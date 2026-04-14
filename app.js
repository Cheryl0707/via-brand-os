/* ========================================
   Via Brand OS — Application Logic
   ======================================== */

// --- State ---
let currentView = 'dashboard';
let currentBrand = null; // 'via' | 'cm' | 'remix' | null
let currentCity = 'austin';
let aiSidebarOpen = false;

// --- City Data ---
const cityData = {
  austin: {
    name: 'Austin',
    state: 'TX',
    headline: 'Your ride is going\nautonomous in Austin',
    subline: 'Starting Spring 2026, Waymo autonomous vehicles join the Austin transit network. Same app. Same price. A whole new ride.',
    illus: { emoji: '\u{1F3DB}', label: 'Texas State Capitol' },
    safety: 'Texas (TX)',
    suggestions: [
      'The future of transit has arrived in Austin',
      'Austin, meet your autonomous ride',
      'Driverless. Affordable. Now in Austin.'
    ]
  },
  denver: {
    name: 'Denver',
    state: 'CO',
    headline: 'Your ride is going\nautonomous in Denver',
    subline: 'Starting Summer 2026, Waymo autonomous vehicles join the Denver metro transit network. Same app. Same price. A whole new ride.',
    illus: { emoji: '\u{1F3D4}', label: 'Rocky Mountains' },
    safety: 'Colorado (CO)',
    suggestions: [
      'Denver, the future of transit is electric and autonomous',
      'From the Rockies to your ride — now autonomous',
      'Mile High City, meet your driverless ride.'
    ]
  },
  seattle: {
    name: 'Seattle',
    state: 'WA',
    headline: 'Your ride is going\nautonomous in Seattle',
    subline: 'Starting Fall 2026, Waymo autonomous vehicles join the Seattle transit network. Same app. Same price. A whole new ride.',
    illus: { emoji: '\u{1F308}', label: 'Space Needle' },
    safety: 'Washington (WA)',
    suggestions: [
      'Seattle, your ride just got smarter',
      'Autonomous transit arrives in the Emerald City',
      'Rain or shine — your driverless ride awaits.'
    ]
  }
};

// --- Breadcrumb Map ---
const breadcrumbs = {
  'dashboard': 'Dashboard',
  'cross-brand': 'Cross-Brand Hub',
  'via-home': 'Via',
  'via-foundation': 'Via > Brand Foundation',
  'via-templates': 'Via > Templates',
  'via-templates-av': 'Via > Templates > Autonomous Vehicles',
  'via-templates-rider': 'Via > Templates > Rider Growth',
  'via-templates-gov': 'Via > Templates > GovTech Sales',
  'via-av-poster': 'Via > Templates > AV > Bus Stop Poster',
  'via-cities': 'Via > City Manager',
  'via-city-detail': 'Via > City Manager > Chandler Flex',
  'cm-home': 'Citymapper',
  'cm-social': 'Citymapper > Templates > Social Media Kit',
  'cm-billboard': 'Citymapper > Templates > City Billboard',
  'cm-foundation': 'Citymapper > Brand Foundation',
  'cm-templates': 'Citymapper > Templates',
  'cm-cities': 'Citymapper > City Manager',
  'remix-home': 'Remix',
  'remix-foundation': 'Remix > Brand Foundation',
  'remix-templates': 'Remix > Templates',
  'remix-agencies': 'Remix > Agency Manager',
  'projects': 'Projects',
  'project-waymo': 'Projects > Waymo AV Expansion \u2014 New York',
  'project-mayor': 'Projects > Mayor Outreach Campaign',
  'project-coming-soon': 'Projects > Coming Soon',
  'insights': 'Insights',
  'city-generator': 'City Material Generator'
};

// --- Navigation ---
function navigateTo(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  // Show target view
  const target = document.getElementById('view-' + viewId);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight; // trigger reflow
    target.style.animation = '';
  }

  // Update sidebar active state
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.sidebar-subitem').forEach(item => item.classList.remove('active'));

  // Determine brand
  let brand = null;
  if (viewId.startsWith('via')) brand = 'via';
  else if (viewId.startsWith('cm')) brand = 'cm';
  else if (viewId.startsWith('remix')) brand = 'remix';
  currentBrand = brand;

  // Activate correct sidebar item
  const sidebarItem = document.querySelector(`.sidebar-item[data-view="${viewId}"]`);
  if (sidebarItem) sidebarItem.classList.add('active');

  // Activate brand parent and show subnav
  if (brand) {
    const brandItem = document.querySelector(`.sidebar-item[data-view="${brand === 'cm' ? 'cm-home' : brand + '-home'}"]`);
    if (brandItem) brandItem.classList.add('active');

    // Show/hide subnavs
    document.querySelectorAll('.sidebar-sub').forEach(s => s.style.display = 'none');
    const subnav = document.getElementById(brand + '-subnav');
    if (subnav) subnav.style.display = 'flex';

    // Highlight sub-item
    const subItem = document.querySelector(`.sidebar-subitem[data-view="${viewId}"]`);
    if (subItem) subItem.classList.add('active');
  } else {
    document.querySelectorAll('.sidebar-sub').forEach(s => s.style.display = 'none');
    // Activate exact match for non-brand items
    const item = document.querySelector(`.sidebar-item[data-view="${viewId}"]`);
    if (item) item.classList.add('active');
  }

  // Update breadcrumb
  const bc = document.getElementById('breadcrumb');
  bc.innerHTML = (breadcrumbs[viewId] || viewId).split(' > ').map((part, i, arr) => {
    if (i < arr.length - 1) return `<span class="bc-link">${part}</span> <span class="bc-sep">&rsaquo;</span>`;
    return `<span>${part}</span>`;
  }).join(' ');

  // Scroll content to top
  document.querySelector('.content').scrollTop = 0;

  // Close command palette if open
  closeCommandPalette();

  currentView = viewId;
}

