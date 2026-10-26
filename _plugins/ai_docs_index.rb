# frozen_string_literal: true

require "json"

# Builds /assets/ai/docs-index.json: every documentation page's title, URL, place in the
# navigation and raw Markdown. The Ask AI service (ai-assist/) reads this file from the
# deployed site, so its answers always match what is published, with no separate sync step.
#
# Raw Markdown (read before Jekyll renders it) is what the model reads best, and it keeps
# placeholders such as {{baseUrl}} that Liquid would otherwise swallow.
#
# Leave a page out with `ai_exclude: true` in its front matter, or turn the whole index off
# with `ai_assist: { index: false }` in _config.yml.
module RelmAI
  class DocsIndexGenerator < Jekyll::Generator
    safe true
    priority :lowest

    INDEX_DIR = "assets/ai"
    INDEX_NAME = "docs-index.json"

    def generate(site)
      config = site.config["ai_assist"] || {}
      return if config["index"] == false

      pages = site.pages
        .select { |page| page.ext == ".md" && page.data["title"] && !page.data["ai_exclude"] }
        .sort_by(&:url)
        .map { |page| entry_for(page) }
        .reject { |entry| entry[:content].empty? }

      index = Jekyll::PageWithoutAFile.new(site, site.source, INDEX_DIR, INDEX_NAME)
      index.content = JSON.generate(
        version: 1,
        site: site.config["title"],
        generated_at: site.time.utc.iso8601,
        pages: pages
      )
      index.data.merge!(
        "layout" => nil,
        "render_with_liquid" => false,
        "sitemap" => false,
        "nav_exclude" => true,
        "search_exclude" => true
      )
      site.pages << index
      Jekyll.logger.info "Ask AI:", "indexed #{pages.size} pages into /#{INDEX_DIR}/#{INDEX_NAME}"
    end

    private

    def entry_for(page)
      {
        url: page.url,
        title: page.data["title"].to_s,
        parent: page.data["parent"],
        grand_parent: page.data["grand_parent"],
        content: clean(expand_includes(page.content.to_s, page.site))
      }.compact
    end

    # Inlines {% include file.md %} so shared snippets (such as the enum tables in _includes/enums/)
    # are part of the text the AI reads. One level deep is enough for these snippets.
    def expand_includes(markdown, site)
      markdown.gsub(/\{%-?\s*include\s+([\w\/.-]+)\s*-?%\}/) do
        file = site.in_source_dir("_includes", Regexp.last_match(1))
        File.file?(file) ? File.read(file) : ""
      end
    end

    # Drops markup that only means something to Jekyll/kramdown: {: .class } attribute lines,
    # {% raw %} wrappers and include/comment tags. Everything else stays as written.
    def clean(markdown)
      markdown
        .gsub(/\{%-?\s*(end)?raw\s*-?%\}/, "")
        .gsub(/\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}/m, "")
        .gsub(/\{%-?.*?-?%\}/m, "")
        .gsub(/^\{:[^}\n]*\}[ \t]*\n/, "")
        .gsub(/<!--.*?-->/m, "")
        .gsub(/\n{3,}/, "\n\n")
        .strip
    end
  end
end
