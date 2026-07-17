/* =========================================================
   DARIUSH MADAN AZAR — DATA LAYER
   ---------------------------------------------------------
   All content (projects, news, media, downloads, settings)
   lives here. For now it is persisted to localStorage so the
   whole site works by simply opening index.html (no server
   required). The public pages and the admin panel both read
   and write through this same DMA_DB object.

   FUTURE UPGRADE PATH:
   Every function below already returns/accepts plain JSON-
   shaped objects that match /data/*.json. When a real backend
   exists, replace the body of each function with a fetch()
   call to your API — nothing else in the site needs to change,
   because every page only ever talks to DMA_DB, never to
   localStorage directly.
   ========================================================= */

const DMA_KEYS = {
  projects:  'dma_projects',
  news:      'dma_news',
  media:     'dma_media',
  downloads: 'dma_downloads',
  settings:  'dma_settings',
  adminPass: 'dma_admin_pass'
};

/* ---------------- seed data (first-run defaults) ---------------- */
const DMA_SEED = {
  settings: {
    companyName:   "داریوش معدن آذر",
    companyNameEn: "Dariush Madan Azar",
    registrationNumber: "20604",
    capital:       "22,000,000,000",
    foundedYear:   "1400",
    chairman:      "داریوش جعفری",
    ceo:           "مجید جعفری",
    chairmanShare: "99",
    ceoShare:      "1",
    phone:         "0914 410 7797",
    email:         "Dr.jafari86@gmail.com",
    instagram:     "dariushmadan",
    linkedin:      "",
    youtube:       "",
    telegram:      "",
    officeTehran:  "تهران، پونک شمالی، بلوار المهدی، روبروی بوستان امام‌رضا، ساختمان نور",
    officeTabriz:  "تبریز، چهارراه آبرسان، برج سفید ۱، نبش مهرگان سوم، طبقه ۷",
    aboutLead: "داریوش معدن آذر با این باور تأسیس شد که ایران، با برخورداری از یکی از غنی‌ترین ذخایر معدنی جهان، هنوز از ظرفیت واقعی خود در اکتشاف، استخراج، فرآوری، توسعه فناوری‌های معدنی و ایجاد ارزش افزوده بهره‌برداری کامل نکرده است.",
    aboutBody: "هدف از تأسیس این شرکت، تنها فعالیت در حوزه استخراج مواد معدنی نیست؛ بلکه ایجاد مجموعه‌ای دانش‌محور، نوآور و آینده‌نگر است که بتواند زنجیره ارزش معدن را از مرحله شناسایی ذخایر تا فرآوری، تولید محصولات با ارزش افزوده، جذب سرمایه، توسعه فناوری و حضور در بازارهای داخلی و بین‌المللی تکمیل کند. ما بر این باوریم که معدن تنها یک منبع طبیعی نیست، بلکه سرمایه‌ای ملی برای توسعه اقتصادی، اشتغال‌زایی، رشد صنایع پایین‌دستی و افزایش ثروت پایدار کشور است.",
    vision: "چشم‌انداز داریوش معدن آذر، تبدیل شدن به یکی از شرکت‌های پیشرو در صنعت معدن ایران و منطقه است؛ شرکتی که با تلفیق معدن، فناوری، نوآوری و سرمایه‌گذاری هوشمند، نقش مؤثری در توسعه پایدار بخش معدن ایفا کرده و به مرجعی قابل اعتماد برای سرمایه‌گذاران، صنعتگران و فعالان معدنی تبدیل شود."
  },

  projects: [
    {
      id: 1,
      name: "معدن کلسیت سفید تک اشخانه",
      location: "خراسان شمالی، بجنورد، اشخانه",
      mineral: "کربنات کلسیم",
      status: "در حال استخراج / فرآوری",
      description: "بهره‌برداری از ذخایر کربنات کلسیم با کیفیت بالا. واحد فرآوری این معدن جهت تولید کربنات کلسیم به‌عنوان ماده اولیه «کاغذ سنگی» هم‌اکنون در حال احداث است.",
      images: [],
      documents: [],
      createdAt: "1400-01-01"
    },
    {
      id: 2,
      name: "معدن مسکویت قره‌آغاج",
      location: "آذربایجان شرقی، قره‌آغاج",
      mineral: "میکا مسکویت",
      status: "در حال بهره‌برداری",
      description: "استخراج و بهره‌برداری از ذخایر میکای مسکویت، با کاربرد گسترده در صنایع رنگ، پلاستیک، لوازم آرایشی و صنایع الکترونیک.",
      images: [],
      documents: [],
      createdAt: "1400-01-01"
    }
  ],

  news: [
    {
      id: 1,
      slug: "afttah-vahed-farvari-carbonat-calcium-ashkhaneh",
      isBlog: false,
      title: "آغاز احداث واحد فرآوری کربنات کلسیم در معدن اشخانه",
      summary: "واحد فرآوری کربنات کلسیم برای تولید ماده اولیه کاغذ سنگی در معدن کلسیت سفید تک اشخانه وارد فاز احداث شد.",
      date: "1403-09-10",
      image: "",
      content: "واحد فرآوری کربنات کلسیم با هدف تولید ماده اولیه کاغذ سنگی در معدن کلسیت سفید تک اشخانه وارد فاز احداث شد. این واحد گامی مهم در مسیر جلوگیری از خام‌فروشی مواد معدنی است."
    },
    {
      id: 2,
      slug: "tadavom-bahrebardari-moscovite-ghareaghaj",
      isBlog: false,
      title: "تداوم بهره‌برداری از معدن مسکویت قره‌آغاج",
      summary: "عملیات استخراج و بهره‌برداری از ذخایر میکای مسکویت در معدن قره‌آغاج آذربایجان شرقی با روند مطلوبی ادامه دارد.",
      date: "1403-06-02",
      image: "",
      content: "عملیات استخراج و بهره‌برداری از ذخایر میکای مسکویت در معدن قره‌آغاج آذربایجان شرقی با روند مطلوبی ادامه دارد."
    },
    {
      id: 3,
      slug: "sabt-rasmi-sherkat-dariush-madan-azar",
      isBlog: false,
      title: "ثبت رسمی شرکت داریوش معدن آذر",
      summary: "شرکت داریوش معدن آذر با شماره ثبت ۲۰۶۰۴ و سرمایه ثبتی اولیه ۲۲,۰۰۰,۰۰۰,۰۰۰ ریال به‌طور رسمی فعالیت خود را آغاز کرد.",
      date: "1400-01-15",
      image: "",
      content: "شرکت داریوش معدن آذر با شماره ثبت ۲۰۶۰۴ و سرمایه ثبتی اولیه ۲۲,۰۰۰,۰۰۰,۰۰۰ ریال به‌طور رسمی فعالیت خود را در صنعت معدن آغاز کرد."
    }
  ],

  media: [],
  downloads: []
};