// --- Sidebar Click Handlers ---
document.querySelectorAll('.sidebar-item[data-view]').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.view));
});
document.querySelectorAll('.sidebar-subitem[data-view]').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.view));
});

// --- Command Palette ---
function openCommandPalette() {
  const cp = document.getElementById('command-palette');
  cp.style.display = 'flex';
  const input = document.getElementById('cmd-input');
  input.value = '';
  input.focus();
  document.getElementById('cmd-results').style.display = 'block';
  document.getElementById('cmd-ai-results').style.display = 'none';
}

function closeCommandPalette() {
  document.getElementById('command-palette').style.display = 'none';
}

// Command palette backdrop click
document.querySelector('.cmd-backdrop')?.addEventListener('click', closeCommandPalette);

// Command palette keyboard
document.addEventListener('keydown', (e) => {
  // ⌘K or Ctrl+K to open
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const cp = document.getElementById('command-palette');
    if (cp.style.display === 'none' || !cp.style.display) {
      openCommandPalette();
    } else {
      closeCommandPalette();
    }
  }
  // ESC to close
  if (e.key === 'Escape') {
    closeCommandPalette();
    if (aiSidebarOpen) toggleAISidebar();
  }
});

// Command palette search
const cmdInput = document.getElementById('cmd-input');
if (cmdInput) {
  let searchTimeout;
  cmdInput.addEventListener('input', () => {
    const q = cmdInput.value.trim().toLowerCase();
    const defaultResults = document.getElementById('cmd-results');
    const aiResults = document.getElementById('cmd-ai-results');

    if (q.length === 0) {
      defaultResults.style.display = 'block';
      aiResults.style.display = 'none';
      return;
    }

    // Show AI thinking
    defaultResults.style.display = 'none';
    aiResults.style.display = 'block';

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      // Simulate AI search results
      const results = searchTemplates(q);
      if (results.length > 0) {
        aiResults.innerHTML = results.map(r => `
          <div class="cmd-item" onclick="navigateTo('${r.view}')">
            <span class="cmd-icon">${r.icon}</span>
            <div class="cmd-item-text">
              <span class="cmd-item-title">${r.title}</span>
              <span class="cmd-item-path">${r.path}</span>
            </div>
            <span class="cmd-badge ${r.brand}">${r.brandLabel}</span>
          </div>
        `).join('');
      } else {
        aiResults.innerHTML = `
          <div class="cmd-ai-thinking">
            <div class="cmd-ai-dot"></div>
            <span>No results for "${cmdInput.value}". Try asking a question...</span>
          </div>`;
      }
    }, 300);
  });
}

