/*
 * Ask AI: a chat panel that answers questions from these docs.
 *
 * Opens from the header button, ⌘I / Ctrl+I, or the "Ask AI" row at the top of search results
 * (Tab in the search box). Questions go to the ai-assist service, which finds the relevant doc
 * sections and streams Claude's answer back with links to the pages it used. The conversation is
 * kept for this browser tab, so following a link keeps the chat open on the next page.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var ENDPOINT = (script && script.getAttribute('data-endpoint') || '').replace(/\/$/, '');
  var BASEURL = (script && script.getAttribute('data-baseurl') || '').replace(/\/$/, '');
  if (!ENDPOINT) { return; }

  var STORE_KEY = 'relm.askai.v1';
  var MAX_STORED = 24;
  var HISTORY_SENT = 8;
  var IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  var SUGGESTIONS = [
    'How do I authenticate and sign API requests?',
    'How do I send a payout to a beneficiary?',
    'How do I verify a webhook is from Relm?',
    'How do I onboard a customer as a partner?'
  ];

  // ------------------------------------------------------------------------------------------------
  // State

  var state = load();
  var ui = {};
  var controller = null;
  var renderQueued = false;
  var stickToBottom = true;
  var restoreFocus = null;

  function load() {
    var empty = { messages: [], open: false, draft: '', disabled: false };
    try {
      var saved = JSON.parse(window.sessionStorage.getItem(STORE_KEY) || 'null');
      if (!saved || !Array.isArray(saved.messages)) { return empty; }
      saved.messages = saved.messages.filter(function (m) {
        return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
      }).map(function (m) {
        // An answer that was still arriving when the page changed can't resume.
        if (m.status === 'streaming') { m.status = m.content ? 'stopped' : 'error'; }
        if (m.status === 'error' && !m.error) { m.error = 'This answer was interrupted.'; }
        return m;
      });
      return { messages: saved.messages, open: !!saved.open, draft: saved.draft || '', disabled: false };
    } catch (e) { return empty; }
  }

  function save() {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify({
        messages: state.messages.slice(-MAX_STORED),
        open: state.open,
        draft: ui.input ? ui.input.value : state.draft
      }));
    } catch (e) { /* storage unavailable: the chat lasts for this page only */ }
  }

  // ------------------------------------------------------------------------------------------------
  // DOM helpers (same shape as try-it.js)

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) {
      var value = attrs[name];
      if (value === undefined || value === null || value === false) { return; }
      if (name === 'text') { node.textContent = value; }
      else if (name === 'html') { node.innerHTML = value; }
      else if (name.indexOf('on') === 0) { node.addEventListener(name.slice(2), value); }
      else { node.setAttribute(name, value === true ? '' : value); }
    });
    (children || []).forEach(function (child) {
      if (child) { node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child); }
    });
    return node;
  }

  var ICONS = {
    sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><path fill="currentColor" d="M12 2.5l1.9 5.1a4 4 0 0 0 2.5 2.5l5.1 1.9-5.1 1.9a4 4 0 0 0-2.5 2.5L12 21.5l-1.9-5.1a4 4 0 0 0-2.5-2.5L2.5 12l5.1-1.9a4 4 0 0 0 2.5-2.5z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M5 15V5a1 1 0 0 1 1-1h10"/></svg>',
    page: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ask-ai-icon"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 3h8l4 4v14H6z M14 3v4h4"/></svg>'
  };

  // ------------------------------------------------------------------------------------------------
  // Markdown → safe HTML. Everything is escaped first; links only to this site or http(s).

  function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function unescapeHtml(text) {
    return text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }

  function safeHref(url) {
    url = url.trim();
    if (/^#[\w\-]*$/.test(url)) { return { href: url, external: false }; }
    if (/^\/(?!\/)/.test(url)) { return { href: BASEURL + url, external: false }; }
    if (/^https?:\/\//i.test(url)) {
      var sameSite = url.indexOf(window.location.origin + '/') === 0;
      return { href: url, external: !sameSite };
    }
    return null;
  }

  function inline(text) {
    var codes = [];
    var out = text.replace(/`([^`\n]+)`/g, function (_, code) {
      codes.push('<code>' + escapeHtml(code) + '</code>');
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    out = escapeHtml(out);
    out = out.replace(/\[([^\]\n]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, function (match, label, url) {
      var link = safeHref(unescapeHtml(url));
      if (!link) { return label; }
      return '<a href="' + escapeHtml(link.href) + '"' +
        (link.external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + '</a>';
    });
    out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[\s(])\*([^*\s][^*\n]*?)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    out = out.replace(/(^|[\s(])_([^_\s][^_\n]*?)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    return out.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[Number(i)]; });
  }

  function codeBlock(code, lang) {
    return '<div class="ask-ai-code"><div class="ask-ai-code-head"><span>' + escapeHtml(lang || 'code') +
      '</span><button type="button" class="ask-ai-copy" data-copy-code>' + ICONS.copy + '<span>Copy</span></button></div>' +
      '<pre><code>' + escapeHtml(code) + '</code></pre></div>';
  }

  var LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;

  function renderList(lines) {
    // lines: [{ indent, ordered, text }] → nested <ul>/<ol>
    var html = '';
    var stack = [];
    lines.forEach(function (item) {
      while (stack.length && item.indent < stack[stack.length - 1].indent) {
        html += '</li></' + stack.pop().tag + '>';
      }
      var top = stack[stack.length - 1];
      if (!top || item.indent > top.indent) {
        var tag = item.ordered ? 'ol' : 'ul';
        stack.push({ indent: item.indent, tag: tag });
        html += '<' + tag + (item.ordered && item.start > 1 ? ' start="' + item.start + '"' : '') + '><li>';
      } else {
        html += '</li><li>';
      }
      html += inline(item.text);
    });
    while (stack.length) { html += '</li></' + stack.pop().tag + '>'; }
    return html;
  }

  function splitRow(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
  }

  function renderMarkdown(source) {
    var lines = source.replace(/\r\n?/g, '\n').split('\n');
    var html = [];
    var i = 0;

    function isBlockStart(line, next) {
      return /^\s*```/.test(line) || /^#{1,6}\s/.test(line) || LIST_ITEM.test(line) || /^>\s?/.test(line) ||
        (line.indexOf('|') !== -1 && next !== undefined && /^\s*\|?\s*:?-{3,}/.test(next));
    }

    while (i < lines.length) {
      var line = lines[i];
      var fence = /^\s*```\s*([\w+#.\-]*)/.exec(line);
      if (fence) {
        var code = [];
        i++;
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
        i++; // closing fence (or end of a block still streaming)
        html.push(codeBlock(code.join('\n'), fence[1]));
        continue;
      }
      if (!line.trim()) { i++; continue; }

      var heading = /^(#{1,6})\s+(.*?)\s*#*$/.exec(line);
      if (heading) {
        var level = Math.min(6, heading[1].length + 2);
        html.push('<h' + level + '>' + inline(heading[2]) + '</h' + level + '>');
        i++;
        continue;
      }
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { html.push('<hr>'); i++; continue; }

      if (line.indexOf('|') !== -1 && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
        var head = splitRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf('|') !== -1 && lines[i].trim()) { rows.push(splitRow(lines[i])); i++; }
        html.push('<div class="ask-ai-table"><table><thead><tr>' + head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + rows.map(function (r) {
            return '<tr>' + head.map(function (_, c) { return '<td>' + inline(r[c] || '') + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>');
        continue;
      }

      if (LIST_ITEM.test(line)) {
        var items = [];
        while (i < lines.length) {
          var m = LIST_ITEM.exec(lines[i]);
          if (m) {
            items.push({ indent: m[1].replace(/\t/g, '    ').length, ordered: /\d/.test(m[2]), start: parseInt(m[2], 10) || 1, text: m[3] });
            i++;
          } else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && !/^\s*```/.test(lines[i]) && items.length) {
            items[items.length - 1].text += ' ' + lines[i].trim(); // wrapped item text
            i++;
          } else if (!lines[i].trim() && LIST_ITEM.test(lines[i + 1] || '')) {
            i++; // loose list
          } else { break; }
        }
        html.push(renderList(items));
        continue;
      }

      if (/^>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
        html.push('<blockquote>' + renderMarkdown(quote.join('\n')) + '</blockquote>');
        continue;
      }

      var para = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i], lines[i + 1])) { para.push(lines[i]); i++; }
      html.push('<p>' + para.map(inline).join('<br>') + '</p>');
    }
    return html.join('');
  }

  // ------------------------------------------------------------------------------------------------
  // Panel

  function shortcutLabel() { return IS_MAC ? '⌘I' : 'Ctrl+I'; }

  function build() {
    ui.messages = el('div', { class: 'ask-ai-messages', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });
    ui.messages.addEventListener('scroll', function () {
      var m = ui.messages;
      stickToBottom = m.scrollHeight - m.scrollTop - m.clientHeight < 48;
    });
    ui.messages.addEventListener('click', onMessagesClick);

    ui.input = el('textarea', {
      class: 'ask-ai-input',
      rows: '1',
      maxlength: '1000',
      placeholder: 'Ask anything about the Relm APIs…',
      'aria-label': 'Your question',
      oninput: function () { autosize(); save(); },
      onkeydown: function (event) {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
          event.preventDefault();
          submit();
        }
      }
    });
    ui.input.value = state.draft || '';

    ui.send = el('button', {
      type: 'button',
      class: 'ask-ai-send',
      'aria-label': 'Send',
      html: ICONS.send,
      onclick: function () { if (controller) { stop(); } else { submit(); } }
    });

    ui.panel = el('section', {
      class: 'ask-ai-panel',
      id: 'ask-ai-panel',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-labelledby': 'ask-ai-title',
      hidden: true
    }, [
      el('header', { class: 'ask-ai-head' }, [
        el('div', { class: 'ask-ai-brand' }, [
          el('span', { class: 'ask-ai-badge', html: ICONS.sparkle }),
          el('div', {}, [
            el('div', { class: 'ask-ai-title', id: 'ask-ai-title', text: 'Ask Relm AI' }),
            el('div', { class: 'ask-ai-subtitle', text: 'Based on these docs. Check key details.' })
          ])
        ]),
        el('div', { class: 'ask-ai-head-actions' }, [
          el('button', { type: 'button', class: 'ask-ai-icon-button', title: 'New chat', 'aria-label': 'New chat', html: ICONS.reset, onclick: reset }),
          el('button', { type: 'button', class: 'ask-ai-icon-button', title: 'Close (Esc)', 'aria-label': 'Close', html: ICONS.close, onclick: close })
        ])
      ]),
      ui.messages,
      el('footer', { class: 'ask-ai-foot' }, [
        el('div', { class: 'ask-ai-compose' }, [ui.input, ui.send]),
        el('div', { class: 'ask-ai-hint', text: 'Enter to send, Shift+Enter for a new line' })
      ])
    ]);

    ui.fab = el('button', {
      type: 'button',
      class: 'ask-ai-fab',
      'aria-label': 'Ask AI about these docs',
      'aria-controls': 'ask-ai-panel',
      html: ICONS.sparkle + '<span>Ask AI</span>',
      onclick: toggle
    });

    document.body.appendChild(ui.panel);
    document.body.appendChild(ui.fab);

    // Other "Ask" buttons on the page (e.g. on the home page) open the panel too.
    Array.prototype.forEach.call(document.querySelectorAll('[data-ask-ai-open]'), function (button) {
      button.hidden = false;
      button.addEventListener('click', function () { open(); });
    });

    var trigger = document.querySelector('[data-ask-ai-trigger]');
    if (trigger) {
      trigger.hidden = false;
      trigger.addEventListener('click', toggle);
      var kbd = trigger.querySelector('kbd');
      if (kbd) { kbd.textContent = shortcutLabel(); }
    }
    render();
  }

  function autosize() {
    ui.input.style.height = 'auto';
    ui.input.style.height = Math.min(ui.input.scrollHeight, 160) + 'px';
  }

  function pageTitle() {
    var h = document.querySelector('#main-content h1, #main-content h2');
    return h ? h.textContent.trim() : '';
  }

  function suggestionsFor() {
    var list = SUGGESTIONS.slice();
    var title = pageTitle();
    var path = currentPath();
    if (title && path !== '/') {
      list.unshift(/endpoints?\//.test(path) || document.querySelector('.endpoint-layout')
        ? 'Explain "' + title + '": what it does, the required fields, and an example request'
        : 'Summarise "' + title + '" and what I need to do');
      list = list.slice(0, 4);
    }
    return list;
  }

  function renderEmpty() {
    return el('div', { class: 'ask-ai-empty' }, [
      el('span', { class: 'ask-ai-empty-badge', html: ICONS.sparkle }),
      el('p', { class: 'ask-ai-empty-title', text: 'How can I help you build with Relm?' }),
      el('p', { class: 'ask-ai-empty-text', text: 'I search these docs and answer with links to the pages I used.' }),
      el('div', { class: 'ask-ai-suggestions' }, suggestionsFor().map(function (text) {
        return el('button', { type: 'button', class: 'ask-ai-suggestion', text: text, onclick: function () { ask(text); } });
      }))
    ]);
  }

  function renderMessage(message, index) {
    if (message.role === 'user') {
      return el('div', { class: 'ask-ai-msg ask-ai-msg-user' }, [el('div', { class: 'ask-ai-bubble', text: message.content })]);
    }
    var body = el('div', { class: 'ask-ai-answer' });
    if (message.content) { body.innerHTML = renderMarkdown(message.content); }
    if (message.status === 'streaming') {
      if (!message.content) {
        body.appendChild(el('div', { class: 'ask-ai-thinking' }, [
          el('span'), el('span'), el('span'), el('em', { text: 'Searching the docs…' })
        ]));
      } else {
        var last = body.lastElementChild;
        (last && last.tagName !== 'DIV' ? last : body).appendChild(el('span', { class: 'ask-ai-caret', 'aria-hidden': 'true' }));
      }
    }

    var parts = [body];
    if (message.status === 'error') {
      parts.push(el('div', { class: 'ask-ai-error', role: 'alert' }, [
        el('span', { text: message.error || 'Something went wrong.' }),
        state.disabled ? null : el('button', { type: 'button', class: 'ask-ai-link-button', text: 'Try again', 'data-retry': String(index) })
      ]));
    }
    if (message.status === 'stopped') {
      parts.push(el('div', { class: 'ask-ai-note', text: 'Stopped.' }));
    }
    if (message.status === 'done' || message.status === 'stopped') {
      var sources = sourcesFor(message).map(function (source) {
        var link = safeHref(source.url);
        if (!link) { return null; }
        return el('a', { class: 'ask-ai-source', href: link.href }, [
          el('span', { html: ICONS.page }),
          el('span', { class: 'ask-ai-source-title', text: source.title }),
          source.section ? el('span', { class: 'ask-ai-source-section', text: source.section.split(' › ').pop() }) : null
        ]);
      }).filter(Boolean);
      parts.push(el('div', { class: 'ask-ai-meta' }, [
        sources.length ? el('div', { class: 'ask-ai-sources' }, [el('div', { class: 'ask-ai-sources-label', text: 'Pages used' })].concat(sources)) : null,
        message.content ? el('button', { type: 'button', class: 'ask-ai-copy ask-ai-copy-answer', 'data-copy-answer': String(index), html: ICONS.copy + '<span>Copy answer</span>' }) : null
      ]));
    }
    return el('div', { class: 'ask-ai-msg ask-ai-msg-assistant' }, parts);
  }

  /**
   * The pages the answer links to, in the order it mentions them, named from the retrieved sources
   * where possible. An answer without links falls back to the two best-matching pages.
   */
  function sourcesFor(message) {
    var retrieved = message.sources || [];
    var byPage = {};
    retrieved.forEach(function (source) { byPage[source.url.split('#')[0]] = source; });
    var seen = {};
    var linked = [];
    var pattern = /\[([^\]\n]+)\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g;
    var match;
    while ((match = pattern.exec(message.content)) && linked.length < 5) {
      var page = match[2];
      if (seen[page]) { continue; }
      seen[page] = true;
      var known = byPage[page];
      linked.push({ url: page + (match[3] || ''), title: known ? known.title : match[1].replace(/[`*_]/g, '') });
    }
    return linked.length ? linked : retrieved.slice(0, 2);
  }

  function render() {
    renderQueued = false;
    if (!ui.messages) { return; }
    ui.messages.innerHTML = '';
    if (!state.messages.length) { ui.messages.appendChild(renderEmpty()); }
    state.messages.forEach(function (message, index) { ui.messages.appendChild(renderMessage(message, index)); });
    if (state.disabled) {
      ui.messages.appendChild(el('div', { class: 'ask-ai-note', text: 'Ask AI is unavailable right now. Search still works as usual.' }));
    }
    ui.panel.classList.toggle('is-busy', !!controller);
    ui.send.innerHTML = controller ? ICONS.stop : ICONS.send;
    ui.send.setAttribute('aria-label', controller ? 'Stop' : 'Send');
    ui.input.disabled = state.disabled;
    if (stickToBottom) { ui.messages.scrollTop = ui.messages.scrollHeight; }
  }

  function queueRender() {
    if (renderQueued) { return; }
    renderQueued = true;
    window.requestAnimationFrame(render);
  }

  function onMessagesClick(event) {
    var target = event.target.closest('button');
    if (!target) { return; }
    if (target.hasAttribute('data-retry')) {
      var index = Number(target.getAttribute('data-retry'));
      var question = state.messages[index - 1];
      if (question && question.role === 'user') {
        state.messages.splice(index - 1, 2);
        ask(question.content);
      }
    } else if (target.hasAttribute('data-copy-code')) {
      copy(target.closest('.ask-ai-code').querySelector('code').textContent, target);
    } else if (target.hasAttribute('data-copy-answer')) {
      copy(state.messages[Number(target.getAttribute('data-copy-answer'))].content, target);
    }
  }

  function copy(text, button) {
    var label = button.querySelector('span');
    var original = label ? label.textContent : '';
    var done = function () {
      if (!label) { return; }
      label.textContent = 'Copied';
      setTimeout(function () { label.textContent = original; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  }

  function currentPath() {
    var path = window.location.pathname;
    if (BASEURL && path.indexOf(BASEURL) === 0) { path = path.slice(BASEURL.length) || '/'; }
    return path.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  }

  // ------------------------------------------------------------------------------------------------
  // Open / close

  function open(focusInput) {
    if (!ui.panel) { build(); }
    if (!state.open) { restoreFocus = document.activeElement; }
    state.open = true;
    ui.panel.hidden = false;
    document.documentElement.classList.add('ask-ai-open');
    ui.fab.setAttribute('aria-expanded', 'true');
    stickToBottom = true;
    render();
    autosize();
    if (focusInput !== false) { setTimeout(function () { ui.input.focus(); }, 0); }
    save();
  }

  function close() {
    if (!ui.panel) { return; }
    state.open = false;
    ui.panel.hidden = true;
    document.documentElement.classList.remove('ask-ai-open');
    ui.fab.setAttribute('aria-expanded', 'false');
    save();
    if (restoreFocus && restoreFocus.focus) { restoreFocus.focus(); }
  }

  function toggle() { if (state.open) { close(); } else { open(); } }

  function reset() {
    stop();
    state.messages = [];
    ui.input.value = '';
    save();
    render();
    ui.input.focus();
  }

  // ------------------------------------------------------------------------------------------------
  // Asking

  function submit() {
    var text = ui.input.value.trim();
    if (!text || controller || state.disabled) { return; }
    ui.input.value = '';
    autosize();
    ask(text);
  }

  function stop() {
    if (controller) { controller.abort(); }
  }

  function history() {
    // Completed exchanges only: a failed answer and its question are left out.
    var turns = [];
    for (var i = 0; i + 1 < state.messages.length; i += 2) {
      var q = state.messages[i];
      var a = state.messages[i + 1];
      if (q.role === 'user' && a.role === 'assistant' && a.content && a.status !== 'error') {
        turns.push({ role: 'user', content: q.content }, { role: 'assistant', content: a.content });
      }
    }
    return turns.slice(-HISTORY_SENT);
  }

  function ask(question) {
    question = String(question || '').trim().slice(0, 1000);
    if (!question || state.disabled) { return; }
    if (!state.open) { open(); }
    stop();

    var turns = history().concat([{ role: 'user', content: question }]);
    var answer = { role: 'assistant', content: '', status: 'streaming', sources: [] };
    state.messages.push({ role: 'user', content: question }, answer);
    stickToBottom = true;
    controller = new AbortController();
    var mine = controller;
    save();
    render();

    function finish(status, error) {
      if (controller !== mine) { return; }
      controller = null;
      answer.status = status;
      if (error) { answer.error = error; }
      save();
      render();
    }

    fetch(ENDPOINT + '/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: turns, page: currentPath() }),
      signal: mine.signal
    }).then(function (response) {
      var type = response.headers.get('Content-Type') || '';
      if (!response.ok || type.indexOf('text/event-stream') === -1) {
        return response.json().catch(function () { return null; }).then(function (body) {
          var err = body && body.error || {};
          handleError(err.code || 'HTTP_' + response.status, err.msg);
        });
      }
      return readStream(response.body.getReader());
    }).catch(function (error) {
      if (error && error.name === 'AbortError') { finish(answer.content ? 'stopped' : 'error', 'Stopped.'); return; }
      finish('error', 'Check your connection and try again.');
    });

    function handleError(code, message) {
      if (code === 'NOT_CONFIGURED' || code === 'UNAVAILABLE') { state.disabled = true; updateSearchRow(); }
      finish('error', message || 'Something went wrong. Please try again.');
    }

    function readStream(reader) {
      var decoder = new TextDecoder();
      var buffer = '';
      var ended = false;

      function onEvent(name, data) {
        if (name === 'meta') { answer.sources = data.sources || []; }
        else if (name === 'delta') { answer.content += data.text || ''; queueRender(); }
        else if (name === 'done') { ended = true; finish('done'); }
        else if (name === 'error') { ended = true; handleError(data.code, data.msg); }
      }

      function pump() {
        return reader.read().then(function (result) {
          buffer += decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
          var blocks = buffer.split('\n\n');
          buffer = blocks.pop();
          blocks.forEach(function (block) {
            var name = 'message';
            var data = '';
            block.split('\n').forEach(function (line) {
              if (line.indexOf('event:') === 0) { name = line.slice(6).trim(); }
              else if (line.indexOf('data:') === 0) { data += line.slice(5).trim(); }
            });
            try { onEvent(name, data ? JSON.parse(data) : {}); } catch (e) { /* ignore a malformed event */ }
          });
          if (result.done) {
            if (!ended) { finish(answer.content ? 'stopped' : 'error', answer.content ? null : 'The answer was interrupted. Please try again.'); }
            return;
          }
          return pump();
        });
      }
      return pump();
    }
  }

  // ------------------------------------------------------------------------------------------------
  // "Ask AI" row in the theme's search results

  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchRow = null;

  function updateSearchRow() {
    if (!searchInput || !searchResults) { return; }
    var query = searchInput.value.trim();
    if (state.disabled || query.length < 2) {
      if (searchRow && searchRow.parentNode) { searchRow.parentNode.removeChild(searchRow); }
      return;
    }
    if (!searchRow) {
      searchRow = el('button', {
        type: 'button',
        class: 'ask-ai-search-row',
        onclick: function () { askFromSearch(); }
      });
    }
    searchRow.innerHTML = '';
    searchRow.appendChild(el('span', { class: 'ask-ai-badge', html: ICONS.sparkle }));
    searchRow.appendChild(el('span', { class: 'ask-ai-search-text' }, [
      el('strong', { text: 'Ask AI' }),
      el('span', { class: 'ask-ai-search-query', text: '“' + query + '”' })
    ]));
    searchRow.appendChild(el('kbd', { text: 'Tab' }));
    if (searchResults.firstChild !== searchRow) { searchResults.insertBefore(searchRow, searchResults.firstChild); }
  }

  function askFromSearch() {
    var query = searchInput.value.trim();
    if (!query) { return; }
    searchInput.value = '';
    searchInput.blur();
    document.documentElement.classList.remove('search-active');
    searchResults.innerHTML = '';
    ask(query);
  }

  if (searchInput && searchResults) {
    // The theme rebuilds the results list on every keystroke; put the row back each time.
    new MutationObserver(function () {
      if (!searchRow || searchResults.firstChild !== searchRow) { updateSearchRow(); }
    }).observe(searchResults, { childList: true });
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Tab' && !event.shiftKey && searchInput.value.trim().length >= 2 && !state.disabled) {
        event.preventDefault();
        askFromSearch();
      }
    });
  }

  // ------------------------------------------------------------------------------------------------
  // Start

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && (event.key === 'i' || event.key === 'I')) {
      event.preventDefault();
      toggle();
      return;
    }
    // Esc closes the panel, unless it's clearing another field (the theme's search box uses Esc too).
    if (event.key === 'Escape' && state.open) {
      var active = document.activeElement;
      var elsewhere = active && active !== document.body && !ui.panel.contains(active) &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName);
      if (!elsewhere) { event.preventDefault(); close(); }
    }
  });

  build();
  if (state.open) { open(false); }
})();
