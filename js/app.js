/**
 * 五行英语牌 — 主应用逻辑
 * 管理屏幕切换、游戏状态、UI 交互。
 */

/* ========== 头像系统 ========== */
const AVATARS = {
  normal: [
    { id: 'avatar1', label: '小狮子', color: '#FF7043', icon: '🦁' },
    { id: 'avatar2', label: '小猫咪', color: '#FFB74D', icon: '🐱' },
    { id: 'avatar3', label: '小兔子', color: '#F48FB1', icon: '🐰' },
    { id: 'avatar4', label: '小熊猫', color: '#A1887F', icon: '🐼' },
    { id: 'avatar5', label: '小狐狸', color: '#FF8A65', icon: '🦊' },
    { id: 'avatar6', label: '小青蛙', color: '#81C784', icon: '🐸' },
    { id: 'avatar7', label: '小猴子', color: '#D4E157', icon: '🐵' },
    { id: 'avatar8', label: '独角兽', color: '#CE93D8', icon: '🦄' },
    { id: 'avatar9', label: '小龙', color: '#4DB6AC', icon: '🐉' },
    { id: 'avatar10', label: '小老虎', color: '#FFA726', icon: '🐯' },
  ],
  special: [
    { id: 'special1', label: '⭐ 勇者', color: '#FFD700', icon: '🏆', desc: '击败一个Boss后解锁', unlock: () => false },
    { id: 'special2', label: '👑 王者', color: '#FF6F00', icon: '👑', desc: '收集100张卡片后解锁', unlock: () => false },
    { id: 'special3', label: '🌈 彩虹', color: '#E040FB', icon: '🌈', desc: '累计1000XP后解锁', unlock: () => false },
  ],
};

/** 获取头像对象 */
function getAvatarById(id) {
  for (const cat of [AVATARS.normal, AVATARS.special]) {
    const found = cat.find(a => a.id === id);
    if (found) return found;
  }
  return null;
}

/** 生成头像占位 SVG */
function avatarPlaceholderSvg(avatar) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="47" fill="${avatar.color}"/>
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
      <text x="50" y="68" text-anchor="middle" font-size="48" fill="white" font-weight="bold">${avatar.icon}</text>
    </svg>`
  )}`;
}

/* ========== 注册-选头像 ========== */
let _selectedAvatar = '';

function showRegAvatarScreen() {
  _selectedAvatar = '';
  document.getElementById('avatar-error').textContent = '';
  document.getElementById('btn-avatar-confirm').disabled = true;

  const grid = document.getElementById('avatar-grid');
  grid.innerHTML = '';

  for (const av of AVATARS.normal) {
    const el = document.createElement('div');
    el.className = 'avatar-card';
    el.dataset.id = av.id;
    el.innerHTML = `
      <div class="avatar-img-wrap">
        <img src="${avatarPlaceholderSvg(av)}" alt="${av.label}" class="avatar-thumb">
      </div>
      <span class="avatar-label">${av.label}</span>
    `;
    el.addEventListener('click', () => selectAvatar(av.id));
    grid.appendChild(el);
  }

  // 特殊头像
  for (const av of AVATARS.special) {
    const el = document.createElement('div');
    el.className = 'avatar-card avatar-locked';
    el.dataset.id = av.id;
    el.innerHTML = `
      <div class="avatar-img-wrap avatar-special-bg">
        <img src="${avatarPlaceholderSvg(av)}" alt="${av.label}" class="avatar-thumb">
        <div class="avatar-lock-badge">🔒</div>
      </div>
      <span class="avatar-label">${av.label}</span>
      <span class="avatar-desc">${av.desc}</span>
    `;
    el.addEventListener('click', () => {
      document.getElementById('avatar-error').textContent = '🔒 该头像尚未解锁';
    });
    grid.appendChild(el);
  }

  showScreen('screen-reg-avatar');
}

function selectAvatar(id) {
  _selectedAvatar = id;
  document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.avatar-card[data-id="${id}"]`)?.classList.add('selected');
  document.getElementById('btn-avatar-confirm').disabled = false;
  document.getElementById('avatar-error').textContent = '';
}

function confirmAvatar() {
  if (!_selectedAvatar) return;
  showRegElementScreen();
}

/* ========== 注册-选本命五行 ========== */
let _selectedElement = '';

const ELEMENT_STATS = {
  '木': { hp: 18, atk: 8, def: 12, spd: 7, cri: 5, desc: '🌳 生命之木 · 血厚持久' },
  '火': { hp: 7, atk: 18, def: 7, spd: 10, cri: 8, desc: '🔥 烈焰之火 · 高攻爆发' },
  '土': { hp: 11, atk: 7, def: 18, spd: 7, cri: 7, desc: '⛰️ 不动之土 · 铁壁防守' },
  '水': { hp: 7, atk: 8, def: 7, spd: 20, cri: 8, desc: '💧 流水之水 · 极速先手' },
  '金': { hp: 8, atk: 10, def: 8, spd: 9, cri: 15, desc: '⭐ 锋锐之金 · 暴击制胜' },
};

function showRegElementScreen() {
  _selectedElement = '';
  document.getElementById('element-error').textContent = '';
  document.getElementById('btn-element-confirm').disabled = true;
  document.getElementById('reg-element-detail').style.display = 'none';

  const grid = document.getElementById('reg-element-grid');
  grid.innerHTML = '';

  for (const el of DATA.ELEMENTS) {
    const stats = ELEMENT_STATS[el.name];
    const card = document.createElement('div');
    card.className = `element-card ${el.cls}`;
    card.dataset.element = el.name;
    card.innerHTML = `<span class="elem-icon">${el.icon}</span><span class="elem-name">${el.name}</span>`;
    card.addEventListener('click', () => selectRegElement(el.name));
    grid.appendChild(card);
  }

  showScreen('screen-reg-element');
}

function selectRegElement(elementName) {
  _selectedElement = elementName;
  document.querySelectorAll('#reg-element-grid .element-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`#reg-element-grid .element-card[data-element="${elementName}"]`)?.classList.add('selected');

  const stats = ELEMENT_STATS[elementName];
  const elInfo = DATA.getElementInfo(elementName);
  document.getElementById('reg-element-detail').style.display = 'block';
  document.getElementById('reg-element-detail').innerHTML = `
    <div style="font-size:28px;margin-bottom:8px">${elInfo.icon}</div>
    <div style="font-weight:700;font-size:20px">${stats.desc}</div>
    <div class="elem-stats-grid">
      <span class="elem-stat">❤️HP <b>${stats.hp}</b></span>
      <span class="elem-stat">⚔️ATK <b>${stats.atk}</b></span>
      <span class="elem-stat">🛡️DEF <b>${stats.def}</b></span>
      <span class="elem-stat">💨SPD <b>${stats.spd}</b></span>
      <span class="elem-stat">💥CRI <b>${stats.cri}%</b></span>
    </div>
  `;

  document.getElementById('btn-element-confirm').disabled = false;
  document.getElementById('element-error').textContent = '';
}

async function confirmElement() {
  if (!_selectedElement) return;
  try {
    // 保存到头像和五行到数据库
    await updateUserProfile(_selectedAvatar, _selectedElement);
    goHomeAfterLogin();
  } catch (e) {
    document.getElementById('element-error').textContent = '保存失败，请重试';
  }
}

/* ========== 游戏状态 ========== */
const STATE = {
  userElement: null,
  sysElement: null,
  words: [],
  wordIndex: 0,
  targetOrder: [],
  targetSentence: '',
  contextCn: '',
  userSentence: [],
  matchedWords: [],
  sentenceCorrect: false,
};

/* ========== 背包计数显示 ========== */
function updateBackpackCount() {
  const bp = loadBackpack();
  const el = document.getElementById('backpack-count');
  if (el) el.textContent = `已收集 ${bp.length} 张`;
}

/** 从技能背包迁移旧道具到物品背包（一次性迁移） */
function migrateOldItems() {
  const bp = loadBackpack();
  const items = loadItems();
  let migrated = false;
  const newBp = [];
  for (const entry of bp) {
    if (entry.type === 'item') {
      items.push(entry);
      migrated = true;
    } else {
      newBp.push(entry);
    }
  }
  if (migrated) {
    saveBackpack(newBp);
    saveItems(items);
  }
}

/* ========== 永久属性加成 ========== */
const ELEMENT_TO_BONUS = { '火':'fire', '水':'water', '木':'wood', '金':'metal', '土':'earth' };

function addAttributeBonus(element) {
  const key = ELEMENT_TO_BONUS[element];
  if (!key) return;
  const bonus = loadBonus();
  bonus[key]++;
  saveBonus(bonus);
}

function addAllAttributeBonus() {
  const bonus = loadBonus();
  bonus.wood++;
  bonus.fire++;
  bonus.earth++;
  bonus.water++;
  bonus.metal++;
  saveBonus(bonus);
}

/* ========== 经验值 / 等级系统 ========== */
function addXp(amount) {
  const current = loadXp();
  const newXp = current + amount;
  saveXp(newXp);
  return newXp;
}

function getLevel(totalXp) {
  const n = Math.floor((-1 + Math.sqrt(1 + totalXp / 2)) / 2);
  return Math.max(0, n);
}

function getXpForLevel(level) {
  return level * (level + 1) * 8;
}

function getXpProgress(totalXp) {
  const level = getLevel(totalXp);
  const current = getXpForLevel(level);
  const next = getXpForLevel(level + 1);
  return { level, xpInLevel: totalXp - current, xpNeeded: next - current };
}

function getStudyXp(attempts, mode) {
  const totalXp = loadXp();
  const level = getLevel(totalXp);
  let baseXp;

  if (mode === 'grade1-2') {
    if (attempts === 1) baseXp = 35;
    else if (attempts === 2) baseXp = 20;
    else if (attempts === 3) baseXp = 10;
    else baseXp = 5;  // 4次及以上，仅经验
  } else {
    // grade3-4
    if (attempts === 1) baseXp = 70;
    else if (attempts === 2) baseXp = 40;
    else if (attempts === 3) baseXp = 20;
    else baseXp = 10; // 4次及以上，仅经验
  }

  // 智慧（水属性）经验加成：每点超过10的部分+1%
  const pStats = getPlayerStats(level);
  const intBonus = 1 + (pStats.water - 10) * 0.01;
  return Math.max(1, Math.round(baseXp * intBonus));
}

/* ========== 称号系统 ========== */
const TITLES = [
  { minLevel: 0,  name: '英语种子', icon: '🌱' },
  { minLevel: 10, name: '英语新芽', icon: '🌿' },
  { minLevel: 20, name: '英语小花', icon: '🌸' },
  { minLevel: 30, name: '英语小树', icon: '🌳' },
  { minLevel: 40, name: '英语森林', icon: '🌲' },
  { minLevel: 50, name: '英语山川', icon: '⛰️' },
  { minLevel: 60, name: '英语星河', icon: '⭐' },
  { minLevel: 70, name: '英语太阳', icon: '☀️' },
];

function getTitle(level) {
  let title = TITLES[TITLES.length - 1];
  for (const t of TITLES) {
    if (level >= t.minLevel) title = t;
  }
  return title;
}

/** 背包容量：基础100，每10级+50 */
function getMaxBackpackCapacity(level) {
  return 100 + Math.floor(level / 10) * 50;
}