// Search data
function searchTemplates(query) {
  const all = [
    { title: 'AV Bus Stop Poster', path: 'Via > Templates > AV > Launch Campaign', view: 'via-av-poster', icon: '\u{1F4C4}', brand: 'via', brandLabel: 'Via', keywords: 'av autonomous poster bus stop waymo launch' },
    { title: 'AV City Billboard', path: 'Via > Templates > AV > Launch Campaign', view: 'via-templates-av', icon: '\u{1F5BC}', brand: 'via', brandLabel: 'Via', keywords: 'av billboard autonomous city outdoor' },
    { title: 'AV In-Vehicle Screen UI', path: 'Via > Templates > AV > Rider Experience', view: 'via-templates-av', icon: '\u{1F5A5}', brand: 'via', brandLabel: 'Via', keywords: 'av screen vehicle interior ui display' },
    { title: 'AV Safety Notice Card', path: 'Via > Templates > AV > Compliance', view: 'via-templates-av', icon: '\u{26A0}', brand: 'via', brandLabel: 'Via', keywords: 'av safety compliance legal notice card' },
    { title: 'New City Launch Pack', path: 'Via > Templates > Rider Growth', view: 'via-templates-rider', icon: '\u{1F680}', brand: 'via', brandLabel: 'Via', keywords: 'city launch new pack rider growth onboarding' },
    { title: 'Whitepaper Template', path: 'Via > Templates > GovTech Sales', view: 'via-templates-gov', icon: '\u{1F4D1}', brand: 'via', brandLabel: 'Via', keywords: 'whitepaper white paper government sales pitch b2g' },
    { title: 'Q1 Earnings Deck', path: 'Via > Templates > Investor Relations', view: 'via-templates', icon: '\u{1F4CA}', brand: 'via', brandLabel: 'Via', keywords: 'earnings investor relations quarterly deck report ipo' },
    { title: 'Chandler Flex', path: 'Via > City Manager > Chandler, AZ', view: 'via-city-detail', icon: '\u{1F3D9}', brand: 'via', brandLabel: 'Via', keywords: 'chandler flex arizona city av waymo' },
    { title: 'Brand Foundation', path: 'Via > Brand Foundation', view: 'via-foundation', icon: '\u{1F3A8}', brand: 'via', brandLabel: 'Via', keywords: 'brand foundation color logo typography identity' },
    { title: 'London City Icons', path: 'Citymapper > City Manager > London', view: 'cm-cities', icon: '\u{1F1EC}\u{1F1E7}', brand: 'cm', brandLabel: 'Citymapper', keywords: 'london city icons citymapper uk transit' },
    { title: 'Social Media Kit', path: 'Citymapper > Templates > Social Media', view: 'cm-social', icon: '\u{1F4F1}', brand: 'cm', brandLabel: 'Citymapper', keywords: 'citymapper social media launch city campaign instagram tiktok twitter linkedin' },
    { title: 'City Billboard', path: 'Citymapper > Templates > Billboard', view: 'cm-billboard', icon: '\u{1F5BC}', brand: 'cm', brandLabel: 'Citymapper', keywords: 'citymapper billboard outdoor advertising transit station digital screen' },
    { title: 'App Store Screenshots', path: 'Citymapper > Templates > App Assets', view: 'cm-templates', icon: '\u{1F4F2}', brand: 'cm', brandLabel: 'Citymapper', keywords: 'citymapper app store screenshot ios android' },
    { title: 'Data Visualization System', path: 'Remix > Brand Foundation', view: 'remix-foundation', icon: '\u{1F4CA}', brand: 'remix', brandLabel: 'Remix', keywords: 'remix data visualization chart heatmap graph' },
    { title: 'Ridership Modeling Assets', path: 'Remix > Templates > Product Launch', view: 'remix-templates', icon: '\u{1F4C8}', brand: 'remix', brandLabel: 'Remix', keywords: 'remix ridership modeling prediction citymapper data' },
    { title: 'Waymo AV Expansion Campaign', path: 'Cross-Brand > Campaigns', view: 'cross-brand', icon: '\u{1F500}', brand: 'via', brandLabel: 'Cross-Brand', keywords: 'waymo av expansion cross brand campaign austin denver seattle' },
    { title: 'City Material Generator', path: 'Generate > New City Pack', view: 'city-generator', icon: '\u{2728}', brand: 'via', brandLabel: 'Generator', keywords: 'generate city material pack new workflow ai create' },
  ];

  return all.filter(item => {
    const haystack = (item.title + ' ' + item.path + ' ' + item.keywords).toLowerCase();
    return query.split(' ').every(word => haystack.includes(word));
  }).slice(0, 5);
}

// Command palette item clicks
document.querySelectorAll('.cmd-item[data-target]').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.target));
});

// --- City Switching (Editor) ---
function switchCity(city) {
  currentCity = city;
  const data = cityData[city];
  if (!data) return;

  // Update buttons
  document.querySelectorAll('.city-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === city);
  });

  // Update poster
  const headline = document.getElementById('poster-headline');
  if (headline) headline.innerHTML = data.headline.replace('\n', '<br>');

  const subline = document.getElementById('poster-subline');
  if (subline) subline.textContent = data.subline;

  const illus = document.getElementById('city-illus');
  if (illus) {
    illus.innerHTML = `<span>${data.illus.emoji}</span><span style="font-size:11px">${data.illus.label}</span>`;
  }

  // Update control input
  const ctrlHeadline = document.getElementById('ctrl-headline');
  if (ctrlHeadline) ctrlHeadline.value = data.headline.replace('\n', ' ');

  // Update safety selector
  const safetySelect = document.querySelector('.control-select');
  if (safetySelect) {
    for (let opt of safetySelect.options) {
      if (opt.textContent.includes(data.safety)) {
        safetySelect.value = opt.value;
        break;
      }
    }
  }

  // Hide suggestions
  const sug = document.getElementById('headline-suggestions');
  if (sug) sug.style.display = 'none';
}

// --- AI Headline Suggestions ---
function suggestHeadlines() {
  const data = cityData[currentCity];
  const sug = document.getElementById('headline-suggestions');
  if (!sug || !data) return;

  sug.innerHTML = data.suggestions.map(s =>
    `<div class="suggestion" onclick="pickSuggestion(this, 'ctrl-headline')">${s}</div>`
  ).join('');
  sug.style.display = 'block';
}

function pickSuggestion(el, inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.value = el.textContent;
    // Also update poster headline
    const headline = document.getElementById('poster-headline');
    if (headline) headline.innerHTML = el.textContent;
  }
  const sug = document.getElementById('headline-suggestions');
  if (sug) sug.style.display = 'none';
}

// Live headline editing
const ctrlHeadline = document.getElementById('ctrl-headline');
if (ctrlHeadline) {
  ctrlHeadline.addEventListener('input', () => {
    const headline = document.getElementById('poster-headline');
    if (headline) headline.innerHTML = ctrlHeadline.value;
  });
}

