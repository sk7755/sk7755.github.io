// Mirrors the `max-width: 860px` breakpoint in styles.css, where the nav
// collapses into the toggle-driven panel.
const compactNav = window.matchMedia('(max-width: 860px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const navigationLinks = navigation ? [...navigation.querySelectorAll('a[href^="#"]')] : [];
const menuLinks = navigation ? [...navigation.querySelectorAll('a')] : [];

const closeMenu = ({ restoreFocus = false } = {}) => {
  if (!menuToggle || !navigation) return;
  const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');

  if (restoreFocus && wasOpen) {
    menuToggle.focus({ preventScroll: true });
  }
};

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  menuLinks.forEach((link) =>
    link.addEventListener('click', () => closeMenu({ restoreFocus: true })),
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu({ restoreFocus: true });
  });

  compactNav.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 18);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-20% 0px -65%', threshold: [0, 0.2, 0.5] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Scroll reveal ---------------------------------------------------------- */

const revealTargets = [...document.querySelectorAll('[data-reveal]')];

if (revealTargets.length) {
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    revealTargets.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

/* Hero plane sweep -------------------------------------------------------- */

/* Sweeps a vertical line across a simple polygon and drops a chord at every
   vertex it passes, building the vertical trapezoidal decomposition — the
   same construction as the SWAT 2026 figure. */
const initSweep = () => {
  const canvas = document.querySelector('[data-sweep]');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;

  const MODEL_W = 200;
  const MODEL_H = 46;

  // x-monotone simple polygon: upper chain left to right, lower chain back.
  const POLY = [
    [4, 26], [14, 10], [26, 16], [36, 6], [48, 13], [58, 7], [70, 17], [82, 9],
    [94, 15], [106, 5], [118, 14], [130, 8], [142, 18], [154, 10], [166, 16],
    [178, 7], [190, 14], [196, 28],
    [186, 40], [174, 33], [162, 42], [150, 35], [138, 44], [126, 36], [114, 43],
    [102, 34], [90, 42], [78, 35], [66, 43], [54, 36], [42, 44], [30, 37],
    [18, 42], [8, 34],
  ];

  const events = [...new Set(POLY.map(([x]) => x))].sort((a, b) => a - b);

  const style = getComputedStyle(document.documentElement);
  const token = (name) => style.getPropertyValue(name).trim();

  const rgba = (hex, alpha) => {
    const raw = hex.replace('#', '');
    const full = raw.length === 3 ? raw.replace(/./g, (c) => c + c) : raw;
    const n = Number.parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  };

  const INK = token('--ink') || '#17324d';
  const BLUE = token('--blue') || '#4f7cac';
  const CORAL = token('--coral') || '#c04434';
  const TEAL = token('--teal') || '#117878';

  // Interior spans of the vertical line at x, by the even-odd rule. Edges are
  // half-open in x so a vertex is counted exactly once.
  const spansAt = (x) => {
    const crossings = [];

    for (let i = 0; i < POLY.length; i++) {
      const [ax, ay] = POLY[i];
      const [bx, by] = POLY[(i + 1) % POLY.length];
      if (ax === bx) continue;
      const lo = Math.min(ax, bx);
      const hi = Math.max(ax, bx);
      if (x < lo || x >= hi) continue;
      crossings.push(ay + ((x - ax) / (bx - ax)) * (by - ay));
    }

    crossings.sort((a, b) => a - b);

    const spans = [];
    for (let i = 0; i + 1 < crossings.length; i += 2) {
      spans.push([crossings[i], crossings[i + 1]]);
    }
    return spans;
  };

  let width = 0;
  let height = 0;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  const layout = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 0.88 leaves a margin inside the panel rather than bleeding to the edges
    scale = Math.min(width / MODEL_W, height / MODEL_H) * 0.88;
    offsetX = (width - MODEL_W * scale) / 2;
    offsetY = (height - MODEL_H * scale) / 2;
    return true;
  };

  const px = (x) => offsetX + x * scale;
  const py = (y) => offsetY + y * scale;

  const tracePolygon = () => {
    ctx.beginPath();
    POLY.forEach(([x, y], i) => {
      if (i) ctx.lineTo(px(x), py(y));
      else ctx.moveTo(px(x), py(y));
    });
    ctx.closePath();
  };

  const draw = (sweepX, alpha) => {
    ctx.clearRect(0, 0, width, height);
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;

    // Region already swept
    ctx.save();
    tracePolygon();
    ctx.clip();
    ctx.fillStyle = rgba(TEAL, 0.11);
    ctx.fillRect(0, 0, px(sweepX), height);
    ctx.restore();

    // Chords dropped at each vertex passed so far
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(BLUE, 0.55);
    ctx.beginPath();
    for (const ex of events) {
      if (ex > sweepX) break;
      for (const [y0, y1] of spansAt(ex)) {
        if (y1 - y0 < 0.5) continue;
        ctx.moveTo(px(ex), py(y0));
        ctx.lineTo(px(ex), py(y1));
      }
    }
    ctx.stroke();

    // Polygon boundary
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = rgba(INK, 0.8);
    tracePolygon();
    ctx.stroke();

    // Sweep line
    if (sweepX > 0 && sweepX < MODEL_W) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = rgba(CORAL, 0.9);
      ctx.beginPath();
      ctx.moveTo(px(sweepX), py(0) - 10);
      ctx.lineTo(px(sweepX), py(MODEL_H) + 10);
      ctx.stroke();
      ctx.restore();
    }

    // Vertices, highlighted once the sweep has processed them
    for (const [x, y] of POLY) {
      const passed = x <= sweepX;
      ctx.beginPath();
      ctx.arc(px(x), py(y), passed ? 2.4 : 1.9, 0, Math.PI * 2);
      ctx.fillStyle = passed ? rgba(CORAL, 0.9) : rgba(INK, 0.45);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  const SWEEP_MS = 9000;
  const HOLD_MS = 2200;
  const FADE_MS = 900;
  const CYCLE_MS = SWEEP_MS + HOLD_MS + FADE_MS;

  let rafId = 0;
  let startedAt = 0;
  let running = false;
  let inView = false;

  let scrubX = null;

  const frame = (now) => {
    if (!running) return;
    if (!startedAt) startedAt = now;

    if (scrubX !== null) {
      draw(scrubX, 1);
      rafId = requestAnimationFrame(frame);
      return;
    }

    const t = (now - startedAt) % CYCLE_MS;
    let sweepX = MODEL_W;
    let alpha = 1;

    if (t < SWEEP_MS) {
      sweepX = MODEL_W * (t / SWEEP_MS);
      alpha = Math.min(1, t / 600);
    } else if (t >= SWEEP_MS + HOLD_MS) {
      alpha = 1 - (t - SWEEP_MS - HOLD_MS) / FADE_MS;
    }

    draw(sweepX, alpha);
    rafId = requestAnimationFrame(frame);
  };

  const drawStatic = () => {
    if (layout()) draw(MODEL_W, 1);
  };

  // Only run while the canvas is actually on screen and the tab is in front.
  const play = () => {
    if (running || reduceMotion.matches || !inView || document.hidden) return;
    if (!layout()) return;
    running = true;
    startedAt = 0;
    rafId = requestAnimationFrame(frame);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  if (reduceMotion.matches) drawStatic();

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (running) layout();
      else drawStatic();
    }).observe(canvas);
  } else {
    window.addEventListener('resize', () => (running ? layout() : drawStatic()));
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          if (inView) play();
          else pause();
        });
      },
      { threshold: 0 },
    ).observe(canvas);
  } else {
    inView = true;
    play();
  }

  /* Pointer scrubbing. `touch-action: pan-y` on the canvas leaves vertical
     panning to the browser, so a horizontal drag reaches us without stealing
     the page scroll; a vertical one arrives as pointercancel instead. */
  const scrubTo = (event) => {
    if (reduceMotion.matches || !scale) return;
    const rect = canvas.getBoundingClientRect();
    const modelX = (event.clientX - rect.left - offsetX) / scale;
    scrubX = Math.max(0, Math.min(MODEL_W, modelX));
    play();
  };

  const releaseScrub = () => {
    if (scrubX === null) return;
    // Resume the loop where the pointer left it, so there is no jump.
    startedAt = performance.now() - (scrubX / MODEL_W) * SWEEP_MS;
    scrubX = null;
  };

  canvas.addEventListener('pointermove', scrubTo);
  canvas.addEventListener('pointerdown', scrubTo);
  canvas.addEventListener('pointerleave', releaseScrub);
  canvas.addEventListener('pointercancel', releaseScrub);
  canvas.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') releaseScrub();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else play();
  });

  reduceMotion.addEventListener('change', (event) => {
    if (event.matches) {
      pause();
      drawStatic();
    } else {
      play();
    }
  });
};

initSweep();