/** 玩家五行属性：等级成长 + 本命初始偏向 + 道具永久加成 */
function getPlayerStats(level) {
  const bonus = loadBonus();
  const elemName = USER_CACHE.element;
  const base = ELEMENT_STATS[elemName] || { hp: 10, atk: 10, def: 10, spd: 10, cri: 10 };
  const wood = base.hp + level + bonus.wood;
  const fire = base.atk + level + bonus.fire;
  const earth = base.def + level + bonus.earth;
  const water = base.spd + level + bonus.water;
  const metal = base.cri + level + bonus.metal;
  return {
    wood, fire, earth, water, metal,
    maxHp: 60 + wood * 4,
    atk: fire,
    def: earth,
    int: water,
    luk: metal,
  };
}

function updateHomeXpDisplay() {
  const totalXp = loadXp();
  const { level, xpInLevel, xpNeeded } = getXpProgress(totalXp);
  const title = getTitle(level);
  const userEl = document.getElementById('home-userinfo');
  if (userEl && USER_CACHE.username) {
    const av = getAvatarById(USER_CACHE.avatar);
    const avIcon = av ? av.icon : '👤';
    const elemIcon = DATA.getElementInfo(USER_CACHE.element);
    const elemStr = elemIcon ? `${elemIcon.icon}` : '';
    userEl.innerHTML = `${avIcon} ${USER_CACHE.username} ${elemStr}`;
  }
  const badge = document.getElementById('home-level-badge');
  if (badge) badge.textContent = `Lv.${level} ${title.icon}`;
}

/* ========== 综合战力 ========== */
function calcCombatPower(pStats) {
  // maxHp权重高（生存），atk/def次之（战斗），int/luk辅助
  return Math.floor(pStats.maxHp * 2 + pStats.atk * 5 + pStats.def * 3 + pStats.int + pStats.luk);
}

/* ========== 五维雷达图 ========== */
function generateRadarChart(stats, maxVal = 100) {
  const elements = [
    { key: 'wood', label: '木', icon: '🌳', color: '#4caf50' },
    { key: 'fire', label: '火', icon: '🔥', color: '#ff5722' },
    { key: 'earth', label: '土', icon: '⛰️', color: '#795548' },
    { key: 'metal', label: '金', icon: '⭐', color: '#f57f17' },
    { key: 'water', label: '水', icon: '💧', color: '#2196f3' },
  ];

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const R = 88;
  const levels = 5;

  const angles = elements.map((_, i) => (i * 72 - 90) * Math.PI / 180);

  function vertex(angle, r) {
    const x = (cx + r * Math.cos(angle)).toFixed(1);
    const y = (cy + r * Math.sin(angle)).toFixed(1);
    return { x, y };
  }

  function pentagonPoints(r) {
    return angles.map(a => {
      const v = vertex(a, r);
      return `${v.x},${v.y}`;
    }).join(' ');
  }

  const values = elements.map(el => Math.min(maxVal, Math.max(0, stats[el.key] || 0)));

  let svg = `<svg viewBox="0 0 ${size} ${size}" class="radar-svg">`;

  // 背景五边形网格
  for (let i = 1; i <= levels; i++) {
    const r = R * i / levels;
    svg += `<polygon points="${pentagonPoints(r)}" fill="none" stroke="#e8e0f0" stroke-width="${i === levels ? 1.5 : 1}"/>`;
  }

  // 轴线
  for (const a of angles) {
    const end = vertex(a, R);
    svg += `<line x1="${cx}" y1="${cy}" x2="${end.x}" y2="${end.y}" stroke="#e8e0f0" stroke-width="1"/>`;
  }

  // 数据多边形
  const dataPoints = angles.map((a, i) => {
    const v = vertex(a, R * values[i] / maxVal);
    return `${v.x},${v.y}`;
  });
  svg += `<polygon points="${dataPoints.join(' ')}" fill="rgba(124,77,255,0.12)" stroke="#7c4dff" stroke-width="2"/>`;

  // 数据点
  for (let i = 0; i < angles.length; i++) {
    const v = vertex(angles[i], R * values[i] / maxVal);
    svg += `<circle cx="${v.x}" cy="${v.y}" r="4" fill="${elements[i].color}" stroke="white" stroke-width="2"/>`;
  }

  // 顶点标签
  const labelR = R + 20;
  for (let i = 0; i < angles.length; i++) {
    const v = vertex(angles[i], labelR);
    svg += `<text x="${v.x}" y="${v.y}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${elements[i].color}">${elements[i].icon}</text>`;
    // 数值标注在数据点和顶点之间
    const dataR = R * values[i] / maxVal;
    const labelPosR = dataR + 14;
    if (labelPosR < R - 4) {
      const lp = vertex(angles[i], labelPosR);
      svg += `<text x="${lp.x}" y="${lp.y}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#666" font-weight="600">${values[i]}</text>`;
    }
  }

  // 中心标注
  svg += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#aaa">五行</text>`;

  svg += '</svg>';
  return svg;
}

/* ========== 个人信息面板 ========== */
async function showProfile() {
  await DATA.load();
  const container = document.getElementById('profile-content');
  container.innerHTML = '';

  // 数据准备
  const totalXp = loadXp();
  const { level, xpInLevel, xpNeeded } = getXpProgress(totalXp);
  const pct = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;
  const title = getTitle(level);
  const pStats = getPlayerStats(level);
  const bonus = loadBonus();
  const bp = loadBackpack();
  const items = loadItems();
  const av = getAvatarById(USER_CACHE.avatar);
  const elInfo = DATA.getElementInfo(USER_CACHE.element);
  const elStats = ELEMENT_STATS[USER_CACHE.element];
  const avIcon = av ? av.icon : '👤';
  const avColor = av ? av.color : '#7c4dff';
  const elemColor = elInfo ? elInfo.color : '#888';
  const elemBg = elInfo ? elInfo.bg : '#f5f5f5';
  const power = calcCombatPower(pStats);

  // 角色卡
  const charCard = document.createElement('div');
  charCard.className = 'profile-char-card';
  charCard.style.background = `linear-gradient(180deg, ${elemBg} 0%, white 50%)`;
  charCard.innerHTML = `
    <div class="profile-avatar-wrap">
      <img src="${avatarPlaceholderSvg({ icon: avIcon, color: avColor })}" alt="" class="profile-avatar-img">
      <div class="profile-avatar-element-ring" style="border-color:${elemColor}"></div>
    </div>
    <div class="profile-name">${USER_CACHE.username}</div>
    <div class="profile-element-badge" style="background:${elemBg};color:${elemColor}">
      ${elInfo ? elInfo.icon : ''} 本命 · ${USER_CACHE.element}
    </div>
    <div class="profile-element-desc">${elStats ? elStats.desc : ''}</div>
    <div class="profile-power">
      <span class="profile-power-value">${power}</span>
      <span class="profile-power-label">综合战力</span>
    </div>
  `;
  container.appendChild(charCard);

  // XP 卡片
  const xpCard = document.createElement('div');
  xpCard.className = 'profile-xp-card';
  xpCard.innerHTML = `
    <div class="profile-xp-row">
      <span class="profile-xp-level">Lv.${level}</span>
      <span class="profile-xp-title">${title.icon} ${title.name}</span>
    </div>
    <div class="profile-xp-track"><div class="profile-xp-fill" style="width:${Math.min(100, pct)}%"></div></div>
    <div class="profile-xp-text">${xpInLevel} / ${xpNeeded} XP</div>
  `;
  container.appendChild(xpCard);

  // 五维雷达图 + 属性详情卡片
  const radarCard = document.createElement('div');
  radarCard.className = 'profile-radar-card';
  radarCard.innerHTML = `
    <div class="profile-section-title">🎯 五行五维图</div>
    <div class="radar-container">
      ${generateRadarChart(pStats, 100)}
      <div class="radar-legend">
        <div class="radar-legend-item" style="color:#4caf50">🌳 木 <b>${pStats.wood}</b></div>
        <div class="radar-legend-item" style="color:#ff5722">🔥 火 <b>${pStats.fire}</b></div>
        <div class="radar-legend-item" style="color:#795548">⛰️ 土 <b>${pStats.earth}</b></div>
        <div class="radar-legend-item" style="color:#f57f17">⭐ 金 <b>${pStats.metal}</b></div>
        <div class="radar-legend-item" style="color:#2196f3">💧 水 <b>${pStats.water}</b></div>
      </div>
    </div>
  `;
  container.appendChild(radarCard);

  // 收集进度卡片
  const collectCard = document.createElement('div');
  collectCard.className = 'profile-collect-card';
  collectCard.innerHTML = `
    <div class="profile-section-title">📊 收集进度</div>
    <div class="profile-collect-row">
      <div class="profile-collect-item">
        <div class="profile-collect-num">${bp.length}</div>
        <div class="profile-collect-label">🎴 技能卡</div>
      </div>
      <div class="profile-collect-item">
        <div class="profile-collect-num">${items.length}</div>
        <div class="profile-collect-label">🧰 道具</div>
      </div>
      <div class="profile-collect-item">
        <div class="profile-collect-num">${totalXp}</div>
        <div class="profile-collect-label">✨ 总经验</div>
      </div>
    </div>
    <div class="profile-bonus-row" style="margin-top:12px;border-top:1px solid #f0f0f0;padding-top:12px">
      <span class="profile-collect-label">头像: ${av ? av.label : '未选择'}</span>
    </div>
  `;
  container.appendChild(collectCard);

  showScreen('screen-profile');
}

/* ========== 屏幕切换 ========== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ========== 主界面 ========== */
function goHome() {
  showScreen('screen-home');
  updateBackpackCount();
  updateHomeXpDisplay();
}

/* ========== 练习（待实现） ========== */
function showPractice() {
  showToast('✏️ 练习模式即将上线，敬请期待！');
}

/* ========== 排行榜 ========== */
let _lbData = [];
let _lbTab = 'level';

/** 给任意用户计算综合战力（不依赖全局 USER_CACHE） */
function calcPowerForUser(element, bonus, level) {
  const base = ELEMENT_STATS[element] || { hp: 10, atk: 10, def: 10, spd: 10, cri: 10 };
  const bns = bonus || {};
  const wood = base.hp + level + (bns.wood || 0);
  const fire = base.atk + level + (bns.fire || 0);
  const earth = base.def + level + (bns.earth || 0);
  const water = base.spd + level + (bns.water || 0);
  const metal = base.cri + level + (bns.metal || 0);
  const maxHp = 60 + wood * 4;
  return Math.floor(maxHp * 2 + fire * 5 + earth * 3 + water + metal);
}

async function showLeaderboard() {
  showScreen('screen-leaderboard');
  document.getElementById('lb-loading').style.display = 'block';
  document.getElementById('lb-list').innerHTML = '';

  const rows = await fetchAllUsers();
  if (!rows || rows.length === 0) {
    document.getElementById('lb-loading').textContent = '暂无数据';
    return;
  }

  // 为每个用户计算等级和战力
  _lbData = rows.map(u => {
    const level = getLevel(u.xp || 0);
    const bonus = typeof u.bonus === 'object' && u.bonus ? u.bonus : {};
    const power = calcPowerForUser(u.element || '', bonus, level);
    return {
      username: u.username,
      avatar: u.avatar || '',
      element: u.element || '',
      xp: u.xp || 0,
      level,
      bonus,
      power,
    };
  });

  document.getElementById('lb-loading').style.display = 'none';
  renderLeaderboard(_lbTab);
}

