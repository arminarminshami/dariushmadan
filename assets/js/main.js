/* =========================================================
   DARIUSH MADAN AZAR — MAIN SITE SCRIPT
   Scroll reveal, counters, subtle parallax, and dynamic
   rendering of projects / news / gallery / downloads /
   contact info from DMA_DB (see assets/js/data.js).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- counter animation for hero stats ---------- */
  document.querySelectorAll('[data-counter]').forEach(el => {
    const raw = el.getAttribute('data-counter');
    const target = parseInt(raw.replace(/[^\d]/g,''), 10);
    if (isNaN(target)) return;
    const suffix = raw.replace(/[\d,]/g,'');
    let started = false;
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1400;
          const start = performance.now();
          function tick(now){
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.floor(eased * target);
            el.textContent = val.toLocaleString('en-US') + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString('en-US') + suffix;
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    counterIo.observe(el);
  });

  /* ---------- subtle parallax on hero strata ---------- */
  const heroStrata = document.querySelectorAll('.hero .strata, .page-hero .strata');
  if (heroStrata.length){
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroStrata.forEach(s => { s.style.transform = `translateY(${y * 0.08}px)`; });
    }, { passive:true });
  }

  /* ---------- render dynamic content blocks (data-driven) ---------- */
  renderProjects();
  renderNews();
  renderBlogs();
  renderNewsDetail();
  renderGallery();
  renderDownloads();
  renderContactInfo();
  renderHeroStats();
  bindContactForm();
});

