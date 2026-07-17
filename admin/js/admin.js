/* =========================================================
   DARIUSH MADAN AZAR — ADMIN PANEL LOGIC
   All reads/writes go through DMA_DB (assets/js/data.js).
   Anything saved here is instantly reflected on the public
   site because both read from the same localStorage-backed
   data layer.
   ========================================================= */

const ADM_ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
  projects:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  news:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 9h8M8 13h8M8 17h4"/></svg>',
  media:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5-11 11"/></svg>',
  downloads: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>',
  settings:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 000-3l2-1.4-2-3.4-2.3.8a7.6 7.6 0 00-2.6-1.5L14 2h-4l-.5 2.5a7.6 7.6 0 00-2.6 1.5l-2.3-.8-2 3.4 2 1.4a7.6 7.6 0 000 3l-2 1.4 2 3.4 2.3-.8a7.6 7.6 0 002.6 1.5L10 22h4l.5-2.5a7.6 7.6 0 002.6-1.5l2.3.8 2-3.4-2-1.4z"/></svg>',
  edit:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  trash:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  plus:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  logout:    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  site:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>'
};

function esc(str){
  const d = document.createElement('div');
  d.textContent = str == null ? '' : String(str);
  return d.innerHTML;
}

function toast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ---------------- panel switching ---------------- */
function dmaSwitchPanel(name){
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav button[data-panel]').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelector(`.admin-nav button[data-panel="${name}"]`).classList.add('active');
  if(name === 'dashboard') renderDashboard();
  if(name === 'projects') renderProjectsTable();
  if(name === 'news') renderNewsTable();
  if(name === 'media') renderMediaGrid();
  if(name === 'downloads') renderDownloadsTable();
  if(name === 'settings') fillSettingsForm();
}

/* ---------------- dashboard ---------------- */
function renderDashboard(){
  const p = DMA_DB.getProjects(), n = DMA_DB.getNews(), m = DMA_DB.getMedia(), d = DMA_DB.getDownloads();
  document.getElementById('dashStats').innerHTML = `
    <div class="dash-stat"><div class="n mono">${p.length}</div><div class="l">پروژه ثبت‌شده</div></div>
    <div class="dash-stat"><div class="n mono">${n.length}</div><div class="l">خبر منتشرشده</div></div>
    <div class="dash-stat"><div class="n mono">${m.length}</div><div class="l">فایل رسانه</div></div>
    <div class="dash-stat"><div class="n mono">${d.length}</div><div class="l">فایل دانلودی</div></div>`;

  const recent = [
    ...n.map(x => ({t:x.title, meta:'خبر · ' + x.date})),
    ...p.map(x => ({t:x.name, meta:'پروژه · ' + (x.createdAt||'')}))
  ].slice(0,6);
  document.getElementById('dashRecent').innerHTML = recent.length
    ? recent.map(r => `<div class="row"><span>${esc(r.t)}</span><span>${esc(r.meta)}</span></div>`).join('')
    : '<div class="row"><span>موردی برای نمایش نیست</span></div>';
}

/* ---------------- projects ---------------- */
function renderProjectsTable(){
  const list = DMA_DB.getProjects();
  const body = document.getElementById('projectsTableBody');
  if(!list.length){ body.innerHTML = `<tr><td colspan="5" class="empty-row">هنوز پروژه‌ای ثبت نشده است.</td></tr>`; return; }
  body.innerHTML = list.map(p => `
    <tr>
      <td>${esc(p.name)}</td>
      <td>${esc(p.location)}</td>
      <td>${esc(p.mineral)}</td>
      <td>${esc(p.status)}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openProjectModal(${p.id})">${ADM_ICONS.edit}</button>
          <button class="icon-btn danger" onclick="deleteProjectRow(${p.id})">${ADM_ICONS.trash}</button>
        </div>
      </td>
    </tr>`).join('');
}
function openProjectModal(id){
  const p = id ? DMA_DB.getProject(id) : null;
  document.getElementById('projectModalTitle').textContent = p ? 'ویرایش پروژه' : 'افزودن پروژه جدید';
  document.getElementById('pf-id').value = p ? p.id : '';
  document.getElementById('pf-name').value = p ? p.name : '';
  document.getElementById('pf-location').value = p ? p.location : '';
  document.getElementById('pf-mineral').value = p ? p.mineral : '';
  document.getElementById('pf-status').value = p ? p.status : 'در حال اکتشاف';
  document.getElementById('pf-description').value = p ? p.description : '';
  window._pfImages = p ? (p.images || []) : [];
  renderFilePreview('pf-images-preview', window._pfImages, 'pf');
  document.getElementById('projectModal').classList.add('show');
}
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
async function handleProjectImages(input){
  for(const file of input.files){
    const dataUrl = await readFileAsDataURL(file);
    window._pfImages.push(dataUrl);
  }
  renderFilePreview('pf-images-preview', window._pfImages, 'pf');
  input.value = '';
}
function renderFilePreview(containerId, images, prefix){
  const el = document.getElementById(containerId);
  el.innerHTML = images.map((src,i) => `<img src="${src}" onclick="window.${prefix}RemoveImage(${i})" title="حذف">`).join('');
}
window.pfRemoveImage = (i) => { window._pfImages.splice(i,1); renderFilePreview('pf-images-preview', window._pfImages, 'pf'); };