// --- AI Sidebar ---
function toggleAISidebar() {
  const sidebar = document.getElementById('ai-sidebar');
  aiSidebarOpen = !aiSidebarOpen;
  sidebar.style.display = aiSidebarOpen ? 'flex' : 'none';
  if (aiSidebarOpen) {
    document.getElementById('ai-chat-input').focus();
  }
}

function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('ai-messages');

  // Add user message
  messages.innerHTML += `
    <div class="ai-msg ai-msg-user">
      <div class="ai-msg-avatar">C</div>
      <div class="ai-msg-content"><p>${escapeHtml(msg)}</p></div>
    </div>
  `;

  input.value = '';

  // Simulate AI response
  setTimeout(() => {
    const response = generateAIResponse(msg);
    messages.innerHTML += `
      <div class="ai-msg ai-msg-bot">
        <div class="ai-msg-avatar">AI</div>
        <div class="ai-msg-content"><p>${response}</p></div>
      </div>
    `;
    messages.scrollTop = messages.scrollHeight;
  }, 800);

  messages.scrollTop = messages.scrollHeight;
}

// AI chat enter key
const aiChatInput = document.getElementById('ai-chat-input');
if (aiChatInput) {
  aiChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendAIMessage();
  });
}

function generateAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('av') || lower.includes('waymo') || lower.includes('autonomous')) {
    return 'The AV template collection is under <strong>Via > Templates > Autonomous Vehicles</strong>. We have 22 templates covering launch campaigns, rider experience materials, in-vehicle screens, and compliance documents. 3 cities are live (Chandler, Austin, Denver) and 5 more are launching soon. Want me to open the AV templates?';
  }
  if (lower.includes('chandler') || lower.includes('city') || lower.includes('brand kit')) {
    return 'Chandler Flex is our most complete city brand kit — it includes the white-label logo, local color palette (#E85D04), city illustrations, vehicle wrap designs, and 23 generated assets. You can find it in <strong>Via > City Manager > Chandler Flex</strong>.';
  }
  if (lower.includes('citymapper') || lower.includes('icon')) {
    return 'Citymapper\'s signature feature is the city-specific transit icon system — each of 40+ cities gets locally-inspired icons (London\'s red bus, NYC\'s yellow cab, etc.). The AI can generate new city icon sets. Check <strong>Citymapper > City Manager</strong>.';
  }
  if (lower.includes('color') || lower.includes('blue') || lower.includes('brand')) {
    return 'Via\'s primary brand color is <strong>#00a8e2</strong> (Via Blue). Each white-label city gets a local accent color that\'s harmonized with Via Blue. The City Color Adapter AI tool can generate compatible palettes. See <strong>Via > Brand Foundation > Color System</strong>.';
  }
  if (lower.includes('remix') || lower.includes('data') || lower.includes('chart')) {
    return 'Remix\'s design DNA is data visualization. The brand foundation includes a complete chart system (ridership trends, coverage heatmaps, mode split donuts) all in Remix Purple (#6B4FBB). The AI can auto-generate charts from CSV data. Check <strong>Remix > Brand Foundation</strong>.';
  }
  return 'I can help you find templates, generate city assets, check brand compliance, or create new projects across Via, Citymapper, and Remix. Try asking about a specific brand, city, or template type!';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Citymapper Social City Data ---
const cmSocialCities = {
  london: {
    icon: '\u{1F68B}', headline: 'London,<br>now even more usable.',
    sub: 'Real-time transit, AI-powered routes, and your city in your pocket. Download Citymapper.',
    suggestions: ['London, get there the best way.', 'Every route. Every mode. One app.', 'Your London. Now in your pocket.'],
    illus: [{ emoji: '\u{1F68B}', label: 'Double-decker' }, { emoji: '\u{1F687}', label: 'Tube' }, { emoji: '\u{26F5}', label: 'Thames' }]
  },
  nyc: {
    icon: '\u{1F695}', headline: 'New York,<br>now even more usable.',
    sub: 'Every subway, bus, ferry, and bike — one app. Real-time, rain or shine. Download Citymapper.',
    suggestions: ['NYC, get there the best way.', 'Subway delays? We got you.', 'Your city. Every mode. One tap.'],
    illus: [{ emoji: '\u{1F695}', label: 'Yellow Cab' }, { emoji: '\u{1F687}', label: 'Subway' }, { emoji: '\u{1F309}', label: 'Bridge' }]
  },
  paris: {
    icon: '\u{1F688}', headline: 'Paris,<br>maintenant encore plus simple.',
    sub: 'Métro, bus, vélo, trottinette — tout dans une app. Téléchargez Citymapper.',
    suggestions: ['Paris, trouvez le meilleur chemin.', 'Chaque ligne. Chaque mode. Une app.', 'Votre Paris. Dans votre poche.'],
    illus: [{ emoji: '\u{1F688}', label: 'Métro' }, { emoji: '\u{1F6B2}', label: 'Vélib' }, { emoji: '\u{1F5FC}', label: 'Tour Eiffel' }]
  }
};