function renderLeaderboard(tab) {
  _lbTab = tab;
  const container = document.getElementById('lb-list');
  container.innerHTML = '';

  // 排序
  const sorted = [..._lbData].sort((a, b) =>
    tab === 'level' ? b.xp - a.xp : b.power - a.power
  );

  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];
    const rank = i + 1;
    const isSelf = u.username === USER_CACHE.username;
    const av = getAvatarById(u.avatar);
    const elInfo = DATA.getElementInfo(u.element);

    const row = document.createElement('div');
    row.className = 'lb-row' + (isSelf ? ' lb-self' : '');

    // 排名
    let rankHtml;
    if (rank === 1) rankHtml = '<span class="lb-medal">🥇</span>';
    else if (rank === 2) rankHtml = '<span class="lb-medal">🥈</span>';
    else if (rank === 3) rankHtml = '<span class="lb-medal">🥉</span>';
    else rankHtml = `<span class="lb-rank">${rank}</span>`;

    row.innerHTML = `
      ${rankHtml}
      <span class="lb-avatar">${av ? av.icon : '👤'}</span>
      <span class="lb-name">${u.username}${isSelf ? ' （你）' : ''}</span>
      <span class="lb-element" style="color:${elInfo ? elInfo.color : '#888'}">${elInfo ? elInfo.icon : ''}</span>
      <div class="lb-stats">
        <div class="lb-stat">
          <span class="lb-stat-value">Lv.${u.level}</span>
          <span class="lb-stat-label">等级</span>
        </div>
        <div class="lb-stat" style="border-left:1px solid #eee;padding-left:10px">
          <span class="lb-stat-value">${u.power}</span>
          <span class="lb-stat-label">战力</span>
        </div>
      </div>
    `;
    container.appendChild(row);
  }
}