function saveProjectForm(e){
  e.preventDefault();
  const id = document.getElementById('pf-id').value;
  DMA_DB.saveProject({
    id: id ? Number(id) : undefined,
    name: document.getElementById('pf-name').value.trim(),
    location: document.getElementById('pf-location').value.trim(),
    mineral: document.getElementById('pf-mineral').value.trim(),
    status: document.getElementById('pf-status').value,
    description: document.getElementById('pf-description').value.trim(),
    images: window._pfImages || [],
    documents: []
  });
  closeModal('projectModal');
  renderProjectsTable();
  toast('پروژه ذخیره شد ✓');
}
function deleteProjectRow(id){
  if(!confirm('حذف این پروژه قطعی است. ادامه می‌دهید؟')) return;
  DMA_DB.deleteProject(id);
  renderProjectsTable();
  toast('پروژه حذف شد');
}

/* ---------------- news ---------------- */
function renderNewsTable(){
  const list = DMA_DB.getNews();
  const body = document.getElementById('newsTableBody');
  if(!list.length){ body.innerHTML = `<tr><td colspan="4" class="empty-row">هنوز خبری ثبت نشده است.</td></tr>`; return; }
  body.innerHTML = list.map(n => `
    <tr>
      <td>${esc(n.title)}</td>
      <td>${n.isBlog ? '<span style="color:#e2c377;">وبلاگ</span>' : '<span style="color:#c8a24a;">اخبار شرکت</span>'}</td>
      <td class="mono">${esc(n.date)}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openNewsModal(${n.id})">${ADM_ICONS.edit}</button>
          <button class="icon-btn danger" onclick="deleteNewsRow(${n.id})">${ADM_ICONS.trash}</button>
        </div>
      </td>
    </tr>`).join('');
}
function openNewsModal(id){
  const n = id ? DMA_DB.getNewsItem(id) : null;
  document.getElementById('newsModalTitle').textContent = n ? 'ویرایش خبر' : 'افزودن خبر جدید';
  document.getElementById('nf-id').value = n ? n.id : '';
  document.getElementById('nf-title').value = n ? n.title : '';
  document.getElementById('nf-isblog').value = n && n.isBlog ? 'true' : 'false';
  document.getElementById('nf-date').value = n ? n.date : new Date().toISOString().slice(0,10);
  document.getElementById('nf-summary').value = n ? (n.summary || '') : '';
  document.getElementById('nf-content').value = n ? n.content : '';
  window._nfImageUrl = n ? (n.image || '') : '';
  document.getElementById('nf-imagename').textContent = window._nfImageUrl ? 'تصویری بارگذاری‌شده موجود است' : 'تصویری انتخاب نشده';
  document.getElementById('newsModal').classList.add('show');
}
async function handleNewsImage(input){
  const file = input.files[0];
  if(!file) return;
  window._nfImageUrl = await readFileAsDataURL(file);
  document.getElementById('nf-imagename').textContent = file.name;
}
function slugify(text){
  return 'news-' + Date.now() + '-' + text.trim().slice(0,20).replace(/[^a-zA-Z0-9ا-ی]+/g,'-').replace(/^-+|-+$/g,'');
}
function saveNewsForm(e){
  e.preventDefault();
  const id = document.getElementById('nf-id').value;
  const existing = id ? DMA_DB.getNewsItem(id) : null;
  const title = document.getElementById('nf-title').value.trim();
  DMA_DB.saveNews({
    id: id ? Number(id) : undefined,
    slug: existing ? existing.slug : slugify(title),
    title: title,
    isBlog: document.getElementById('nf-isblog').value === 'true',
    date: document.getElementById('nf-date').value,
    summary: document.getElementById('nf-summary').value.trim(),
    image: window._nfImageUrl || '',
    content: document.getElementById('nf-content').value.trim()
  });
  window._nfImageUrl = '';
  closeModal('newsModal');
  renderNewsTable();
  toast('خبر ذخیره شد ✓');
}
function deleteNewsRow(id){
  if(!confirm('حذف این خبر قطعی است. ادامه می‌دهید؟')) return;
  DMA_DB.deleteNews(id);
  renderNewsTable();
  toast('خبر حذف شد');
}

