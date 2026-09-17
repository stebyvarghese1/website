/* ==========================================================================
   ThreatLens — Apple Experience Scripts (main.js)
   Sleek interactions, segmented controls, modal sheets, copy handler
   ========================================================================== */
(function () {
  'use strict';

  // ── 1. Apple Navigation Blur on Scroll ────────────────────────────────────
  const nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(0, 0, 0, 0.85)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      nav.style.background = 'rgba(0, 0, 0, 0.72)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 2. Mobile Drawer ──────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('open');
      hamburger.textContent = drawer.classList.contains('open') ? '✕' : '☰';
    });
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }

  // ── 3. Smooth Anchor Scroll ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 4. Apple Segmented Control Showcase Switcher ──────────────────────────
  const segBtns = document.querySelectorAll('.segmented-btn');
  const showcaseImg = document.getElementById('showcase-img');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseBadge = document.getElementById('showcase-badge');
  const showcasePills = document.getElementById('showcase-pills');

  segBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgSrc = btn.dataset.img;
      const title = btn.dataset.title;
      const badge = btn.dataset.badge;
      const pills = (btn.dataset.pills || '').split(',');

      if (showcaseImg) {
        showcaseImg.style.opacity = '0.2';
        setTimeout(() => {
          showcaseImg.src = imgSrc;
          showcaseImg.style.opacity = '1';
        }, 120);
      }
      if (showcaseTitle) showcaseTitle.textContent = title;
      if (showcaseBadge) showcaseBadge.textContent = badge;
      if (showcasePills) {
        showcasePills.innerHTML = pills.map(p => `<span class="window-pill">${p.trim()}</span>`).join('');
      }
    });
  });

  // ── 5. Download Tabs ──────────────────────────────────────────────────────
  const dlTabs = document.querySelectorAll('.dl-tab-btn');
  const dlPanels = document.querySelectorAll('.dl-panel');

  dlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dlTabs.forEach(t => t.classList.remove('active'));
      dlPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.panel);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ── 6. Apple Copy Buttons ─────────────────────────────────────────────────
  document.querySelectorAll('.apple-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = btn.textContent;
        btn.textContent = 'Copied';
        btn.style.background = 'var(--apple-green)';
        btn.style.color = '#000000';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });

})();
