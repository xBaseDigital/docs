(function () {
  'use strict';

  var KEY = {
    auth: 'relm.tryit.auth.',
    param: 'relm.tryit.param.',
    body: 'relm.tryit.body.'
  };

  // Try it only ever sends requests to the Relm sandbox, never to production (https://api.relm.co).
  // This list is deliberately not configurable from the page; _plugins/try_it_sandbox_guard.rb applies
  // the same rule to `try_it_server` when the site is built.
  var SANDBOX_ORIGINS = ['https://sandbox.api.relm.co'];

  // The URL, normalised, if it really points at the sandbox; otherwise null. The URL is parsed rather
  // than string-matched, so "https://sandbox.api.relm.co@api.relm.co/..." is judged by its real host.
  function sandboxOnly(url) {
    try {
      var parsed = new URL(url);
      if (SANDBOX_ORIGINS.indexOf(parsed.origin) === -1 || parsed.username || parsed.password) { return null; }
      return parsed.href;
    } catch (e) { return null; }
  }

  // fetch() for API calls: refuses anything outside the sandbox, and won't follow a redirect elsewhere.
  function sandboxFetch(url, init) {
    var safe = sandboxOnly(url);
    if (!safe) {
      var blocked = new Error('Blocked: Try it only sends requests to the sandbox.');
      blocked.sandboxBlocked = true;
      return Promise.reject(blocked);
    }
    var options = { redirect: 'error', credentials: 'omit' };
    Object.keys(init || {}).forEach(function (k) { if (k !== 'redirect' && k !== 'credentials') { options[k] = init[k]; } });
    return fetch(safe, options);
  }

  function storageGet(key) {
    try { return window.sessionStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  function storageSet(key, value) {
    try {
      if (value) { window.sessionStorage.setItem(key, value); }
      else { window.sessionStorage.removeItem(key); }
    } catch (e) { /* storage unavailable: values live for this page only */ }
  }

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

  function resolveRef(spec, item) {
    if (!item || !item.$ref) { return item; }
    return item.$ref.replace(/^#\//, '').split('/').reduce(function (acc, key) {
      return acc ? acc[key] : undefined;
    }, spec);
  }

  function getPath(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc === undefined || acc === null ? undefined : acc[key];
    }, obj);
  }

  function findOperation(spec, operationId) {
    var paths = spec.paths || {};
    var methods = ['get', 'post', 'put', 'patch', 'delete'];
    for (var path in paths) {
      for (var i = 0; i < methods.length; i++) {
        var op = paths[path][methods[i]];
        if (op && op.operationId === operationId) {
          return { path: path, method: methods[i].toUpperCase(), op: op, spec: spec };
        }
      }
    }
    return null;
  }

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) { return window.crypto.randomUUID(); }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightJson(text) {
    return escapeHtml(text).replace(
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        var cls = 'ti-num';
        if (match.charAt(0) === '"') { cls = /:$/.test(match) ? 'ti-key' : 'ti-str'; }
        else if (match === 'true' || match === 'false') { cls = 'ti-bool'; }
        else if (match === 'null') { cls = 'ti-null'; }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
  }

  function shellQuote(text) {
    return "'" + text.replace(/'/g, "'\\''") + "'";
  }

  function plain(text) {
    return (text || '').replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
  }

  function exampleFor(param) {
    if (param.example !== undefined) { return String(param.example); }
    var schema = param.schema || {};
    if (schema.default !== undefined) { return String(schema.default); }
    if (schema.examples && schema.examples.length) { return String(schema.examples[0]); }
    if (schema.format === 'uuid') { return 'UUID'; }
    if (schema.format === 'date') { return 'YYYY-MM-DD'; }
    return '';
  }

  function securityFor(found) {
    var requirements = found.op.security !== undefined ? found.op.security : (found.spec.security || []);
    if (!requirements.length) { return null; }
    var schemes = (found.spec.components && found.spec.components.securitySchemes) || {};
    for (var i = 0; i < requirements.length; i++) {
      var name = Object.keys(requirements[i])[0];
      var scheme = schemes[name];
      if (scheme && scheme.type === 'http' && scheme.scheme === 'bearer') {
        return { name: name, scheme: scheme };
      }
    }
    return null;
  }

  function exampleBody(found) {
    var content = found.op.requestBody && found.op.requestBody.content && found.op.requestBody.content['application/json'];
    if (!content) { return null; }
    var example = content.example;
    if (example === undefined && content.examples) {
      var first = content.examples[Object.keys(content.examples)[0]];
      example = first && first.value;
    }
    return JSON.stringify(example === undefined ? {} : example, null, 2);
  }

  function jsonEscape(value) {
    return JSON.stringify(String(value)).slice(1, -1);
  }

  function substitute(text) {
    return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, function (match, name) {
      if (name === 'uuid') { return uuid(); }
      var saved = storageGet(KEY.param + name);
      return saved ? jsonEscape(saved) : match;
    });
  }

  function renderOperation(container, found, onSaved) {
    var server = container.getAttribute('data-server');
    var opId = found.op.operationId;
    var params = (found.op.parameters || []).map(function (p) { return resolveRef(found.spec, p); });
    var pathParams = params.filter(function (p) { return p.in === 'path'; });
    var queryParams = params.filter(function (p) { return p.in === 'query'; });
    var security = securityFor(found);
    var bodyExample = exampleBody(found);
    var inputs = {};
    var tokenInput = null;
    var bodyInput = null;

    function paramRow(param) {
      var schema = param.schema || {};
      var stored = storageGet(KEY.param + param.name);
      var id = 'ti-p-' + opId + '-' + param.name;
      var input;
      if (schema.enum) {
        input = el('select', { id: id, class: 'ti-input' }, [el('option', { value: '', text: param.required ? 'Select…' : '—' })]
          .concat(schema.enum.filter(function (v) { return v !== null; }).map(function (v) {
            return el('option', { value: String(v), text: String(v), selected: String(v) === stored });
          })));
      } else {
        input = el('input', {
          id: id, class: 'ti-input', type: 'text', autocomplete: 'off', spellcheck: 'false',
          placeholder: exampleFor(param), value: stored
        });
      }
      function save() {
        input.classList.remove('ti-invalid');
        storageSet(KEY.param + param.name, input.value.trim());
        refresh();
      }
      input.addEventListener('input', save);
      input.addEventListener('change', save);
      inputs[param.name] = input;

      var extra = null;
      if (param.name === 'customerId' && security && security.name === 'bearerAuth') {
        extra = el('button', { type: 'button', class: 'ti-link', text: 'Use mine', onclick: fillCustomerId });
      }

      return el('div', { class: 'ti-field' }, [
        el('label', { for: id, class: 'ti-label' }, [
          el('code', { text: param.name }),
          param.required ? el('span', { class: 'ti-req', text: 'required' }) : el('span', { class: 'ti-opt', text: 'optional' }),
          extra
        ]),
        input,
        param.description ? el('div', { class: 'ti-help', text: plain(param.description) }) : null
      ]);
    }

    function currentUrl() {
      var path = found.path.replace(/\{([^}]+)\}/g, function (_, name) {
        var v = inputs[name] ? inputs[name].value.trim() : '';
        return v ? encodeURIComponent(v) : ':' + name;
      });
      var query = queryParams
        .map(function (p) { return [p.name, inputs[p.name].value.trim()]; })
        .filter(function (pair) { return pair[1] !== ''; })
        .map(function (pair) { return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]); })
        .join('&');
      return server + path + (query ? '?' + query : '');
    }

    function curlCommand() {
      var parts = ['curl ' + (found.method !== 'GET' ? '-X ' + found.method + ' ' : '') + shellQuote(currentUrl())];
      if (security) { parts.push('-H ' + shellQuote('Authorization: Bearer <TOKEN>')); }
      if (bodyInput) {
        parts.push('-H ' + shellQuote('Content-Type: application/json'));
        var compact = bodyInput.value;
        try { compact = JSON.stringify(JSON.parse(substitutePreview(bodyInput.value))); } catch (e) { /* keep as typed */ }
        parts.push('--data-raw ' + shellQuote(compact));
      }
      return parts.join(' \\\n  ');
    }

    function substitutePreview(text) {
      return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, function (match, name) {
        if (name === 'uuid') { return '<NEW_UUID>'; }
        var saved = storageGet(KEY.param + name);
        return saved ? jsonEscape(saved) : '<' + name + '>';
      });
    }

    var urlBox = el('div', { class: 'ti-url' });
    var curlBox = el('pre', { class: 'ti-curl' });
    var copyBtn = el('button', {
      type: 'button', class: 'ti-link', text: 'Copy curl',
      onclick: function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(curlCommand()).then(function () {
            copyBtn.textContent = 'Copied';
            setTimeout(function () { copyBtn.textContent = 'Copy curl'; }, 1500);
          });
        }
      }
    });

    function refresh() {
      urlBox.textContent = currentUrl();
      curlBox.textContent = curlCommand();
    }

    var statusLine = el('div', { class: 'ti-status' });
    var savedLine = el('div', { class: 'ti-saved' });
    var responseBody = el('pre', { class: 'ti-response', html: '<span class="ti-muted">Send a request to see the live response.</span>' });
    var sendBtn = el('button', { type: 'button', class: 'btn btn-primary ti-send', text: 'Send', onclick: send });

    function validate() {
      var ok = true;
      params.forEach(function (p) {
        if (p.required && !inputs[p.name].value.trim()) {
          inputs[p.name].classList.add('ti-invalid');
          ok = false;
        }
      });
      if (tokenInput && !tokenInput.value.trim()) {
        tokenInput.classList.add('ti-invalid');
        ok = false;
      }
      if (bodyInput) {
        try { JSON.parse(substitutePreview(bodyInput.value)); }
        catch (e) { bodyInput.classList.add('ti-invalid'); ok = false; }
      }
      return ok;
    }

    function showResult(status, ok, ms, bodyText) {
      statusLine.innerHTML = '';
      statusLine.appendChild(el('span', { class: 'ti-pill ' + (ok ? 'ti-ok' : 'ti-err'), text: String(status) }));
      if (ms !== null) { statusLine.appendChild(el('span', { class: 'ti-muted', text: ms + ' ms' })); }
      var pretty = bodyText;
      var parsed = null;
      try { parsed = JSON.parse(bodyText); pretty = JSON.stringify(parsed, null, 2); } catch (e) { /* not JSON */ }
      responseBody.innerHTML = pretty ? highlightJson(pretty) : '<span class="ti-muted">(empty body)</span>';
      return parsed;
    }

    function captureFromResponse(parsed) {
      var rules = found.op['x-try-it-save'] || [];
      var saved = [];
      rules.forEach(function (rule) {
        var value = getPath(parsed, rule.from);
        if (value === undefined || value === null || value === '') { return; }
        if (rule.to.indexOf('auth:') === 0) {
          storageSet(KEY.auth + rule.to.slice(5), String(value));
          saved.push(rule.label || rule.to.slice(5));
        } else {
          storageSet(KEY.param + rule.to, String(value));
          saved.push(rule.to);
        }
      });
      savedLine.textContent = saved.length ? 'Saved for your next requests: ' + saved.join(', ') : '';
      if (saved.length && onSaved) { onSaved(); }
    }

    function send() {
      if (tokenInput) { tokenInput.classList.remove('ti-invalid'); }
      if (bodyInput) { bodyInput.classList.remove('ti-invalid'); }
      savedLine.textContent = '';
      if (!validate()) {
        statusLine.innerHTML = '';
        statusLine.appendChild(el('span', { class: 'ti-muted', text: 'Fill in the highlighted fields.' }));
        return;
      }
      var headers = { Accept: 'application/json' };
      if (tokenInput) { headers.Authorization = 'Bearer ' + tokenInput.value.trim(); }
      var init = { method: found.method, headers: headers };
      if (bodyInput) {
        var finalBody = substitute(bodyInput.value);
        var missing = finalBody.match(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/);
        if (missing) {
          bodyInput.classList.add('ti-invalid');
          statusLine.innerHTML = '';
          statusLine.appendChild(el('span', { class: 'ti-muted', text: 'No saved value for ' + missing[1] + ': replace {{' + missing[1] + '}} in the body.' }));
          return;
        }
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(JSON.parse(finalBody));
      }
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';
      var started = performance.now();
      sandboxFetch(currentUrl(), init).then(function (res) {
        return res.text().then(function (text) {
          var parsed = showResult(res.status + ' ' + (res.statusText || ''), res.ok, Math.round(performance.now() - started), text);
          if (res.ok && parsed) { captureFromResponse(parsed); }
        });
      }).catch(function (err) {
        if (err && err.sandboxBlocked) {
          showResult('Not sent', false, null, '');
          responseBody.textContent = 'Try it only sends requests to the Relm sandbox (' + SANDBOX_ORIGINS.join(', ') +
            '), and this request was going somewhere else, so it was not sent.';
          return;
        }
        showResult('Network error', false, null, '');
        responseBody.textContent = 'The request did not reach the API. Check your connection. If the API blocked this ' +
          'origin (CORS), the browser hides the details: open the browser console for more.';
      }).then(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
      });
    }

    function fillCustomerId() {
      if (!tokenInput || !tokenInput.value.trim()) { if (tokenInput) { tokenInput.classList.add('ti-invalid'); } return; }
      sandboxFetch(server + '/v1/customers/me', { headers: { Accept: 'application/json', Authorization: 'Bearer ' + tokenInput.value.trim() } })
        .then(function (res) { return res.json(); })
        .then(function (body) {
          var id = body && body.data && body.data.id;
          if (id && inputs.customerId) {
            inputs.customerId.value = id;
            storageSet(KEY.param + 'customerId', id);
            refresh();
          }
        })
        .catch(function () { /* user can paste it */ });
    }

    container.innerHTML = '';
    container.appendChild(el('div', { class: 'ti-endpoint' }, [
      el('span', { class: 'ti-method ti-' + found.method.toLowerCase(), text: found.method }),
      urlBox
    ]));

    if (found.op['x-try-it-note']) {
      container.appendChild(el('div', { class: 'ti-section ti-note', text: plain(found.op['x-try-it-note']) }));
    }

    if (security) {
      tokenInput = el('input', {
        type: 'password', id: 'ti-token-' + opId, class: 'ti-input', autocomplete: 'off', spellcheck: 'false',
        placeholder: security.scheme['x-placeholder'] || 'Paste a sandbox token', value: storageGet(KEY.auth + security.name),
        oninput: function () { storageSet(KEY.auth + security.name, tokenInput.value.trim()); }
      });
      var toggle = el('button', {
        type: 'button', class: 'ti-link', text: 'Show',
        onclick: function () {
          var hidden = tokenInput.type === 'password';
          tokenInput.type = hidden ? 'text' : 'password';
          toggle.textContent = hidden ? 'Hide' : 'Show';
        }
      });
      container.appendChild(el('div', { class: 'ti-section' }, [
        el('div', { class: 'ti-field' }, [
          el('label', { for: 'ti-token-' + opId, class: 'ti-label' }, [el('span', { text: security.scheme['x-label'] || 'Bearer token' }), toggle]),
          tokenInput,
          el('div', { class: 'ti-help', text: plain(security.scheme['x-help'] || security.scheme.description) + ' Kept for this tab only.' })
        ])
      ]));
    }

    if (pathParams.length) {
      container.appendChild(el('div', { class: 'ti-section' }, [el('div', { class: 'ti-section-title', text: 'Path' })].concat(pathParams.map(paramRow))));
    }
    if (queryParams.length) {
      var queryRows = queryParams.map(paramRow);
      var requiredRows = queryRows.filter(function (_, i) { return queryParams[i].required; });
      var optionalRows = queryRows.filter(function (_, i) { return !queryParams[i].required; });
      var section = el('div', { class: 'ti-section' }, [el('div', { class: 'ti-section-title', text: 'Query' })].concat(requiredRows));
      if (optionalRows.length) {
        var anyStored = optionalRows.some(function (row) { return row.querySelector('.ti-input').value; });
        section.appendChild(el('details', { class: 'ti-optional', open: anyStored || optionalRows.length <= 3 }, [
          el('summary', { text: optionalRows.length + ' optional filter' + (optionalRows.length > 1 ? 's' : '') })
        ].concat(optionalRows)));
      }
      container.appendChild(section);
    }

    if (bodyExample !== null) {
      bodyInput = el('textarea', {
        class: 'ti-input ti-body', spellcheck: 'false', rows: String(Math.min(18, bodyExample.split('\n').length + 1)),
        oninput: function () {
          bodyInput.classList.remove('ti-invalid');
          storageSet(KEY.body + opId, bodyInput.value === bodyExample ? '' : bodyInput.value);
          refresh();
        }
      });
      bodyInput.value = storageGet(KEY.body + opId) || bodyExample;
      var reset = el('button', {
        type: 'button', class: 'ti-link', text: 'Reset to example',
        onclick: function () { bodyInput.value = bodyExample; storageSet(KEY.body + opId, ''); refresh(); }
      });
      container.appendChild(el('div', { class: 'ti-section' }, [
        el('div', { class: 'ti-section-title' }, [el('span', { text: 'Body' }), reset]),
        bodyInput,
        /\{\{/.test(bodyExample)
          ? el('div', { class: 'ti-help', html: '<code>{{uuid}}</code> becomes a new UUID on every send. Other <code>{{name}}</code> values are filled from earlier responses or the fields above.' })
          : null
      ]));
    }

    container.appendChild(el('div', { class: 'ti-actions' }, [sendBtn, el('span', { class: 'ti-muted ti-kbd', text: '⌘/Ctrl + Enter' })]));
    container.appendChild(el('div', { class: 'ti-section ti-result' }, [
      el('div', { class: 'ti-section-title' }, [el('span', { text: 'Response' }), statusLine]),
      responseBody,
      savedLine
    ]));
    container.appendChild(el('details', { class: 'ti-curl-wrap' }, [
      el('summary', {}, [el('span', { text: 'curl' }), copyBtn]),
      curlBox
    ]));

    container.onkeydown = function (event) {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); send(); }
    };

    refresh();
  }

  function parseEntries(raw) {
    var value;
    try { value = JSON.parse(raw); } catch (e) { value = raw; }
    if (!value) { return []; }
    if (!Array.isArray(value)) { value = [value]; }
    return value.map(function (item) {
      return typeof item === 'string' ? { op: item } : item;
    });
  }

  function findHeading(text) {
    var wanted = plain(text).toLowerCase();
    var headings = document.querySelectorAll('.endpoint-docs h1, .endpoint-docs h2, .endpoint-docs h3');
    for (var i = 0; i < headings.length; i++) {
      var clone = headings[i].cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll('.anchor-heading, .ti-jump'), function (n) { n.remove(); });
      if (plain(clone.textContent).toLowerCase() === wanted) { return headings[i]; }
    }
    return null;
  }

  function init(root) {
    var entries = parseEntries(root.getAttribute('data-operations'));
    if (!entries.length) { return; }

    var specCache = {};
    function loadSpec(url) {
      if (!specCache[url]) {
        specCache[url] = fetch(url).then(function (res) {
          if (!res.ok) { throw new Error('could not load ' + url); }
          return res.json();
        });
      }
      return specCache[url];
    }

    var defaultSpec = root.getAttribute('data-spec');
    var body = el('div', { class: 'ti-body-wrap', 'data-server': root.getAttribute('data-server') });
    var selector = null;
    var current = -1;
    var lastManual = 0;
    var engaged = false;

    function select(index, manual) {
      if (index === current) { return; }
      current = index;
      engaged = false;
      if (manual) { lastManual = Date.now(); }
      if (selector) { selector.value = String(index); }
      var entry = entries[index];
      loadSpec(entry.spec || defaultSpec).then(function (spec) {
        var found = findOperation(spec, entry.op);
        if (!found) { throw new Error('operation ' + entry.op + ' is not in the spec'); }
        if (current === index) { renderOperation(body, found); }
      }).catch(function (err) {
        if (current !== index) { return; }
        body.innerHTML = '';
        body.appendChild(el('p', { class: 'ti-section ti-muted', text: 'Try it is unavailable: ' + err.message }));
      });
    }

    var head = el('div', { class: 'ti-head' }, [
      el('span', { class: 'ti-title', text: 'Try it' }),
      el('span', { class: 'ti-env', text: 'Sandbox', title: 'Requests go to ' + SANDBOX_ORIGINS.join(', ') + ' only' })
    ]);
    root.innerHTML = '';
    root.appendChild(head);

    var configured = (root.getAttribute('data-server') || '').replace(/\/+$/, '');
    if (SANDBOX_ORIGINS.indexOf(configured) === -1) {
      root.appendChild(el('p', {
        class: 'ti-section ti-muted',
        text: 'Try it is turned off on this page. It only sends requests to the Relm sandbox (' +
          SANDBOX_ORIGINS.join(', ') + '), and this page is set up for ' + (configured || 'no server') + '.'
      }));
      return;
    }

    if (entries.length > 1) {
      selector = el('select', {
        class: 'ti-input ti-select', 'aria-label': 'Endpoint',
        onchange: function () { select(Number(selector.value), true); }
      }, entries.map(function (entry, i) {
        return el('option', { value: String(i), text: entry.label || entry.heading || entry.op });
      }));
      root.appendChild(el('div', { class: 'ti-section ti-picker' }, [selector]));
      entries.forEach(function (entry, i) {
        if (entry.heading || entry.label) { return; }
        loadSpec(entry.spec || defaultSpec).then(function (spec) {
          var found = findOperation(spec, entry.op);
          if (found && found.op.summary) { selector.options[i].text = found.op.summary; }
        }).catch(function () { /* label stays as the operation id */ });
      });
    }
    root.appendChild(body);
    body.addEventListener('input', function () { engaged = true; });
    body.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.ti-send')) { engaged = true; }
    });

    var anchors = entries.map(function (entry, i) {
      if (!entry.heading) { return null; }
      var heading = findHeading(entry.heading);
      if (!heading) { return null; }
      heading.appendChild(el('button', {
        type: 'button', class: 'ti-jump', text: 'Try it',
        onclick: function () {
          select(i, true);
          if (window.matchMedia('(max-width: 74.99rem)').matches) { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
      }));
      return { index: i, node: heading };
    }).filter(Boolean);

    if (!anchors.length) {
      var firstHeading = document.querySelector('.endpoint-docs h1, .endpoint-docs h2');
      if (firstHeading) {
        firstHeading.appendChild(el('button', {
          type: 'button', class: 'ti-jump ti-jump-solo', text: 'Try it',
          onclick: function () { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }));
      }
    }

    if (anchors.length > 1) {
      var follow = function () {
        if (engaged || root.contains(document.activeElement) || Date.now() - lastManual < 4000) { return; }
        var best = null;
        anchors.forEach(function (a) {
          if (a.node.getBoundingClientRect().top < window.innerHeight * 0.35) { best = a; }
        });
        if (best) { select(best.index, false); }
      };
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; follow(); });
      }, { passive: true });
    }

    var hashIndex = -1;
    if (window.location.hash) {
      var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      anchors.forEach(function (a) { if (a.node === target) { hashIndex = a.index; } });
    }
    select(hashIndex >= 0 ? hashIndex : 0, hashIndex >= 0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.try-it[data-operations]'), init);
  });
})();