/* ---------------- media ---------------- */
function renderMediaGrid(){
  const list = DMA_DB.getMedia();
  const grid = document.getElementById('mediaGrid');
  if(!list.length){ grid.innerHTML = `<p class="empty-row">هنوز رسانه‌ای بارگذاری نشده است.</p>`; return; }
  grid.innerHTML = list.map(m => `
    <div class="media-tile">
      <img src="${m.url}" alt="">
      <span class="cat">${esc(m.category || 'عمومی')}</span>
      <button class="del" onclick="deleteMediaTile(${m.id})">${ADM_ICONS.trash}</button>
    </div>`).join('');
}
async function handleMediaUpload(input){
  const cat = document.getElementById('mediaCategory').value || 'عمومی';
  for(const file of input.files){
    const dataUrl = await readFileAsDataURL(file);
    DMA_DB.addMedia({ type:'image', url: dataUrl, category: cat });
  }
  input.value = '';
  renderMediaGrid();
  toast('تصویر(ها) بارگذاری شد ✓');
}
function deleteMediaTile(id){
  if(!confirm('حذف این تصویر قطعی است. ادامه می‌دهید؟')) return;
  DMA_DB.deleteMedia(id);
  renderMediaGrid();
  toast('تصویر حذف شد');
}

/* ---------------- downloads ---------------- */
function renderDownloadsTable(){
  const list = DMA_DB.getDownloads();
  const body = document.getElementById('downloadsTableBody');
  if(!list.length){ body.innerHTML = `<tr><td colspan="4" class="empty-row">هنوز فایلی بارگذاری نشده است.</td></tr>`; return; }
  body.innerHTML = list.map(d => `
    <tr>
      <td>${esc(d.title)}</td>
      <td>${esc(d.category || '—')}</td>
      <td class="mono">${esc(d.date || '')}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openDownloadModal(${d.id})">${ADM_ICONS.edit}</button>
          <button class="icon-btn danger" onclick="deleteDownloadRow(${d.id})">${ADM_ICONS.trash}</button>
        </div>
      </td>
    </tr>`).join('');
}
function openDownloadModal(id){
  const d = id ? DMA_DB.getDownloads().find(x=>x.id===Number(id)) : null;
  document.getElementById('dfModalTitle').textContent = d ? 'ویرایش فایل' : 'افزودن فایل دانلودی';
  document.getElementById('df-id').value = d ? d.id : '';
  document.getElementById('df-title').value = d ? d.title : '';
  document.getElementById('df-category').value = d ? d.category : '';
  window._dfFileUrl = d ? d.fileUrl : null;
  document.getElementById('df-filename').textContent = window._dfFileUrl ? 'فایلی بارگذاری‌شده موجود است' : 'فایلی انتخاب نشده';
  document.getElementById('downloadModal').classList.add('show');
}
async function handleDownloadFile(input){
  const file = input.files[0];
  if(!file) return;
  window._dfFileUrl = await readFileAsDataURL(file);
  document.getElementById('df-filename').textContent = file.name;
}
function saveDownloadForm(e){
  e.preventDefault();
  const id = document.getElementById('df-id').value;
  DMA_DB.saveDownload({
    id: id ? Number(id) : undefined,
    title: document.getElementById('df-title').value.trim(),
    category: document.getElementById('df-category').value.trim(),
    fileUrl: window._dfFileUrl || null
  });
  closeModal('downloadModal');
  renderDownloadsTable();
  toast('فایل ذخیره شد ✓');
}
function deleteDownloadRow(id){
  if(!confirm('حذف این فایل قطعی است. ادامه می‌دهید؟')) return;
  DMA_DB.deleteDownload(id);
  renderDownloadsTable();
  toast('فایل حذف شد');
}

/* ---------------- settings ---------------- */
function fillSettingsForm(){
  const s = DMA_DB.getSettings();
  const f = document.getElementById('settingsForm');
  Object.keys(s).forEach(key => {
    const el = f.querySelector(`[name="${key}"]`);
    if(el) el.value = s[key];
  });
}
function saveSettingsForm(e){
  e.preventDefault();
  const f = document.getElementById('settingsForm');
  const s = DMA_DB.getSettings();
  new FormData(f).forEach((val, key) => { s[key] = val; });
  DMA_DB.saveSettings(s);
  toast('تنظیمات ذخیره شد ✓');
}
function changeAdminPassword(e){
  e.preventDefault();
  const cur = document.getElementById('pw-current').value;
  const next = document.getElementById('pw-new').value;
  if(!DMA_DB.checkPassword(cur)){ toast('رمز فعلی نادرست است'); return; }
  if(next.length < 4){ toast('رمز جدید باید حداقل ۴ کاراکتر باشد'); return; }
  DMA_DB.setPassword(next);
  document.getElementById('pw-current').value = '';
  document.getElementById('pw-new').value = '';
  toast('رمز عبور تغییر کرد ✓');
}

/* ---------------- init ---------------- */
function dmaInitAdmin(){
  document.querySelectorAll('.admin-nav button[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => dmaSwitchPanel(btn.getAttribute('data-panel')));
  });
  renderDashboard();
}
