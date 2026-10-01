(function () {
  'use strict';

  var nameEl = document.getElementById('name');
  var words = ['Martijn', 'Luijken'];
  var idx = 0;
  words.forEach(function (w) {
    var span = document.createElement('span');
    span.className = 'word';
    for (var i = 0; i < w.length; i++) {
      var ch = document.createElement('span');
      ch.className = 'ch';
      ch.textContent = w[i];
      ch.setAttribute('data-ch', w[i]);
      ch.style.setProperty('--i', (idx % 3) + 1);
      ch.style.setProperty('--j', (idx % 2 === 0 ? 1 : -1));
      span.appendChild(ch);
      idx++;
    }
    nameEl.appendChild(span);
  });

  var track = document.getElementById('track');
  var clone = track.cloneNode(true);
  clone.removeAttribute('id');
  track.parentNode.appendChild(clone);

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  var fine = window.matchMedia('(pointer: fine)').matches;
  if (!fine) return;

  var cursor = document.getElementById('cursor');
  var preview = document.createElement('div');
  preview.className = 'preview';
  preview.setAttribute('aria-hidden', 'true');
  for (var a = 1; a <= 5; a++) {
    var art = document.createElement('div');
    art.className = 'art art-' + a;
    art.setAttribute('data-art', a);
    preview.appendChild(art);
  }
  document.body.appendChild(preview);

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var cx = mx, cy = my;
  var px = mx, py = my;
  var hoveringProject = false;

  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function frame() {
    cx = lerp(cx, mx, 0.28);
    cy = lerp(cy, my, 0.28);
    cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';

    px = lerp(px, mx + 180, 0.09);
    py = lerp(py, my - 40, 0.09);
    var tilt = (mx - px) * 0.03;
    preview.style.transform = 'translate(' + px + 'px,' + py + 'px) translate(-50%,-50%) rotate(' + (hoveringProject ? tilt : -4) + 'deg) scale(' + (hoveringProject ? 1 : 0.9) + ')';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  var arts = preview.querySelectorAll('.art');
  var projects = document.querySelectorAll('.case');
  projects.forEach(function (p) {
    p.addEventListener('mouseenter', function () {
      hoveringProject = true;
      cursor.classList.add('is-view');
      preview.classList.add('on');
      var id = p.getAttribute('data-art');
      arts.forEach(function (art) { art.classList.toggle('show', art.getAttribute('data-art') === id); });
    });
    p.addEventListener('mouseleave', function () {
      hoveringProject = false;
      cursor.classList.remove('is-view');
      preview.classList.remove('on');
    });
  });

  document.querySelectorAll('a').forEach(function (l) {
    l.addEventListener('mouseenter', function () { cursor.classList.add('is-link'); });
    l.addEventListener('mouseleave', function () { cursor.classList.remove('is-link'); });
  });

  document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });
})();
