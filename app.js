// ── Beta gate ──
var BETA_HASH = '62ad2d25fbd049976790a29e9820c8043c239d20bdef2b8ab5d3e9ff785cb05a';

function hashPassword(pw) {
  var encoded = new TextEncoder().encode(pw);
  return crypto.subtle.digest('SHA-256', encoded).then(function (buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  });
}

var gate = document.getElementById('beta-gate');
var gateForm = document.getElementById('gate-form');
var gateInput = document.getElementById('gate-input');
var gateError = document.getElementById('gate-error');
var gateBtn = document.getElementById('gate-btn');

if (sessionStorage.getItem('closr_beta') === '1') {
  gate.classList.add('hidden');
}

gateInput.addEventListener('input', function () {
  gateBtn.disabled = !gateInput.value.trim();
  gateInput.classList.remove('error');
  gateError.classList.remove('show');
});

gateForm.addEventListener('submit', function (e) {
  e.preventDefault();
  gateBtn.disabled = true;
  gateBtn.textContent = 'Checking...';
  gateError.classList.remove('show');
  hashPassword(gateInput.value.trim()).then(function (hash) {
    if (hash === BETA_HASH) {
      sessionStorage.setItem('closr_beta', '1');
      gate.classList.add('hidden');
    } else {
      gateInput.classList.add('error');
      gateError.classList.add('show');
      gateBtn.textContent = 'Enter Beta';
      gateBtn.disabled = !gateInput.value.trim();
    }
  });
});

// ── Scroll reveal + commission calculator ──
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  // commission calculator
  var slider = document.getElementById('homeVal');
  var homeOut = document.getElementById('calcHome');
  var commOut = document.getElementById('calcComm');
  if (!slider) return;
  function money(n) { return '$' + Math.round(n).toLocaleString('en-CA'); }
  function calc() {
    var v = +slider.value;
    homeOut.textContent = money(v);
    var c = 0.07 * Math.min(v, 100000) + 0.03 * Math.max(v - 100000, 0);
    commOut.textContent = '~' + money(c);
    var pct = (v - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = 'linear-gradient(90deg,var(--accent) ' + pct + '%,var(--line-2) ' + pct + '%)';
  }
  slider.addEventListener('input', calc);
  calc();
})();