function switchLeaderboardTab(tab) {
  _lbTab = tab;
  document.querySelectorAll('.lb-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderLeaderboard(tab);
}

/** 重复上次的学习模式（"再来一次"用） */
function repeatLastLearnMode() {
  startStudy(lastLearnMode);
}

let lastLearnMode = 'grade1-2'; // 追踪最后一次学习模式

/* ========== 学习选年级 ========== */
function showStudyScreen() {
  // 所有年级均直接开放，等级不再作为解锁条件
  const btn = document.getElementById('grade-3-4-btn');
  const desc = document.getElementById('grade-3-4-desc');
  const lock = document.getElementById('grade-3-4-lock');
  btn.className = 'grade-card grade-unlocked';
  desc.textContent = '中级单词 · 含虚词';
  lock.textContent = '✅';
  btn.onclick = () => startStudy('grade3-4');
  showScreen('screen-study');
}

/** 3-4年级按钮备用处理 */
function handleGrade3_4() {
  startStudy('grade3-4');
}

/** 从学习选级进入对应的模式 */
async function startStudy(mode) {
  // 等级不再锁定内容，任何年级均可直接进入
  lastLearnMode = mode;
  STATE.currentMode = mode;
  STATE.sentenceAttempts = 0;
  await DATA.load();

  // 选择句子组
  const tier = mode === 'grade1-2' ? 'beginner' : 'intermediate';
  const result = DATA.selectAnySentenceGroup(tier);
  if (result) {
    STATE.words = result.words;
    STATE.targetOrder = result.targetOrder;
    STATE.targetSentence = result.targetSentence;
    STATE.contextCn = result.contextCn;
  } else {
    STATE.words = DATA.selectWords4();
    STATE.targetOrder = DATA.getTargetOrder(STATE.words);
    STATE.targetSentence = '';
    STATE.contextCn = '';
  }

  STATE.wordIndex = 0;
  STATE.sentenceCorrect = false;
  STATE.words = DATA.shuffleArray([...STATE.words]);

  startLearning();
}

/* ========== 选五行（保留给挑战模式） ========== */
async function startGame(mode) {
  if (mode !== 'challenge') return;
  await DATA.load();

  STATE.userElement = null;
  STATE.sysElement = null;
  document.getElementById('element-result').style.display = 'none';

  const picker = document.getElementById('element-picker');
  picker.innerHTML = '';
  for (const el of DATA.ELEMENTS) {
    const card = document.createElement('div');
    card.className = `element-card ${el.cls}`;
    card.dataset.element = el.name;
    card.innerHTML = `<span class="elem-icon">${el.icon}</span><span class="elem-name">${el.name}</span>`;
    card.addEventListener('click', () => pickElement(el.name));
    picker.appendChild(card);
  }
  showScreen('screen-element');
}

function pickElement(elementName) {
  STATE.userElement = elementName;

  // 高亮选中
  document.querySelectorAll('.element-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.element-card[data-element="${elementName}"]`)?.classList.add('selected');

  // 系统从相生元素中随机选一个（或不同元素）
  const others = DATA.ELEMENTS.filter(e => e.name !== elementName);
  STATE.sysElement = DATA.randomPick(others).name;

  // 显示结果
  showElementResult();
}

function showElementResult() {
  const userEl = DATA.getElementInfo(STATE.userElement);
  const sysEl = DATA.getElementInfo(STATE.sysElement);

  document.getElementById('user-element-badge').textContent = `${userEl.icon} ${STATE.userElement}`;
  document.getElementById('user-element-badge').style.cssText = `background:${userEl.bg};color:${userEl.color}`;
  document.getElementById('sys-element-badge').textContent = `${sysEl.icon} ${STATE.sysElement}`;
  document.getElementById('sys-element-badge').style.cssText = `background:${sysEl.bg};color:${sysEl.color}`;

  document.getElementById('element-result').style.display = 'block';
}

function resetElementPick() {
  STATE.userElement = null;
  STATE.sysElement = null;
  document.querySelectorAll('.element-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('element-result').style.display = 'none';
}

function confirmElements() {
  const result = DATA.selectSentenceGroup(STATE.userElement, STATE.sysElement);

  if (result) {
    STATE.words = result.words;
    STATE.targetOrder = result.targetOrder;
    STATE.targetSentence = result.targetSentence;
    STATE.contextCn = result.contextCn;
  } else {
    // 降级：按 POS 随机选词（旧逻辑）
    STATE.words = DATA.selectWords4(STATE.userElement, STATE.sysElement);
    STATE.targetOrder = DATA.getTargetOrder(STATE.words);
    STATE.targetSentence = '';
    STATE.contextCn = '';
  }

  STATE.wordIndex = 0;
  STATE.sentenceCorrect = false;

  // 洗牌学习顺序
  STATE.words = DATA.shuffleArray([...STATE.words]);

  startLearning();
}

/* ========== 学单词 ========== */
function startLearning() {
  showScreen('screen-learn');
  showWord(0);
}

function showWord(index) {
  if (index >= STATE.words.length) {
    startSentence();
    return;
  }
  STATE.wordIndex = index;
  const w = STATE.words[index];

  // 更新进度
  document.getElementById('progress-fill').style.width = `${((index) / STATE.words.length) * 100}%`;
  document.getElementById('progress-text').textContent = `${index + 1}/${STATE.words.length}`;

  // 显示单词
  const elInfo = DATA.getElementInfo(w.element);
  document.getElementById('learn-element').textContent = `${elInfo.icon} ${w.element}`;
  document.getElementById('learn-element').style.color = elInfo.color;
  document.getElementById('word-english').textContent = w.word;
  document.getElementById('word-english').style.color = elInfo.color;
  document.getElementById('word-chinese').textContent = w.cn;
  document.getElementById('word-chinese').style.display = 'none';
  document.getElementById('word-sentence').textContent = w.sentence;

  // 重置按钮
  document.getElementById('btn-chinese').style.display = 'inline-block';
  document.getElementById('btn-next').textContent = index < STATE.words.length - 1 ? '下一个 →' : '开始连句 →';

  // 自动朗读当前单词（speech.js 内部处理 cancel/speak 竞态）
  SPEAKER.speakWord(w.word);
}

/** 主动发音按钮：朗读当前单词，读完后自动朗读句子 */
function speakCurrentWord() {
  const w = STATE.words[STATE.wordIndex];
  if (!w) return;
  // 先读单词，onEnd 触发后再读句子（不打断单词）
  SPEAKER.speakWord(w.word, () => {
    if (w.sentence) SPEAKER.speakSentence(w.sentence);
  });
}

/** 点击句子时单独朗读句子 */
function speakCurrentSentence() {
  const w = STATE.words[STATE.wordIndex];
  if (!w || !w.sentence) return;
  SPEAKER.speakSentence(w.sentence);
}

function showChinese() {
  const w = STATE.words[STATE.wordIndex];
  document.getElementById('word-chinese').style.display = 'block';
  document.getElementById('btn-chinese').style.display = 'none';
  SPEAKER.speakSentence(w.sentence);
}

function nextWord() {
  showWord(STATE.wordIndex + 1);
}

/* ========== 连句子 ========== */
function startSentence() {
  STATE.userSentence = [];
  STATE.sentenceChecked = false;
  STATE.sentenceCorrect = false;
  showScreen('screen-sentence');

  // 显示中文情境提示
  const hint = document.getElementById('sentence-hint');
  hint.textContent = STATE.contextCn || '按顺序点击单词，拼出正确的句子';

  resetSentenceUI();
  showBuildMode();
}

function resetSentenceUI() {
  document.getElementById('sentence-display').innerHTML = '<span class="sentence-placeholder">点击下方单词开始排列</span>';
  document.getElementById('sentence-actions').style.display = 'flex';
  document.getElementById('sentence-result').style.display = 'none';
  document.getElementById('btn-check').disabled = true;

  const bank = document.getElementById('word-bank');
  bank.innerHTML = '';
  const shuffled = DATA.shuffleArray([...STATE.words]);
  for (const w of shuffled) {
    const card = document.createElement('div');
    card.className = 'bank-card';
    card.dataset.word = w.word;
    card.innerHTML = `${w.word} <span class="bank-cn">${w.cn}</span>`;
    card.addEventListener('click', () => addToSentence(w));
    bank.appendChild(card);
  }
  bank.style.display = 'flex';
}

function showBuildMode() {
  // 词库可点，句子可编辑，"完成"按钮可见
  document.querySelectorAll('.bank-card').forEach(c => c.style.pointerEvents = 'auto');
  document.getElementById('sentence-actions').style.display = 'flex';
  document.getElementById('sentence-result').style.display = 'none';
}

function showResultMode() {
  // 词库禁用，句子只读，"完成"按钮隐藏，显示结果
  document.querySelectorAll('.bank-card').forEach(c => c.style.pointerEvents = 'none');
  document.getElementById('sentence-actions').style.display = 'none';
  document.getElementById('sentence-result').style.display = 'block';
}

function addToSentence(word) {
  if (STATE.sentenceChecked) return;
  if (STATE.userSentence.includes(word)) return;
  STATE.userSentence.push(word);

  renderSentence();
  updateBank();
  document.getElementById('btn-check').disabled = STATE.userSentence.length < 2;
}

function removeFromSentence(word) {
  if (STATE.sentenceChecked) return;
  const idx = STATE.userSentence.indexOf(word);
  if (idx === -1) return;
  STATE.userSentence.splice(idx, 1);
  renderSentence();
  updateBank();
  document.getElementById('btn-check').disabled = STATE.userSentence.length < 2;
}

function renderSentence() {
  const display = document.getElementById('sentence-display');
  if (STATE.userSentence.length === 0) {
    display.innerHTML = '<span class="sentence-placeholder">点击下方单词开始排列</span>';
    return;
  }
  display.innerHTML = '';
  for (const w of STATE.userSentence) {
    const token = document.createElement('span');
    token.className = 'word-token';
    token.textContent = w.word;
    if (!STATE.sentenceChecked) {
      token.addEventListener('click', () => removeFromSentence(w));
    }
    display.appendChild(token);
  }
}

function updateBank() {
  document.querySelectorAll('.bank-card').forEach(card => {
    const word = card.dataset.word;
    const inSentence = STATE.userSentence.some(w => w.word === word);
    card.classList.toggle('used', inSentence);
  });
}

/** 检查连句——必须完全正确才能通过 */
function checkSentence() {
  if (STATE.userSentence.length === 0) return;
  STATE.sentenceChecked = true;
  STATE.sentenceAttempts = (STATE.sentenceAttempts || 0) + 1;

  const total = STATE.targetOrder.length;

  // 位置匹配
  const positionMatches = STATE.targetOrder.map((t, i) => {
    const u = STATE.userSentence[i];
    return !!(u && u.word === t.word);
  });
  const allCorrect = positionMatches.every(Boolean);

  // 视觉渲染
  renderSentenceResult(positionMatches);

  if (!allCorrect) {
    STATE.sentenceCorrect = false;
    showResultMode();
    showSentenceResultFail();
    return;
  }

  // 成功！
  STATE.sentenceCorrect = true;
  showResultMode();
  showSentenceResultSuccess();

  // 朗读
  const fullSentence = STATE.targetSentence || STATE.targetOrder.map(w => w.word).join(' ');
  SPEAKER.speakSentence(fullSentence);
}

function renderSentenceResult(matches) {
  const display = document.getElementById('sentence-display');
  display.innerHTML = '';
  for (let i = 0; i < STATE.targetOrder.length; i++) {
    const w = STATE.userSentence[i];
    const correctWord = STATE.targetOrder[i];
    const token = document.createElement('div');
    token.className = 'slot-token';
    if (w) {
      token.textContent = w.word;
      token.className += matches[i] ? ' slot-correct' : ' slot-wrong';
      if (!matches[i]) {
        const hint = document.createElement('div');
        hint.className = 'slot-hint';
        hint.textContent = '→ ' + correctWord.word;
        token.appendChild(hint);
      }
    } else {
      token.textContent = '___';
      token.className += ' slot-empty';
    }
    display.appendChild(token);
  }
}

function showSentenceResultFail() {
  const msg = document.getElementById('sentence-result-message');
  const buttons = document.getElementById('result-buttons');
  buttons.innerHTML = '';

  msg.className = 'result-msg result-msg-fail';
  msg.innerHTML = '顺序不对，再想想～';

  const btn = document.createElement('button');
  btn.className = 'secondary-btn';
  btn.textContent = '再试一次';
  btn.addEventListener('click', () => retrySentence());
  buttons.appendChild(btn);
}

function showSentenceResultSuccess() {
  const attempts = STATE.sentenceAttempts;
  const mode = STATE.currentMode || 'grade1-2';

  // 计算奖励卡数量
  let cardCount;
  if (attempts === 1) cardCount = 3;
  else if (attempts === 2) cardCount = 2;
  else if (attempts === 3) cardCount = 1;
  else cardCount = 0;  // 4次及以上无卡

  // 计算经验值
  const xpGain = getStudyXp(attempts, mode);

  // 存储奖励信息供 showReward 使用
  STATE._rewardInfo = { cardCount, xpGain, attempts };

  const msg = document.getElementById('sentence-result-message');
  const buttons = document.getElementById('result-buttons');
  buttons.innerHTML = '';

  let title;
  if (attempts === 1) title = '🎉 一次成功！';
  else if (attempts === 2) title = '👍 第二次成功！';
  else if (attempts === 3) title = '💪 第3次成功！';
  else title = '😅 第4次及以上，继续加油！';

  msg.className = 'result-msg result-msg-perfect';
  msg.innerHTML = `${title}<br><span class="result-sentence">「${STATE.targetSentence || STATE.targetOrder.map(w => w.word).join(' ')}」</span>`;

  const btn = document.createElement('button');
  btn.className = 'primary-btn';
  const btnLabel = cardCount > 0
    ? `领取奖励 → (${cardCount}张卡, +${xpGain}XP)`
    : `领取经验 → (+${xpGain}XP)`;
  btn.textContent = btnLabel;
  btn.addEventListener('click', () => showReward());
  buttons.appendChild(btn);
}

function retrySentence() {
  STATE.userSentence = [];
  STATE.sentenceChecked = false;
  STATE.positionMatches = [];
  showBuildMode();
  renderSentence();
  updateBank();
  document.getElementById('btn-check').disabled = true;
}

/* ========== 奖励 ========== */
function showReward() {
  const info = STATE._rewardInfo;
  if (!info) return;

  showScreen('screen-reward');

  const icon = document.getElementById('reward-icon');
  const title = document.getElementById('reward-title');
  const desc = document.getElementById('reward-desc');

  let msg;
  if (info.attempts === 1) { msg = '一次成功！最高奖励！'; icon.textContent = '🏆'; title.textContent = '完美通关！'; }
  else if (info.attempts === 2) { msg = '第二次成功，不错哦！'; icon.textContent = '🎉'; title.textContent = '做得好！'; }
  else if (info.attempts === 3) { msg = '第3次成功！'; icon.textContent = '💪'; title.textContent = '坚持就是胜利！'; }
  else { msg = '超过3次了，只获得经验值，下次加油！'; icon.textContent = '😅'; title.textContent = '继续加油！'; }
  desc.textContent = msg;

  // 从当前词库随机抽卡
  const pool = [...STATE.words];
  const pickCards = [];
  for (let i = 0; i < info.cardCount && pool.length > 0; i++) {
    const picked = DATA.randomPick(pool);
    const idx = pool.indexOf(picked);
    if (idx > -1) pool.splice(idx, 1);
    pickCards.push(picked);
  }

  // 加入背包
  const bp = loadBackpack();
  const maxCap = getMaxBackpackCapacity(getLevel(loadXp()));
  for (const w of pickCards) {
    if (bp.length >= maxCap) break;
    bp.push({
      word: w.word, cn: w.cn, element: w.element,
      pos: w.pos || '', sentence: w.sentence || '',
      date: new Date().toISOString().slice(0, 10),
    });
  }
  saveBackpack(bp);

  // 发放经验
  const newXp = addXp(info.xpGain);
  const { level, xpInLevel, xpNeeded } = getXpProgress(newXp);
  const pct = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;

  document.getElementById('reward-xp-gain').textContent = `+${info.xpGain} XP`;
  document.getElementById('reward-xp-fill').style.width = Math.min(100, pct) + '%';
  document.getElementById('reward-xp-text').textContent = `Lv.${level} ${xpInLevel}/${xpNeeded}`;
  document.getElementById('reward-xp-info').style.display = 'flex';

  // 显示卡片
  const container = document.getElementById('reward-cards');
  container.innerHTML = '';
  if (pickCards.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);font-size:14px;padding:12px">本次没有获得单词卡，再试一次争取在3次内完成！</p>';
  } else {
    for (const w of pickCards) {
    const elInfo = DATA.getElementInfo(w.element);
    const cardDiv = document.createElement('div');
    cardDiv.style.cssText = `background:${elInfo.bg};border-radius:12px;padding:20px 16px;text-align:center;min-width:100px;box-shadow:0 2px 10px rgba(0,0,0,0.1)`;
    cardDiv.innerHTML = `
      <div style="font-size:28px;font-weight:800;color:${elInfo.color}">${w.word}</div>
      <div style="font-size:14px;color:#888;margin-top:4px">${w.cn}</div>
      <div style="font-size:12px;margin-top:8px;padding:4px 10px;border-radius:10px;display:inline-block;background:${elInfo.bg};color:${elInfo.color}">${elInfo.icon} ${w.element}</div>
    `;
    container.appendChild(cardDiv);
  }
  }

  // 等级升级检测（插入容器内首个子元素，会被下次 innerHTML='' 清除）
  const oldLevel = getLevel(newXp - info.xpGain);
  if (level > oldLevel) {
    const lvlUp = document.createElement('div');
    lvlUp.style.cssText = 'background:#fff3e0;color:#e65100;font-weight:700;font-size:18px;text-align:center;padding:12px;margin-bottom:12px;border-radius:16px;';
    lvlUp.textContent = `⬆️ 升级！Lv.${oldLevel} → Lv.${level}`;
    container.insertBefore(lvlUp, container.firstChild);
  }
}

/* ========== 复习（回顾本轮单词） ========== */
function showReview() {
  const words = STATE.words;
  if (!words || words.length === 0) return;

  const list = document.getElementById('review-word-list');
  list.innerHTML = '';
  for (const w of words) {
    const elInfo = DATA.getElementInfo(w.element);
    const item = document.createElement('div');
    item.className = 'review-item';
    item.style.borderLeft = `4px solid ${elInfo.color}`;
    item.innerHTML = `
      <div class="review-word" style="color:${elInfo.color}">${w.word}</div>
      <div class="review-cn">${w.cn}</div>
      <div class="review-sentence">${w.sentence}</div>
    `;
    item.addEventListener('click', () => SPEAKER.speakWord(w.word));
    list.appendChild(item);
  }
  document.getElementById('review-overlay').style.display = 'block';
  document.getElementById('review-modal').style.display = 'block';
}

function closeReview() {
  document.getElementById('review-overlay').style.display = 'none';
  document.getElementById('review-modal').style.display = 'none';
}
function showBackpack() {
  showScreen('screen-backpack');
  const bp = loadBackpack();
  const level = getLevel(loadXp());
  const maxCap = getMaxBackpackCapacity(level);
  const capEl = document.getElementById('backpack-capacity');
  if (capEl) capEl.textContent = `${bp.length} / ${maxCap}`;
  const grid = document.getElementById('backpack-grid');
  const empty = document.getElementById('backpack-empty');

  grid.innerHTML = '';
  if (bp.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // 分离单词卡和道具
  const wordCards = bp.filter(c => !c.type || c.type === 'word');
  const items = bp.filter(c => c.type === 'item');

  // 按五行分组展示单词卡
  const elementOrder = ['火', '水', '木', '金', '土'];
  const grouped = {};
  for (const el of elementOrder) grouped[el] = [];
  for (const item of wordCards) {
    if (grouped[item.element]) grouped[item.element].push(item);
  }

  for (const el of elementOrder) {
    const elItems = grouped[el];
    if (elItems.length === 0) continue;

    const elInfo = DATA.getElementInfo(el);
    const section = document.createElement('div');
    section.className = 'bp-section';

    const header = document.createElement('div');
    header.className = 'bp-section-header';
    header.style.color = elInfo.color;
    header.innerHTML = `${elInfo.icon} ${el} · ${elItems.length}张`;
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'bp-section-grid';
    for (const entry of elItems) {
      const card = document.createElement('div');
      card.className = 'bp-card';
      card.style.background = elInfo.bg;
      card.innerHTML = `
        <span class="bp-element">${elInfo.icon}</span>
        <div class="bp-info">
          <div class="bp-word" style="color:${elInfo.color}">${entry.word}</div>
          <div class="bp-cn">${entry.cn}</div>
          <div class="bp-date">${entry.date}</div>
        </div>
      `;
      row.appendChild(card);
    }
    section.appendChild(row);
    grid.appendChild(section);
  }

  // 道具专区
  if (items.length > 0) {
    const section = document.createElement('div');
    section.className = 'bp-section';

    const header = document.createElement('div');
    header.className = 'bp-section-header';
    header.style.cssText = 'color:#e65100;border-bottom-color:#ffe0b2';
    header.innerHTML = `🎒 道具 · ${items.length}个`;
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'bp-section-grid';

    for (const item of items) {
      const card = document.createElement('div');
      card.className = 'bp-card';
      card.style.cssText = 'background:#fff8e1;border-radius:10px;padding:16px;text-align:center;width:calc(50% - 5px);box-shadow:0 2px 10px rgba(0,0,0,0.1)';

      let icon, label, sublabel;
      if (item.itemType === 'boost') {
        icon = '✨';
        label = `${item.element}属性提升`;
        sublabel = '挑战模式掉落';
      } else if (item.itemType === 'blank_card') {
        icon = '🃏';
        label = '空白单词卡';
        sublabel = '可自定义单词';
      } else if (item.itemType === 'all_boost') {
        icon = '🌟';
        label = '全属性提升';
        sublabel = '稀有道具';
      } else {
        icon = '📦';
        label = '未知道具';
        sublabel = '';
      }

      card.innerHTML = `
        <div style="font-size:28px">${icon}</div>
        <div style="font-size:14px;font-weight:700;color:#e65100;margin-top:4px">${label}</div>
        ${sublabel ? `<div style="font-size:11px;color:#888;margin-top:2px">${sublabel}</div>` : ''}
        <div style="font-size:11px;color:#aaa;margin-top:2px">${item.date || ''}</div>
      `;
      row.appendChild(card);
    }

    section.appendChild(row);
    grid.appendChild(section);
  }
}

/* ========== 物品背包 ========== */
let _selectedItemIndex = -1;

function showItemBackpack() {
  // 首次打开时迁移旧道具
  migrateOldItems();

  const items = loadItems();
  const grid = document.getElementById('items-grid');
  const empty = document.getElementById('items-empty');

  grid.innerHTML = '';
  closeItemDetail();
  _selectedItemIndex = -1;

  if (items.length === 0) {
    empty.style.display = 'block';
    showScreen('screen-items');
    return;
  }
  empty.style.display = 'none';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.index = i;

    let icon, label, sublabel;
    if (item.itemType === 'boost') {
      icon = '✨'; label = `${item.element}属性提升`; sublabel = '永久+1';
    } else if (item.itemType === 'all_boost') {
      icon = '🌟'; label = '全属性提升'; sublabel = '全部永久+1';
    } else if (item.itemType === 'blank_card') {
      icon = '🃏'; label = '空白单词卡'; sublabel = '创造新单词';
    } else {
      icon = '📦'; label = '未知道具'; sublabel = '';
    }

    card.innerHTML = `
      <div class="item-card-icon">${icon}</div>
      <div class="item-card-label">${label}</div>
      ${sublabel ? `<div class="item-card-sublabel">${sublabel}</div>` : ''}
      <div class="item-card-date">${item.date || ''}</div>
    `;

    card.addEventListener('click', () => selectItem(i));
    grid.appendChild(card);
  }

  showScreen('screen-items');
}

function selectItem(index) {
  _selectedItemIndex = index;
  const items = loadItems();
  const item = items[index];
  if (!item) return;

  // 高亮
  document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.item-card[data-index="${index}"]`)?.classList.add('selected');

  const iconEl = document.getElementById('item-detail-icon');
  const nameEl = document.getElementById('item-detail-name');
  const descEl = document.getElementById('item-detail-desc');
  const useBtn = document.getElementById('btn-item-use');

  let icon, name, desc, showUse = true;

  if (item.itemType === 'boost') {
    icon = '✨'; name = `${item.element}属性提升`;
    desc = `永久提升${item.element}属性 +1。当前道具使用后不可恢复。`;
  } else if (item.itemType === 'all_boost') {
    icon = '🌟'; name = '全属性提升';
    desc = '永久提升所有五行属性 +1。稀有道具，使用后不可恢复。';
  } else if (item.itemType === 'blank_card') {
    icon = '🃏'; name = '空白单词卡';
    desc = '消耗此卡创建一个自定义单词，输入英文和中文释义后加入技能背包。';
  } else {
    icon = '📦'; name = '未知道具'; desc = ''; showUse = false;
  }

  iconEl.textContent = icon;
  nameEl.textContent = name;
  descEl.textContent = desc;
  useBtn.style.display = showUse ? 'inline-block' : 'none';

  document.getElementById('item-detail').style.display = 'block';
}

function closeItemDetail() {
  document.getElementById('item-detail').style.display = 'none';
  _selectedItemIndex = -1;
  document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
}

function useSelectedItem() {
  const items = loadItems();
  const item = items[_selectedItemIndex];
  if (!item) return;

  if (item.itemType === 'boost') {
    showModal(`确定使用「${item.element}属性提升」吗？效果：永久提升${item.element}属性 +1`, () => {
      closeModal();
      addAttributeBonus(item.element);
      consumeItem(_selectedItemIndex);
      showToast(`✨ ${item.element}属性 +1！`);
    });
  } else if (item.itemType === 'all_boost') {
    showModal('确定使用「全属性提升」吗？效果：所有五行属性永久 +1', () => {
      closeModal();
      addAllAttributeBonus();
      consumeItem(_selectedItemIndex);
      showToast('🌟 所有属性 +1！');
    });
  } else if (item.itemType === 'blank_card') {
    // 暂不处理，留待实现
    showBlankCardInput();
  }
}

function consumeItem(index) {
  const items = loadItems();
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    saveItems(items);
  }
  // 刷新背包
  showItemBackpack();
}

/** 简单Toast提示 */
function showToast(msg) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:#fff;padding:16px 32px;border-radius:12px;font-size:18px;font-weight:700;z-index:200;text-align:center;max-width:80%;pointer-events:none';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

/* ========== 空白单词卡 ========== */
let _blankCardCallback = null;

function showBlankCardInput() {
  // 构建输入弹窗
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '150';
  overlay.id = 'blank-card-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-box blank-card-modal';
  modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;width:90%;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,0.2);z-index:151;text-align:center';

  modal.innerHTML = `
    <div style="font-size:36px;margin-bottom:8px">🃏</div>
    <h3 style="margin-bottom:8px">创建自定义单词</h3>
    <p style="font-size:13px;color:#888;margin-bottom:16px">输入英文单词和中文释义，确认后加入技能背包</p>
    <div style="margin-bottom:12px">
      <input id="bc-english" type="text" placeholder="英文单词" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px;outline:none;box-sizing:border-box">
    </div>
    <div style="margin-bottom:16px">
      <input id="bc-chinese" type="text" placeholder="中文释义" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px;outline:none;box-sizing:border-box">
    </div>
    <div id="bc-error" style="font-size:13px;color:#e53935;margin-bottom:8px;min-height:18px"></div>
    <div id="bc-element-picker" style="display:none;margin-bottom:12px">
      <p style="font-size:13px;color:#666;margin-bottom:8px">选择这个词的五行属性：</p>
      <div id="bc-element-options" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"></div>
    </div>
    <div class="items-detail-actions" style="justify-content:center">
      <button class="primary-btn" id="bc-confirm" onclick="confirmBlankCard()">确认</button>
      <button class="text-btn" onclick="cancelBlankCard()">取消</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  overlay.addEventListener('click', cancelBlankCard);

  // 预填充参考词库数据
  _blankCardCallback = null;
  document.getElementById('bc-error').textContent = '';
  document.getElementById('bc-element-picker').style.display = 'none';

  // 自动对焦
  setTimeout(() => document.getElementById('bc-english')?.focus(), 100);
}

function cancelBlankCard() {
  document.getElementById('blank-card-overlay')?.remove();
  document.querySelector('.blank-card-modal')?.remove();
  _blankCardCallback = null;
}

async function confirmBlankCard() {
  const engInput = document.getElementById('bc-english');
  const cnInput = document.getElementById('bc-chinese');
  const errorEl = document.getElementById('bc-error');

  const english = engInput.value.trim();
  const chinese = cnInput.value.trim();

  if (!english) { errorEl.textContent = '请输入英文单词'; return; }
  if (!chinese) { errorEl.textContent = '请输入中文释义'; return; }

  // 只允许字母、空格、连字符
  if (!/^[a-zA-Z\s\-']+$/.test(english)) {
    errorEl.textContent = '英文单词只能包含字母、空格和连字符';
    return;
  }

  // 确保词库已加载
  await DATA.loadReference();

  // 查参考词库
  const ref = DATA.lookupReferenceWord(english);
  if (!ref) {
    errorEl.textContent = '这个词不在参考词库中，请重新输入';
    return;
  }

  // 检查是否在已有词汇表中
  const inVocabulary = DATA.words.some(w => w.word.toLowerCase() === english.toLowerCase());

  // 显示五行选择（第一次通过验证后显示）
  const elemPicker = document.getElementById('bc-element-picker');
  if (elemPicker.style.display === 'none') {
    // 第一次确认通过，显示五行选择
    const options = document.getElementById('bc-element-options');
    options.innerHTML = '';
    for (const el of DATA.ELEMENTS) {
      const btn = document.createElement('button');
      btn.className = 'element-card';
      btn.style.cssText = `background:${el.bg};padding:8px 12px;border-radius:10px;border:none;cursor:pointer;text-align:center;min-width:60px`;
      btn.dataset.element = el.name;
      btn.innerHTML = `<div style="font-size:24px">${el.icon}</div><div style="font-size:12px;font-weight:600;color:${el.color}">${el.name}</div>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#bc-element-options .element-card').forEach(c => c.style.outline = 'none');
        btn.style.outline = `3px solid ${el.color}`;
        btn.dataset.selected = 'true';
        _blankCardCallback = el.name;
      });
      options.appendChild(btn);
    }
    elemPicker.style.display = 'block';
    errorEl.textContent = '请选择单词的五行属性';
    document.getElementById('bc-confirm').textContent = '完成创建';
    return;
  }

  // 第二次确认：检查五行是否已选
  const selectedElement = _blankCardCallback;
  if (!selectedElement) {
    errorEl.textContent = '请选择一个五行属性';
    return;
  }

  // 创建单词卡
  const pos = ref.pos;
  const newCard = {
    word: english,
    cn: chinese,
    element: selectedElement,
    pos: pos,
    sentence: '',
    date: new Date().toISOString().slice(0, 10),
  };

  // 加入技能背包
  const bp = loadBackpack();
  const level = getLevel(loadXp());
  const maxCap = getMaxBackpackCapacity(level);
  if (bp.length >= maxCap) {
    errorEl.textContent = '技能背包已满！';
    return;
  }
  bp.push(newCard);
  saveBackpack(bp);

  // 计算XP奖励
  let xpGain;
  if (inVocabulary) {
    xpGain = 15;  // 已知词
  } else {
    xpGain = 30;  // 新词
  }
  addXp(xpGain);

  // 消耗空白卡
  const items = loadItems();
  if (_selectedItemIndex >= 0 && _selectedItemIndex < items.length) {
    items.splice(_selectedItemIndex, 1);
    saveItems(items);
  }

  cancelBlankCard();
  showToast(`✅ "${english}" 已加入技能背包！+${xpGain}XP`);
  showItemBackpack();
}

/* ========== 模态框 ========== */
function showModal(text, onConfirm) {
  document.getElementById('modal-text').textContent = text;
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('modal-box').style.display = 'block';
  document.getElementById('modal-confirm').onclick = onConfirm;
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('modal-box').style.display = 'none';
}

function confirmAbort() {
  showModal('确定退出学习吗？进度不会保存。', () => {
    closeModal();
    goHome();
  });
}

/* ========== 挑战模式 — 回合制打怪 ========== */

const BOSSES = [
  { name: '青龙', element: '木', icon: '🐉', desc: '东方木属性神兽', hp: 150, atkRating: 8, defRating: 8, hpRating: 10 },
  { name: '朱雀', element: '火', icon: '🐦', desc: '南方火属性神兽', hp: 150, atkRating: 10, defRating: 9, hpRating: 7 },
  { name: '白虎', element: '金', icon: '🐯', desc: '西方金属性神兽', hp: 150, atkRating: 9, defRating: 9, hpRating: 8 },
  { name: '玄武', element: '水', icon: '🐢', desc: '北方水属性神兽', hp: 150, atkRating: 8, defRating: 9, hpRating: 9 },
  { name: '麒麟', element: '土', icon: '🦄', desc: '中央土属性瑞兽', hp: 150, atkRating: 7, defRating: 10, hpRating: 9 },
];

/** 根据Boss属性评分和玩家等级计算战斗数值 */
function getBossBattleStats(boss, playerLevel) {
  const baseHp = 80 + boss.hpRating * 10;
  const atk = boss.atkRating * 5;
  const def = Math.round(boss.defRating * 2);
  return {
    maxHp: baseHp + playerLevel * 5,
    atk: atk + playerLevel,
    def: def + Math.floor(playerLevel * 0.5),
  };
}

const BATTLE = {
  level: null,
  boss: null,
  bossHp: 150,
  bossMaxHp: 150,
  playerHp: 100,
  playerMaxHp: 100,
  // 装备
  equippedCards: [],
  handCards: [],       // 当前可用手牌（含战斗中获得）
  consumedSet: new Set(), // 已消耗的手牌索引
  // 回合
  phase: 'boss',      // boss | player | transition | end
  roundCount: 0,
  bossCorrectCount: 0,
  totalDamageDealt: 0,
  berserkSubRound: 0, // 狂暴模式子回合（0=第一击, 1=第二击）
  // 当前Boss题
  currentQuestion: null,
  // 玩家选中的手牌索引
  selectedIndices: [],
  // 生克关系映射
  ELEMENT_RELATIONS: {
    '木': { sheng: '火', ke: '土' },
    '火': { sheng: '土', ke: '金' },
    '土': { sheng: '金', ke: '水' },
    '金': { sheng: '水', ke: '木' },
    '水': { sheng: '木', ke: '火' },
  },
};

/* 启动挑战模式 */
async function startChallengeMode() {
  await DATA.load();
  showLevelScreen();
}

/* ========== 级别选择 ========== */
function showLevelScreen() {
  const container = document.getElementById('level-list');
  container.innerHTML = '';

  const levels = [
    { id: 'beginner', label: '初级', icon: '🌱', desc: 'Boss 150HP · 适合初学', locked: false },
    { id: 'intermediate', label: '中级', icon: '🌿', desc: '即将开放', locked: true },
    { id: 'advanced', label: '高级', icon: '🌳', desc: '即将开放', locked: true },
  ];

  for (const lv of levels) {
    const btn = document.createElement('button');
    btn.className = 'level-card ' + (lv.locked ? 'level-locked' : 'level-active');
    btn.innerHTML = `
      <span class="level-icon">${lv.icon}</span>
      <span>
        <span class="level-label">${lv.label}</span>
        <div class="level-desc">${lv.desc}</div>
      </span>
    `;
    if (!lv.locked) btn.onclick = () => selectLevel(lv.id);
    container.appendChild(btn);
  }
  showScreen('screen-level');
}

function selectLevel(level) {
  BATTLE.level = level;
  showBossScreen();
}

/* ========== Boss选择 ========== */
function showBossScreen() {
  const grid = document.getElementById('boss-grid');
  grid.innerHTML = '';
  for (const b of BOSSES) {
    const elInfo = DATA.getElementInfo(b.element);
    const card = document.createElement('div');
    card.className = `boss-card ${elInfo ? elInfo.cls : ''}`;
    card.innerHTML = `
      <span class="boss-icon">${b.icon}</span>
      <span class="boss-name">${b.name}</span>
      <span class="boss-elem">${elInfo ? elInfo.icon : ''} ${b.element}</span>
      <span class="boss-stats">⚔️${b.atkRating} 🛡️${b.defRating} ❤️${b.hpRating}</span>
    `;
    card.addEventListener('click', () => selectBoss(b));
    grid.appendChild(card);
  }
  showScreen('screen-boss');
}

function selectBoss(boss) {
  const playerLevel = getLevel(loadXp());
  const bossStats = getBossBattleStats(boss, playerLevel);
  BATTLE.boss = { ...boss, ...bossStats };
  BATTLE.bossHp = bossStats.maxHp;
  BATTLE.bossMaxHp = bossStats.maxHp;
  showEquipScreen();
}

/* ========== 装备技能 ========== */
function showEquipScreen() {
  const bp = loadBackpack();
  const grid = document.getElementById('equip-grid');
  const hint = document.getElementById('equip-hint');
  const count = document.getElementById('equip-count');
  const btn = document.getElementById('btn-equip-confirm');

  // 检查数量
  if (bp.length < 15) {
    hint.textContent = `❗ 需要至少15张技能牌，你只有 ${bp.length} 张。先去学习模式收集吧！`;
    hint.style.color = '#e53935';
    grid.innerHTML = '';
    count.textContent = `已选 0/15`;
    showElementCounts({});
    btn.disabled = true;
    showScreen('screen-equip');
    return;
  }

  // 检查五行覆盖
  const elementSet = new Set(bp.map(c => c.element).filter(Boolean));
  const missing = DATA.ELEMENTS.map(e => e.name).filter(el => !elementSet.has(el));
  if (missing.length > 0) {
    hint.textContent = `❗ 缺少 ${missing.join('、')} 属性的牌，需要所有五行才能出战`;
    hint.style.color = '#e53935';
    grid.innerHTML = '';
    count.textContent = `已选 0/15`;
    showElementCounts({});
    btn.disabled = true;
    showScreen('screen-equip');
    return;
  }

  hint.textContent = '点击单词卡装备（至少15张，必须含全部五行）';
  hint.style.color = '';
  BATTLE.equippedCards = [];

  // 补全pos并按五行分组排序渲染
  grid.innerHTML = '';
  const elementOrder = DATA.ELEMENTS.map(e => e.name);
  const grouped = {};
  for (const el of elementOrder) grouped[el] = [];
  for (let i = 0; i < bp.length; i++) {
    const card = bp[i];
    if (!card.pos) card.pos = DATA.lookupWordPos(card.word, card.element);
    if (grouped[card.element]) grouped[card.element].push(i);
  }
  for (const el of elementOrder) {
    const indices = grouped[el] || [];
    for (const i of indices) {
      const card = bp[i];
      const elInfo = DATA.getElementInfo(card.element);
      const div = document.createElement('div');
      div.className = `equip-card ${elInfo ? elInfo.cls : ''}`;
      div.dataset.index = i;
      div.dataset.element = card.element;
    div.innerHTML = `
      <span class="eq-word">${card.word}</span>
      <span class="eq-cn">${card.cn}</span>
    `;
    div.addEventListener('click', () => toggleEquipCard(i, bp));
    grid.appendChild(div);
  }
  }

  BATTLE._equipBackpack = bp;
  BATTLE.equippedCards = [];
  count.textContent = `已选 0/15`;
  showElementCounts({});
  btn.disabled = true;
  showScreen('screen-equip');
}

function showElementCounts(counts) {
  const container = document.getElementById('equip-element-counts');
  container.innerHTML = '';
  for (const el of DATA.ELEMENTS) {
    const n = counts[el.name] || 0;
    const badge = document.createElement('span');
    badge.className = `equip-el-badge ${n === 0 ? 'missing' : ''}`;
    badge.style.cssText = `background:${el.bg};color:${el.color}`;
    badge.textContent = `${el.icon} ${n}`;
    container.appendChild(badge);
  }
}

function toggleEquipCard(index, bp) {
  const idx = BATTLE.equippedCards.indexOf(index);
  if (idx >= 0) {
    BATTLE.equippedCards.splice(idx, 1);
  } else {
    if (BATTLE.equippedCards.length >= 15) return;
    BATTLE.equippedCards.push(index);
  }

  // 更新UI（用 data-index 取原始背包索引）
  const cards = document.querySelectorAll('.equip-card');
  cards.forEach(c => {
    const origIdx = parseInt(c.dataset.index);
    c.classList.toggle('equip-selected', BATTLE.equippedCards.includes(origIdx));
  });

  const count = document.getElementById('equip-count');
  count.textContent = `已选 ${BATTLE.equippedCards.length}/15`;

  // 更新五行统计
  const counts = {};
  for (const idx of BATTLE.equippedCards) {
    const el = bp[idx].element;
    counts[el] = (counts[el] || 0) + 1;
  }
  showElementCounts(counts);

  // 确认按钮：15张 + 全五行
  const allFive = DATA.ELEMENTS.every(e => (counts[e.name] || 0) > 0);
  const btn = document.getElementById('btn-equip-confirm');
  btn.disabled = !(BATTLE.equippedCards.length === 15 && allFive);
}

function confirmEquip() {
  const bp = BATTLE._equipBackpack;
  const selected = BATTLE.equippedCards.map(i => ({
    ...bp[i],
    pos: bp[i].pos || DATA.lookupWordPos(bp[i].word, bp[i].element),
    source: 'equip',
    bpIndex: i,
  }));

  // 检查是否有动词
  const hasVerb = selected.some(c => c.pos === 'verb');
  if (!hasVerb) {
    document.getElementById('equip-hint').textContent = '❗ 至少需要1张动词牌才能组句攻击';
    document.getElementById('equip-hint').style.color = '#e53935';
    return;
  }

  initBattle(selected);
}

/* ========== 初始化战斗 ========== */
function initBattle(equipped) {
  const boss = BATTLE.boss;
  const playerLevel = getLevel(loadXp());
  const pStats = getPlayerStats(playerLevel);
  BATTLE.bossHp = boss.maxHp;
  BATTLE.bossMaxHp = boss.maxHp;
  BATTLE.playerHp = pStats.maxHp;
  BATTLE.playerMaxHp = pStats.maxHp;
  BATTLE.equippedCards = equipped;
  BATTLE.handCards = [...equipped];
  BATTLE.consumedSet = new Set();
  BATTLE.phase = 'boss';
  BATTLE.roundCount = 0;
  BATTLE.bossCorrectCount = 0;
  BATTLE.totalDamageDealt = 0;
  BATTLE.currentQuestion = null;
  BATTLE.selectedIndices = [];

  startBattle();
}

/* ========== 战斗主要循环 ========== */
function startBattle() {
  // 设置Boss UI
  const boss = BATTLE.boss;
  const elInfo = DATA.getElementInfo(boss.element);
  document.getElementById('b-boss-icon').textContent = boss.icon;
  document.getElementById('b-boss-name').textContent = boss.name;
  document.getElementById('b-boss-atk').textContent = boss.atk;
  document.getElementById('b-boss-def').textContent = boss.def;
  const pLevel = getLevel(loadXp());
  document.querySelector('.battle-level-badge').textContent = `Lv.${pLevel}`;

  updateHpBars();
  showScreen('screen-battle');

  // Boss先手
  bossTurn();
}

function updateHpBars() {
  // Boss HP
  const bossPct = Math.max(0, (BATTLE.bossHp / BATTLE.bossMaxHp) * 100);
  const bossFill = document.getElementById('b-boss-hp-fill');
  bossFill.style.width = bossPct + '%';
  bossFill.className = 'battle-hp-fill' + (bossPct < 25 ? ' low' : bossPct < 50 ? ' mid' : '');
  document.getElementById('b-boss-hp-text').textContent = `${Math.ceil(BATTLE.bossHp)}/${BATTLE.bossMaxHp}`;

  // Player HP
  const playerPct = Math.max(0, (BATTLE.playerHp / BATTLE.playerMaxHp) * 100);
  const playerFill = document.getElementById('b-player-hp-fill');
  playerFill.style.width = playerPct + '%';
  playerFill.className = 'battle-hp-fill' + (playerPct < 25 ? ' low' : playerPct < 50 ? ' mid' : '');
  document.getElementById('b-player-hp-text').textContent = `${Math.ceil(BATTLE.playerHp)}/${BATTLE.playerMaxHp}`;
}

/* 显示/隐藏阶段 */
function showPhase(phaseId) {
  document.querySelectorAll('.battle-phase').forEach(el => el.style.display = 'none');
  const el = document.getElementById(phaseId);
  if (el) el.style.display = 'block';
}

/* ========== Boss回合 ========== */
function bossTurn() {
  BATTLE.phase = 'boss';
  BATTLE.roundCount++;
  showPhase('b-boss-turn');

  const isBerserk = BATTLE.roundCount > 5;
  if (isBerserk) {
    const sub = BATTLE.berserkSubRound;
    if (sub === 0) {
      document.getElementById('b-round-label').textContent = `🔥 狂暴·第一击！ (第${BATTLE.roundCount}回合)`;
    } else {
      document.getElementById('b-round-label').textContent = `🔥 狂暴·第二击！ (第${BATTLE.roundCount}回合)`;
    }
    document.getElementById('b-boss-card')?.classList.add('berserk');
  } else {
    document.getElementById('b-round-label').textContent = `⚔️ Boss的攻击！ (第${BATTLE.roundCount}回合)`;
  }

  // 生成题目
  const question = DATA.generateClozeQuestion();
  BATTLE.currentQuestion = question;

  const qEl = document.getElementById('bq-question');
  qEl.innerHTML = `"${question.displaySentence}"<br><small style="font-size:14px;color:#888;font-weight:400">选择正确的词填入空白</small>`;

  const optContainer = document.getElementById('bq-options');
  optContainer.innerHTML = '';
  document.getElementById('bq-next-btn').style.display = 'none';
  const resultEl = document.getElementById('bq-result');
  resultEl.style.display = 'none';
  resultEl.className = 'bq-result';

  for (let i = 0; i < question.options.length; i++) {
    const opt = question.options[i];
    const btn = document.createElement('button');
    btn.className = 'bq-option';
    btn.textContent = `${opt.word} (${opt.cn})`;
    btn.addEventListener('click', () => answerBossQuestion(i));
    optContainer.appendChild(btn);
  }

  renderHandCards();
}

function answerBossQuestion(optIndex) {
  const question = BATTLE.currentQuestion;
  if (!question) return;
  const opt = question.options[optIndex];
  const isCorrect = opt.isCorrect;
  const allOpts = document.querySelectorAll('.bq-option');

  // 禁用所有选项
  allOpts.forEach((btn, i) => {
    btn.disabled = true;
    const o = question.options[i];
    if (o.isCorrect) btn.classList.add('correct');
    else if (i === optIndex) btn.classList.add('wrong');
  });

  const resultEl = document.getElementById('bq-result');
  resultEl.style.display = 'block';

  if (isCorrect) {
    // Boss掉血 + 得牌（固定10点奖励伤害）
    BATTLE.bossCorrectCount++;
    BATTLE.bossHp -= 10;
    BATTLE.totalDamageDealt += 10;
    resultEl.className = 'bq-result bq-correct';
    resultEl.innerHTML = `✅ 正确！Boss掉了10点HP！<br>「${opt.word}」加入你的手牌！`;

    // 创建奖励牌（从词汇表补全数据）
    const vocabWord = DATA.words.find(w =>
      w.word.toLowerCase() === question.correctWord.word.toLowerCase() &&
      w.element === question.correctWord.element
    );
    const rewardCard = {
      word: question.correctWord.word,
      cn: question.correctWord.cn,
      element: question.correctWord.element,
      pos: question.correctWord.pos,
      sentence: (vocabWord && vocabWord.sentence) || question.correctWord.sentence || '',
      source: 'reward',
    };
    BATTLE.handCards.push(rewardCard);
    updateHpBars();

    // 检查Boss是否归零
    if (BATTLE.bossHp <= 0) {
      BATTLE.bossHp = 0;
      updateHpBars();
      transitionMsg(`🎉 Boss ${BATTLE.boss.name} 被击败了！`, '查看结果', () => endBattle(true));
      return;
    }
  } else {
    // 玩家掉血（受防御影响）
    const pLevel = getLevel(loadXp());
    const pStats = getPlayerStats(pLevel);
    const bossAtk = BATTLE.boss.atk || 20;
    const isBerserkDouble = BATTLE.roundCount > 5 && BATTLE.berserkSubRound === 1;
    const dmgMult = isBerserkDouble ? 2 : 1;
    const rawDmg = Math.round(bossAtk * (10 / (10 + pStats.def)) * dmgMult);
    BATTLE.playerHp -= rawDmg;
    resultEl.className = 'bq-result bq-wrong';
    const berserkLabel = isBerserkDouble ? '（狂暴双倍伤害！）' : '';
    resultEl.innerHTML = `❌ 答错了！你掉了${rawDmg}点HP！${berserkLabel}<br>正确答案是「${question.options.find(o => o.isCorrect).word}」`;
    updateHpBars();

    if (BATTLE.playerHp <= 0) {
      BATTLE.playerHp = 0;
      updateHpBars();
      transitionMsg(`💔 你被 ${BATTLE.boss.name} 击败了...`, '查看结果', () => endBattle(false));
      return;
    }
  }

  // 继续（狂暴模式下可能进行第二击）
  document.getElementById('bq-next-btn').onclick = () => {
    document.getElementById('bq-next-btn').style.display = 'none';
    const isBerserk = BATTLE.roundCount > 5;
    if (isBerserk && BATTLE.berserkSubRound === 0) {
      BATTLE.berserkSubRound = 1;
      bossTurn();
    } else {
      BATTLE.berserkSubRound = 0;
      showPhase('b-player-turn');
      playerTurn();
    }
  };
  document.getElementById('bq-next-btn').style.display = 'inline-block';
}

/* ========== 过渡信息 ========== */
function transitionMsg(message, btnText, callback) {
  showPhase('b-transition');
  document.getElementById('b-round-label').textContent = '';
  document.getElementById('bt-content').innerHTML = message;
  const btn = document.getElementById('bt-next-btn');
  btn.textContent = btnText;
  btn.style.display = 'inline-block';
  btn.onclick = callback;
}

/* ========== 玩家回合 ========== */
function playerTurn() {
  BATTLE.phase = 'player';
  BATTLE.selectedIndices = [];

  // 空手牌检测
  const available = getAvailableHandCards();
  if (available.length === 0) {
    transitionMsg('💔 手牌已空，无法继续战斗...', '查看结果', () => endBattle(false));
    return;
  }

  document.getElementById('b-round-label').textContent = `⚔️ 你的回合！`;

  showPhase('b-player-turn');
  renderHandCards();
  bpRenderSentence();
  updateBpAttackBtn();
  document.getElementById('bp-error-msg').textContent = '';
}

function renderHandCards() {
  const container = document.getElementById('b-hand-cards');
  const empty = document.getElementById('b-hand-empty');
  const count = document.getElementById('b-hand-count');

  const available = getAvailableHandCards();
  count.textContent = `${available.length}张`;

  if (available.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  container.innerHTML = '';
  for (let i = 0; i < BATTLE.handCards.length; i++) {
    if (BATTLE.consumedSet.has(i)) continue;
    const card = BATTLE.handCards[i];
    const elInfo = DATA.getElementInfo(card.element);
    const selected = BATTLE.selectedIndices.includes(i);

    const div = document.createElement('div');
    div.className = `hand-card ${elInfo ? elInfo.cls : ''} ${selected ? 'hand-selected' : ''}`;
    div.dataset.index = i;
    div.innerHTML = `
      <span class="hc-word">${card.word}</span>
      <span class="hc-cn">${card.cn}</span>
      <span class="hc-pos">${DATA.POS_LABELS[card.pos] || card.pos}</span>
    `;
    div.addEventListener('click', () => bpToggleCard(i));
    container.appendChild(div);
  }
}

function getAvailableHandCards() {
  return BATTLE.handCards.filter((_, i) => !BATTLE.consumedSet.has(i));
}

function bpToggleCard(index) {
  if (BATTLE.consumedSet.has(index)) return;
  const idx = BATTLE.selectedIndices.indexOf(index);
  if (idx >= 0) {
    BATTLE.selectedIndices.splice(idx, 1);
  } else {
    if (BATTLE.selectedIndices.length >= 8) return;
    BATTLE.selectedIndices.push(index);
  }
  renderHandCards();
  bpRenderSentence();
  updateBpAttackBtn();
}

function bpRenderSentence() {
  const display = document.getElementById('bp-sentence-display');
  if (BATTLE.selectedIndices.length === 0) {
    display.innerHTML = '<span class="sentence-placeholder">点击手牌中的单词排列</span>';
    return;
  }
  display.innerHTML = '';
  for (const idx of BATTLE.selectedIndices) {
    const card = BATTLE.handCards[idx];
    const token = document.createElement('span');
    token.className = 'word-token';
    token.textContent = card.word;
    token.addEventListener('click', () => {
      const pos = BATTLE.selectedIndices.indexOf(idx);
      if (pos >= 0) BATTLE.selectedIndices.splice(pos, 1);
      renderHandCards();
      bpRenderSentence();
      updateBpAttackBtn();
    });
    display.appendChild(token);
  }
}

function updateBpAttackBtn() {
  const btn = document.getElementById('btn-bp-attack');
  btn.disabled = BATTLE.selectedIndices.length < 1;
}

function bpResetSentence() {
  BATTLE.selectedIndices = [];
  renderHandCards();
  bpRenderSentence();
  updateBpAttackBtn();
  document.getElementById('bp-error-msg').textContent = '';
}

/* ========== 语法验证 ========== */
function validateSentence(selectedCards) {
  if (selectedCards.length < 1) return '至少选择1张牌';
  if (selectedCards.length > 8) return '最多选择8张牌';
  if (selectedCards.length === 1) return null; // 单张牌不检查语法

  const hasVerb = selectedCards.some(c => c.pos === 'verb');
  if (!hasVerb) return '句子需要动词';

  // 检查冠词位置
  for (let i = 0; i < selectedCards.length; i++) {
    const c = selectedCards[i];
    if (c.pos === 'art') {
      if (i === selectedCards.length - 1) return `冠词「${c.word}」不能放在句尾`;
      const next = selectedCards[i + 1];
      if (next.pos === 'verb') return `冠词「${c.word}」后面不能直接跟动词`;
    }
  }

  // 检查介词位置
  for (let i = 0; i < selectedCards.length; i++) {
    const c = selectedCards[i];
    if (c.pos === 'prep') {
      if (i === selectedCards.length - 1) return `介词「${c.word}」不能放在句尾`;
      const next = selectedCards[i + 1];
      if (next.pos === 'verb') return `介词「${c.word}」后面不能直接跟动词`;
    }
  }

  return null; // 验证通过
}

/* ========== 计算伤害 ========== */
function calculateDamage(selectedCards, bossElement, playerAtk, bossDef) {
  const n = selectedCards.length;
  let baseDamage = n * playerAtk;

  // 统计五行
  const elementCounts = {};
  let totalElements = 0;
  for (const c of selectedCards) {
    if (c.element) {
      elementCounts[c.element] = (elementCounts[c.element] || 0) + 1;
      totalElements++;
    }
  }

  // 检测全五行
  const presentElements = Object.keys(elementCounts);
  const allElements = DATA.ELEMENTS.map(e => e.name);
  const hasAllFive = allElements.every(el => elementCounts[el] && elementCounts[el] > 0);

  if (hasAllFive) {
    const defMult = 20 / (20 + (bossDef || 0));
    return { damage: Math.max(1, Math.round(baseDamage * 2 * defMult)), multiplier: 2.0, dominantElement: '全五行', description: '全五行·威力翻倍！' };
  }

  // 找最多
  let maxCount = 0;
  let dominantElement = null;
  for (const [el, count] of Object.entries(elementCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantElement = el;
    }
  }

  // 检查是否有多个并列最多
  const tiedElements = Object.entries(elementCounts).filter(([_, c]) => c === maxCount);
  const isTie = tiedElements.length > 1;

  if (isTie && presentElements.length < allElements.length) {
    // 平局且不全五行 → 随机 0.7-1.3
    const randomMultiplier = Math.round((0.7 + Math.random() * 0.6) * 10) / 10;
    const defMult = 20 / (20 + (bossDef || 0));
    return { damage: Math.max(1, Math.round(baseDamage * randomMultiplier * defMult)), multiplier: randomMultiplier, dominantElement: '随机', description: `五行持平·随机系数×${randomMultiplier}` };
  }

  // 确定综合五行
  const domEl = dominantElement || allElements[0];

  // 双向查询生克关系
  const domRel = BATTLE.ELEMENT_RELATIONS[domEl];       // domEl 克谁
  const bossRel = BATTLE.ELEMENT_RELATIONS[bossElement];  // boss 克谁
  let multiplier = 1.0;
  let description = '';

  if (domEl === bossElement) {
    multiplier = 1.0;
    description = `同属性·持平 (×1.0)`;
  } else if (domRel && domRel.ke === bossElement) {
    // domEl 克 boss → 水克火
    multiplier = 1.5;
    description = `${domEl}克${bossElement}·优势 (×1.5)`;
  } else if (bossRel && bossRel.ke === domEl) {
    // boss 克 domEl → 火克金
    multiplier = 0.5;
    description = `${bossElement}克${domEl}·劣势 (×0.5)`;
  } else if (DATA.SHENG[bossElement] === domEl) {
    // boss 生 domEl → 火生土：借用boss能量
    multiplier = 1.2;
    description = `${bossElement}生${domEl}·借力 (×1.2)`;
  } else if (DATA.SHENG[domEl] === bossElement) {
    // domEl 生 boss → 木生火：能量喂给boss
    multiplier = 0.8;
    description = `${domEl}生${bossElement}·减效 (×0.8)`;
  } else {
    multiplier = 1.0;
    description = `持平 (×1.0)`;
  }

  // Boss防御减免
  const defMultiplier = 20 / (20 + (bossDef || 0));
  const finalDamage = Math.round(baseDamage * multiplier * defMultiplier);
  return { damage: Math.max(1, finalDamage), multiplier, dominantElement: domEl, description };
}

/* ========== 玩家攻击 ========== */
function bpAttack() {
  const selectedCards = BATTLE.selectedIndices.map(i => BATTLE.handCards[i]);

  // 语法验证
  const error = validateSentence(selectedCards);
  if (error) {
    document.getElementById('bp-error-msg').textContent = `❌ ${error}`;
    return;
  }
  document.getElementById('bp-error-msg').textContent = '';

  // 计算伤害（使用玩家火属性作为攻击力）
  const pLevel = getLevel(loadXp());
  const pStats = getPlayerStats(pLevel);
  const result = calculateDamage(selectedCards, BATTLE.boss.element, pStats.atk, BATTLE.boss.def);
  BATTLE.bossHp = Math.max(0, BATTLE.bossHp - result.damage);
  BATTLE.totalDamageDealt += result.damage;

  // 消耗卡牌
  for (const idx of BATTLE.selectedIndices) {
    BATTLE.consumedSet.add(idx);
  }

  updateHpBars();

  // 显示过渡
  const defRatio = BATTLE.boss.def > 0 ? ` × 20/(20+${BATTLE.boss.def})` : '';
  const formulaDetail = `${selectedCards.length}张 × ${pStats.atk} × ${result.multiplier}${defRatio}`;
  const message = `
    <div style="font-weight:700;font-size:20px">${result.description}</div>
    <span class="bt-damage">-${result.damage} HP</span>
    <div style="font-size:13px;color:#888">${formulaDetail} = ${result.damage}</div>
    <div>你的句子：「${selectedCards.map(c => c.word).join(' ')}」</div>
  `;

  if (BATTLE.bossHp <= 0) {
    BATTLE.bossHp = 0;
    updateHpBars();
    transitionMsg(`🎉 ${message}`, '查看结果', () => endBattle(true));
    return;
  }

  // 检查是否还有可用手牌
  const remaining = getAvailableHandCards();
  if (remaining.length === 0) {
    transitionMsg(message + `<br><br>💔 手牌用完了！`, '查看结果', () => endBattle(false));
    return;
  }

  const nextAction = () => {
    BATTLE.selectedIndices = [];
    bossTurn();
  };

  document.getElementById('bt-content').innerHTML = message;
  showPhase('b-transition');
  document.getElementById('b-round-label').textContent = '';
  document.getElementById('bt-next-btn').textContent = '继续 → Boss回合';
  document.getElementById('bt-next-btn').style.display = 'inline-block';
  document.getElementById('bt-next-btn').onclick = nextAction;
}

/* ========== 战斗结算 ========== */
function endBattle(win) {
  BATTLE.phase = 'end';
  const boss = BATTLE.boss;
  const elInfo = DATA.getElementInfo(boss.element);
  showScreen('screen-battle-result');

  document.getElementById('br-icon').textContent = win ? '🎉' : '💔';
  document.getElementById('br-title').textContent = win ? `胜利！击败了${boss.name}！` : `被 ${boss.name} 击败了...`;
  document.getElementById('br-boss-defeated').textContent = win ? `${boss.icon} ${boss.name} · ${boss.element}属性 · 已被击败` : `${boss.icon} ${boss.name} · 下次再来吧`;

  document.getElementById('br-rounds').textContent = BATTLE.roundCount;
  document.getElementById('br-correct').textContent = BATTLE.bossCorrectCount;
  document.getElementById('br-damage').textContent = BATTLE.totalDamageDealt;

  // 未消耗的手牌退回背包
  returnUnusedCards();

  // 奖励
  const rewardArea = document.getElementById('br-reward-area');
  rewardArea.innerHTML = '';

  if (win) {
    // ==== 保底奖励：3张同五行卡 + 经验（受智慧加成） ====
    const bossEl = boss.element;
    const pLevel = getLevel(loadXp());
    const pStats = getPlayerStats(pLevel);
    const xpReward = Math.round(30 * (1 + (pStats.water - 10) * 0.01));

    const rewardCards = DATA.selectRandomCardsByElement(bossEl, 3);
    const bp = loadBackpack();
    const maxCap = getMaxBackpackCapacity(pLevel);

    for (const w of rewardCards) {
      if (bp.length >= maxCap) break;
      bp.push({
        word: w.word, cn: w.cn, element: w.element,
        pos: w.pos || '', sentence: w.sentence || '',
        date: new Date().toISOString().slice(0, 10),
      });
    }

    // ==== 独立概率奖励（受幸运加成） ====
    const lukMult = 1 + (pStats.luk - 10) * 0.01;
    const extraRewards = [];

    // 50% → 额外一张同属性卡
    if (Math.random() < 0.5 * lukMult) {
      const extra = DATA.selectRandomCardsByElement(bossEl, 1);
      if (extra.length > 0 && bp.length < maxCap) {
        bp.push({
          word: extra[0].word, cn: extra[0].cn, element: extra[0].element,
          pos: extra[0].pos || '', sentence: extra[0].sentence || '',
          date: new Date().toISOString().slice(0, 10),
        });
        extraRewards.push(`🎴 额外 ${bossEl} 属性卡「${extra[0].word}」`);
      }
    }

    // 30% → 属性提升道具（同Boss五行）
    if (Math.random() < 0.3 * lukMult) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'boost',
        element: bossEl, date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`✨ ${bossEl}属性提升道具`);
    }

    // 10% → 空白单词卡
    if (Math.random() < 0.1 * lukMult) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'blank_card',
        date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`🃏 空白单词卡`);
    }

    // 2% → 全属性提升道具
    if (Math.random() < 0.02 * lukMult) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'all_boost',
        date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`🌟 全属性提升道具`);
    }

    saveBackpack(bp);
    addXp(xpReward);

    // 构建显示
    const cardsHtml = rewardCards.map(w => {
      const elInfo = DATA.getElementInfo(w.element);
      return `<div style="background:${elInfo.bg};border-radius:10px;padding:12px 14px;text-align:center;min-width:80px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:20px;font-weight:800;color:${elInfo.color}">${w.word}</div>
        <div style="font-size:12px;color:#888">${w.cn}</div>
      </div>`;
    }).join('');

    let extraHtml = '';
    if (extraRewards.length > 0) {
      extraHtml = `<div style="margin-top:8px;font-size:14px;color:#e65100;font-weight:600">🎲 额外掉落：${extraRewards.join('、')}</div>`;
    }

    rewardArea.innerHTML = `
      <p style="font-weight:700;margin-bottom:8px">🎁 获得 ${rewardCards.length} 张 ${bossEl} 属性卡 +${xpReward}XP</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${cardsHtml}</div>
      ${extraHtml}
    `;
  } else {
    // 失败：15 XP
    addXp(15);
    rewardArea.innerHTML = `<p style="color:var(--text-light)">💪 +15 XP · 下次一定能赢！</p>`;
  }
}

function returnUnusedCards() {
  const bp = loadBackpack();

  // 收集要移除的背包索引（消耗掉的 equip 卡）
  const toRemove = new Set();
  for (let i = 0; i < BATTLE.handCards.length; i++) {
    const card = BATTLE.handCards[i];
    if (card.source === 'equip' && BATTLE.consumedSet.has(i)) {
      toRemove.add(card.bpIndex);
    }
  }

  // 从大到小排序移除（避免索引偏移）
  const sorted = [...toRemove].sort((a, b) => b - a);
  for (const idx of sorted) {
    if (idx >= 0 && idx < bp.length) bp.splice(idx, 1);
  }

  saveBackpack(bp);
}

/* ========== 初始化 ========== */
const SPEAKER = SPEECH; // alias for readability

document.addEventListener('DOMContentLoaded', async () => {
  // 预填上次登录的用户名
  const savedUser = localStorage.getItem('wuxing_user');
  if (savedUser) {
    const nameInput = document.getElementById('login-name');
    if (nameInput) nameInput.value = savedUser;
  }
  showScreen('screen-login');

  // Preload voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
