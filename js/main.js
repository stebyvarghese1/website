/* ==========================================================================
   ThreatLens — Apple Experience Scripts (main.js)
   Sleek interactions, navigation, and segmented control switcher
   ========================================================================== */
(function () {
  'use strict';

  // ── 1. Apple Navigation Blur on Scroll ────────────────────────────────────
  const nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(13, 17, 26, 0.92)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.14)';
    } else {
      nav.style.background = 'rgba(13, 17, 26, 0.82)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 2. Mobile Drawer ──────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.textContent = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.textContent = '☰';
        document.body.style.overflow = '';
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

  // ── 4. Apple Segmented Control Showcase Switcher & Auto-Scroll ──────────
  const segBtns = Array.from(document.querySelectorAll('.segmented-btn'));
  const showcaseImg = document.getElementById('showcase-img');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseBadge = document.getElementById('showcase-badge');
  const showcasePills = document.getElementById('showcase-pills');
  const showcaseContainer = document.querySelector('.cinematic-window');
  const segControl = document.querySelector('.segmented-control');

  let currentIndex = 0;
  let autoScrollTimer = null;
  let isPaused = false;
  const ROTATE_INTERVAL = 2000; // 2 seconds per slide (fast, energetic pace)

  // Preload all showcase screenshots into browser memory for zero-lag transitions
  segBtns.forEach(btn => {
    const src = btn.dataset.img;
    if (src) {
      const pre = new Image();
      pre.src = src;
    }
  });

  function activateTab(index, userInitiated = false) {
    if (!segBtns.length) return;
    currentIndex = (index + segBtns.length) % segBtns.length;
    const btn = segBtns[currentIndex];

    segBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // On mobile horizontal track, smooth-scroll the active pill into view
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    const imgSrc = btn.dataset.img;
    const title = btn.dataset.title;
    const badge = btn.dataset.badge;
    const pills = (btn.dataset.pills || '').split(',');

    if (showcaseImg) {
      showcaseImg.style.opacity = '0.35';
      setTimeout(() => {
        showcaseImg.src = imgSrc;
        showcaseImg.style.opacity = '1';
      }, 100);
    }
    if (showcaseTitle) showcaseTitle.textContent = title;
    if (showcaseBadge) showcaseBadge.textContent = badge;
    if (showcasePills) {
      showcasePills.innerHTML = pills.map(p => `<span class="window-pill">${p.trim()}</span>`).join('');
    }

    if (userInitiated) {
      resetAutoScroll();
    }
  }

  function nextSlide() {
    if (!isPaused) {
      activateTab(currentIndex + 1);
    }
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(nextSlide, ROTATE_INTERVAL);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  // Click listeners on segmented buttons
  segBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      activateTab(idx, true);
    });
  });

  // Pause on hover so user can inspect details without interruption
  const pauseTargets = [showcaseContainer, segControl].filter(Boolean);
  pauseTargets.forEach(el => {
    el.addEventListener('mouseenter', () => { isPaused = true; });
    el.addEventListener('mouseleave', () => { isPaused = false; });
  });

  // Mobile touch swipe gestures on showcase window
  let touchStartX = 0;
  let touchEndX = 0;
  if (showcaseContainer) {
    showcaseContainer.addEventListener('touchstart', e => {
      isPaused = true;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    showcaseContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 45) {
        if (diffX > 0) {
          activateTab(currentIndex + 1, true); // Swipe left -> Next
        } else {
          activateTab(currentIndex - 1, true); // Swipe right -> Prev
        }
      }
      setTimeout(() => { isPaused = false; }, 2500);
    }, { passive: true });
  }

  // IntersectionObserver: Only run auto-scroll when showcase is in viewport
  if ('IntersectionObserver' in window && showcaseContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(showcaseContainer);
  } else {
    startAutoScroll();
  }

})();
