/* ============================================================
   Product ADJust — app.js
   Progressive enhancement: страницы работают и без JS.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'paj-nav-collapsed';

  /* ----------------------------------------------------------
     1. Показать / скрыть пароль
     ---------------------------------------------------------- */
  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      var eyeOn = btn.querySelector('[data-eye-on]');
      var eyeOff = btn.querySelector('[data-eye-off]');

      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-toggle-password'));
        if (!input) return;

        var isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';

        btn.setAttribute('aria-pressed', String(isHidden));
        btn.setAttribute('aria-label', isHidden ? 'Скрыть пароль' : 'Показать пароль');

        if (eyeOn && eyeOff) {
          eyeOn.hidden = isHidden;
          eyeOff.hidden = !isHidden;
        }
      });
    });
  }

  /* ----------------------------------------------------------
     2. Сайдбар: скрыть / развернуть (десктоп)
     ---------------------------------------------------------- */
  function initSidebarToggle() {
    var btn = document.querySelector('[data-nav-toggle]');
    if (!btn) return;

    function setCollapsed(collapsed, persist) {
      document.body.classList.toggle('nav-collapsed', collapsed);
      btn.setAttribute('aria-expanded', String(!collapsed));
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0'); } catch (e) { /* noop */ }
      }
    }

    btn.addEventListener('click', function () {
      setCollapsed(!document.body.classList.contains('nav-collapsed'), true);
    });

    /* Восстановить состояние */
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }
    if (saved === '1') setCollapsed(true, false);
  }

  /* ----------------------------------------------------------
     3. История чатов: drawer (< 1024px)
     ---------------------------------------------------------- */
  function initHistoryDrawer() {
    var toggle = document.querySelector('[data-history-toggle]');
    var backdrop = document.querySelector('[data-history-backdrop]');
    if (!toggle && !backdrop) return;

    function open() { document.body.classList.add('history-open'); }
    function close() { document.body.classList.remove('history-open'); }

    if (toggle) {
      toggle.addEventListener('click', function () {
        document.body.classList.contains('history-open') ? close() : open();
      });
    }
    if (backdrop) backdrop.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ----------------------------------------------------------
     4. Чат: автовысота поля ввода
     ---------------------------------------------------------- */
  function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  function initChatInput() {
    var field = document.querySelector('[data-chat-field]');
    if (!field) return;

    autoResize(field);
    field.addEventListener('input', function () { autoResize(field); });
  }

  /* ----------------------------------------------------------
     5. Чат: демо-отправка сообщения
     ---------------------------------------------------------- */
  function formatTime() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function appendUserMessage(body, text) {
    var msg = document.createElement('div');
    msg.className = 'msg msg--user';

    var avatar = document.createElement('div');
    avatar.className = 'msg__avatar';
    avatar.textContent = 'И';

    var content = document.createElement('div');
    content.className = 'msg__content';

    var bubble = document.createElement('div');
    bubble.className = 'msg__bubble';
    bubble.textContent = text;

    var time = document.createElement('div');
    time.className = 'msg__time';
    time.textContent = formatTime();

    content.appendChild(bubble);
    content.appendChild(time);
    msg.appendChild(avatar);
    msg.appendChild(content);
    body.appendChild(msg);
  }

  function initChatSend() {
    var form = document.querySelector('[data-chat-form]');
    var field = document.querySelector('[data-chat-field]');
    var body = document.querySelector('[data-chat-body]');
    var scroll = document.querySelector('[data-chat-scroll]');
    if (!form || !field || !body || !scroll) return;

    function sendMessage() {
      var text = field.value.trim();
      if (!text) return;

      appendUserMessage(body, text);
      field.value = '';
      autoResize(field);
      scroll.scrollTop = scroll.scrollHeight;
      field.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendMessage();
    });

    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  /* ----------------------------------------------------------
     6. Чат: чипы-подсказки → заполняют поле ввода
     ---------------------------------------------------------- */
  function initChatPrompts() {
    var field = document.querySelector('[data-chat-field]');
    if (!field) return;

    document.querySelectorAll('[data-prompt]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        field.value = chip.getAttribute('data-prompt') || chip.textContent.trim();
        autoResize(field);
        field.focus();
      });
    });
  }

  /* ----------------------------------------------------------
     Инициализация
     ---------------------------------------------------------- */
  function init() {
    initPasswordToggles();
    initSidebarToggle();
    initHistoryDrawer();
    initChatInput();
    initChatSend();
    initChatPrompts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