function switchSocialCity(city) {
  const data = cmSocialCities[city];
  if (!data) return;
  // Update buttons
  document.querySelectorAll('#view-cm-social .city-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === city);
  });
  const headline = document.getElementById('social-headline');
  if (headline) headline.innerHTML = data.headline;
  const sub = document.getElementById('social-subtext');
  if (sub) sub.textContent = data.sub;
  const icon = document.getElementById('social-city-icon');
  if (icon) icon.textContent = data.icon;
  const input = document.getElementById('social-ctrl-headline');
  if (input) input.value = data.headline.replace('<br>', ' ');
  const subInput = document.getElementById('social-ctrl-sub');
  if (subInput) subInput.value = data.sub;
  // Update illustration options
  const illusOpts = document.querySelector('#view-cm-social .illus-options');
  if (illusOpts && data.illus) {
    illusOpts.innerHTML = data.illus.map((il, i) =>
      `<div class="illus-opt ${i === 0 ? 'active' : ''}" onclick="this.parentElement.querySelectorAll('.illus-opt').forEach(o=>o.classList.remove('active'));this.classList.add('active')"><span>${il.emoji}</span><span>${il.label}</span></div>`
    ).join('');
  }
  // Hide suggestions
  const sug = document.getElementById('social-headline-suggestions');
  if (sug) sug.style.display = 'none';
}

function suggestSocialHeadlines() {
  const activeBtn = document.querySelector('#view-cm-social .city-btn.active');
  const city = activeBtn ? activeBtn.dataset.city : 'london';
  const data = cmSocialCities[city];
  const sug = document.getElementById('social-headline-suggestions');
  if (!sug || !data) return;
  sug.innerHTML = data.suggestions.map(s =>
    `<div class="suggestion" onclick="pickSocialSuggestion(this)">${s}</div>`
  ).join('');
  sug.style.display = 'block';
}

function pickSocialSuggestion(el) {
  const input = document.getElementById('social-ctrl-headline');
  if (input) input.value = el.textContent;
  const headline = document.getElementById('social-headline');
  if (headline) headline.textContent = el.textContent;
  document.getElementById('social-headline-suggestions').style.display = 'none';
}

function switchSocialFormat(format) {
  const post = document.querySelector('.social-post');
  if (!post) return;
  document.querySelectorAll('#view-cm-social .av-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  switch (format) {
    case 'ig-square': post.style.width = '320px'; post.style.aspectRatio = '1'; break;
    case 'ig-story': post.style.width = '220px'; post.style.aspectRatio = '9/16'; break;
    case 'twitter': post.style.width = '380px'; post.style.aspectRatio = '16/9'; break;
    case 'linkedin': post.style.width = '340px'; post.style.aspectRatio = '1.2/1'; break;
  }
}

// Billboard city switching
function switchBBCity(city) {
  const data = cmSocialCities[city];
  if (!data) return;
  document.querySelectorAll('#view-cm-billboard .city-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === city);
  });
  const bbHeadline = document.getElementById('bb-headline');
  if (bbHeadline) {
    const cityName = city === 'london' ? 'London' : city === 'nyc' ? 'New York' : 'Paris';
    bbHeadline.innerHTML = 'Get there<br>the best way.';
  }
  const bbSub = document.getElementById('bb-sub');
  if (bbSub) {
    const cityName = city === 'london' ? 'London' : city === 'nyc' ? 'New York' : 'Paris';
    bbSub.textContent = `${cityName}'s #1 transit app. ${data.sub.split('.')[0]}.`;
  }
  const bbIcon = document.getElementById('bb-city-icon');
  if (bbIcon) bbIcon.textContent = data.icon;
}