function esc(str){
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function renderHeroStats(){
  const box = document.querySelector('[data-hero-stats]');
  if (!box) return;
  const s = DMA_DB.getSettings();
  const activeProjects = DMA_DB.getProjects().length;
  box.querySelector('[data-stat="capital"]')     && (box.querySelector('[data-stat="capital"]').textContent = s.capital);
  box.querySelector('[data-stat="projects"]')     && (box.querySelector('[data-stat="projects"]').textContent = activeProjects);
  box.querySelector('[data-stat="founded"]')      && (box.querySelector('[data-stat="founded"]').textContent = s.foundedYear);
}

function renderProjects(){
  const grid = document.querySelector('[data-projects-grid]');
  if (!grid) return;
  const projects = DMA_DB.getProjects();
  if (!projects.length){ grid.innerHTML = '<p class="gallery-empty">هنوز پروژه‌ای ثبت نشده است.</p>'; return; }
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-visual">
        <div class="strata"><div class="band"></div><div class="band" style="top:55%"></div><div class="vein" style="right:35%"></div></div>
        <div class="project-status">${esc(p.status)}</div>
      </div>
      <div class="project-body">
        <h3>${esc(p.name)}</h3>
        <div class="project-loc">📍 ${esc(p.location)}</div>
        <p class="desc">${esc(p.description)}</p>
        <div class="project-meta"><span class="meta-chip">${esc(p.mineral)}</span></div>
      </div>
    </div>
  `).join('');
}

function renderNews(limit){
  const grid = document.querySelector('[data-news-grid]');
  if (!grid) return;
  let items = DMA_DB.getNews().filter(n => !n.isBlog);
  if (limit) items = items.slice(0, limit);
  if (!items.length){ grid.innerHTML = '<p class="gallery-empty">خبری برای نمایش وجود ندارد.</p>'; return; }
  const base = (typeof SITE_BASE !== 'undefined') ? SITE_BASE : '';
  const newsHref = (n) => `${base}pages/news-detail.html?slug=${encodeURIComponent(n.slug || '')}&id=${n.id}`;
  grid.innerHTML = items.map(n => {
    const excerpt = n.summary && n.summary.trim() ? n.summary : ((n.content||'').slice(0,120) + ((n.content||'').length>120?'…':''));
    return `
    <a class="news-card" href="${newsHref(n)}">
      ${n.image ? `<div class="news-card-img"><img src="${n.image}" alt=""></div>` : ''}
      <div class="news-date mono">${esc(n.date)}</div>
      <h3>${esc(n.title)}</h3>
      <p>${esc(excerpt)}</p>
      <span class="rm">ادامه مطلب ←</span>
    </a>`;
  }).join('');
}


function renderBlogs(){
  const grid = document.querySelector('[data-blogs-grid]');
  if (!grid) return;
  const items = DMA_DB.getNews().filter(n => n.isBlog);
  if (!items.length){ grid.innerHTML = '<p class="gallery-empty">هنوز مطلبی در وبلاگ منتشر نشده است.</p>'; return; }
  const base = (typeof SITE_BASE !== 'undefined') ? SITE_BASE : '';
  const blogHref = (n) => `${base}pages/blog-detail.html?slug=${encodeURIComponent(n.slug || '')}&id=${n.id}`;
  grid.innerHTML = items.map(n => {
    const excerpt = n.summary && n.summary.trim() ? n.summary : ((n.content||'').slice(0,120) + ((n.content||'').length>120?'…':''));
    return `
    <a class="news-card" href="${blogHref(n)}">
      ${n.image ? `<div class="news-card-img"><img src="${n.image}" alt=""></div>` : ''}
      <div class="news-date mono">${esc(n.date)}</div>
      <h3>${esc(n.title)}</h3>
      <p>${esc(excerpt)}</p>
      <span class="rm">ادامه مطلب ←</span>
    </a>`;
  }).join('');
}

/* ---------- news detail page (pages/news-detail.html) ---------- */
function renderNewsDetail(){
  const box = document.querySelector('[data-news-detail]');
  if (!box) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const id = params.get('id');
  const item = (slug && DMA_DB.getNewsBySlug(slug)) || (id && DMA_DB.getNewsItem(id));

  if (!item){
    box.innerHTML = '<p class="gallery-empty">این خبر یافت نشد یا حذف شده است.</p>';
    return;
  }

  document.title = item.title + ' | داریوش معدن آذر';
  const imgHtml = item.image ? `<div class="news-detail-img"><img src="${item.image}" alt="${esc(item.title)}"></div>` : '';
  const paragraphs = (item.content || '').split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');

  box.innerHTML = `
    <div class="news-detail-date mono">${esc(item.date)}</div>
    <div class="tag" style="display:inline-block;margin-bottom:16px;">${item.isBlog ? 'وبلاگ' : 'اخبار شرکت'}</div>
    <h1 class="news-detail-title">${esc(item.title)}</h1>
    ${imgHtml}
    <div class="news-detail-body">${paragraphs || '<p>متنی برای این خبر ثبت نشده است.</p>'}</div>
  `;
}

function renderGallery(){
  const grid = document.querySelector('[data-gallery-grid]');
  if (!grid) return;
  const items = DMA_DB.getMedia();
  if (!items.length){
    grid.innerHTML = '<p class="gallery-empty">هنوز تصویری از پنل مدیریت بارگذاری نشده است. تصاویر از بخش «رسانه» پنل ادمین قابل افزودن هستند.</p>';
    return;
  }
  grid.innerHTML = items.map(m => `
    <div class="gallery-item">
      ${m.url ? `<img src="${m.url}" alt="${esc(m.category||'')}">` : ''}
      <span class="cat">${esc(m.category || 'عمومی')}</span>
    </div>
  `).join('');
}

function renderDownloads(){
  const list = document.querySelector('[data-downloads-list]');
  if (!list) return;
  const items = DMA_DB.getDownloads();
  if (!items.length){
    list.innerHTML = '<p class="dl-empty">هنوز فایلی برای دانلود بارگذاری نشده است. فایل‌ها از پنل مدیریت قابل افزودن هستند.</p>';
    return;
  }
  list.innerHTML = items.map(d => `
    <div class="dl-item">
      <div class="dl-info">
        <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        <div>
          <h4>${esc(d.title)}</h4>
          <div class="dl-meta">${esc(d.category || 'مستندات')} · ${esc(d.date || '')}</div>
        </div>
      </div>
      ${d.fileUrl ? `<a class="dl-btn" href="${d.fileUrl}" download="${esc(d.title)}">دانلود</a>` : `<span class="dl-btn" style="opacity:.5;cursor:not-allowed;">فایل موجود نیست</span>`}
    </div>
  `).join('');
}

function renderContactInfo(){
  const s = DMA_DB.getSettings();
  document.querySelectorAll('[data-field]').forEach(el => {
    const key = el.getAttribute('data-field');
    if (s[key] !== undefined){
      if (el.tagName === 'A' && el.hasAttribute('href')){
        if (el.href.startsWith('tel:')) el.href = 'tel:+98' + s.phone.replace(/\s|^0/g,'');
        else if (el.href.startsWith('mailto:')) el.href = 'mailto:' + s.email;
        el.textContent = s[key];
      } else {
        el.textContent = s[key];
      }
    }
  });
}

function bindContactForm(){
  const cf = document.getElementById('contactForm');
  if (!cf) return;
  cf.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('.submit-btn');
    const original = btn.textContent;
    btn.textContent = 'درخواست شما ثبت شد ✓';
    btn.style.background = '#b87333';
    setTimeout(() => { btn.textContent = original; btn.style.background = ''; this.reset(); }, 2600);
  });
}