/* ---------------- low level storage helpers ---------------- */
function _get(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(raw === null) return fallback;
    return JSON.parse(raw);
  }catch(e){
    console.error('DMA_DB read error', key, e);
    return fallback;
  }
}
function _set(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch(e){
    console.error('DMA_DB write error', key, e);
    return false;
  }
}
function _nextId(list){
  return list.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}

/* ---------------- public DB API ---------------- */
const DMA_DB = {

  init(){
    if(localStorage.getItem(DMA_KEYS.settings)  === null) _set(DMA_KEYS.settings,  DMA_SEED.settings);
    if(localStorage.getItem(DMA_KEYS.projects)  === null) _set(DMA_KEYS.projects,  DMA_SEED.projects);
    if(localStorage.getItem(DMA_KEYS.news)      === null) _set(DMA_KEYS.news,      DMA_SEED.news);
    if(localStorage.getItem(DMA_KEYS.media)     === null) _set(DMA_KEYS.media,     DMA_SEED.media);
    if(localStorage.getItem(DMA_KEYS.downloads) === null) _set(DMA_KEYS.downloads, DMA_SEED.downloads);
    if(localStorage.getItem(DMA_KEYS.adminPass) === null) _set(DMA_KEYS.adminPass, "20604");
  },

  resetToSeed(){
    _set(DMA_KEYS.settings,  DMA_SEED.settings);
    _set(DMA_KEYS.projects,  DMA_SEED.projects);
    _set(DMA_KEYS.news,      DMA_SEED.news);
    _set(DMA_KEYS.media,     DMA_SEED.media);
    _set(DMA_KEYS.downloads, DMA_SEED.downloads);
  },

  /* settings */
  getSettings(){ return _get(DMA_KEYS.settings, DMA_SEED.settings); },
  saveSettings(obj){ return _set(DMA_KEYS.settings, obj); },

  /* projects */
  getProjects(){ return _get(DMA_KEYS.projects, []); },
  getProject(id){ return this.getProjects().find(p => p.id === Number(id)); },
  saveProject(project){
    const list = this.getProjects();
    if(project.id){
      const idx = list.findIndex(p => p.id === Number(project.id));
      if(idx > -1){ list[idx] = {...list[idx], ...project}; }
      else{ list.push(project); }
    }else{
      project.id = _nextId(list);
      project.createdAt = new Date().toISOString().slice(0,10);
      list.push(project);
    }
    _set(DMA_KEYS.projects, list);
    return project;
  },
  deleteProject(id){
    const list = this.getProjects().filter(p => p.id !== Number(id));
    _set(DMA_KEYS.projects, list);
  },

  /* news */
  getNews(){ return _get(DMA_KEYS.news, []).sort((a,b)=> b.date.localeCompare(a.date)); },
  getNewsItem(id){ return this.getNews().find(n => n.id === Number(id)); },
  getNewsBySlug(slug){ return this.getNews().find(n => n.slug === slug); },
  saveNews(item){
    const list = _get(DMA_KEYS.news, []);
    if(item.id){
      const idx = list.findIndex(n => n.id === Number(item.id));
      if(idx > -1){ list[idx] = {...list[idx], ...item}; }
      else{ list.push(item); }
    }else{
      item.id = _nextId(list);
      list.push(item);
    }
    _set(DMA_KEYS.news, list);
    return item;
  },
  deleteNews(id){
    const list = _get(DMA_KEYS.news, []).filter(n => n.id !== Number(id));
    _set(DMA_KEYS.news, list);
  },

  /* media */
  getMedia(){ return _get(DMA_KEYS.media, []); },
  addMedia(item){
    const list = this.getMedia();
    item.id = _nextId(list);
    list.push(item);
    _set(DMA_KEYS.media, list);
    return item;
  },
  deleteMedia(id){
    const list = this.getMedia().filter(m => m.id !== Number(id));
    _set(DMA_KEYS.media, list);
  },

  /* downloads */
  getDownloads(){ return _get(DMA_KEYS.downloads, []); },
  saveDownload(item){
    const list = this.getDownloads();
    if(item.id){
      const idx = list.findIndex(d => d.id === Number(item.id));
      if(idx > -1){ list[idx] = {...list[idx], ...item}; }
      else{ list.push(item); }
    }else{
      item.id = _nextId(list);
      item.date = new Date().toISOString().slice(0,10);
      list.push(item);
    }
    _set(DMA_KEYS.downloads, list);
    return item;
  },
  deleteDownload(id){
    const list = this.getDownloads().filter(d => d.id !== Number(id));
    _set(DMA_KEYS.downloads, list);
  },

  /* admin auth (client-side only — see admin/js/auth.js) */
  checkPassword(pass){ return _get(DMA_KEYS.adminPass, "20604") === pass; },
  setPassword(pass){ return _set(DMA_KEYS.adminPass, pass); }
};

DMA_DB.init();
