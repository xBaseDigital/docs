# frozen_string_literal: true

# Builds the sidebar, breadcrumbs, Previous / Next links and section indexes from _data/navigation.yml.
#
# Gives Liquid:
#   site.data.nav_tree   the sidebar: sections, each with `items` (pages, or groups of pages)
#   page.nav             for pages in the sidebar: `section`, `trail` (breadcrumbs), `prev`, `next`
#   page.nav_index       for section / group pages that should list their pages: `groups`
#
# Each link carries `title` (as shown in the sidebar), `page_title`, `url`, and for single-endpoint pages
# `method` and `path`, read from the OpenAPI operation named in the page's `try_it` front matter.
module RelmNavigation
  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      config = site.data["navigation"]
      return unless config.is_a?(Array)

      @site = site
      @errors = []
      @pages = {}
      site.pages.each { |page| @pages[normalize(page.url)] ||= page if page.html? }
      @operations = load_operations(site)
      @listed = {}
      reading_order = []

      tree = config.map { |section| build_section(section, reading_order) }
      fail_on_errors!

      site.data["nav_tree"] = tree
      assign_prev_next(reading_order)
      warn_about_unlisted_pages
    end

    private

    # --- Building the tree -----------------------------------------------------------------------

    def build_section(config, reading_order)
      title = config["title"].to_s
      @errors << "a section has no title" if title.empty?
      section = { "title" => title, "items" => [] }

      if config["url"]
        own = link_for(config["url"], { "title" => title })
        if own
          section["url"] = own["url"]
          reading_order << own
          page_for(own)&.data&.[]=("nav", { "section" => title, "trail" => [] })
        end
      end

      Array(config["pages"]).each do |entry|
        link = link_for(entry)
        next unless link

        section["items"] << link.merge("type" => "page")
        reading_order << link
        set_page_nav(link, section, nil)
      end

      Array(config["groups"]).each do |group_config|
        group = { "type" => "group", "title" => group_config["title"].to_s, "pages" => [] }
        Array(group_config["pages"]).each do |entry|
          link = link_for(entry)
          next unless link

          group["pages"] << link
          reading_order << link
          set_page_nav(link, section, group_config)
        end
        section["items"] << group
        if group_config["url"]
          group_page = page_at(group_config["url"])
          if group_page
            group["url"] = group_page.url
            @listed[normalize(group_page.url)] = true
            group_page.data["nav"] = { "section" => title, "trail" => [section_crumb(section)] }
            set_index(group_page, [group.slice("title", "pages")], true)
          end
        end
      end

      # The section's own page, and any `also` pages, can list everything in the section.
      groups = index_groups(section)
      if section["url"]
        set_index(@pages[normalize(section["url"])], groups, config["index"] == true)
      end
      Array(config["also"]).each do |url|
        page = page_at(url)
        next unless page

        @listed[normalize(page.url)] = true
        page.data["nav"] = { "section" => title, "trail" => [section_crumb(section)] }
        set_index(page, groups, true)
      end

      section
    end

    def index_groups(section)
      loose = section["items"].select { |item| item["type"] == "page" }
      grouped = section["items"].select { |item| item["type"] == "group" }
      groups = []
      groups << { "title" => nil, "pages" => loose } unless loose.empty?
      groups + grouped.map { |group| group.slice("title", "pages") }
    end

    # A page lists its pages when asked to, or when it has nothing else to show.
    def set_index(page, groups, wanted)
      return unless page
      return unless wanted || page.content.to_s.strip.empty?

      page.data["nav_index"] = { "groups" => groups }
    end

    def set_page_nav(link, section, group_config)
      page = page_for(link)
      return unless page

      trail = [section_crumb(section)]
      if group_config
        crumb = { "title" => group_config["title"].to_s }
        crumb["url"] = page_at(group_config["url"], quiet: true)&.url if group_config["url"]
        trail << crumb
      end
      page.data["nav"] = { "section" => section["title"], "trail" => trail }
    end

    def section_crumb(section)
      { "title" => section["title"], "url" => section["url"] }.compact
    end

    # --- Links -------------------------------------------------------------------------------------

    def link_for(entry, defaults = {})
      entry = { "url" => entry } if entry.is_a?(String)
      page = page_at(entry["url"])
      return unless page

      @listed[normalize(page.url)] = true
      page_title = page.data["title"].to_s
      link = {
        "title" => (entry["title"] || defaults["title"] || page_title).to_s,
        "page_title" => page_title.empty? ? entry["title"].to_s : page_title,
        "url" => page.url
      }
      operation = single_operation(page)
      link.merge!("method" => operation[:method], "path" => operation[:path]) if operation
      link
    end

    def page_at(url, quiet: false)
      page = @pages[normalize(url.to_s)]
      @errors << "#{url.inspect} is not the permalink of any page" if page.nil? && !quiet
      page
    end

    def page_for(link)
      @pages[normalize(link["url"])]
    end

    def normalize(url)
      path = url.to_s.sub(/\.html\z/, "").sub(%r{/index\z}, "/")
      path = path.chomp("/")
      path.empty? ? "/" : path
    end

    # --- HTTP methods from the OpenAPI specs ----------------------------------------------------

    def load_operations(site)
      operations = {}
      (site.data["openapi"] || {}).each_value do |spec|
        (spec["paths"] || {}).each do |path, methods|
          next unless methods.is_a?(Hash)

          methods.each do |method, operation|
            next unless operation.is_a?(Hash) && operation["operationId"]

            operations[operation["operationId"]] = { method: method.upcase, path: path }
          end
        end
      end
      operations
    end

    # `try_it` is an operationId, or a list of them / of `{ op: operationId, ... }` entries.
    def single_operation(page)
      try_it = page.data["try_it"]
      try_it = [try_it] unless try_it.is_a?(Array)
      ids = try_it.map { |entry| entry.is_a?(Hash) ? entry["op"] : entry }.map(&:to_s).reject(&:empty?).uniq
      ids.size == 1 ? @operations[ids.first] : nil
    end

    # --- Previous / Next ------------------------------------------------------------------------

    def assign_prev_next(order)
      order = order.uniq { |link| normalize(link["url"]) }
      order.each_with_index do |link, i|
        page = page_for(link)
        next unless page

        nav = (page.data["nav"] ||= {})
        nav["prev"] = pager(order[i - 1]) if i.positive?
        nav["next"] = pager(order[i + 1]) if order[i + 1]
      end
    end

    def pager(link)
      { "title" => link["page_title"], "url" => link["url"] }
    end

    # --- Checks -------------------------------------------------------------------------------------

    def fail_on_errors!
      return if @errors.empty?

      raise Jekyll::Errors::FatalException,
            "_data/navigation.yml: #{@errors.uniq.join('; ')}"
    end

    def warn_about_unlisted_pages
      unlisted = @site.pages.select do |page|
        page.html? && page.data["title"] && page.data["nav_exclude"] != true &&
          page.url != "/404.html" && !@listed[normalize(page.url)]
      end
      return if unlisted.empty?

      Jekyll.logger.warn "Navigation:", "not in _data/navigation.yml, so not in the sidebar: " \
                                        "#{unlisted.map(&:url).sort.join(', ')}"
    end
  end
end
