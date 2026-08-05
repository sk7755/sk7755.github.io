// Mirrors the `max-width: 860px` breakpoint in styles.css, where the nav
// collapses into the toggle-driven panel.
const compactNav = window.matchMedia('(max-width: 860px)');

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
