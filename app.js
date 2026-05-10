// ==========================================================================
// Calculator
// ==========================================================================

const slider = document.getElementById('priceSlider');
const homeValueEl = document.getElementById('homeValue');
const realtorCostEl = document.getElementById('realtorCost');
const youKeepEl = document.getElementById('youKeep');
const youKeepMobileEl = document.getElementById('youKeepMobile');
const thinkAboutEl = document.getElementById('thinkAbout');
const shareBtn = document.getElementById('shareCalc');
const FLAT_FEE = 1700;

let currentSavings = 0;
let animationFrame = null;

function formatMoney(n) {
  return '$' + n.toLocaleString('en-CA');
}

function formatHomeValue(val) {
  if (val >= 1_000_000) {
    return '$' + (val / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  }
  return '$' + (val / 1000).toFixed(0) + 'K';
}

function updateSliderTrack() {
  const pct =
    ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background =
    'linear-gradient(to right, var(--bg-dark) ' +
    pct +
    '%, var(--border) ' +
    pct +
    '%)';
}

// Countup animation for savings value
function animateSavings(target) {
  const start = currentSavings;
  const diff = target - start;
  if (diff === 0) return;

  const duration = 200;
  const startTime = performance.now();

  if (animationFrame) cancelAnimationFrame(animationFrame);

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.round(start + diff * eased);

    youKeepEl.textContent = formatMoney(value);
    if (youKeepMobileEl) youKeepMobileEl.textContent = formatMoney(value);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      currentSavings = target;
    }
  }

  animationFrame = requestAnimationFrame(step);
}

function updateCalculator(animate) {
  const val = parseInt(slider.value);
  const realtorFee = Math.round(val * 0.05);
  const savings = realtorFee - FLAT_FEE;

  homeValueEl.textContent = formatHomeValue(val);
  realtorCostEl.textContent = formatMoney(realtorFee);
  thinkAboutEl.textContent =
    'Think about what you\u2019d do with ' + formatMoney(savings);

  if (animate) {
    animateSavings(savings);
  } else {
    currentSavings = savings;
    youKeepEl.textContent = formatMoney(savings);
    if (youKeepMobileEl) youKeepMobileEl.textContent = formatMoney(savings);
  }

  updateSliderTrack();
}

if (slider) {
  // Read URL param for deep-link
  const params = new URLSearchParams(window.location.search);
  const homeParam = params.get('home');
  if (homeParam) {
    const parsed = parseInt(homeParam);
    if (parsed >= 200000 && parsed <= 2000000) {
      slider.value = parsed;
    }
  }

  slider.addEventListener('input', function () {
    updateCalculator(true);
  });
  updateCalculator(false);
}

// Share / copy link button
if (shareBtn && slider) {
  shareBtn.addEventListener('click', function () {
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('home', slider.value);
    url.hash = 'calculator';

    navigator.clipboard.writeText(url.toString()).then(function () {
      shareBtn.textContent = '\u2705 Link copied!';
      setTimeout(function () {
        shareBtn.textContent = '\uD83D\uDD17 Copy link to this calculation';
      }, 2000);
    }).catch(function () {
      // Fallback: select a prompt
      window.prompt('Copy this link:', url.toString());
    });
  });
}

// ==========================================================================
// FAQ Accordion (progressive enhancement on <details>)
// ==========================================================================

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (item.open) {
      // Close other open items
      faqItems.forEach(function (other) {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    }
  });
});

// ==========================================================================
// Scroll Animations (IntersectionObserver)
// ==========================================================================

const fadeEls = document.querySelectorAll('.fade-in');
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (fadeEls.length > 0) {
  if (prefersReducedMotion) {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  }
}
