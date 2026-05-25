// Fade-up on scroll
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(function (el) {
  observer.observe(el);
});

// Animated compare bars
setTimeout(function () {
  var t = document.getElementById('bar-trad');
  var c = document.getElementById('bar-closr');
  if (t) t.style.width = '100%';
  if (c) c.style.width = '39%';
}, 400);

// Amortization chart
var chart = document.getElementById('amort-chart');
if (chart) {
  var pts = [0, 5, 10, 15, 20, 25];
  var vals = pts.map(function (y) { return Math.round(11500 * Math.pow(1.06, y)); });
  var mx = vals[vals.length - 1];
  pts.forEach(function (yr, i) {
    var col = document.createElement('div');
    col.className = 'chart-col';
    var bar = document.createElement('div');
    bar.className = 'chart-bar';
    var h = Math.max(5, Math.round((vals[i] / mx) * 72));
    bar.style.cssText = 'height:' + h + 'px;background:#1D9E75;opacity:' + (0.22 + (i / 5) * 0.78).toFixed(2);
    var lbl = document.createElement('div');
    lbl.className = 'chart-lbl';
    lbl.textContent = yr === 0 ? 'today' : 'yr ' + yr;
    col.appendChild(bar);
    col.appendChild(lbl);
    chart.appendChild(col);
  });
}
