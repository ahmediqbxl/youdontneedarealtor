// Calculator
var slider = document.getElementById('priceSlider');
var homeValueEl = document.getElementById('homeValue');
var realtorCostEl = document.getElementById('realtorCost');
var youKeepEl = document.getElementById('youKeep');
var thinkAboutEl = document.getElementById('thinkAbout');
var FLAT_FEE = 1700;

function formatMoney(n) {
  return '$' + n.toLocaleString('en-CA');
}

function formatHomeValue(val) {
  if (val >= 1000000) {
    return '$' + (val / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  }
  return '$' + (val / 1000).toFixed(0) + 'K';
}

function updateSliderTrack() {
  var pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background =
    'linear-gradient(to right, var(--bg-dark) ' + pct + '%, var(--border) ' + pct + '%)';
}

function updateCalculator() {
  var val = parseInt(slider.value);
  var realtorFee = Math.round(val * 0.05);
  var savings = realtorFee - FLAT_FEE;

  homeValueEl.textContent = formatHomeValue(val);
  realtorCostEl.textContent = formatMoney(realtorFee);
  youKeepEl.textContent = formatMoney(savings);
  thinkAboutEl.textContent = 'Think about what you\u2019d do with ' + formatMoney(savings);
  updateSliderTrack();
}

if (slider) {
  slider.addEventListener('input', updateCalculator);
  updateCalculator();
}

// FAQ — close other items when one opens
var faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (item.open) {
      faqItems.forEach(function (other) {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    }
  });
});
