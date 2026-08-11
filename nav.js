// nav.js — shared navigation behaviour (sticky state, dropdowns, mobile menu, scroll-spy)
(function(){
  var nav = document.getElementById('nav'); if(!nav) return;

  // sticky: solidify on scroll
  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 6); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // dropdowns: click-toggle (+ hover via CSS), Escape + outside-click close, a11y
  var items = [].slice.call(nav.querySelectorAll('.nav-item'));
  function closeAll(){ items.forEach(function(it){ var m=it.querySelector('.nav-menu'), l=it.querySelector('.nav-link'); if(m) m.classList.remove('open'); if(l) l.setAttribute('aria-expanded','false'); }); }
  items.forEach(function(it){
    var link=it.querySelector('.nav-link'), menu=it.querySelector('.nav-menu');
    if(!link||!menu) return;
    link.addEventListener('click', function(e){ e.stopPropagation(); var open=menu.classList.contains('open'); closeAll(); if(!open){ menu.classList.add('open'); link.setAttribute('aria-expanded','true'); } });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); });

  // mobile menu
  var burger = nav.querySelector('.nav-burger'), panel = document.getElementById('navMobile');
  function closeMobile(){ if(!panel) return; panel.classList.remove('open'); if(burger){ burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); } document.body.classList.remove('nav-lock'); }
  if(burger && panel){
    burger.addEventListener('click', function(){ var open=panel.classList.toggle('open'); burger.classList.toggle('open',open); burger.setAttribute('aria-expanded',open?'true':'false'); document.body.classList.toggle('nav-lock',open); });
    panel.addEventListener('click', function(e){ if(e.target.closest('a')) closeMobile(); });
    window.addEventListener('resize', function(){ if(window.innerWidth>900) closeMobile(); });
  }

  // scroll-spy active state
  var spy = {}; [].slice.call(nav.querySelectorAll('[data-spy]')).forEach(function(l){ spy[l.getAttribute('data-spy')] = l; });
  var ids = Object.keys(spy);
  if(ids.length && 'IntersectionObserver' in window){
    var secs = ids.map(function(id){ return document.getElementById(id); }).filter(Boolean);
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ ids.forEach(function(k){ spy[k].classList.toggle('active', k===e.target.id); }); } }); }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    secs.forEach(function(s){ io.observe(s); });
  }
})();
