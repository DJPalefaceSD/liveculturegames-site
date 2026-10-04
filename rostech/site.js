// Rostech Racing — the page's moving parts: start lights, rev lights, tabs, copy.
(function () {
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 🚦 Start lights: five pods light one by one, hold, then lights out.
  var lights = document.getElementById('lights');
  var say = document.getElementById('lights-say');
  function startLights() {
    if (!lights || still) return;
    var pods = lights.querySelectorAll('.pod');
    pods.forEach(function (p) { p.classList.remove('lit'); });
    say.textContent = 'FIVE RED LIGHTS…';
    say.classList.add('waiting');
    pods.forEach(function (p, i) { setTimeout(function () { p.classList.add('lit'); }, 500 + i * 650); });
    setTimeout(function () {
      pods.forEach(function (p) { p.classList.remove('lit'); });
      say.textContent = 'LIGHTS OUT AND AWAY WE GO';
      say.classList.remove('waiting');
    }, 500 + pods.length * 650 + 900);
  }
  if (lights) { startLights(); lights.addEventListener('click', startLights); lights.style.cursor = 'pointer'; lights.title = 'Run the start again'; }

  // 🏁 Rev lights on the wheel: sweep up to the limiter, then settle.
  var revs = document.querySelectorAll('.rev');
  if (revs.length && !still) {
    revs.forEach(function (r, i) { setTimeout(function () { r.classList.add('on'); }, 200 + i * 60); });
    setTimeout(function () { revs.forEach(function (r, i) { if (i > 9) r.classList.remove('on'); }); }, 200 + revs.length * 60 + 500);
  } else revs.forEach(function (r, i) { if (i < 10) r.classList.add('on'); });

  // 🛞 Tabs: a compound filter on the grid, panels on a car page.
  document.querySelectorAll('.tabs').forEach(function (bar) {
    var tabs = bar.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('on', t === tab); t.setAttribute('aria-selected', t === tab); });
        if (tab.dataset.filter) {
          var f = tab.dataset.filter, shown = 0;
          document.querySelectorAll('.tower-row').forEach(function (row) {
            var on = f === 'all' || row.dataset.compound === f;
            row.hidden = !on; if (on) shown++;
          });
          var tabSay = document.getElementById('tab-say');
          if (tabSay) tabSay.textContent = f === 'all'
            ? 'All ' + shown + ' mods. Pick a tyre to see one family.'
            : shown + ' on ' + tab.textContent.replace(/\d+$/, '').trim().toLowerCase() + '.';
        }
        if (tab.dataset.panel) {
          var host = bar.parentElement;
          host.querySelectorAll('.panel').forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.panel; });
          try { history.replaceState(null, '', '#' + tab.dataset.panel); } catch (e) {}
        }
      });
    });
  });
  // A bare #token opens that panel (radio, notes, pit).
  var hash = (location.hash || '').slice(1);
  if (hash) { var t = document.querySelector('.tab[data-panel="' + hash + '"]'); if (t) t.click(); }

  // 📋 Copy: the clipboard if the frame allows it, else select the words.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var was = btn.textContent; btn.classList.add('done'); btn.textContent = 'Copied'; setTimeout(function () { btn.classList.remove('done'); btn.textContent = was; }, 1400); };
      var pick = function () {
        var code = btn.parentElement.querySelector('code');
        if (!code) return;
        var range = document.createRange(); range.selectNodeContents(code);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = 'Selected: press Ctrl+C';
      };
      try { navigator.clipboard.writeText(text).then(done, pick); } catch (e) { pick(); }
    });
  });
})();