// --- Illustration Option Clicks ---
document.querySelectorAll('.illus-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.illus-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// --- Color Option Clicks ---
document.querySelectorAll('.color-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// --- AV Tab Clicks ---
document.querySelectorAll('.av-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.av-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ========================================
// CITY MATERIAL GENERATOR — Wizard Logic
// ========================================

let genCurrentStep = 1;
let genSelectedBrand = 'via';
let genSelectedColor = '#FF6B35';
let genSelectedIcon = '\u{1F3D6}'; // beach
let genSelectedHeadline = 'Your ride is going autonomous in Miami';
let unsplashKey = localStorage.getItem('unsplash_key') || '';
let moodboardPhotos = []; // { url, thumb, alt, color, tags[], pinned }

// Step navigation
function genNextStep(step) {
  if (step === 5) {
    showGenStep(5);
    startGeneration();
    return;
  }
  if (step === 2) {
    // Auto-populate search with city name
    const cityName = document.getElementById('gen-city-name');
    const searchInput = document.getElementById('gen-mood-search');
    if (cityName && searchInput) {
      searchInput.value = (cityName.value || 'city') + ' city transit landmarks';
    }
    const moodTitle = document.getElementById('gen-mood-title');
    if (moodTitle && cityName) moodTitle.textContent = (cityName.value || 'New City') + ' \u2014 Visual Direction';
    // Auto-search if key exists
    if (unsplashKey) {
      showGenStep(step);
      searchMoodboard();
      return;
    }
  }
  showGenStep(step);
}

function genPrevStep(step) {
  showGenStep(step);
}

function showGenStep(step) {
  genCurrentStep = step;
  // Hide all panels
  for (let i = 1; i <= 5; i++) {
    const panel = document.getElementById('gen-step-' + i);
    if (panel) panel.style.display = (i === step) ? 'block' : 'none';
  }
  // Update step bar
  document.querySelectorAll('.gen-step').forEach(s => {
    const sStep = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sStep === step) s.classList.add('active');
    else if (sStep < step) s.classList.add('done');
  });
  document.querySelectorAll('.gen-step-line').forEach((line, i) => {
    line.classList.remove('active', 'done');
    if (i < step - 1) line.classList.add('done');
    if (i === step - 2) line.classList.add('active');
  });
  // Update city name in materials step
  const cityName = document.getElementById('gen-city-name');
  const matCity = document.getElementById('gen-mat-city');
  if (cityName && matCity) matCity.textContent = cityName.value || 'New City';
  // Update brand config title
  const configTitle = document.getElementById('gen-config-title');
  if (configTitle && cityName) configTitle.textContent = (cityName.value || 'New City') + ' \u2014 Brand Config';

  // Scroll to top
  document.querySelector('.content').scrollTop = 0;
}

// Brand selector
function selectGenBrand(brand) {
  genSelectedBrand = brand;
  document.querySelectorAll('.gen-brand-opt').forEach(o => {
    o.classList.toggle('active', o.dataset.brand === brand);
  });
}

// Color selector
function selectGenColor(el) {
  document.querySelectorAll('.gen-color-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  genSelectedColor = el.dataset.color;
  const label = document.getElementById('gen-color-label');
  if (label) label.textContent = el.title;
  // Update live previews
  updateGenPreview();
}

// Icon selector
function selectGenIcon(el) {
  document.querySelectorAll('.gen-icon-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  genSelectedIcon = el.dataset.icon;
  updateGenPreview();
}

// Headline selector
function selectGenHeadline(el) {
  document.querySelectorAll('.gen-headline-opt').forEach(o => {
    o.classList.remove('active');
    o.querySelector('input').checked = false;
  });
  el.classList.add('active');
  el.querySelector('input').checked = true;
  genSelectedHeadline = el.querySelector('span').textContent;
  updateGenPreview();
}

// Update live preview in step 2
function updateGenPreview() {
  const hero = document.querySelector('.gen-mini-hero');
  if (hero) hero.style.background = `linear-gradient(170deg, ${genSelectedColor}, #00a8e2)`;

  const icon = document.getElementById('gen-preview-icon');
  if (icon) icon.innerHTML = genSelectedIcon;

  const headline = document.getElementById('gen-preview-headline');
  const cityName = document.getElementById('gen-city-name');
  if (headline && cityName) {
    headline.innerHTML = genSelectedHeadline.replace(/(Miami|[A-Z][a-z]+)/g, cityName.value || 'Miami');
  }

  const socialBg = document.querySelector('.gen-social-mini-bg');
  if (socialBg) socialBg.style.background = `linear-gradient(135deg, ${genSelectedColor}, ${adjustColor(genSelectedColor, -30)})`;

  const socialIcon = document.getElementById('gen-preview-social-icon');
  if (socialIcon) socialIcon.innerHTML = genSelectedIcon;

  const socialCta = document.querySelector('.gen-social-mini-cta');
  if (socialCta) socialCta.style.color = genSelectedColor;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// Material selection toggle
function toggleGenMat(el) {
  el.classList.toggle('checked');
  updateMatSummary();
}

function updateMatSummary() {
  const checked = document.querySelectorAll('.gen-mat-item.checked');
  const count = checked.length;
  let totalSec = 0;
  checked.forEach(item => {
    const timeText = item.querySelector('.gen-mat-time').textContent;
    const match = timeText.match(/(\d+)/);
    if (match) totalSec += parseInt(match[1]);
  });
  const countEl = document.getElementById('gen-mat-count');
  const estEl = document.getElementById('gen-mat-est');
  if (countEl) countEl.textContent = count + ' material' + (count !== 1 ? 's' : '') + ' selected';
  if (estEl) estEl.textContent = 'Estimated: ~' + totalSec + ' seconds';
}

// Quick fill city
function quickFillCity(cityKey) {
  const data = {
    chandler: { name: 'Chandler', country: 'us', lang: 'en', wl: 'Chandler Flex' },
    manchester: { name: 'Manchester', country: 'uk', lang: 'en', wl: 'Bee Network' },
    raleigh: { name: 'Raleigh', country: 'us', lang: 'en', wl: 'GoRaleigh Access' }
  };
  const d = data[cityKey];
  if (!d) return;
  document.getElementById('gen-city-name').value = d.name;
  document.getElementById('gen-country').value = d.country;
  document.getElementById('gen-lang').value = d.lang;
  document.getElementById('gen-wl-name').value = d.wl;
}

// ===== STEP 4: AI Generation Simulation =====
function startGeneration() {
  const progressPanel = document.getElementById('gen-progress-panel');
  const reviewPanel = document.getElementById('gen-review-panel');
  if (progressPanel) progressPanel.style.display = 'block';
  if (reviewPanel) reviewPanel.style.display = 'none';

  const items = document.querySelectorAll('.gen-progress-item');
  const durations = [2000, 1500, 3000, 1200]; // ms per item
  let delay = 300;

  items.forEach((item, i) => {
    const fill = item.querySelector('.gen-prog-fill');
    const status = item.querySelector('.gen-prog-status');
    const duration = durations[i] || 2000;

    // Start
    setTimeout(() => {
      status.textContent = 'Generating...';
      status.className = 'gen-prog-status active';
      animateProgress(fill, duration);
    }, delay);

    // Complete
    setTimeout(() => {
      fill.style.width = '100%';
      status.textContent = '\u2705 Complete';
      status.className = 'gen-prog-status done';
    }, delay + duration);

    delay += duration + 200;
  });

  // All done — show review
  setTimeout(() => {
    const spinner = document.querySelector('.gen-progress-spinner');
    if (spinner) spinner.style.display = 'none';
    const sub = document.getElementById('gen-progress-sub');
    if (sub) sub.textContent = 'All materials generated successfully!';

    setTimeout(() => {
      if (progressPanel) progressPanel.style.display = 'none';
      if (reviewPanel) reviewPanel.style.display = 'block';
    }, 600);
  }, delay + 200);
}

function animateProgress(fillEl, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    fillEl.style.width = (eased * 100) + '%';
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ========================================
// MOODBOARD — Unsplash API Integration
// ========================================

function connectUnsplash() {
  const keyInput = document.getElementById('gen-unsplash-key');
  const key = keyInput ? keyInput.value.trim() : '';
  if (!key) return;
  unsplashKey = key;
  localStorage.setItem('unsplash_key', key);
  document.getElementById('gen-api-banner').style.display = 'none';
  document.getElementById('gen-api-connected').style.display = 'flex';
  searchMoodboard();
}

function disconnectUnsplash() {
  unsplashKey = '';
  localStorage.removeItem('unsplash_key');
  document.getElementById('gen-api-banner').style.display = 'flex';
  document.getElementById('gen-api-connected').style.display = 'none';
}

// Init: check for saved key
(function checkUnsplashKey() {
  if (unsplashKey) {
    const banner = document.getElementById('gen-api-banner');
    const connected = document.getElementById('gen-api-connected');
    if (banner) banner.style.display = 'none';
    if (connected) connected.style.display = 'flex';
  }
})();

async function searchMoodboard() {
  const searchInput = document.getElementById('gen-mood-search');
  const query = searchInput ? searchInput.value.trim() : '';
  if (!query) return;

  const grid = document.getElementById('gen-mood-grid');
  const empty = document.getElementById('gen-mood-empty');

  if (!unsplashKey) {
    if (empty) {
      empty.innerHTML = '<span>&#128274;</span><p>Please connect your Unsplash API key above to search for photos.<br><a href="https://unsplash.com/developers" target="_blank">Get a free key in 2 minutes &rarr;</a></p>';
      empty.style.display = 'flex';
    }
    return;
  }

  // Show loading state
  if (empty) {
    empty.innerHTML = '<div class="gen-mood-loading"><div class="gen-progress-spinner"></div><span>Searching Unsplash for "' + query + '"...</span></div>';
    empty.style.display = 'flex';
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      { headers: { 'Authorization': 'Client-ID ' + unsplashKey } }
    );
    if (!res.ok) throw new Error('API error: ' + res.status);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      moodboardPhotos = data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.small,
        alt: photo.alt_description || photo.description || query,
        color: photo.color || '#888',
        user: photo.user.name,
        tags: extractTags(photo),
        pinned: false
      }));
      renderMoodboard();
    } else {
      if (empty) {
        empty.innerHTML = '<span>&#128533;</span><p>No photos found for "' + query + '". Try different keywords.</p>';
        empty.style.display = 'flex';
      }
    }
  } catch (err) {
    console.error('Unsplash API error:', err);
    if (empty) {
      empty.innerHTML = '<span>&#9888;</span><p>API error: ' + err.message + '<br>Check your API key and try again.</p>';
      empty.style.display = 'flex';
    }
  }
}

function extractTags(photo) {
  const tags = [];
  const desc = ((photo.alt_description || '') + ' ' + (photo.description || '')).toLowerCase();
  if (desc.match(/building|tower|skyscrap|architectur|bridge|monument/)) tags.push('architecture');
  if (desc.match(/bus|train|metro|subway|transit|station|rail|tram/)) tags.push('transit');
  if (desc.match(/street|road|walk|people|crowd|urban|market|shop/)) tags.push('street');
  if (desc.match(/landmark|statue|monument|famous|historic|church|museum/)) tags.push('landmark');
  if (desc.match(/tree|park|ocean|beach|water|sky|sunset|mountain|palm|river|nature/)) tags.push('nature');
  if (tags.length === 0) tags.push('street'); // default
  return tags;
}

function renderMoodboard(filterTag) {
  const grid = document.getElementById('gen-mood-grid');
  const empty = document.getElementById('gen-mood-empty');
  if (!grid) return;

  const filtered = filterTag && filterTag !== 'all'
    ? moodboardPhotos.filter(p => p.tags.includes(filterTag))
    : moodboardPhotos;

  if (filtered.length === 0) {
    if (empty) {
      empty.innerHTML = '<span>&#128247;</span><p>No photos match this category. Try "All".</p>';
      empty.style.display = 'flex';
    }
    grid.innerHTML = '';
    grid.appendChild(empty);
    return;
  }

  if (empty) empty.style.display = 'none';

  grid.innerHTML = filtered.map((photo, i) => `
    <div class="gen-mood-photo ${photo.pinned ? 'pinned' : ''}" data-idx="${moodboardPhotos.indexOf(photo)}" onclick="togglePinPhoto(${moodboardPhotos.indexOf(photo)})" style="animation-delay:${i * 0.05}s">
      <img src="${photo.thumb}" alt="${photo.alt}" loading="lazy">
      <div class="gen-mood-photo-overlay">
        <span class="gen-mood-pin">${photo.pinned ? '\u{1F4CC}' : '\u{1F4CC}'}</span>
        <span class="gen-mood-photo-credit">${photo.user}</span>
      </div>
      <div class="gen-mood-photo-tags">
        ${photo.tags.map(t => '<span class="gen-mood-photo-tag">' + t + '</span>').join('')}
      </div>
      <div class="gen-mood-photo-color" style="background:${photo.color}"></div>
    </div>
  `).join('');

  updateMoodSummary();
}

function togglePinPhoto(idx) {
  if (moodboardPhotos[idx]) {
    moodboardPhotos[idx].pinned = !moodboardPhotos[idx].pinned;
    // Re-render just the card
    const card = document.querySelector(`.gen-mood-photo[data-idx="${idx}"]`);
    if (card) card.classList.toggle('pinned', moodboardPhotos[idx].pinned);
    updateMoodSummary();
  }
}

function filterMoodboard(tag, btn) {
  document.querySelectorAll('.gen-mood-cat').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMoodboard(tag);
}

function updateMoodSummary() {
  const summary = document.getElementById('gen-mood-summary');
  const pinned = moodboardPhotos.filter(p => p.pinned);
  const pinnedCount = document.getElementById('gen-pinned-count');

  if (moodboardPhotos.length > 0) {
    if (summary) summary.style.display = 'grid';
  }

  if (pinnedCount) pinnedCount.textContent = pinned.length;

  // Extract colors from all photos (pinned first, then all)
  const colorSource = pinned.length > 0 ? pinned : moodboardPhotos.slice(0, 6);
  const palette = document.getElementById('gen-mood-palette');
  if (palette) {
    palette.innerHTML = colorSource.map(p =>
      `<div class="gen-palette-swatch" style="background:${p.color}" title="${p.color}">
        <span>${p.color}</span>
      </div>`
    ).join('');
  }

  // Generate mood keywords based on tags and city
  const cityName = document.getElementById('gen-city-name');
  const city = cityName ? cityName.value : 'City';
  const allTags = moodboardPhotos.flatMap(p => p.tags);
  const tagCounts = {};
  allTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
  const moodKeywords = generateMoodKeywords(tagCounts, city);
  const tagsEl = document.getElementById('gen-mood-tags');
  if (tagsEl) {
    tagsEl.innerHTML = moodKeywords.map(k =>
      `<span class="gen-mood-keyword">${k}</span>`
    ).join('');
  }
}

function generateMoodKeywords(tagCounts, city) {
  const keywords = [];
  if (tagCounts.nature > 2) keywords.push('Natural', 'Organic');
  if (tagCounts.architecture > 2) keywords.push('Architectural', 'Geometric');
  if (tagCounts.transit > 1) keywords.push('Connected', 'Mobile');
  if (tagCounts.street > 1) keywords.push('Urban', 'Dynamic');
  if (tagCounts.landmark > 1) keywords.push('Iconic', 'Cultural');
  // City-specific moods
  const cityLower = city.toLowerCase();
  if (cityLower.includes('miami')) keywords.push('Tropical', 'Vibrant', 'Coastal');
  else if (cityLower.includes('london')) keywords.push('Heritage', 'Sophisticated');
  else if (cityLower.includes('tokyo') || cityLower.includes('japan')) keywords.push('Futuristic', 'Precise');
  else if (cityLower.includes('paris')) keywords.push('Elegant', 'Timeless');
  else if (cityLower.includes('berlin')) keywords.push('Bold', 'Industrial');
  else if (cityLower.includes('austin')) keywords.push('Creative', 'Eclectic');
  else keywords.push('Contemporary', 'Approachable');
  return keywords.slice(0, 6);
}

// Reset wizard
function genReset() {
  genCurrentStep = 1;
  // Reset progress bars
  document.querySelectorAll('.gen-prog-fill').forEach(f => f.style.width = '0%');
  document.querySelectorAll('.gen-prog-status').forEach(s => {
    s.textContent = 'Waiting...';
    s.className = 'gen-prog-status';
  });
  const spinner = document.querySelector('.gen-progress-spinner');
  if (spinner) spinner.style.display = 'block';
  const sub = document.getElementById('gen-progress-sub');
  if (sub) sub.textContent = 'AI is creating brand-compliant materials across all selected templates.';
  showGenStep(1);
}

// --- Projects Tab Switching ---
function switchProjectsTab(tab) {
  document.querySelectorAll('.projects-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.projects-tab-content').forEach(c => c.style.display = 'none');
  const btn = document.querySelector(`.projects-tab[onclick*="'${tab}'"]`);
  if (btn) btn.classList.add('active');
  const content = document.getElementById('projects-tab-' + tab);
  if (content) content.style.display = '';
}

// --- Init ---
navigateTo('dashboard');
