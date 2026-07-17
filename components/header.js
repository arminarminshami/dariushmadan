/* =========================================================
   DARIUSH MADAN AZAR — HEADER COMPONENT
   ---------------------------------------------------------
   Each page sets `const SITE_BASE = "";` (root) or `"../"`
   (one level deep, e.g. /pages/) BEFORE loading this script.
   `const ACTIVE_PAGE = "about";` etc. tells this component
   which nav icon to highlight.
   ========================================================= */

const DMA_ICONS = {
  home:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  about:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none"/></svg>',
  projects:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  business:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="7" height="7" rx="1"/><rect x="14" y="10" width="7" height="7" rx="1"/><path d="M10 13.5h4"/></svg>',
  investment:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M7 19V9"/><path d="M12 19V5"/><path d="M17 19v-7"/></svg>',
  gallery:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5-11 11"/></svg>',
  news:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 9h8M8 13h8M8 17h4"/></svg>',
  downloads: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>',
  contact:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>'
};

const DMA_NAV = [
  { key:'home',     label:'خانه',              href:'index.html' },
  { key:'about',     label:'درباره ما',          href:'pages/about.html' },
  { key:'projects',  label:'پروژه‌ها',           href:'pages/projects.html' },
  { key:'business',  label:'زمینه‌های فعالیت',    href:'pages/business-activities.html' },
  { key:'gallery',   label:'گالری',              href:'pages/gallery.html' },
  { key:'news',      label:'اخبار',              href:'pages/news.html' },
];

const DMA_LOGO = '<svg viewBox="0 0 40 40" fill="none"><path d="M4 30 L14 12 L20 22 L26 8 L36 30 Z" fill="none" stroke="#c8a24a" stroke-width="2" stroke-linejoin="round"/><line x1="4" y1="30" x2="36" y2="30" stroke="#c8a24a" stroke-width="2"/></svg>';

function dmaRenderHeader(){
  const base = (typeof SITE_BASE !== 'undefined') ? SITE_BASE : '';
  const active = (typeof ACTIVE_PAGE !== 'undefined') ? ACTIVE_PAGE : '';
  const fix = (href) => base + href;

  const linkHtml = (item, isMobile) => {
    const cls = item.key === active ? 'active' : '';
    return `<a href="${fix(item.href)}" class="${cls}">${DMA_ICONS[item.key]}<span>${item.label}</span></a>`;
  };

  const desktopLinks = DMA_NAV.map(i => linkHtml(i)).join('\n');
  const mobileLinks = DMA_NAV.concat([
    { key:'investment', label:'فرصت‌های سرمایه‌گذاری', href:'pages/investment.html' },
    { key:'downloads',  label:'دانلودها',              href:'pages/downloads.html' },
    { key:'contact',    label:'تماس با ما',            href:'pages/contact.html' }
  ]).map(i => linkHtml(i, true)).join('\n');

  const html = `
  <header class="site-header">
    <div class="nav">
      <a href="${fix('index.html')}" class="brand">
        <div class="mark">${DMA_LOGO}</div>
        <div class="brand-text"><b>داریوش معدن آذر</b><span>DARIUSH MADAN AZAR CO.</span></div>
      </a>
      <nav class="links">${desktopLinks}</nav>
      <a href="${fix('pages/contact.html')}" class="nav-cta">${DMA_ICONS.contact}<span>تماس با ما</span></a>
      <button class="burger" id="burgerBtn" aria-label="منو"><span></span><span></span><span></span></button>
    </div>
    <div class="mobile-menu" id="mobileMenu">${mobileLinks}</div>
  </header>`;

  document.getElementById('site-header').innerHTML = html;

  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

document.addEventListener('DOMContentLoaded', dmaRenderHeader);
