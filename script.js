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

/* Live figure: largest inscribed unit rectangle ---------------------------- */

/* Draws the largest rectangle of unit width inscribed in a convex polygon as
   its orientation turns through [0, pi), next to the profile of its area.

   Rotating the polygon by -theta makes the rectangle axis-aligned, and a convex
   polygon contains a rectangle exactly when it contains all four corners. So
   with lo(x) and hi(x) the lower and upper boundary of the rotated polygon, the
   tallest unit-width rectangle whose left side sits at x has height

     f(x) = min(hi(x), hi(x + 1)) - max(lo(x), lo(x + 1)).

   hi is concave and lo is convex, so f is concave and ternary search converges
   on the true optimum. The width is 1, so that height is also the area.
   After Chung, Bae, Shin, Yoon and Ahn, Computational Geometry 2025. */
const initRectFigure = () => {
  const canvas = document.querySelector('[data-demo]');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;

  // Convex polygon, counterclockwise, y pointing up. The inscribed rectangle
  // is exactly 1 unit wide in these coordinates.
  const POLY = [
    [0.45, 0.20], [3.05, 0.05], [4.65, 0.95], [4.40, 2.15],
    [2.70, 2.80], [0.80, 2.45], [0.05, 1.30],
  ];

  const HALF_TURN = Math.PI;
  const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Consolas, monospace';

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
  const OCHRE = token('--ochre') || '#d9942f';
  const MUTED = token('--muted') || '#5b6e74';

  const rotate = (points, angle) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return points.map(([x, y]) => [x * c - y * s, x * s + y * c]);
  };

  // Vertical extent of a convex polygon at abscissa x.
  const extentAt = (points, x) => {
    let lo = Infinity;
    let hi = -Infinity;

    for (let i = 0; i < points.length; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[(i + 1) % points.length];
      if (ax === bx) continue;
      const t = (x - ax) / (bx - ax);
      if (t < 0 || t > 1) continue;
      const y = ay + t * (by - ay);
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }

    return hi < lo ? null : [lo, hi];
  };

  // Vertical range open to both sides of a unit-wide rectangle placed at x.
  const spanAt = (points, x) => {
    const left = extentAt(points, x);
    const right = extentAt(points, x + 1);
    if (!left || !right) return null;
    return [Math.max(left[0], right[0]), Math.min(left[1], right[1])];
  };

  const heightAt = (points, x) => {
    const span = spanAt(points, x);
    return span ? span[1] - span[0] : -Infinity;
  };

  const largestRect = (theta) => {
    const q = rotate(POLY, -theta);
    let minX = Infinity;
    let maxX = -Infinity;
    for (const [x] of q) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    if (maxX - minX <= 1) return null;

    let lo = minX;
    let hi = maxX - 1;
    for (let i = 0; i < 60; i++) {
      const a = lo + (hi - lo) / 3;
      const b = hi - (hi - lo) / 3;
      if (heightAt(q, a) < heightAt(q, b)) lo = a;
      else hi = b;
    }

    const x = (lo + hi) / 2;
    const span = spanAt(q, x);
    if (!span || span[1] - span[0] <= 1e-9) return null;

    return {
      height: span[1] - span[0],
      // bottom-left, bottom-right, top-right, top-left
      corners: rotate(
        [[x, span[0]], [x + 1, span[0]], [x + 1, span[1]], [x, span[1]]],
        theta,
      ),
    };
  };

  const segmentDistance = ([qx, qy], [ax, ay], [bx, by]) => {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2
      ? Math.max(0, Math.min(1, ((qx - ax) * dx + (qy - ay) * dy) / len2))
      : 0;
    return Math.hypot(qx - (ax + t * dx), qy - (ay + t * dy));
  };

  const isContact = (corner) => {
    for (let i = 0; i < POLY.length; i++) {
      if (segmentDistance(corner, POLY[i], POLY[(i + 1) % POLY.length]) < 1e-4) {
        return true;
      }
    }
    return false;
  };

  // Area profile over all orientations, plus the global optimum.
  const SAMPLES = 300;
  const profile = new Float64Array(SAMPLES + 1);
  let bestTheta = 0;
  let bestHeight = 0;

  for (let i = 0; i <= SAMPLES; i++) {
    const result = largestRect((i / SAMPLES) * HALF_TURN);
    profile[i] = result ? result.height : 0;
    if (profile[i] > bestHeight) {
      bestHeight = profile[i];
      bestTheta = (i / SAMPLES) * HALF_TURN;
    }
  }

  // Refine inside the bracketing sample interval.
  {
    const step = HALF_TURN / SAMPLES;
    const centre = bestTheta;
    for (let i = 0; i <= 160; i++) {
      const theta = centre - step + (2 * step * i) / 160;
      if (theta < 0 || theta > HALF_TURN) continue;
      const result = largestRect(theta);
      if (result && result.height > bestHeight) {
        bestHeight = result.height;
        bestTheta = theta;
      }
    }
  }

  const bounds = POLY.reduce(
    (acc, [x, y]) => ({
      x0: Math.min(acc.x0, x),
      y0: Math.min(acc.y0, y),
      x1: Math.max(acc.x1, x),
      y1: Math.max(acc.y1, y),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity },
  );

  let width = 0;
  let height = 0;
  let showProfile = false;
  let polyScale = 1;
  let polyX = 0;
  let polyY = 0;
  let plotL = 0;
  let plotR = 0;
  let plotT = 0;
  let plotB = 0;
  let fontSize = 10;

  const layout = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = Math.max(10, Math.min(24, width * 0.02));
    fontSize = Math.max(9, Math.min(12, width * 0.011));
    // Narrower than this the profile plot would be unreadable, so drop it
    showProfile = width >= 560;

    const panelW = showProfile ? Math.min(width * 0.34, 400) : width;
    const boxW = panelW - pad * 2;
    const boxH = height - pad * 2;
    const modelW = bounds.x1 - bounds.x0;
    const modelH = bounds.y1 - bounds.y0;

    polyScale = Math.min(boxW / modelW, boxH / modelH);
    polyX = pad + (boxW - modelW * polyScale) / 2;
    polyY = pad + (boxH - modelH * polyScale) / 2;

    plotL = panelW + pad;
    plotR = width - pad;
    plotT = pad + fontSize * 1.8;
    plotB = height - pad - fontSize * 1.8;

    return true;
  };

  const px = (x) => polyX + (x - bounds.x0) * polyScale;
  const py = (y) => polyY + (bounds.y1 - y) * polyScale;

  const tracePath = (points) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      if (i) ctx.lineTo(px(x), py(y));
      else ctx.moveTo(px(x), py(y));
    });
    ctx.closePath();
  };

  const drawPolygon = (result, emphasise) => {
    tracePath(POLY);
    ctx.fillStyle = rgba(TEAL, 0.05);
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = rgba(INK, 0.8);
    ctx.stroke();

    for (const [x, y] of POLY) {
      ctx.beginPath();
      ctx.arc(px(x), py(y), 2.1, 0, Math.PI * 2);
      ctx.fillStyle = rgba(INK, 0.5);
      ctx.fill();
    }

    if (!result) return;
    const c = result.corners;

    tracePath(c);
    ctx.fillStyle = rgba(TEAL, emphasise ? 0.2 : 0.12);
    ctx.fill();
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = rgba(TEAL, 0.85);
    ctx.stroke();

    // The two sides of length exactly 1
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = rgba(CORAL, 0.95);
    ctx.beginPath();
    ctx.moveTo(px(c[0][0]), py(c[0][1]));
    ctx.lineTo(px(c[1][0]), py(c[1][1]));
    ctx.moveTo(px(c[2][0]), py(c[2][1]));
    ctx.lineTo(px(c[3][0]), py(c[3][1]));
    ctx.stroke();

    // Corners resting on the boundary — the contact set
    for (const corner of c) {
      if (!isContact(corner)) continue;
      ctx.beginPath();
      ctx.arc(px(corner[0]), py(corner[1]), 3.3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = rgba(CORAL, 0.95);
      ctx.stroke();
    }

    // "1" beside a unit side, pushed away from the rectangle centre
    const mx = (c[0][0] + c[1][0]) / 2;
    const my = (c[0][1] + c[1][1]) / 2;
    let ox = mx - (c[0][0] + c[2][0]) / 2;
    let oy = my - (c[0][1] + c[2][1]) / 2;
    const norm = Math.hypot(ox, oy) || 1;
    ox = (ox / norm) * 0.26;
    oy = (oy / norm) * 0.26;

    ctx.font = `${fontSize}px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = rgba(CORAL, 0.95);
    ctx.fillText('1', px(mx + ox), py(my + oy));
  };

  const drawProfile = (theta, result) => {
    const ceiling = bestHeight * 1.12;
    const tx = (t) => plotL + (t / HALF_TURN) * (plotR - plotL);
    const ty = (h) => plotB - (h / ceiling) * (plotB - plotT);

    const curve = (closed) => {
      ctx.beginPath();
      ctx.moveTo(tx(0), ty(profile[0]));
      for (let i = 1; i <= SAMPLES; i++) {
        ctx.lineTo(tx((i / SAMPLES) * HALF_TURN), ty(profile[i]));
      }
      if (closed) {
        ctx.lineTo(tx(HALF_TURN), plotB);
        ctx.lineTo(tx(0), plotB);
        ctx.closePath();
      }
    };

    curve(true);
    ctx.fillStyle = rgba(BLUE, 0.07);
    ctx.fill();

    curve(false);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = rgba(BLUE, 0.85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(plotL, plotB);
    ctx.lineTo(plotR, plotB);
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(MUTED, 0.5);
    ctx.stroke();

    ctx.font = `${fontSize}px ${MONO}`;
    ctx.fillStyle = rgba(MUTED, 1);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('0', plotL, plotB + 5);
    ctx.textAlign = 'center';
    ctx.fillText('π/2', (plotL + plotR) / 2, plotB + 5);
    ctx.textAlign = 'right';
    ctx.fillText('π', plotR, plotB + 5);

    // Global optimum
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(MUTED, 0.5);
    ctx.beginPath();
    ctx.moveTo(plotL, ty(bestHeight));
    ctx.lineTo(plotR, ty(bestHeight));
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(tx(bestTheta), ty(bestHeight), 3.1, 0, Math.PI * 2);
    ctx.fillStyle = rgba(OCHRE, 1);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = rgba(OCHRE, 1);
    ctx.fillText('MAX', tx(bestTheta), ty(bestHeight) - 6);

    // Current orientation
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = rgba(CORAL, 0.7);
    ctx.beginPath();
    ctx.moveTo(tx(theta), plotT - 4);
    ctx.lineTo(tx(theta), plotB);
    ctx.stroke();
    ctx.restore();

    const now = result ? result.height : 0;
    ctx.beginPath();
    ctx.arc(tx(theta), ty(now), 3.4, 0, Math.PI * 2);
    ctx.fillStyle = rgba(CORAL, 0.95);
    ctx.fill();

    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = rgba(MUTED, 1);
    ctx.fillText(
      `θ ${theta.toFixed(2)}   AREA ${now.toFixed(2)}`,
      plotR,
      plotT - 6,
    );
  };

  const draw = (theta, alpha, emphasise) => {
    ctx.clearRect(0, 0, width, height);
    if (alpha <= 0) return;

    ctx.globalAlpha = alpha;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const result = largestRect(theta);
    drawPolygon(result, emphasise);
    if (showProfile && plotR > plotL) drawProfile(theta, result);

    ctx.globalAlpha = 1;
  };

  const SWEEP_MS = 11000;
  const RETURN_MS = 900;
  const HOLD_MS = 2400;
  const FADE_MS = 700;
  const CYCLE_MS = SWEEP_MS + RETURN_MS + HOLD_MS + FADE_MS;

  let rafId = 0;
  let startedAt = 0;
  let running = false;
  let inView = false;
  let scrubTheta = null;

  const frame = (now) => {
    if (!running) return;
    if (!startedAt) startedAt = now;

    if (scrubTheta !== null) {
      draw(scrubTheta, 1, Math.abs(scrubTheta - bestTheta) < 0.015);
      rafId = requestAnimationFrame(frame);
      return;
    }

    const t = (now - startedAt) % CYCLE_MS;
    let theta = bestTheta;
    let alpha = 1;
    let emphasise = false;

    if (t < SWEEP_MS) {
      theta = (t / SWEEP_MS) * HALF_TURN;
      alpha = Math.min(1, t / 600);
    } else if (t < SWEEP_MS + RETURN_MS) {
      // Ease back from pi to the optimal orientation and rest there
      const p = (t - SWEEP_MS) / RETURN_MS;
      const eased = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p);
      theta = HALF_TURN + (bestTheta - HALF_TURN) * eased;
    } else {
      emphasise = true;
      if (t >= SWEEP_MS + RETURN_MS + HOLD_MS) {
        alpha = 1 - (t - SWEEP_MS - RETURN_MS - HOLD_MS) / FADE_MS;
      }
    }

    draw(theta, alpha, emphasise);
    rafId = requestAnimationFrame(frame);
  };

  const drawStatic = () => {
    if (layout()) draw(bestTheta, 1, true);
  };

  // Only run while the canvas is on screen and the tab is in front.
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
    if (reduceMotion.matches || !width) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    scrubTheta = Math.max(0, Math.min(1, ratio)) * HALF_TURN;
    play();
  };

  const releaseScrub = () => {
    if (scrubTheta === null) return;
    // Resume the loop where the pointer left it, so there is no jump.
    startedAt = performance.now() - (scrubTheta / HALF_TURN) * SWEEP_MS;
    scrubTheta = null;
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

initRectFigure();
