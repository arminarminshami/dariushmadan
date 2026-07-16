/* =========================================================
   DARIUSH MADAN AZAR — FOOTER COMPONENT
   Reads live contact info from DMA_DB.getSettings() so that
   editing "Company Settings" in the admin panel updates the
   footer on every page automatically — no code changes needed.
   ========================================================= */

function dmaRenderFooter(){
  const base = (typeof SITE_BASE !== 'undefined') ? SITE_BASE : '';
  const fix = (href) => base + href;
  const s = DMA_DB.getSettings();

  const html = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <div class="mark">${DMA_LOGO}</div>
            <b>${s.companyName}</b>
          </div>
          <p class="small">${s.aboutLead ? s.aboutLead.slice(0,120) + '…' : ''}</p>
        </div>
        <div class="footer-col">
          <h4>دسترسی سریع</h4>
          <a href="${fix('index.html')}">خانه</a>
          <a href="${fix('pages/about.html')}">درباره ما</a>
          <a href="${fix('pages/projects.html')}">پروژه‌ها</a>
          <a href="${fix('pages/business-activities.html')}">زمینه‌های فعالیت</a>
        </div>
        <div class="footer-col">
          <h4>بیشتر</h4>
          <a href="${fix('pages/investment.html')}">فرصت‌های سرمایه‌گذاری</a>
          <a href="${fix('pages/gallery.html')}">گالری</a>
          <a href="${fix('pages/news.html')}">اخبار</a>
          <a href="${fix('pages/downloads.html')}">دانلودها</a>
        </div>
        <div class="footer-col">
          <h4>تماس</h4>
          <a href="tel:${s.phone.replace(/\s/g,'')}" class="mono" dir="ltr">${s.phone}</a>
          <a href="mailto:${s.email}" class="mono" dir="ltr">${s.email}</a>
          <a href="https://instagram.com/${s.instagram}" target="_blank" rel="noopener">${s.instagram}@</a>
          <a href="${fix('pages/contact.html')}">فرم تماس ←</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>شماره ثبت شرکت: ${s.registrationNumber}</span>
        <span>© تمامی حقوق برای ${s.companyName} محفوظ است.</span>
        <a href="${fix('admin/index.html')}">ورود مدیریت</a>
      </div>
    </div>
  </footer>`;

  document.getElementById('site-footer').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', dmaRenderFooter);
