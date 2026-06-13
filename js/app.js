/**
 * 五行英语牌 — 主应用逻辑
 * 管理屏幕切换、游戏状态、UI 交互。
 */

/* ========== 头像系统 ========== */
const AVATARS_NORMAL = Array.from({length: 31}, (_, i) => ({
  id: `avatar${i + 1}`,
  label: `头像${i + 1}`,
}));
const AVATARS_SPECIAL = Array.from({length: 28}, (_, i) => ({
  id: `special${i + 1}`,
  label: `特殊头像${i + 1}`,
}));

/* ========== 成就定义 ========== */
const ACHIEVEMENTS = [
  { id:'first_boss_win',    name:'初战告捷',     desc:'第一次击败Boss',          icon:'🏆', titleUnlock:'初战告捷' },
  { id:'spell_10_words',    name:'拼词小能手',   desc:'累计拼对10个单词',        icon:'✍️' },
  { id:'spell_50_words',    name:'拼词达人',     desc:'累计拼对50个单词',        icon:'✍️' },
  { id:'spell_200_words',   name:'拼词高手',     desc:'累计拼对200个单词',       icon:'✍️' },
  { id:'all_elements_10',   name:'五行调和',     desc:'五行永久加成各达10',      icon:'⚖️' },
  { id:'collect_500',       name:'收藏家',       desc:'累计收集500张单词卡',     icon:'📚' },
  { id:'element_master',    name:'五行大师',     desc:'各五行收集率均达50%',     icon:'🌟' },
  { id:'no_damage_win',     name:'完美防御·初',  desc:'无伤击败Boss 1次',       icon:'🛡️', titleUnlock:'完美防御' },
  { id:'no_damage_win_10',  name:'完美防御·极',  desc:'无伤击败Boss 10次',      icon:'🛡️' },
  { id:'no_damage_win_30',  name:'完美防御·臻',  desc:'无伤击败Boss 30次',      icon:'🛡️' },
  { id:'lv10',              name:'初出茅庐',     desc:'达到10级',               icon:'⭐', titleUnlock:'初出茅庐' },
  { id:'lv20',              name:'小有所成',     desc:'达到20级',               icon:'⭐' },
  { id:'boss_10_wins',      name:'常胜将军',     desc:'累计击败Boss 10次',       icon:'⚔️' },
  { id:'boss_50_wins',      name:'不败传奇',     desc:'累计击败Boss 50次',       icon:'⚔️', titleUnlock:'不败传奇' },
  { id:'use_10_items',      name:'道具达人',     desc:'累计使用10个道具',        icon:'🧰' },
];

/* ========== 头像框定义 ========== */
/*
 * 头像框定义
 * anim: none | glow | dynamic | rainbow | rainbow-dynamic
 * condition.type: level | bossKills | allFive
 */
const AVATAR_FRAMES = [
  { id:'', label:'无', anim:'none', condition:null },
  // ★ 五行·初（击杀5次）
  { id:'frame-wood-1', label:'木·初', anim:'none', condition:{type:'bossKills',element:'木',value:5} },
  { id:'frame-fire-1', label:'火·初', anim:'none', condition:{type:'bossKills',element:'火',value:5} },
  { id:'frame-metal-1', label:'金·初', anim:'none', condition:{type:'bossKills',element:'金',value:5} },
  { id:'frame-water-1', label:'水·初', anim:'none', condition:{type:'bossKills',element:'水',value:5} },
  { id:'frame-earth-1', label:'土·初', anim:'none', condition:{type:'bossKills',element:'土',value:5} },
  // ★ 五行·极（击杀20次）
  { id:'frame-wood-2', label:'木·极', anim:'glow', condition:{type:'bossKills',element:'木',value:20} },
  { id:'frame-fire-2', label:'火·极', anim:'glow', condition:{type:'bossKills',element:'火',value:20} },
  { id:'frame-metal-2', label:'金·极', anim:'glow', condition:{type:'bossKills',element:'金',value:20} },
  { id:'frame-water-2', label:'水·极', anim:'glow', condition:{type:'bossKills',element:'水',value:20} },
  { id:'frame-earth-2', label:'土·极', anim:'glow', condition:{type:'bossKills',element:'土',value:20} },
  // ★ 五行·臻（击杀50次，动态特效）
  { id:'frame-wood-3', label:'木·臻', anim:'dynamic', condition:{type:'bossKills',element:'木',value:50} },
  { id:'frame-fire-3', label:'火·臻', anim:'dynamic', condition:{type:'bossKills',element:'火',value:50} },
  { id:'frame-metal-3', label:'金·臻', anim:'dynamic', condition:{type:'bossKills',element:'金',value:50} },
  { id:'frame-water-3', label:'水·臻', anim:'dynamic', condition:{type:'bossKills',element:'水',value:50} },
  { id:'frame-earth-3', label:'土·臻', anim:'dynamic', condition:{type:'bossKills',element:'土',value:50} },
  // ★ 五彩系列（全五行攻击次数解锁）
  { id:'frame-rainbow-1', label:'彩·初', anim:'none', condition:{type:'allFive',value:5} },
  { id:'frame-rainbow-2', label:'彩·绚', anim:'glow', condition:{type:'allFive',value:20} },
  { id:'frame-rainbow-3', label:'彩·幻', anim:'rainbow-dynamic', condition:{type:'allFive',value:50} },
  // ★ 紫色系
  { id:'frame-purple-1', label:'紫·初', anim:'none', condition:{type:'bossWins',value:1} },
  { id:'frame-purple-2', label:'紫·极', anim:'glow', condition:{type:'bossWins',value:10} },
  { id:'frame-purple-3', label:'紫·臻', anim:'dynamic', condition:{type:'bossWins',value:50} },
  // ★ 粉色系
  { id:'frame-pink-1', label:'粉·初', anim:'none', condition:{type:'wordsSpelled',value:10} },
  { id:'frame-pink-2', label:'粉·极', anim:'glow', condition:{type:'wordsSpelled',value:50} },
  { id:'frame-pink-3', label:'粉·臻', anim:'dynamic', condition:{type:'wordsSpelled',value:200} },
  // ★ 橙色系（待定奖励）
  { id:'frame-orange-1', label:'橙·初', anim:'none', condition:null },
  { id:'frame-orange-2', label:'橙·极', anim:'glow', condition:null },
  { id:'frame-orange-3', label:'橙·臻', anim:'dynamic', condition:null },
  // ★ 黑色系
  { id:'frame-black-1', label:'黑·初', anim:'none', condition:{type:'perfectWins',value:1} },
  { id:'frame-black-2', label:'黑·极', anim:'glow', condition:{type:'perfectWins',value:10} },
  { id:'frame-black-3', label:'黑·臻', anim:'dynamic', condition:{type:'perfectWins',value:30} },
];

/** 获取头像图片路径 */
function getAvatarUrl(id) {
  if (!id) return '';
  if (id.startsWith('special')) return `img/avatars-special/avatars-${id}.jpg`;
  return `img/avatars/avatars${id.replace('avatar', '')}.jpg`;
}

/** 获取头像标签 */
function getAvatarLabel(id) {
  const all = [...AVATARS_NORMAL, ...AVATARS_SPECIAL];
  const found = all.find(a => a.id === id);
  return found ? found.label : '未选择';
}

/** 获取已解锁的特殊头像 ID 集合（通过 avatar_unlock 道具） */
function getUnlockedSpecials() {
  const items = loadItems();
  const unlocked = new Set();
  for (const item of items) {
    if (item.itemType === 'avatar_unlock' && item.specialId) {
      unlocked.add(item.specialId);
    }
  }
  return unlocked;
}

/* ========== 更换头像 ========== */
let _changeAvatarSelectedId = '';
let _caTab = 'normal';

function showChangeAvatarScreen() {
  _changeAvatarSelectedId = '';
  _caTab = 'normal';
  document.getElementById('btn-change-avatar-confirm').disabled = true;
  document.getElementById('change-avatar-error').textContent = '';
  document.getElementById('ca-hint').textContent = '点击选择头像';
  switchAvatarTab('normal');
  showScreen('screen-change-avatar');
}

function switchAvatarTab(tab) {
  _caTab = tab;
  _changeAvatarSelectedId = '';
  document.getElementById('btn-change-avatar-confirm').disabled = true;
  document.getElementById('change-avatar-error').textContent = '';
  document.querySelectorAll('.ca-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

  const unlocked = getUnlockedSpecials();
  const unlockCount = unlocked.size;
  document.getElementById('ca-unlock-info').textContent = `🔓 ${unlockCount}/${AVATARS_SPECIAL.length}`;

  const grid = document.getElementById('change-avatar-grid');
  grid.innerHTML = '';

  if (tab === 'normal') {
    document.getElementById('ca-hint').textContent = '点击选择头像（普通头像全部可用）';
    for (const av of AVATARS_NORMAL) {
      const el = createAvatarCard(av.id, av.label, true);
      grid.appendChild(el);
    }
  } else {
    document.getElementById('ca-hint').textContent = unlocked.size > 0 ? '点击选择已解锁的特殊头像' : '尚未解锁任何特殊头像，挑战Boss有概率获得！';
    for (const av of AVATARS_SPECIAL) {
      const unlockedFlag = unlocked.has(av.id);
      const el = createAvatarCard(av.id, av.label, unlockedFlag);
      if (unlockedFlag) {
        el.addEventListener('click', () => selectChangeAvatar(av.id));
      }
      grid.appendChild(el);
    }
  }
}

function createAvatarCard(id, label, unlocked) {
  const el = document.createElement('div');
  el.className = 'avatar-card' + (unlocked ? '' : ' avatar-locked');
  el.dataset.id = id;
  el.innerHTML = `
    <div class="avatar-img-wrap">
      <img src="${getAvatarUrl(id)}" alt="${label}" class="avatar-thumb">
      ${unlocked ? '' : '<span class="avatar-lock-badge">🔒</span>'}
    </div>
    <span class="avatar-label">${label}</span>
    ${unlocked ? '' : '<span class="avatar-desc">未解锁</span>'}
  `;
  if (unlocked) {
    el.addEventListener('click', () => selectChangeAvatar(id));
  }
  return el;
}

function selectChangeAvatar(id) {
  _changeAvatarSelectedId = id;
  document.querySelectorAll('#change-avatar-grid .avatar-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`#change-avatar-grid .avatar-card[data-id="${id}"]`)?.classList.add('selected');
  document.getElementById('btn-change-avatar-confirm').disabled = false;
  document.getElementById('change-avatar-error').textContent = '';
}

async function confirmChangeAvatar() {
  if (!_changeAvatarSelectedId) return;
  try {
    await updateUserProfile(_changeAvatarSelectedId, USER_CACHE.element);
    showToast('✅ 头像已更换');
    showProfile();
  } catch (e) {
    document.getElementById('change-avatar-error').textContent = '保存失败，请重试';
  }
}

/* ========== 头像框选择 ========== */
let _frameSortMode = 'all'; // all | unlocked

function showFrameSelect() {
  // 先检测新解锁
  checkNewFrameUnlocks();
  const grid = document.getElementById('frame-grid');
  grid.innerHTML = '';
  const unlocked = getUnlockedFrames();
  const current = USER_CACHE.avatarFrame || '';

  for (const f of AVATAR_FRAMES) {
    const isUnlocked = !f.condition || unlocked.has(f.id);
    const isActive = f.id === current;
    const progress = f.condition ? getFrameProgress(f) : null;
    const pct = progress && progress.target > 0 ? Math.min(100, Math.round(progress.current / progress.target * 100)) : 100;

    const card = document.createElement('div');
    card.className = 'frame-card' + (isActive ? ' frame-active' : '') + (isUnlocked ? '' : ' frame-locked');

    // 确定五行元素色
    const frameEl = getFrameElement(f.id);
    const elInfo = frameEl ? DATA.getElementInfo(frameEl) : null;

    card.innerHTML = `
      <div class="frame-preview">
        <div class="frame-avatar-mock${isUnlocked && f.anim !== 'none' ? ' frame-anim-' + f.anim : ''}${f.id ? ' frame-el-' + f.id.replace('frame-', '') : ''}">
          <div class="frame-avatar-inner">👤</div>
        </div>
      </div>
      <div class="frame-label">${f.label}</div>
      ${!isUnlocked && progress ? `<div class="frame-progress"><div class="frame-progress-bar"><div class="frame-progress-fill" style="width:${pct}%"></div></div><span class="frame-progress-text">${progress.current}/${progress.target}</span></div>` : ''}
      <div class="frame-status">${isActive ? '✅ 佩戴中' : isUnlocked ? '点击佩戴' : '🔒'}</div>
    `;
    card.addEventListener('click', () => {
      if (!isUnlocked) { showToast('🔒 未解锁'); return; }
      setAvatarFrame(f.id);
      showFrameSelect(); // 刷新
    });
    grid.appendChild(card);
  }
  showScreen('screen-frame-select');
}

/* ========== 注册-选头像 ========== */
let _selectedAvatar = '';

function showRegAvatarScreen() {
  _selectedAvatar = '';
  document.getElementById('avatar-error').textContent = '';
  document.getElementById('btn-avatar-confirm').disabled = true;

  const grid = document.getElementById('avatar-grid');
  grid.innerHTML = '';

  for (const av of AVATARS_NORMAL) {
    const el = document.createElement('div');
    el.className = 'avatar-card';
    el.dataset.id = av.id;
    el.innerHTML = `
      <div class="avatar-img-wrap">
        <img src="${getAvatarUrl(av.id)}" alt="${av.label}" class="avatar-thumb">
      </div>
      <span class="avatar-label">${av.label}</span>
    `;
    el.addEventListener('click', () => selectAvatar(av.id));
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
let _changingElement = false;  // true=使用洗髓丹重选五行，false=注册流程

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
    if (_changingElement) {
      // 洗髓丹重选五行
      await updateUserProfile(USER_CACHE.avatar, _selectedElement);
      _changingElement = false;
      showToast(`✅ 本命五行已变更为「${_selectedElement}」`);
      showProfile();
    } else {
      // 注册流程
      await updateUserProfile(_selectedAvatar, _selectedElement);
      goHomeAfterLogin();
    }
  } catch (e) {
    document.getElementById('element-error').textContent = '保存失败，请重试';
  }
}

/** 五行洗髓丹：打开重选五行界面 */
function showChangeElementScreen() {
  _changingElement = true;
  showRegElementScreen();

  // 改写UI适配重选场景
  const backBtn = document.querySelector('#screen-reg-element .back-btn');
  if (backBtn) backBtn.onclick = () => { _changingElement = false; goHome(); };

  document.querySelector('#screen-reg-element h2').textContent = '重新选择本命五行';
  document.getElementById('btn-element-confirm').textContent = '确认更改';
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
  /** 测验统计 */
  quizCorrect: 0,
  quizTotal: 0,
  _quizAnswered: false,
  /** 测验排程：哪些词位(index)触发测验 */
  quizSchedule: [],
  _quizzedWords: null,
};

/* ========== 道具增益状态 ========== */
const BOOST_STATE = {
  xpBoostEndTime: 0,
  luckyCharmActive: false,
};

function initBoostState() {
  BOOST_STATE.xpBoostEndTime = loadLocal('xpBoostEnd', 0);
}
function isXpBoostActive() {
  return Date.now() < BOOST_STATE.xpBoostEndTime;
}
function getXpBoostRemaining() {
  return Math.max(0, Math.ceil((BOOST_STATE.xpBoostEndTime - Date.now()) / 1000));
}

/* ========== 成就系统 ========== */
const ACH_STATS_KEY = 'achStats';

function loadAchStats() {
  return loadLocal(ACH_STATS_KEY, { bossWins:0, bossPerfectWins:0, wordsSpelled:0, itemsUsed:0, totalCardsCollected:0 });
}
function saveAchStats(s) { saveLocal(ACH_STATS_KEY, s); }

function checkAchievements(context) {
  const stats = loadAchStats();
  const bonus = loadBonus();
  const bp = loadBackpack();
  stats.bonus = bonus;
  // element completion
  const completion = {};
  for (const el of ['火','水','木','金','土']) {
    const total = (DATA.byElement[el] || []).length;
    const owned = new Set(bp.filter(c => c.element === el).map(c => c.word)).size;
    completion[el] = total > 0 ? Math.round(owned / total * 100) : 0;
  }
  stats.elementCompletion = completion;
  stats.totalCardsCollected = bp.length;
  stats.level = getLevel(loadXp());

  let newAchievement = null;
  for (const ach of ACHIEVEMENTS) {
    const existing = (USER_CACHE.achievements || []).find(a => a.id === ach.id);
    if (existing && existing.status === 'completed') continue;
    let met = false;
    switch (ach.id) {
      case 'first_boss_win': met = stats.bossWins >= 1; break;
      case 'spell_10_words': met = stats.wordsSpelled >= 10; break;
      case 'spell_50_words': met = stats.wordsSpelled >= 50; break;
      case 'spell_200_words': met = stats.wordsSpelled >= 200; break;
      case 'all_elements_10': met = bonus.wood>=10 && bonus.fire>=10 && bonus.earth>=10 && bonus.water>=10 && bonus.metal>=10; break;
      case 'collect_500': met = bp.length >= 500; break;
      case 'element_master': met = Object.values(completion).every(v => v >= 50); break;
      case 'no_damage_win': met = stats.bossPerfectWins >= 1; break;
      case 'no_damage_win_10': met = stats.bossPerfectWins >= 10; break;
      case 'no_damage_win_30': met = stats.bossPerfectWins >= 30; break;
      case 'lv10': met = stats.level >= 10; break;
      case 'lv20': met = stats.level >= 20; break;
      case 'boss_10_wins': met = stats.bossWins >= 10; break;
      case 'boss_50_wins': met = stats.bossWins >= 50; break;
      case 'use_10_items': met = stats.itemsUsed >= 10; break;
    }
    if (met) {
      if (!existing) {
        if (!USER_CACHE.achievements) USER_CACHE.achievements = [];
        USER_CACHE.achievements.push({ id: ach.id, status: 'completed' });
        newAchievement = ach;
      } else if (existing.status === 'locked') {
        existing.status = 'completed';
        newAchievement = ach;
      }
    }
  }
  if (newAchievement) {
    showAchievementUnlock(newAchievement);
  }
  saveAchStats(stats);
  syncToSupabase();
}

function showAchievementUnlock(ach) {
  // 自动赋予称号（仅第一个称号自动装备）
  if (ach.titleUnlock && !USER_CACHE.title) {
    USER_CACHE.title = ach.titleUnlock;
    syncToSupabase();
  }
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:30%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#ffd700,#ff8f00);color:#fff;padding:20px 40px;border-radius:20px;z-index:200;text-align:center;animation:popIn 0.3s;box-shadow:0 8px 30px rgba(0,0,0,0.3)';
  el.innerHTML = `
    <div style="font-size:48px;margin-bottom:8px">${ach.icon}</div>
    <div style="font-size:20px;font-weight:800">成就解锁！</div>
    <div style="font-size:16px;margin-top:4px">${ach.name}</div>
    <div style="font-size:13px;opacity:0.9;margin-top:2px">${ach.desc}</div>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

async function showAchievements() {
  await DATA.load();
  const container = document.getElementById('ach-list');
  const arr = ACHIEVEMENTS;
  container.innerHTML = '';
  const completed = (USER_CACHE.achievements || []).filter(a => a.status === 'completed').length;
  const statsEl = document.getElementById('ach-stats');
  if (statsEl) statsEl.textContent = `🏅 已解锁 ${completed}/${arr.length}`;

  // 统计进度数据
  const stats = loadAchStats();
  const bonus = loadBonus();
  const bp = loadBackpack();
  const level = getLevel(loadXp());
  const completion = {};
  for (const el of ['火','水','木','金','土']) {
    const total = (DATA.byElement[el] || []).length;
    const owned = new Set(bp.filter(c => c.element === el).map(c => c.word)).size;
    completion[el] = total > 0 ? Math.round(owned / total * 100) : 0;
  }

  for (const ach of arr) {
    const state = (USER_CACHE.achievements || []).find(a => a.id === ach.id);
    const status = state ? state.status : 'locked';

    let progressStr = '';
    switch (ach.id) {
      case 'first_boss_win': progressStr = `${stats.bossWins}/1`; break;
      case 'spell_10_words': progressStr = `${stats.wordsSpelled}/10`; break;
      case 'spell_50_words': progressStr = `${stats.wordsSpelled}/50`; break;
      case 'spell_200_words': progressStr = `${stats.wordsSpelled}/200`; break;
      case 'all_elements_10': {
        const m = Math.min(bonus.wood||0, bonus.fire||0, bonus.earth||0, bonus.water||0, bonus.metal||0);
        progressStr = `${m}/10`; break;
      }
      case 'collect_500': progressStr = `${bp.length}/500`; break;
      case 'element_master': {
        const m = Math.min(...Object.values(completion));
        progressStr = `${m}%/50%`; break;
      }
      case 'no_damage_win': progressStr = `${stats.bossPerfectWins}/1`; break;
      case 'no_damage_win_10': progressStr = `${stats.bossPerfectWins}/10`; break;
      case 'no_damage_win_30': progressStr = `${stats.bossPerfectWins}/30`; break;
      case 'lv10': progressStr = `${level}/10`; break;
      case 'lv20': progressStr = `${level}/20`; break;
      case 'boss_10_wins': progressStr = `${stats.bossWins}/10`; break;
      case 'boss_50_wins': progressStr = `${stats.bossWins}/50`; break;
      case 'use_10_items': progressStr = `${stats.itemsUsed}/10`; break;
    }

    const card = document.createElement('div');
    card.className = `achievement-card achievement-${status}`;
    card.innerHTML = `
      <span class="ach-icon">${ach.icon}</span>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
      </div>
      <div class="ach-progress">${progressStr}</div>
      <span class="ach-status-badge">${status === 'completed' ? '🔓' : '🔒'}</span>
    `;
    container.appendChild(card);
  }
  showScreen('screen-achievements');
}

/* ========== 卡片图鉴 ========== */
async function showCollectionBook() {
  await DATA.load();
  const bp = loadBackpack();
  showScreen('screen-collection');

  // 计算收集信息
  const elemOrder = ['木','火','金','水','土'];
  let totalWords = 0;
  let totalOwned = 0;
  const elemData = {};
  for (const el of elemOrder) {
    const words = DATA.byElement[el] || [];
    const owned = {};
    let elTotal = 0;
    let elOwned = 0;
    const maxQualities = {}; // word -> highest quality
    for (const w of words) {
      const wordKey = w.word.toLowerCase();
      if (!maxQualities[wordKey]) maxQualities[wordKey] = 'common';
      elTotal++;
      // check backpack
      for (const c of bp) {
        if (c.word.toLowerCase() === wordKey && c.element === el) {
          owned[wordKey] = true;
          const qi = QUALITY_ORDER.indexOf(c.quality || 'common');
          const curQi = QUALITY_ORDER.indexOf(maxQualities[wordKey]);
          if (qi > curQi) maxQualities[wordKey] = c.quality || 'common';
          break;
        }
      }
    }
    elOwned = Object.keys(owned).length;
    totalWords += elTotal;
    totalOwned += elOwned;
    elemData[el] = { words, owned: owned, ownCount: elOwned, total: elTotal, maxQualities };
  }

  // 进度
  const pct = totalWords > 0 ? Math.round(totalOwned / totalWords * 100) : 0;
  document.getElementById('collection-progress').innerHTML =
    `<div class="collection-pct">📊 收集进度 ${totalOwned}/${totalWords} (${pct}%)</div>
     <div class="collection-bar"><div class="collection-fill" style="width:${pct}%"></div></div>`;

  // tabs
  const tabsEl = document.getElementById('collection-tabs');
  tabsEl.innerHTML = elemOrder.map(el => {
    const info = DATA.getElementInfo(el);
    const d = elemData[el];
    return `<button class="collection-tab" data-el="${el}" onclick="showCollectionTab('${el}')">
      ${info.icon} ${el} (${d.ownCount}/${d.total})
    </button>`;
  }).join('');

  // 显示第一个tab
  showCollectionTab(elemOrder[0]);
}

function showCollectionTab(element) {
  // tab高亮
  document.querySelectorAll('.collection-tab').forEach(t => t.classList.toggle('active', t.dataset.el === element));

  const bp = loadBackpack();
  const words = DATA.byElement[element] || [];
  const grid = document.getElementById('collection-grid');
  grid.innerHTML = '';

  // 统计各词最高品质
  const maxQualities = {};
  for (const w of words) {
    const wordKey = w.word.toLowerCase();
    maxQualities[wordKey] = 'common';
    for (const c of bp) {
      if (c.word.toLowerCase() === wordKey && c.element === element) {
        const qi = QUALITY_ORDER.indexOf(c.quality || 'common');
        const curQi = QUALITY_ORDER.indexOf(maxQualities[wordKey]);
        if (qi > curQi) maxQualities[wordKey] = c.quality || 'common';
      }
    }
  }

  for (const w of words) {
    const wordKey = w.word.toLowerCase();
    const q = maxQualities[wordKey];
    const owned = q !== 'common' || bp.some(c => c.word.toLowerCase() === wordKey && c.element === element);
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const card = document.createElement('div');
    card.className = 'collection-card' + (owned ? '' : ' collection-locked');
    card.innerHTML = owned
      ? `<div class="collection-word">${w.word}</div>
         <div class="collection-cn">${w.cn}</div>
         <span class="collection-quality" style="background:${qi.color}">${qi.icon}${qi.label}</span>`
      : `<div class="collection-word">?</div>
         <div class="collection-cn">🔒</div>
         <span class="collection-quality" style="background:#999">???</span>`;
    grid.appendChild(card);
  }
}

/* ========== 头像框系统 ========== */
const FRAME_UNLOCK_KEY = 'unlockedFrames';

function getFrameElement(id) {
  if (!id) return null;
  for (const el of ['木','火','金','水','土']) {
    if (id.includes('-wood-') && el === '木') return el;
    if (id.includes('-fire-') && el === '火') return el;
    if (id.includes('-metal-') && el === '金') return el;
    if (id.includes('-water-') && el === '水') return el;
    if (id.includes('-earth-') && el === '土') return el;
  }
  return null;
}

function getUnlockedFrames() {
  return new Set(loadLocal(FRAME_UNLOCK_KEY, []));
}

function isFrameUnlocked(id) {
  if (!id) return true; // '无' always unlocked
  return getUnlockedFrames().has(id);
}

function getFrameProgress(frame) {
  if (!frame.condition) return { current: 0, target: 0 };
  const c = frame.condition;
  if (c.type === 'level') {
    return { current: getLevel(loadXp()), target: c.value };
  } else if (c.type === 'bossKills') {
    return { current: loadLocal('bossKills_' + c.element, 0), target: c.value };
  } else if (c.type === 'allFive') {
    return { current: loadLocal('allFiveAttacks', 0), target: c.value };
  } else if (c.type === 'bossWins') {
    const s = loadLocal('achStats', {});
    return { current: s.bossWins || 0, target: c.value };
  } else if (c.type === 'wordsSpelled') {
    const s = loadLocal('achStats', {});
    return { current: s.wordsSpelled || 0, target: c.value };
  } else if (c.type === 'perfectWins') {
    const s = loadLocal('achStats', {});
    return { current: s.bossPerfectWins || 0, target: c.value };
  }
  return { current: 0, target: 0 };
}

/** 检测所有框的解锁状态，返回新解锁的框列表 */
function checkNewFrameUnlocks() {
  const unlocked = getUnlockedFrames();
  const newly = [];
  for (const f of AVATAR_FRAMES) {
    if (!f.condition || unlocked.has(f.id)) continue;
    const { current, target } = getFrameProgress(f);
    if (current >= target) {
      unlocked.add(f.id);
      newly.push(f);
    }
  }
  if (newly.length > 0) {
    saveLocal(FRAME_UNLOCK_KEY, [...unlocked]);
    for (const f of newly) {
      showToast(`🖼️ 新头像框解锁：${f.label}！可在个人页更换`);
    }
  }
  return newly;
}

/** 兼容旧函数名：主页/profile中调用 */
function checkAvatarFrameUnlocks() {
  return checkNewFrameUnlocks();
}

/** 获取头像框显示名称 */
function getFrameLabel(id) {
  if (!id) return '无';
  const found = AVATAR_FRAMES.find(f => f.id === id);
  return found ? found.label : '无';
}

/** 获取头像框的主色（用于排行榜等简略展示） */
function getFrameColor(id) {
  if (!id) return null;
  const el = getFrameElement(id);
  if (el) {
    const info = DATA.getElementInfo(el);
    if (info) return info.color;
  }
  if (id.includes('rainbow')) return '#ffd700';
  return '#888';
}

/** 测试用：解锁所有头像框 */
function unlockAllFrames() {
  const allIds = AVATAR_FRAMES.map(f => f.id).filter(id => id);
  saveLocal(FRAME_UNLOCK_KEY, allIds);
  showToast('✅ 已解锁全部头像框');
  showFrameSelect();
}

/** 设置当前佩戴的头像框 */
function setAvatarFrame(frameId) {
  USER_CACHE.avatarFrame = frameId;
  syncToSupabase();
  showToast(`🖼️ 已更换头像框`);
}

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

/* 装备槽配置：4个槽位对应4种词性 */
const EQUIP_SLOTS = [
  { pos: 'noun', label: '名词', icon: '📝' },
  { pos: 'verb', label: '动词', icon: '🏃' },
  { pos: 'adj',  label: '形容词', icon: '🎨' },
  { pos: 'pron', label: '代词',   icon: '👤' },
];

/* ========== 卡片品质等级 ========== */
const QUALITY_ORDER = ['common','copper','silver','gold','legendary'];
const CARD_QUALITIES = {
  common:    { label:'普通', coeff:0.01, level:0, icon:'⚪', color:'#9e9e9e' },
  copper:    { label:'铜',   coeff:0.015, level:1, icon:'🟫', color:'#b87333' },
  silver:    { label:'银',   coeff:0.02,  level:2, icon:'⬜', color:'#c0c0c0' },
  gold:      { label:'金',   coeff:0.025, level:3, icon:'🟨', color:'#ffd700' },
  legendary: { label:'传说', coeff:0.03,  level:4, icon:'💎', color:'#ff6f00' },
};

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
  const finalAmount = isXpBoostActive() ? Math.round(amount * 2) : amount;
  const newXp = current + finalAmount;
  saveXp(newXp);
  return newXp;
}

function getLevel(totalXp) {
  if (totalXp <= 0) return 0;
  // 新公式：累计经验 = 15L² + 35L → L = (-35+√(1225+60*XP))/30
  const n = Math.floor((-35 + Math.sqrt(1225 + 60 * totalXp)) / 30);
  return Math.max(0, n);
}

function getXpForLevel(level) {
  // 返回升到该等级的累计总经验：15L² + 35L
  return 15 * level * level + 35 * level;
}

function getXpProgress(totalXp) {
  const level = getLevel(totalXp);
  const current = getXpForLevel(level);
  const next = getXpForLevel(level + 1);
  return { level, xpInLevel: totalXp - current, xpNeeded: next - current };
}

function getStudyXp(attempts, mode, quizCorrect, quizTotal) {
  const totalXp = loadXp();
  const level = getLevel(totalXp);
  let baseXp;

  // 按年级梯度：1-2=基准(原5-6级奖励), 3-4×1.5, 5-6×2.0
  if (mode === 'grade1-2') {
    if (attempts === 1) baseXp = 70;
    else if (attempts === 2) baseXp = 40;
    else if (attempts === 3) baseXp = 20;
    else baseXp = 10;
  } else if (mode === 'grade3-4') {
    if (attempts === 1) baseXp = 105;
    else if (attempts === 2) baseXp = 60;
    else if (attempts === 3) baseXp = 30;
    else baseXp = 15;
  } else {
    if (attempts === 1) baseXp = 140;
    else if (attempts === 2) baseXp = 80;
    else if (attempts === 3) baseXp = 40;
    else baseXp = 20;
  }

  // 等级衰减
  const gradeMax = parseInt(mode.split('-')[1]);
  const decayThreshold = gradeMax * 5;
  const exceed = Math.min(5, Math.max(0, level - decayThreshold));
  const decay = 1 - exceed * 0.1;

  // 智慧（水属性）经验加成
  const pStats = getPlayerStats(level);
  const intBonus = 1 + (pStats.water - 10) * 0.01;

  // 测验准确率乘数: 0.25 + 0.75 × (正确数/总题数)
  const accuracy = quizTotal > 0 ? quizCorrect / quizTotal : 1;
  const quizMultiplier = 0.25 + 0.75 * accuracy;

  return Math.max(1, Math.round(baseXp * decay * intBonus * quizMultiplier));
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

/** 背包容量：基础100，每级+2，额外奖励格 */
function getMaxBackpackCapacity(level) {
  const extra = loadLocal('backpackExtra', 0);
  return 100 + level * 2 + extra;
}
function getBackpackExtra() { return loadLocal('backpackExtra', 0); }
function addBackpackSlot(n) {
  const cur = getBackpackExtra();
  saveLocal('backpackExtra', cur + n);
}

/** 玩家五行属性：等级成长 + 本命初始偏向 + 道具永久加成 + 装备加成 */
function getPlayerStats(level) {
  const bonus = loadBonus();
  const elemName = USER_CACHE.element;
  const base = ELEMENT_STATS[elemName] || { hp: 10, atk: 10, def: 10, spd: 10, cri: 10 };
  let wood = base.hp + level + bonus.wood;
  let fire = base.atk + level + bonus.fire;
  let earth = base.def + level + bonus.earth;
  let water = base.spd + level + bonus.water;
  let metal = base.cri + level + bonus.metal;

  // 装备加成公式：基础值 × Σ(字母数×品质系数) + Σ(字母数×品质等级)
  const equip = loadEquip();
  let pctWood = 0, pctFire = 0, pctEarth = 0, pctWater = 0, pctMetal = 0;
  let flatWood = 0, flatFire = 0, flatEarth = 0, flatWater = 0, flatMetal = 0;
  for (const slot of equip) {
    if (!slot || !slot.element) continue;
    const key = ELEMENT_TO_BONUS[slot.element];
    if (!key) continue;
    const q = slot.quality || 'common';
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const wlen = slot.word ? slot.word.length : 1;
    const pct = wlen * qi.coeff;
    const flat = wlen * qi.level;
    if (key === 'wood') { pctWood += pct; flatWood += flat; }
    else if (key === 'fire') { pctFire += pct; flatFire += flat; }
    else if (key === 'earth') { pctEarth += pct; flatEarth += flat; }
    else if (key === 'water') { pctWater += pct; flatWater += flat; }
    else if (key === 'metal') { pctMetal += pct; flatMetal += flat; }
  }
  wood = Math.round(wood * (1 + pctWood)) + flatWood;
  fire = Math.round(fire * (1 + pctFire)) + flatFire;
  earth = Math.round(earth * (1 + pctEarth)) + flatEarth;
  water = Math.round(water * (1 + pctWater)) + flatWater;
  metal = Math.round(metal * (1 + pctMetal)) + flatMetal;

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
    const avUrl = getAvatarUrl(USER_CACHE.avatar);
    const elemIcon = DATA.getElementInfo(USER_CACHE.element);
    const elemStr = elemIcon ? `${elemIcon.icon}` : '';
    userEl.innerHTML = `${avUrl ? `<img src="${avUrl}" class="user-avatar-mini" onerror="this.outerHTML='👤'">` : '👤'} ${USER_CACHE.username} ${elemStr}`;
  }
  const badge = document.getElementById('home-level-badge');
  if (badge) badge.textContent = `Lv.${level} ${title.icon}`;
  // XP boost indicator
  const boostIndicator = document.getElementById('xp-boost-indicator');
  if (boostIndicator) {
    if (isXpBoostActive()) {
      const sec = getXpBoostRemaining();
      boostIndicator.style.display = 'inline-block';
      boostIndicator.textContent = `⏫ ×2 ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    } else {
      boostIndicator.style.display = 'none';
    }
  }
}

/* ========== 综合战力 ========== */
function calcCombatPower(pStats) {
  // maxHp权重高（生存），atk/def次之（战斗），int/luk辅助
  return Math.floor(pStats.maxHp * 2 + pStats.atk * 5 + pStats.def * 3 + pStats.int + pStats.luk);
}

/* ========== 五维雷达图 ========== */
function generateRadarChart(stats, maxVal = 'auto') {
  const elements = [
    { key: 'wood',  label: '木', icon: '🌳', attr: '血量',       color: '#4caf50' },
    { key: 'fire',  label: '火', icon: '🔥', attr: '攻击',       color: '#ff5722' },
    { key: 'earth', label: '土', icon: '⛰️', attr: '防御',       color: '#795548' },
    { key: 'metal', label: '金', icon: '⭐', attr: '幸运·暴击',   color: '#f57f17' },
    { key: 'water', label: '水', icon: '💧', attr: '智慧·速度',   color: '#2196f3' },
  ];
  // 动态缩放：取当前最大值并保留余量，低等级也能撑起图形
  if (maxVal === 'auto') {
    const rawMax = Math.max(...elements.map(el => stats[el.key] || 0), 1);
    maxVal = Math.ceil(Math.max(rawMax * 1.3, 60));
  }

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

  // 数值标签（数据点外侧）
  for (let i = 0; i < angles.length; i++) {
    const dataR = R * values[i] / maxVal;
    if (dataR < R - 6) {
      const lp = vertex(angles[i], Math.min(dataR + 14, R - 4));
      svg += `<text x="${lp.x}" y="${lp.y}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#666" font-weight="600">${values[i]}</text>`;
    }
  }

  // 顶点标签：五行图标 + 属性说明
  const labelR = R + 22;
  for (let i = 0; i < angles.length; i++) {
    const v = vertex(angles[i], labelR);
    const yBase = +v.y;
    svg += `<text x="${v.x}" y="${(yBase - 5).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="${elements[i].color}">${elements[i].icon}${elements[i].label}</text>`;
    svg += `<text x="${v.x}" y="${(yBase + 9).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="9" fill="#999">${elements[i].attr}</text>`;
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
  const avUrl = getAvatarUrl(USER_CACHE.avatar);
  const elInfo = DATA.getElementInfo(USER_CACHE.element);
  const elStats = ELEMENT_STATS[USER_CACHE.element];
  const elemColor = elInfo ? elInfo.color : '#888';
  const elemBg = elInfo ? elInfo.bg : '#f5f5f5';
  const power = calcCombatPower(pStats);

  // 角色卡
  const charCard = document.createElement('div');
  charCard.className = 'profile-char-card';
  charCard.style.background = `linear-gradient(180deg, ${elemBg} 0%, white 50%)`;
  charCard.innerHTML = `
    <div class="profile-avatar-wrap${USER_CACHE.avatarFrame ? ' profile-frame-' + USER_CACHE.avatarFrame : ''}">
      <img src="${avUrl}" alt="" class="profile-avatar-img" onerror="this.src='data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="47" fill="#e0e0e0"/><text x="50" y="68" text-anchor="middle" font-size="48" fill="#aaa">👤</text></svg>')}'">
      <div class="profile-avatar-element-ring" style="border-color:${elemColor}"></div>
    </div>
    <div class="profile-name">${USER_CACHE.username}</div>
    <div class="profile-frame-name">🖼️ ${getFrameLabel(USER_CACHE.avatarFrame)}</div>
    ${USER_CACHE.title ? `<div class="profile-title-badge">👑 ${USER_CACHE.title}</div>` : ''}
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
      ${generateRadarChart(pStats)}
      <div class="radar-legend">
        <div class="radar-legend-item" style="color:#4caf50">🌳 木·血量 <b>${pStats.wood}</b></div>
        <div class="radar-legend-item" style="color:#ff5722">🔥 火·攻击 <b>${pStats.fire}</b></div>
        <div class="radar-legend-item" style="color:#795548">⛰️ 土·防御 <b>${pStats.earth}</b></div>
        <div class="radar-legend-item" style="color:#f57f17">⭐ 金·幸运·暴击 <b>${pStats.metal}</b></div>
        <div class="radar-legend-item" style="color:#2196f3">💧 水·智慧·速度 <b>${pStats.water}</b></div>
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
    <div class="profile-bonus-row" style="margin-top:12px;border-top:1px solid #f0f0f0;padding-top:12px;flex-wrap:wrap;gap:6px">
      <span class="profile-collect-label">${getAvatarLabel(USER_CACHE.avatar)}</span>
      <span class="profile-collect-label" style="font-size:12px;color:#999">🖼️ ${getFrameLabel(USER_CACHE.avatarFrame)}</span>
      <button class="text-btn" onclick="showChangeAvatarScreen()" style="font-size:13px;padding:2px 8px">🔄 头像</button>
      <button class="text-btn" onclick="showFrameSelect()" style="font-size:13px;padding:2px 8px">🔄 头像框</button>
    </div>
    <button class="primary-btn" onclick="showAchievements()" style="margin-top:10px;width:100%">🏅 成就</button>
    <button class="primary-btn" onclick="showCollectionBook()" style="margin-top:8px;width:100%">📖 卡片图鉴</button>
    <button class="primary-btn" onclick="showEquip()" style="margin-top:8px;width:100%">⚔️ 装备</button>
  `;
  container.appendChild(collectCard);

  showScreen('screen-profile');
}

/* ========== 奖励说明 ========== */
function showRewardsInfo() {
  const c = document.getElementById('rewards-content');
  c.innerHTML = `
    <div class="ri-section">
      <h3>⚔️ 挑战模式 · Boss战胜利</h3>
      <p>每次胜利必得：3张Boss同属性卡 + 经验（受智慧加成）</p>
      <table class="ri-table">
        <tr><td>额外同属性卡</td><td>50%</td></tr>
        <tr><td>单属性提升道具（同Boss五行）</td><td>25%</td></tr>
        <tr><td>空白单词卡</td><td>10%</td></tr>
        <tr><td>特殊头像解锁</td><td>6%</td></tr>
        <tr><td>全属性提升道具</td><td>2%</td></tr>
        <tr><td>五行洗髓丹</td><td>1%</td></tr>
        <tr><td>经验加倍符</td><td>15%</td></tr>
        <tr><td>幸运护符</td><td>10%</td></tr>
        <tr><td>复活石</td><td>8%</td></tr>
      </table>
      <p class="ri-note">* 除五行洗髓丹外，均受幸运（金属性）加成</p>
      <p>Boss战失败：固定 +15 XP</p>
    </div>
    <div class="ri-section">
      <h3>✏️ 练习模式</h3>
      <p>得分 ≥ 80% 可获得额外奖励：</p>
      <table class="ri-table">
        <tr><td>空白单词卡</td><td>12%</td></tr>
        <tr><td>🎒 背包格 +2</td><td>10%</td></tr>
      </table>
      <p>满分（100%）额外追加：</p>
      <table class="ri-table">
        <tr><td>随机五行属性 +1</td><td>10%</td></tr>
      </table>
    </div>
    <div class="ri-section">
      <h3>📚 学习模式 · 造句</h3>
      <table class="ri-table">
        <tr><td>第1次成功</td><td>3张单词卡 + 最高经验</td></tr>
        <tr><td>第2次成功</td><td>2张单词卡</td></tr>
        <tr><td>第3次成功</td><td>1张单词卡</td></tr>
        <tr><td>4次及以上</td><td>仅经验，无卡</td></tr>
        <tr><td>随堂测验全对</td><td>额外 +1 张卡</td></tr>
      </table>
      <p class="ri-note">* 经验值受年级档位、智慧（水属性）加成、随堂测验准确率影响，超出推荐等级后逐级衰减至50%</p>
    </div>
    <div class="ri-section">
      <h3>🎒 技能背包 · 添加单词</h3>
      <table class="ri-table">
        <tr><td>填写已知单词</td><td>+15 XP</td></tr>
        <tr><td>填写新单词</td><td>+30 XP</td></tr>
      </table>
    </div>
    <div class="ri-section">
      <h3>⚔️ 装备加成</h3>
      <p>在个人信息面板进入「装备」，可将背包中的单词卡装备到4个词性槽位（名词/动词/形容词/代词），每张卡提供对应五行属性 +10% 的加成。</p>
    </div>
  `;
  showScreen('screen-rewards-info');
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
  updateLetterBagCount();
  updateHomeXpDisplay();
  checkAvatarFrameUnlocks();
}

function updateLetterBagCount() {
  const bag = loadLetterBag();
  const el = document.getElementById('letter-bag-count');
  if (el) el.textContent = `已收集 ${bag.size}/26`;
}

function showLetterBag() {
  const bag = loadLetterBag();
  const grid = document.getElementById('letter-grid');
  grid.innerHTML = '';

  // 26个字母按五行分组展示
  const elemOrder = ['木','火','金','水','土'];
  for (const elName of elemOrder) {
    const elInfo = DATA.getElementInfo(elName);
    const letters = Object.entries(DATA.LETTER_ELEMENTS)
      .filter(([_, v]) => v === elName)
      .map(([k]) => k)
      .sort();

    for (const letter of letters) {
      const unlocked = bag.has(letter);
      const cell = document.createElement('div');
      cell.className = `letter-cell ${unlocked ? 'unlocked' : 'locked'}`;
      if (unlocked) {
        cell.style.cssText = `background:${elInfo.bg};color:${elInfo.color};border:2px solid ${elInfo.color}`;
      }
      cell.innerHTML = `
        <span style="font-size:32px;font-weight:800">${letter.toLowerCase()}</span>
        <span class="letter-elem-label">${elInfo.icon} ${unlocked ? elName : '🔒'}</span>
      `;
      grid.appendChild(cell);
    }
  }

  // 统计
  const totalUnlocked = bag.size;
  const pct = Math.round(totalUnlocked / 26 * 100);
  document.getElementById('letter-bag-hint').textContent =
    `已解锁 ${totalUnlocked}/26 个字母（${pct}%）— 在学习中拼对单词即可解锁字母`;

  showScreen('screen-letter-bag');
}

/* ========== 练习模式 ========== */
const PRAC = {
  questions: [],
  index: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  answered: false,
  totalXp: 0,
  mode: 'grade5-6',
};

/** 练习模式选年级 */
function showPracticeScreen() {
  showScreen('screen-practice-select');
}

async function startPractice(mode) {
  PRAC.mode = mode || 'grade5-6';
  // 确定词库和句子组的 tier 范围
  const isLowGrade = (mode === 'grade1-2');
  const noShengke = (mode !== 'grade5-6');

  try {
    // Direct fetch vocabulary (bypass DATA to isolate SW/fetch issue)
    let wordsData;
    try {
      const r = await fetch('vocabulary.json?_=' + Date.now());
      const d = await r.json();
      wordsData = d.words;
    } catch (fetchErr) {
      showToast('❌ 词库网络请求失败: ' + fetchErr.message);
      return;
    }

    if (!wordsData || wordsData.length === 0) {
      showToast('❌ 词库数据为空，请刷新页面重试');
      return;
    }

    // Load sentence groups too (direct fetch as fallback)
    await DATA.load();
    if (!DATA.words || DATA.words.length === 0) {
      DATA.words = wordsData;
      DATA.byElement = {};
      DATA.byPos = {};
      for (const w of wordsData) {
        if (!DATA.byElement[w.element]) DATA.byElement[w.element] = [];
        DATA.byElement[w.element].push(w);
        if (!DATA.byPos[w.pos]) DATA.byPos[w.pos] = [];
        DATA.byPos[w.pos].push(w);
      }
    }
    if (!DATA.sentenceGroups || DATA.sentenceGroups.length === 0) {
      try {
        const sg = await fetch('sentence_groups.json?_=' + Date.now());
        const sgData = await sg.json();
        DATA.sentenceGroups = sgData.groups;
      } catch(e) { /* cloze questions unavailable */ }
    }

    PRAC.questions = [];
    PRAC.index = 0;
    PRAC.correct = 0;
    PRAC.streak = 0;
    PRAC.bestStreak = 0;
    PRAC.answered = false;
    PRAC.totalXp = 0;
    const types = mode === "grade1-2" ? ["cloze", "match-cn", "word-class"] : mode === "grade3-4" ? ["cloze", "match-cn", "pos", "word-class"] : ["cloze", "match-cn", "pos", "shengke"];
    for (let i = 0; i < 10; i++) {
      const type = DATA.randomPick(types);
      const q = pracGenQuestion(type, mode);
      if (q) PRAC.questions.push(q);
      else i--;
    }

    if (PRAC.questions.length === 0) {
      showToast('❌ 题目生成失败，请先完成一轮学习');
      return;
    }

    showScreen('screen-practice');
    pracShowQuestion(0);
  } catch (e) {
    showToast('❌ ' + e.message);
    console.error('Practice error:', e);
  }
}

function pracGenQuestion(type, mode) {
  switch (type) {
    case 'cloze': return pracGenCloze(mode);
    case 'match-cn': return pracGenMatchCn(mode);
    case 'pos': return pracGenPos(mode);
    case 'word-class': return pracGenWordClass(mode);
    case 'shengke': return pracGenShengke(mode);
  }
}

/* --- 完形填空 --- */
function pracGenCloze(mode) {
  const tier = mode === 'grade1-2' ? 'beginner' : undefined;
  const q = DATA.generateClozeQuestion(tier);
  if (!q) return null;
  return {
    typeLabel: '完形填空',
    question: `选择正确的词填入空白：<br>"${q.displaySentence}"`,
    options: DATA.shuffleArray(q.options.map(o => ({
      text: `${o.word} (${o.cn})`, isCorrect: o.isCorrect,
    }))),
    explanation: '正确答案：' + q.options.find(o => o.isCorrect).word,
  };
}

/* --- 中英配对 --- */
function pracGenMatchCn(mode) {
  let pool = DATA.words.filter(w => w.cn && w.cn.length < 8);
  if (mode === 'grade1-2') pool = pool.filter(w => w.tier === 'beginner');
  // grade3-4 and grade5-6 use all words
  if (pool.length === 0) return null;
  const word = DATA.randomPick(pool);
  const correct = word.cn;
  const others = DATA.shuffleArray(pool.filter(w => w.cn !== correct)).slice(0, 3);
  if (others.length < 3) return null;
  return {
    typeLabel: '中英配对',
    question: `"${word.word}" 的中文意思是？`,
    options: DATA.shuffleArray([
      { text: correct, isCorrect: true },
      ...others.map(w => ({ text: w.cn, isCorrect: false })),
    ]),
    explanation: `${word.word} = ${correct}`,
  };
}

/* --- 词性判断 --- */
function pracGenPos(mode) {
  let pool = DATA.words.filter(w => w.pos && DATA.POS_LABELS[w.pos]);
  if (mode === 'grade1-2') pool = pool.filter(w => w.tier === 'beginner');
  const word = DATA.randomPick(pool);
  const correct = DATA.POS_LABELS[word.pos];
  const wrongs = DATA.shuffleArray(
    Object.values(DATA.POS_LABELS).filter(l => l !== correct)
  ).slice(0, 3);
  if (wrongs.length < 3) return null;
  return {
    typeLabel: '词性判断',
    question: `"${word.word}" (${word.cn}) 是什么词性？`,
    options: DATA.shuffleArray([
      { text: correct, isCorrect: true },
      ...wrongs.map(l => ({ text: l, isCorrect: false })),
    ]),
    explanation: `"${word.word}" 是${correct}`,
  };
}

/* --- 单词分类（给单词选正确的主题分类） --- */
function pracGenWordClass(mode) {
  let pool = DATA.words.filter(w => w.category_cn && DATA.THEME_EMOJI[w.category_cn]);
  if (mode === 'grade1-2') pool = pool.filter(w => w.tier === 'beginner');
  if (pool.length < 4) return null;

  const word = DATA.randomPick(pool);
  const correct = `${DATA.THEME_EMOJI[word.category_cn]} ${word.category_cn}`;

  // 找其他分类做干扰项
  const allCategories = Object.keys(DATA.THEME_EMOJI);
  const wrongCats = DATA.shuffleArray(
    allCategories.filter(c => c !== word.category_cn)
  ).slice(0, 3).map(c => `${DATA.THEME_EMOJI[c]} ${c}`);
  if (wrongCats.length < 3) return null;

  return {
    typeLabel: '单词分类',
    question: `"${word.word}"（${word.cn}）属于哪一类？`,
    options: DATA.shuffleArray([
      { text: correct, isCorrect: true },
      ...wrongCats.map(t => ({ text: t, isCorrect: false })),
    ]),
    explanation: `${word.word} 属于「${word.category_cn}」类`,
  };
}

/* --- 五行生克 --- */
function pracGenShengke(mode) {
  const ELEMENT_RELATIONS = {
    '木': { sheng: '火', ke: '土' },
    '火': { sheng: '土', ke: '金' },
    '土': { sheng: '金', ke: '水' },
    '金': { sheng: '水', ke: '木' },
    '水': { sheng: '木', ke: '火' },
  };
  const el = DATA.randomPick(DATA.ELEMENTS.map(e => e.name));
  const type = Math.random() < 0.5 ? 'sheng' : 'ke';
  const correct = ELEMENT_RELATIONS[el][type];
  const typeChar = type === 'sheng' ? '生' : '克';
  const elInfo = DATA.getElementInfo(el);
  const others = DATA.ELEMENTS.map(e => e.name).filter(n => n !== correct && n !== el);
  const wrongs = DATA.shuffleArray(others).slice(0, 3);
  return {
    typeLabel: '五行生克',
    question: `${elInfo.icon} ${el} ${typeChar}什么？`,
    options: DATA.shuffleArray([
      { text: correct, isCorrect: true },
      ...wrongs.map(n => ({ text: n, isCorrect: false })),
    ]),
    explanation: `${el} ${typeChar} ${correct}`,
  };
}

/* --- 显示题目 --- */
function pracShowQuestion(index) {
  if (index >= PRAC.questions.length) {
    pracShowResult();
    return;
  }

  PRAC.index = index;
  PRAC.answered = false;
  const q = PRAC.questions[index];

  document.getElementById('prac-progress-fill').style.width = `${(index / 10) * 100}%`;
  document.getElementById('prac-progress-text').textContent = `${index + 1}/10`;
  document.getElementById('prac-score').textContent = PRAC.correct;
  document.getElementById('prac-streak').textContent = PRAC.streak;
  document.getElementById('prac-type-badge').textContent = q.typeLabel;
  document.getElementById('prac-question').innerHTML = q.question;
  document.getElementById('prac-next-btn').style.display = 'none';
  document.getElementById('prac-feedback').style.display = 'none';

  const optContainer = document.getElementById('prac-options');
  optContainer.innerHTML = '';
  for (let i = 0; i < q.options.length; i++) {
    const btn = document.createElement('button');
    btn.className = 'prac-option';
    btn.textContent = q.options[i].text;
    btn.addEventListener('click', () => pracAnswer(i));
    optContainer.appendChild(btn);
  }
}

/* --- 作答 --- */
function pracAnswer(optIndex) {
  if (PRAC.answered) return;
  PRAC.answered = true;

  const q = PRAC.questions[PRAC.index];
  const isCorrect = q.options[optIndex].isCorrect;
  const allBtns = document.querySelectorAll('.prac-option');
  allBtns.forEach((btn, i) => {
    btn.disabled = true;
    if (q.options[i].isCorrect) btn.classList.add('prac-correct');
    else if (i === optIndex) btn.classList.add('prac-wrong');
  });

  const fb = document.getElementById('prac-feedback');
  if (isCorrect) {
    PRAC.correct++;
    PRAC.streak++;
    if (PRAC.streak > PRAC.bestStreak) PRAC.bestStreak = PRAC.streak;
    fb.className = 'prac-feedback prac-fb-correct';
    fb.innerHTML = `✅ 正确！${q.explanation}`;
  } else {
    PRAC.streak = 0;
    fb.className = 'prac-feedback prac-fb-wrong';
    fb.innerHTML = `❌ 不对哦。${q.explanation}`;
  }
  fb.style.display = 'block';

  document.getElementById('prac-score').textContent = PRAC.correct;
  document.getElementById('prac-streak').textContent = PRAC.streak;

  // 下一题按钮
  const isLast = PRAC.index >= PRAC.questions.length - 1;
  document.getElementById('prac-next-btn').textContent = isLast ? '查看成绩 →' : '下一题 →';
  document.getElementById('prac-next-btn').style.display = 'inline-block';
}

/* --- 下一题 --- */
function pracNextQuestion() {
  pracShowQuestion(PRAC.index + 1);
}

/* --- 退出确认 --- */
function pracAbort() {
  showModal('确定退出练习吗？进度不会保存。', () => {
    closeModal();
    goHome();
  });
}

/* --- 结算 --- */
function pracShowResult() {
  // 计算经验（按年级倍率）
  const pracMult = PRAC.mode === 'grade1-2' ? 1.0 : PRAC.mode === 'grade3-4' ? 1.5 : 2.0;
  let xp = Math.round(PRAC.correct * 5 * pracMult);
  // 连对加成：从第3次连续正确开始，每次+2
  const streakBonus = Math.max(0, (PRAC.bestStreak - 2)) * 2;
  xp += streakBonus;
  // 等级衰减：超出推荐等级逐级 -10%，最低 50%
  const pracLevel = getLevel(loadXp());
  const pracGradeMax = parseInt(PRAC.mode.split('-')[1]);
  const pracExceed = Math.min(5, Math.max(0, pracLevel - pracGradeMax * 5));
  if (pracExceed > 0) xp = Math.round(xp * (1 - pracExceed * 0.1));
  PRAC.totalXp = xp;
  addXp(xp);

  // 评价
  const rate = PRAC.correct / 10;
  let icon, title, subtitle;
  if (rate === 1) { icon = '🌟'; title = '完美通关！'; subtitle = '全部答对，太厉害了！'; }
  else if (rate >= 0.8) { icon = '🎉'; title = '非常棒！'; subtitle = '再接再厉！'; }
  else if (rate >= 0.5) { icon = '👍'; title = '还不错！'; subtitle = '继续加油哦！'; }
  else { icon = '💪'; title = '继续加油！'; subtitle = '多练练一定会有进步的！'; }

  showScreen('screen-practice-result');
  document.getElementById('pr-icon').textContent = icon;
  document.getElementById('pr-title').textContent = title;
  document.getElementById('pr-subtitle').textContent = subtitle;
  document.getElementById('pr-score-num').textContent = PRAC.correct;
  document.getElementById('pr-best-streak').textContent = PRAC.bestStreak;
  document.getElementById('pr-xp-gain').textContent = xp;

  // 奖励
  const rewardEl = document.getElementById('pr-reward');
  rewardEl.style.display = 'none';
  rewardEl.innerHTML = '';

  if (rate >= 0.8) {
    let rewards = [];
    // 空白卡概率（12%）
    if (Math.random() < 0.12) {
      const items = loadItems();
      items.push({ type: 'item', itemType: 'blank_card', date: new Date().toISOString().slice(0, 10) });
      saveItems(items);
      rewards.push('🃏 空白单词卡');
    }
    // 满分额外：随机属性提升（10%）
    if (rate === 1 && Math.random() < 0.10) {
      const elements = ['木', '火', '土', '金', '水'];
      const randEl = DATA.randomPick(elements);
      const key = ELEMENT_TO_BONUS[randEl];
      const bonus = loadBonus();
      bonus[key]++;
      saveBonus(bonus);
      rewards.push(`✨ ${randEl}属性 +1`);
    }
    // 10% → 背包格+2
    if (Math.random() < 0.10) {
      addBackpackSlot(2);
      rewards.push('🎒 背包格 +2');
    }
        if (rewards.length > 0) {
      rewardEl.style.display = 'block';
      rewardEl.innerHTML = `🎁 额外获得：${rewards.join('、')}`;
    }
  }
}

/* ========== 排行榜 ========== */
let _lbData = [];
let _lbTab = 'level';

/** 给任意用户计算综合战力（与 getPlayerStats 公式一致） */
function calcPowerForUser(element, bonus, level, equip) {
  const base = ELEMENT_STATS[element] || { hp: 10, atk: 10, def: 10, spd: 10, cri: 10 };
  const bns = bonus || {};
  let wood = base.hp + level + (bns.wood || 0);
  let fire = base.atk + level + (bns.fire || 0);
  let earth = base.def + level + (bns.earth || 0);
  let water = base.spd + level + (bns.water || 0);
  let metal = base.cri + level + (bns.metal || 0);

  // 装备加成（与 getPlayerStats 相同：字母数×品质系数% + 字母数×品质等级）
  const eq = equip || [null, null, null, null];
  let pctWood = 0, pctFire = 0, pctEarth = 0, pctWater = 0, pctMetal = 0;
  let flatWood = 0, flatFire = 0, flatEarth = 0, flatWater = 0, flatMetal = 0;
  for (const slot of eq) {
    if (!slot || !slot.element) continue;
    const key = ELEMENT_TO_BONUS[slot.element];
    if (!key) continue;
    const q = slot.quality || 'common';
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const wlen = slot.word ? slot.word.length : 1;
    const pct = wlen * qi.coeff;
    const flat = wlen * qi.level;
    if (key === 'wood') { pctWood += pct; flatWood += flat; }
    else if (key === 'fire') { pctFire += pct; flatFire += flat; }
    else if (key === 'earth') { pctEarth += pct; flatEarth += flat; }
    else if (key === 'water') { pctWater += pct; flatWater += flat; }
    else if (key === 'metal') { pctMetal += pct; flatMetal += flat; }
  }
  wood = Math.round(wood * (1 + pctWood)) + flatWood;
  fire = Math.round(fire * (1 + pctFire)) + flatFire;
  earth = Math.round(earth * (1 + pctEarth)) + flatEarth;
  water = Math.round(water * (1 + pctWater)) + flatWater;
  metal = Math.round(metal * (1 + pctMetal)) + flatMetal;

  const maxHp = 60 + wood * 4;
  return Math.floor(maxHp * 2 + fire * 5 + earth * 3 + water + metal);
}

async function showLeaderboard() {
  showScreen('screen-leaderboard');
  document.getElementById('lb-loading').style.display = 'block';
  document.getElementById('lb-list').innerHTML = '';

  // 先确保本地数据已上传到 Supabase
  await syncToSupabaseNow();

  const rows = await fetchAllUsers();

  // debug: 对比当前用户本地 vs Supabase 数据
  const me = rows.find(u => u.username === USER_CACHE.username);
  if (me) {
    console.log('[排行] 本地 equip:', JSON.stringify(loadEquip()));
    console.log('[排行] Supabase equip:', JSON.stringify(me.equip));
    console.log('[排行] 本地 bonus:', JSON.stringify(loadBonus()));
    console.log('[排行] Supabase bonus:', JSON.stringify(me.bonus));
    console.log('[排行] 本地 xp:', loadXp(), 'Supabase xp:', me.xp);
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    document.getElementById('lb-loading').textContent = '暂无数据';
    return;
  }

  // 为每个用户计算等级和战力
  _lbData = rows.map(u => {
    const level = getLevel(u.xp || 0);
    const bonus = typeof u.bonus === 'object' && u.bonus ? u.bonus : {};
    const equip = Array.isArray(u.equip) ? u.equip : [null, null, null, null];
    const power = calcPowerForUser(u.element || '', bonus, level, equip);
    return {
      username: u.username,
      avatar: u.avatar || '',
      element: u.element || '',
      avatarFrame: u.avatarFrame || '',
      xp: u.xp || 0,
      level,
      bonus,
      equip,
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
    const avUrl = getAvatarUrl(u.avatar);
    const elInfo = DATA.getElementInfo(u.element);
    const frameClass = u.avatarFrame ? ` lb-frame-${u.avatarFrame}` : '';

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
      <span class="lb-avatar${frameClass}">${avUrl ? `<img src="${avUrl}" class="lb-avatar-img" onerror="this.outerHTML='👤'">` : '👤'}</span>
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
  desc.textContent = '中级单词 · 主题学习';
  lock.textContent = '✅';
  btn.onclick = () => startStudy('grade3-4');
  // 5-6年级按钮无需额外解锁
  showScreen('screen-study');
}

/** 3-4年级按钮备用处理 */
function handleGrade3_4() {
  startStudy('grade3-4');
}

/** 从学习选级进入对应的模式 */
async function startStudy(mode) {
  lastLearnMode = mode;
  STATE.currentMode = mode;
  STATE.sentenceAttempts = 0;
  await DATA.load();

  if (mode === 'grade5-6') {
    // 5-6年级：走原有连句模式（word → quiz → sentence）
    const tier = 'intermediate';
    const result = DATA.selectAnySentenceGroup(tier);
    if (result) {
      // 对齐 words 与 targetOrder：以 targetOrder 为准构建 word 列表
      STATE.targetOrder = result.targetOrder;
      // 直接使用 targetOrder 构建 words（保持完全一致，含重复词如 the the）
      STATE.words = [...result.targetOrder];
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
    STATE.isThemeMode = false;
    STATE.words = DATA.shuffleArray([...STATE.words]);
    startLearning();
  } else {
    // 1-2 / 3-4年级：走主题学习模式（word → quiz → finish）
    startThemeLearning(mode);
  }
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

/* ========== 主题学习模式（1-2 / 3-4年级） ========== */
function startThemeLearning(mode) {
  STATE.isThemeMode = true;
  // 从当前年级对应的主题分类中选 5 个词
  STATE.words = DATA.selectThemeWords(mode, 5);
  STATE.wordIndex = 0;
  STATE.quizCorrect = 0;
  STATE.quizTotal = 0;
  STATE._quizAnswered = false;
  STATE._quizzedWords = new Set();
  STATE.quizSchedule = computeQuizSchedule(STATE.words.length);
  STATE.sentenceCorrect = false;

  // 设置主题头部
  const cat = STATE.words[0].category_cn;
  const emoji = DATA.THEME_EMOJI[cat] || '📖';
  const themeEl = document.getElementById('theme-header');
  themeEl.innerHTML = `<span class="theme-emoji">${emoji}</span><span class="theme-name">${cat}</span>`;
  themeEl.style.display = 'flex';

  // 隐藏五行提示（主题模式用 emoji 代替）
  document.getElementById('learn-element').style.display = 'none';
  // 隐藏句子行
  document.getElementById('word-sentence').style.display = 'none';

  showScreen('screen-learn');
  showThemeWord(0);
}

function showThemeWord(index) {
  if (index >= STATE.words.length) {
    startSpellingPhase();
    return;
  }
  STATE.wordIndex = index;
  STATE._quizAnswered = false;
  const w = STATE.words[index];

  // 更新进度
  document.getElementById('progress-fill').style.width = `${(index / STATE.words.length) * 100}%`;
  document.getElementById('progress-text').textContent = `${index + 1}/${STATE.words.length}`;

  // 隐藏测验，恢复单词
  document.getElementById('learn-quiz').style.display = 'none';
  document.getElementById('word-display').style.display = 'block';
  document.getElementById('btn-chinese').style.display = 'inline-block';
  document.getElementById('btn-next').style.display = 'inline-block';

  // 按钮文字
  const isQuizPoint = STATE.quizSchedule.includes(index);
  const isLast = index >= STATE.words.length - 1;
  if (isQuizPoint) {
    document.getElementById('btn-next').textContent = '答题 →';
  } else if (isLast) {
    document.getElementById('btn-next').textContent = '完成 →';
  } else {
    document.getElementById('btn-next').textContent = '下一个 →';
  }

  // 显示单词（主题色）
  document.getElementById('word-english').textContent = w.word;
  document.getElementById('word-english').style.color = 'var(--text)';
  document.getElementById('word-chinese').textContent = w.cn;
  document.getElementById('word-chinese').style.display = 'none';

  // 主题 emoji 提示（复用 learn-element 位置）
  const cat = w.category_cn;
  const emoji = DATA.THEME_EMOJI[cat] || '📖';
  document.getElementById('learn-element').textContent = `${emoji} ${cat}`;
  document.getElementById('learn-element').style.display = 'block';

  SPEAKER.speakWord(w.word);
}

/* ========== 拼词阶段（低年级学习模式，替代连句） ========== */

/** 主题学习完成后进入拼词阶段 */
function startSpellingPhase() {
  STATE.isSpelling = true;
  STATE.spellWordIndex = 0;
  STATE.spellResult = [];
  // 只需要拼部分单词：1-2年级拼1个，3-4年级拼2个
  STATE.spellRequiredCount = STATE.currentMode === 'grade1-2' ? 1 : 2;
  document.getElementById('theme-header').style.display = 'none';
  document.getElementById('learn-element').style.display = 'block';
  document.getElementById('word-sentence').style.display = 'block';
  // 确保按钮可见（从上次可能残留的隐藏状态恢复）
  document.querySelector('.spell-area .learn-buttons').style.display = 'flex';
  document.getElementById('spell-result').style.display = 'none';
  showSpellingWord(0);
}

function showSpellingWord(index) {
  if (index >= STATE.spellRequiredCount) {
    finishThemeLearning();
    return;
  }
  STATE.spellWordIndex = index;
  const w = STATE.words[index];
  if (!STATE.spellResult[index]) {
    STATE.spellResult[index] = { word: w.word, attempts: 0, success: false };
  }
  STATE.spellResult[index].attempts = 0;

  // 进度
  document.getElementById('spell-progress-fill').style.width = `${(index / STATE.spellRequiredCount) * 100}%`;
  document.getElementById('spell-progress-text').textContent = `${index + 1}/${STATE.spellRequiredCount}`;

  // 线索
  const themeEmoji = DATA.THEME_EMOJI[w.category_cn] || '📖';
  document.getElementById('spell-emoji').textContent = themeEmoji;
  document.getElementById('spell-cn').textContent = w.cn;
  document.getElementById('spell-hint').textContent = `${w.word.length} 个字母`;

  // 五行提示
  const wordEl = DATA.getWordElementFromLetters(w.word);
  const elInfo = DATA.getElementInfo(wordEl);
  document.getElementById('spell-word-element').textContent = `${elInfo.icon} ${wordEl}`;
  document.getElementById('spell-word-element').style.color = elInfo.color;

  // 构建字母牌
  const letters = w.word.toUpperCase().split('');
  const letterPool = DATA.shuffleArray(letters.map((ch, i) => ({
    id: i, letter: ch, used: false
  })));

  STATE._spellPool = letterPool;
  STATE._spellPlaced = []; // { slotIndex: 0..n-1, poolId: int }

  renderSpelling(letters.length);
  hideSpellResult();
  showScreen('screen-spell');
}

function renderSpelling(wordLen) {
  // 槽位
  const slotsEl = document.getElementById('spell-slots');
  slotsEl.innerHTML = '';
  for (let i = 0; i < wordLen; i++) {
    const slot = document.createElement('div');
    slot.className = 'spell-slot';
    slot.dataset.slotIdx = i;
    slot.addEventListener('click', () => clickSlot(i));
    slotsEl.appendChild(slot);
  }
  // 字母牌
  renderSpellBank();
  // 按钮状态
  document.getElementById('btn-spell-check').disabled = true;
  document.getElementById('spell-feedback').style.display = 'none';
}

function renderSpellBank() {
  const bank = document.getElementById('spell-bank');
  bank.innerHTML = '';
  for (const pc of STATE._spellPool) {
    if (pc.used) continue;
    const el = DATA.getLetterElement(pc.letter);
    const elInfo = DATA.getElementInfo(el);
    const tile = document.createElement('div');
    tile.className = `letter-tile tile-elem-${elInfo.id}`;
    tile.dataset.poolId = String(pc.id);
    tile.dataset.letter = pc.letter;
    tile.textContent = pc.letter.toLowerCase();
    tile.addEventListener('click', () => clickLetterTile(pc.id));
    bank.appendChild(tile);
  }
}

function clickLetterTile(poolId) {
  const pc = STATE._spellPool.find(p => p.id === poolId);
  if (!pc || pc.used) return;
  pc.used = true;
  STATE._spellPlaced.push(poolId);
  syncSpellUI();
}

function clickSlot(slotIdx) {
  if (!STATE._spellPlaced[slotIdx]) return;
  const poolId = STATE._spellPlaced[slotIdx];
  const pc = STATE._spellPool.find(p => p.id === poolId);
  if (pc) pc.used = false;
  STATE._spellPlaced[slotIdx] = null;
  // 折叠空位
  STATE._spellPlaced = STATE._spellPlaced.filter(v => v !== null);
  syncSpellUI();
}

function syncSpellUI() {
  const wordLen = STATE.words[STATE.spellWordIndex].word.length;
  const slots = document.getElementById('spell-slots').querySelectorAll('.spell-slot');

  for (let i = 0; i < wordLen; i++) {
    const slot = slots[i];
    const poolId = STATE._spellPlaced[i];
    if (poolId !== undefined && poolId !== null) {
      const pc = STATE._spellPool.find(p => p.id === poolId);
      slot.textContent = pc ? pc.letter.toLowerCase() : '';
      slot.className = 'spell-slot filled';
    } else {
      slot.textContent = '';
      slot.className = 'spell-slot';
    }
  }

  renderSpellBank();

  // 检查按钮启用条件：所有槽位填满
  const allFilled = STATE._spellPlaced.length === wordLen && STATE._spellPlaced.every(v => v !== null && v !== undefined);
  document.getElementById('btn-spell-check').disabled = !allFilled;
}

function checkSpelling() {
  const w = STATE.words[STATE.spellWordIndex];
  const result = STATE.spellResult[STATE.spellWordIndex];
  result.attempts++;

  const correct = w.word.toUpperCase();
  const placed = STATE._spellPlaced.map(poolId => {
    const pc = STATE._spellPool.find(p => p.id === poolId);
    return pc ? pc.letter : '';
  }).join('');

  const isCorrect = placed === correct;
  const slots = document.getElementById('spell-slots').querySelectorAll('.spell-slot');

  if (isCorrect) {
    slots.forEach(s => s.className = 'spell-slot correct');
    result.success = true;
    showSpellFeedback('✅ 拼对了！', '#4caf50');
    showSpellReward(result);
  } else {
    // 标记错误位置
    for (let i = 0; i < correct.length; i++) {
      if (placed[i] !== correct[i]) {
        slots[i].className = 'spell-slot wrong';
      }
    }
    showSpellFeedback('❌ 再想想，注意字母顺序', '#f44336');
    // 自动清空重试
    setTimeout(() => {
      resetSpelling();
      // 提示第一个字母
      document.getElementById('spell-hint').textContent = `首字母: ${correct[0]}`;
    }, 1000);
  }
}

function showSpellFeedback(msg, color) {
  const fb = document.getElementById('spell-feedback');
  fb.textContent = msg;
  fb.style.background = color || '#fff3e0';
  fb.style.color = color ? '#fff' : '#e65100';
  fb.style.display = 'block';
}

function resetSpelling() {
  // 清空所有放置
  for (const pc of STATE._spellPool) pc.used = false;
  STATE._spellPlaced = [];
  syncSpellUI();
  document.getElementById('spell-feedback').style.display = 'none';
}

function showSpellReward(result) {
  const w = STATE.words[STATE.spellWordIndex];
  const isLast = STATE.spellWordIndex >= STATE.spellRequiredCount - 1;

  // 解锁字母
  const lb = loadLetterBag();
  for (const ch of w.word.toUpperCase()) {
    lb.add(ch);
  }
  saveLetterBag(lb);

  // 计算 XP（按尝试次数衰减）
  let xpGain = 0;
  const baseXp = STATE.currentMode === 'grade1-2' ? 12 : STATE.currentMode === 'grade3-4' ? 18 : 24;
  if (result.attempts === 1) xpGain = baseXp;
  else if (result.attempts === 2) xpGain = Math.round(baseXp / 2);
  // 第3次及以上：给卡不给 XP
  // 等级衰减
  if (xpGain > 0) {
    const spellLevel = getLevel(loadXp());
    const spellGradeMax = parseInt(STATE.currentMode.split('-')[1]);
    const spellExceed = Math.min(5, Math.max(0, spellLevel - spellGradeMax * 5));
    if (spellExceed > 0) xpGain = Math.round(xpGain * (1 - spellExceed * 0.1));
  }
  addXp(xpGain);

  // track words spelled for achievements
  if (xpGain > 0) {
    const achStats2 = loadAchStats();
    achStats2.wordsSpelled = (achStats2.wordsSpelled || 0) + 1;
    saveAchStats(achStats2);
    checkAchievements('after_spell');
  }

  // 将单词加入技能背包
  const bp = loadBackpack();
  const maxCap = getMaxBackpackCapacity(getLevel(loadXp()));
  if (bp.length < maxCap) {
    bp.push({
      word: w.word, cn: w.cn, element: w.element,
      pos: w.pos || '', sentence: w.sentence || '',
      date: new Date().toISOString().slice(0, 10),
      quality: 'common',
    });
    saveBackpack(bp);
  }

  // 显示结果信息
  const attemptLabel = result.attempts === 1 ? '一次成功！' : result.attempts === 2 ? '第二次成功！' : '拼出来了！';
  const xpLabel = xpGain > 0 ? `+${xpGain}XP` : '';
  const lettersUnlocked = [...new Set(w.word.toUpperCase())].join(' ');
  const msgEl = document.getElementById('spell-result-message');
  msgEl.innerHTML = `
    <div style="font-size:24px;font-weight:700;color:var(--primary)">🎉 ${attemptLabel}</div>
    <div style="font-size:14px;color:var(--text-light);margin-top:8px">
      解锁字母: ${lettersUnlocked} | 获得「${w.word}」卡 ${xpLabel}
    </div>
  `;
  document.getElementById('spell-result').style.display = 'block';
  document.querySelector('.spell-area .learn-buttons').style.display = 'none';

  const btns = document.getElementById('spell-result-buttons');
  btns.innerHTML = '';
  if (isLast) {
    const btn = document.createElement('button');
    btn.className = 'primary-btn';
    btn.textContent = '领取全部奖励 →';
    btn.addEventListener('click', finishThemeLearning);
    btns.appendChild(btn);
  } else {
    const btn = document.createElement('button');
    btn.className = 'primary-btn';
    btn.textContent = '下一个单词 →';
    btn.addEventListener('click', () => {
      hideSpellResult();
      document.querySelector('.spell-area .learn-buttons').style.display = 'flex';
      showSpellingWord(STATE.spellWordIndex + 1);
    });
    btns.appendChild(btn);
  }
}

function hideSpellResult() {
  document.getElementById('spell-result').style.display = 'none';
  document.getElementById('spell-result-buttons').innerHTML = '';
}

function confirmAbortSpell() {
  showModal('确定退出拼词吗？进度不会保存。', () => {
    closeModal();
    STATE.isSpelling = false;
    goHome();
  });
}

function finishThemeLearning() {
  STATE.isThemeMode = false;
  STATE.isSpelling = false;

  // 计算测验 XP + 拼词 XP
  const totalSpelled = STATE.spellResult.filter(r => r.success).length;
  const spellRequired = STATE.spellRequiredCount;
  const quizAccuracy = STATE.quizTotal > 0 ? STATE.quizCorrect / STATE.quizTotal : 0;
  const quizXp = Math.round(10 + quizAccuracy * 20); // 10~30

  const oldTotal = loadXp();
  addXp(quizXp);
  document.getElementById('theme-header').style.display = 'none';

  showThemeReward(totalSpelled, spellRequired, quizAccuracy, quizXp, oldTotal);
}

function showThemeReward(spelled, required, accuracy, quizXp, oldTotal) {
  const cat = STATE.words[0]?.category_cn || '';
  const emoji = DATA.THEME_EMOJI[cat] || '📖';
  const pct = Math.round(accuracy * 100);

  showScreen('screen-reward');

  document.getElementById('reward-icon').textContent = spelled >= required ? '🎉' : '💪';
  document.getElementById('reward-title').textContent = spelled >= required ? '主题完成！' : '继续加油！';
  document.getElementById('reward-desc').textContent = `${emoji} ${cat} · 拼对 ${spelled}/${required} · 测验正确率 ${pct}%`;

  // XP 显示
  const totalXp = loadXp();
  const { level, xpInLevel, xpNeeded } = getXpProgress(totalXp);
  const pctBar = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;

  document.getElementById('reward-xp-gain').textContent = `+${quizXp} XP（测验）`;
  document.getElementById('reward-xp-fill').style.width = Math.min(100, pctBar) + '%';
  document.getElementById('reward-xp-text').textContent = `Lv.${level} ${xpInLevel}/${xpNeeded}`;
  document.getElementById('reward-xp-info').style.display = 'flex';

  // 单词卡已在拼写时逐词发放，不再重复发放
  const container = document.getElementById('reward-cards');
  container.innerHTML = '<p style="color:var(--text-light);font-size:14px;padding:12px">单词卡已在拼写时获得，继续学习收集更多！</p>';

  // 等级升级检测
  const oldLevel = getLevel(oldTotal);
  if (level > oldLevel) {
    const lvlUp = document.createElement('div');
    lvlUp.style.cssText = 'background:#fff3e0;color:#e65100;font-weight:700;font-size:18px;text-align:center;padding:12px;margin-bottom:12px;border-radius:16px;';
    lvlUp.textContent = `⬆️ 升级！Lv.${oldLevel} → Lv.${level}`;
    container.insertBefore(lvlUp, container.firstChild);
  }
}

/* ========== 学单词 ========== */
function startLearning() {
  STATE.quizCorrect = 0;
  STATE.quizTotal = 0;
  STATE._quizAnswered = false;
  STATE._quizzedWords = new Set();
  STATE.quizSchedule = computeQuizSchedule(STATE.words.length);
  showScreen('screen-learn');
  showWord(0);
}

/** 计算测验排程：每轮约 2-3 次测验，均匀分布在词表中 */
function computeQuizSchedule(totalWords) {
  if (totalWords <= 1) return [];
  const last = totalWords - 1;
  if (totalWords <= 3) return [last];
  if (totalWords <= 4) return [1, last];         // 4词 → 2次测验
  if (totalWords <= 6) {                         // 5-6词 → 3次测验
    const s = [1, 3];
    if (!s.includes(last)) s.push(last);
    return s;
  }
  const s = [1, 3, 5];                           // 7+词 → 4次测验
  if (!s.includes(last)) s.push(last);
  return s;
}

function showWord(index) {
  if (index >= STATE.words.length) {
    startSentence();
    return;
  }
  STATE.wordIndex = index;
  STATE._quizAnswered = false;
  const w = STATE.words[index];

  // 更新进度
  document.getElementById('progress-fill').style.width = `${((index) / STATE.words.length) * 100}%`;
  document.getElementById('progress-text').textContent = `${index + 1}/${STATE.words.length}`;

  // 隐藏测验，恢复单词显示
  const quizEl = document.getElementById('learn-quiz');
  quizEl.style.display = 'none';
  document.getElementById('word-display').style.display = 'block';
  document.getElementById('btn-chinese').style.display = 'inline-block';
  document.getElementById('btn-next').style.display = 'inline-block';
  // 根据排程决定按钮文字
  const isQuizPoint = STATE.quizSchedule.includes(index);
  const isLast = index >= STATE.words.length - 1;
  if (isQuizPoint) {
    document.getElementById('btn-next').textContent = '答题 →';
  } else if (isLast) {
    document.getElementById('btn-next').textContent = '完成学习 →';
  } else {
    document.getElementById('btn-next').textContent = '下一个 →';
  }

  // 显示单词
  const elInfo = DATA.getElementInfo(w.element);
  document.getElementById('learn-element').textContent = `${elInfo.icon} ${w.element}`;
  document.getElementById('learn-element').style.color = elInfo.color;
  document.getElementById('word-english').textContent = w.word;
  document.getElementById('word-english').style.color = elInfo.color;
  document.getElementById('word-chinese').textContent = w.cn;
  document.getElementById('word-chinese').style.display = 'none';
  document.getElementById('word-sentence').textContent = w.sentence;

  // 自动朗读当前单词
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

/** 点击"答题"或"下一个"按钮 */
function onNextClick() {
  if (STATE.isThemeMode) {
    onThemeNextClick();
    return;
  }
  if (STATE._quizAnswered) {
    showWord(STATE.wordIndex + 1);
  } else if (STATE.quizSchedule.includes(STATE.wordIndex)) {
    showQuiz();
  } else {
    showWord(STATE.wordIndex + 1);
  }
}

function onThemeNextClick() {
  if (STATE._quizAnswered) {
    showThemeWord(STATE.wordIndex + 1);
  } else if (STATE.quizSchedule.includes(STATE.wordIndex)) {
    showQuiz();
  } else {
    showThemeWord(STATE.wordIndex + 1);
  }
}

/* ========== 随堂测验 ========== */

/** 从已学单词中随机抽选，生成一道中英配对选择 */
function showQuiz() {
  // 从已学单词（含当前词）中挑一个未测过的词，都测过则随机
  const seenWords = STATE.words.slice(0, STATE.wordIndex + 1);
  const unquizzed = seenWords.filter(w => !STATE._quizzedWords.has(w.word));
  const w = unquizzed.length > 0 ? DATA.randomPick(unquizzed) : DATA.randomPick(seenWords);
  if (!w) return;
  STATE._quizAnswered = false;
  STATE._quizzedWords.add(w.word);

  // 随机选择题型
  const isEngToCn = Math.random() < 0.5;

  // 生成干扰项：从当前词组的其他词中取 cn 或 word
  const pool = STATE.words.filter(other => {
    if (isEngToCn) return other.cn !== w.cn;
    return other.word.toLowerCase() !== w.word.toLowerCase();
  });
  let distractors = DATA.shuffleArray([...pool]).slice(0, 3);
  // 干扰项不足时从全局词库补充
  if (distractors.length < 3) {
    const allWords = Object.values(DATA.byElement).flat();
    const extra = DATA.shuffleArray(allWords.filter(v => {
      if (isEngToCn) return v.cn !== w.cn;
      return v.word.toLowerCase() !== w.word.toLowerCase();
    }));
    for (const v of extra) {
      if (distractors.length >= 3) break;
      if (!distractors.some(d => d.word === v.word)) distractors.push(v);
    }
  }

  // 构建选项：1 正确 + 3 干扰
  const correctAnswer = isEngToCn ? w.cn : w.word;
  let options = [
    { text: correctAnswer, correct: true },
    ...distractors.map(d => ({
      text: isEngToCn ? d.cn : d.word,
      correct: false,
    })),
  ];
  options = DATA.shuffleArray(options);

  // 渲染
  const question = isEngToCn
    ? `"${w.word}" 是什么意思？`
    : `"${w.cn}" 对应的英文是？`;
  document.getElementById('quiz-question').textContent = question;

  const optsContainer = document.getElementById('quiz-options');
  optsContainer.innerHTML = '';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt.text;
    btn.dataset.correct = opt.correct ? '1' : '0';
    btn.addEventListener('click', () => handleQuizAnswer(btn));
    optsContainer.appendChild(btn);
  }

  // 隐藏反馈和继续按钮
  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-continue').style.display = 'none';

  // 显示测验，隐藏单词（防止直接视觉匹配）
  document.getElementById('word-display').style.display = 'none';
  document.getElementById('btn-chinese').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('learn-quiz').style.display = 'block';
}

function handleQuizAnswer(selectedBtn) {
  if (STATE._quizAnswered) return;
  STATE._quizAnswered = true;
  STATE.quizTotal++;

  const isCorrect = selectedBtn.dataset.correct === '1';
  if (isCorrect) STATE.quizCorrect++;

  // 禁用所有选项
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.classList.add('quiz-disabled');
    if (btn.dataset.correct === '1') btn.classList.add('quiz-correct');
    if (btn === selectedBtn && !isCorrect) btn.classList.add('quiz-wrong');
  });

  // 显示反馈
  const feedback = document.getElementById('quiz-feedback');
  const isLast = STATE.wordIndex >= STATE.words.length - 1;
  if (isCorrect) {
    feedback.className = 'quiz-feedback fb-correct';
    feedback.textContent = '✓ 正确！';
  } else {
    const correctBtn = document.querySelector('.quiz-option[data-correct="1"]');
    feedback.className = 'quiz-feedback fb-wrong';
    feedback.textContent = `✗ 正确答案是 "${correctBtn ? correctBtn.textContent : ''}"`;
  }
  feedback.style.display = 'block';

  // 显示继续按钮
  const contBtn = document.getElementById('quiz-continue');
  if (STATE.isThemeMode) {
    contBtn.textContent = isLast ? '完成 →' : '继续 →';
  } else {
    contBtn.textContent = isLast ? '开始连句 →' : '继续 →';
  }
  contBtn.style.display = 'block';
}

function advanceAfterQuiz() {
  const isLast = STATE.wordIndex >= STATE.words.length - 1;
  if (STATE.isThemeMode) {
    if (isLast) {
      startSpellingPhase();
    } else {
      showThemeWord(STATE.wordIndex + 1);
    }
    return;
  }
  if (isLast) {
    startSentence();
  } else {
    showWord(STATE.wordIndex + 1);
  }
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
  for (let i = 0; i < shuffled.length; i++) {
    const w = shuffled[i];
    const origIdx = STATE.words.indexOf(w);
    const card = document.createElement('div');
    card.className = 'bank-card';
    card.dataset.widx = origIdx;
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
  // 允许重复词：按出现次数计数（如 the the 需要两个 the）
  const countInSentence = STATE.userSentence.filter(w => w.word === word.word).length;
  const countInWords = STATE.words.filter(w => w.word === word.word).length;
  if (countInSentence >= countInWords) return;
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
  // 统计 userSentence 中每个词的出现次数
  const usedCount = {};
  for (const w of STATE.userSentence) {
    usedCount[w.word] = (usedCount[w.word] || 0) + 1;
  }
  document.querySelectorAll('.bank-card').forEach(card => {
    const widx = parseInt(card.dataset.widx, 10);
    const w = STATE.words[widx];
    // 看这个位置的词是否已被使用（按词出现次数计数）
    const precedingSame = STATE.words.slice(0, widx).filter(x => x.word === w.word).length;
    const used = (usedCount[w.word] || 0) > precedingSame;
    card.classList.toggle('used', used);
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
  else cardCount = 0;

  // 测验全对奖励：额外+1张卡
  if (STATE.quizCorrect === STATE.quizTotal && STATE.quizTotal > 0) {
    cardCount += 1;
  }

  // 计算经验值（含测验准确率乘数）
  const xpGain = getStudyXp(attempts, mode, STATE.quizCorrect, STATE.quizTotal);

  // 存储奖励信息
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
      quality: 'common',
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
  let maxCap = getMaxBackpackCapacity(level);
  // 兼容旧用户：卡片超过当前上限时自动补足
  if (bp.length > maxCap) {
    addBackpackSlot(bp.length - maxCap);
    maxCap = getMaxBackpackCapacity(level);
  }
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
      const q = entry.quality || 'common';
      const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
      card.innerHTML = `
        <span class="bp-element">${elInfo.icon}</span>
        <div class="bp-info">
          <div class="bp-word" style="color:${elInfo.color}">${entry.word}</div>
          <div class="bp-cn">${entry.cn}</div>
          <div class="bp-date">${entry.date}</div>
        </div>
        <span class="quality-badge" style="background:${qi.color};color:#fff;font-size:10px;padding:1px 5px;border-radius:6px;position:absolute;top:3px;right:3px;line-height:1.4">${qi.icon}</span>
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
      } else if (item.itemType === 'avatar_unlock') {
        icon = '🖼️';
        label = '头像解锁';
        sublabel = '特殊头像已解锁';
      } else if (item.itemType === 'element_reset') {
        icon = '💊';
        label = '五行洗髓丹';
        sublabel = '可重置本命五行';
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

/* ========== 卡片合成 ========== */
let _fusionSelections = [null, null]; // [{index, card}]

function showFusionScreen() {
  _fusionSelections = [null, null];
  document.getElementById('fusion-slot-0').innerHTML = '+';
  document.getElementById('fusion-slot-0').className = 'fusion-slot';
  document.getElementById('fusion-slot-1').innerHTML = '+';
  document.getElementById('fusion-slot-1').className = 'fusion-slot';
  document.getElementById('fusion-result').textContent = '?';
  document.getElementById('btn-fusion-execute').disabled = true;
  document.getElementById('fusion-hint').textContent = '选择两张同一单词、同一品质的卡片合成，提升品质';
  renderFusionCardList();
  showScreen('screen-fusion');
}

function renderFusionCardList() {
  const bp = loadBackpack();
  const container = document.getElementById('fusion-card-list');
  container.innerHTML = '';

  // 统计各单词各品质的数量
  const countMap = {};
  for (let i = 0; i < bp.length; i++) {
    const card = bp[i];
    if (card.type === 'item') continue;
    const q = card.quality || 'common';
    const key = card.word.toLowerCase() + '|' + q;
    if (!countMap[key]) countMap[key] = [];
    countMap[key].push(i);
  }

  // 仅显示可合成的（数量≥2且品质不是传说）
  const eligible = [];
  for (const [key, indices] of Object.entries(countMap)) {
    if (indices.length < 2) continue;
    const card = bp[indices[0]];
    if (card.quality === 'legendary') continue;
    eligible.push({ card, indices });
  }

  if (eligible.length === 0) {
    container.innerHTML = '<p class="hint" style="width:100%;text-align:center">没有可合成的卡片，需要至少两张相同单词、相同品质</p>';
    return;
  }

  for (const { card, indices } of eligible) {
    const q = card.quality || 'common';
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const nextQi = CARD_QUALITIES[QUALITY_ORDER[QUALITY_ORDER.indexOf(q) + 1]];
    const elInfo = DATA.getElementInfo(card.element);
    const div = document.createElement('div');
    div.className = 'fusion-card-item';
    div.style.background = elInfo ? elInfo.bg : '#fff';
    div.innerHTML = `
      <div class="fci-word" style="color:${elInfo ? elInfo.color : '#333'}">${card.word}</div>
      <div class="fci-cn">${card.cn}</div>
      <div><span class="fci-quality" style="color:${qi.color}">${qi.icon} ${qi.label}</span> ×${indices.length}</div>
      <div style="font-size:11px;color:#888;margin-top:2px">→ ${nextQi ? nextQi.icon : '?'}</div>
    `;
    div.addEventListener('click', () => {
      // 选择此组中的前两张卡
      const idx0 = indices[0];
      const idx1 = indices[1];
      fusionSelectCards(idx0, idx1, card);
    });
    container.appendChild(div);
  }
}

function fusionSelectCards(idx0, idx1, card) {
  _fusionSelections = [
    { index: idx0, card },
    { index: idx1, card },
  ];
  const q = card.quality || 'common';
  const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
  const nextQ = QUALITY_ORDER[QUALITY_ORDER.indexOf(q) + 1];
  const nextQi = nextQ ? (CARD_QUALITIES[nextQ] || qi) : qi;

  const elInfo = DATA.getElementInfo(card.element);
  const color = elInfo ? elInfo.color : '#333';

  // 更新槽位
  for (let i = 0; i < 2; i++) {
    const slot = document.getElementById('fusion-slot-' + i);
    slot.className = 'fusion-slot selected';
    slot.innerHTML = `<span class="fs-word" style="color:${color}">${card.word}</span><span class="fs-quality" style="color:${qi.color}">${qi.icon}</span>`;
  }

  // 更新结果
  const result = document.getElementById('fusion-result');
  result.innerHTML = nextQi ? `<span style="color:${nextQi.color}">${nextQi.icon}</span><span style="color:${color};font-size:13px">${card.word}</span><span style="font-size:11px;color:#888">${nextQi.label}</span>` : '?';

  document.getElementById('btn-fusion-execute').disabled = false;
  document.getElementById('fusion-hint').textContent = `确认将两张「${card.word}」(${qi.label})合成为${nextQi ? nextQi.label : '?'}？`;
}

function fusionSelectSlot(slotIndex) {
  // 如果已选就取消选择
  if (_fusionSelections[slotIndex]) {
    _fusionSelections[slotIndex] = null;
    const slot = document.getElementById('fusion-slot-' + slotIndex);
    slot.className = 'fusion-slot';
    slot.innerHTML = '+';
    document.getElementById('btn-fusion-execute').disabled = true;
    document.getElementById('fusion-hint').textContent = '选择两张同一单词、同一品质的卡片合成，提升品质';
    return;
  }
  // 否则重新打开选择列表
  renderFusionCardList();
}

function executeFusion() {
  const sel = _fusionSelections;
  if (!sel[0] || !sel[1]) return;
  if (sel[0].index === sel[1].index) {
    showToast('❌ 不能选择同一张卡');
    return;
  }

  const bp = loadBackpack();
  const card0 = bp[sel[0].index];
  const card1 = bp[sel[1].index];
  if (!card0 || !card1) {
    showToast('❌ 卡片已不存在');
    showFusionScreen();
    return;
  }

  const q = card0.quality || 'common';
  if ((card1.quality || 'common') !== q || card0.word.toLowerCase() !== card1.word.toLowerCase()) {
    showToast('❌ 卡片不匹配，请重新选择');
    showFusionScreen();
    return;
  }

  const nextQ = QUALITY_ORDER[QUALITY_ORDER.indexOf(q) + 1];
  if (!nextQ) {
    showToast('❌ 已达到最高品质');
    showFusionScreen();
    return;
  }

  // 删除两张卡，加一张高一品质的卡
  const removeIndices = [sel[0].index, sel[1].index].sort((a, b) => b - a);
  for (const idx of removeIndices) {
    bp.splice(idx, 1);
  }
  bp.push({
    word: card0.word, cn: card0.cn, element: card0.element,
    pos: card0.pos || '', sentence: card0.sentence || '',
    date: new Date().toISOString().slice(0, 10),
    quality: nextQ,
  });
  saveBackpack(bp);

  showToast(`✅ ${card0.word} → ${CARD_QUALITIES[nextQ].label}`);
  showFusionScreen();
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
    } else if (item.itemType === 'avatar_unlock') {
      icon = '🖼️'; label = '头像解锁'; sublabel = `「${getAvatarLabel(item.specialId)}」`;
    } else if (item.itemType === 'element_reset') {
      icon = '💊'; label = '五行洗髓丹'; sublabel = '重置本命五行';
    } else if (item.itemType === 'xp_boost') {
      icon = '⏫'; label = '经验加倍符'; sublabel = '15分钟×2经验';
    } else if (item.itemType === 'lucky_charm') {
      icon = '🍀'; label = '幸运护符'; sublabel = '一次Boss战掉落×1.5';
    } else if (item.itemType === 'revival_stone') {
      icon = '💎'; label = '复活石'; sublabel = 'HP归零恢复50%';
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
  } else if (item.itemType === 'avatar_unlock') {
    icon = '🖼️'; name = '头像解锁道具';
    desc = `解锁特殊头像「${getAvatarLabel(item.specialId)}」。此道具会自动生效，可在更换头像界面使用该头像。`;
    showUse = false;
  } else if (item.itemType === 'element_reset') {
    icon = '💊'; name = '五行洗髓丹';
    desc = '使用后可重新选择本命五行。注意：基础属性将按新五行重新计算，但等级成长和道具加成都不会丢失。';
  } else if (item.itemType === 'xp_boost') {
    icon = '⏫'; name = '经验加倍符';
    desc = '使用后15分钟内所有经验获得×2。重复使用重置计时。';
  } else if (item.itemType === 'lucky_charm') {
    icon = '🍀'; name = '幸运护符';
    desc = '使用后下一次Boss战所有掉落率×1.5（最高不超过100%）。仅生效一次。';
  } else if (item.itemType === 'revival_stone') {
    icon = '💎'; name = '复活石';
    desc = '战斗中HP归零时自动触发，恢复50%生命值。道具会被消耗。';
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
  } else if (item.itemType === 'element_reset') {
    showModal('确定使用「五行洗髓丹」重新选择本命五行吗？当前五行的等级成长和道具加成都不会丢失，仅基础属性按新五行重新计算。', () => {
      closeModal();
      consumeItem(_selectedItemIndex);
      _changingElement = true;
      showChangeElementScreen();
    });
  } else if (item.itemType === 'xp_boost') {
    showModal('确定使用「经验加倍符」吗？效果：15分钟内所有经验获得×2。重复使用重置计时。', () => {
      closeModal();
      BOOST_STATE.xpBoostEndTime = Date.now() + 15 * 60 * 1000;
      saveLocal('xpBoostEnd', BOOST_STATE.xpBoostEndTime);
      consumeItem(_selectedItemIndex);
      showToast('⏫ 经验加倍已激活！持续15分钟');
    });
  } else if (item.itemType === 'lucky_charm') {
    showModal('确定使用「幸运护符」吗？效果：下一次Boss战所有掉落率×1.5（最高不超过100%）。', () => {
      closeModal();
      BOOST_STATE.luckyCharmActive = true;
      consumeItem(_selectedItemIndex);
      showToast('🍀 幸运护符已激活！下次Boss战生效');
    });
  }
}

function consumeItem(index) {
  const items = loadItems();
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    saveItems(items);
    // track item usage
    const achStats3 = loadAchStats();
    achStats3.itemsUsed = (achStats3.itemsUsed || 0) + 1;
    saveAchStats(achStats3);
    checkAchievements('after_item_use');
  }
  // 刷新背包
  showItemBackpack();
}

/* ========== 装备系统 ========== */
function showEquip() {
  const equip = loadEquip();
  renderEquipSlots(equip);
  renderEquipSummary(equip);
  document.getElementById('equip-card-picker').style.display = 'none';
  showScreen('screen-equip-slots');
}

function renderEquipSlots(equip) {
  const container = document.getElementById('equip-slots');
  container.innerHTML = '';

  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const slot = EQUIP_SLOTS[i];
    const card = equip[i];
    const div = document.createElement('div');
    div.className = 'equip-slot' + (card ? ' filled' : '');

    const posLabel = document.createElement('div');
    posLabel.className = 'slot-pos';
    posLabel.textContent = slot.icon + ' ' + slot.label;
    div.appendChild(posLabel);

    if (card) {
      const elInfo = DATA.getElementInfo(card.element);
      const word = document.createElement('div');
      word.className = 'slot-word';
      word.style.color = elInfo ? elInfo.color : '#333';
      word.textContent = card.word;
      div.appendChild(word);

      const cn = document.createElement('div');
      cn.className = 'slot-cn';
      cn.textContent = card.cn;
      div.appendChild(cn);

      const bonus = document.createElement('div');
      bonus.className = 'slot-bonus';
      const q2 = card.quality || 'common';
const qi2 = CARD_QUALITIES[q2] || CARD_QUALITIES.common;
const wlen2 = card.word.length;
const pct2 = Math.round(wlen2 * qi2.coeff * 100);
const flat2 = wlen2 * qi2.level;
const bonusText2 = flat2 > 0 ? `+${pct2}%+${flat2}` : `+${pct2}%`;
bonus.textContent = `${qi2.icon} ${qi2.label} ${bonusText2}`;
      div.appendChild(bonus);
    } else {
      const emptyIcon = document.createElement('div');
      emptyIcon.className = 'slot-empty-icon';
      emptyIcon.textContent = '⬜';
      div.appendChild(emptyIcon);

      const emptyText = document.createElement('div');
      emptyText.className = 'slot-empty-text';
      emptyText.textContent = '点击装备';
      div.appendChild(emptyText);
    }

    div.addEventListener('click', () => openEquipPicker(i));
    container.appendChild(div);
  }
}

function renderEquipSummary(equip) {
  const container = document.getElementById('equip-summary');
  const bonusMap = { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 };

  for (const slot of equip) {
    if (!slot || !slot.element) continue;
    const key = ELEMENT_TO_BONUS[slot.element];
    if (!key) continue;
    const q = (slot.quality || 'common');
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const wlen = slot.word ? slot.word.length : 1;
    bonusMap[key] += Math.round(wlen * qi.coeff * 100) + wlen * qi.level;
  }

  const total = Object.values(bonusMap).filter(v => v > 0).length;
  if (total === 0) {
    container.innerHTML = '<p class="hint" style="margin:0">尚未装备任何卡片</p>';
    return;
  }

  const names = { wood: '木❤️HP', fire: '火⚔️ATK', earth: '土🛡️DEF', water: '水✨SPD', metal: '金⚡CRI' };
  let html = '<h3>当前加成</h3>';
  for (const [key, val] of Object.entries(bonusMap)) {
    if (val > 0) {
      html += '<div class="sum-row">' + names[key] + ' +' + val + '</div>';
    }
  }
  container.innerHTML = html;
}

function openEquipPicker(slotIndex) {
  const slot = EQUIP_SLOTS[slotIndex];
  const bp = loadBackpack();
  const equip = loadEquip();

  // 收集已装备到其他槽的单词（当前槽可换，其他槽的不允许重复选）
  const equippedInOtherSlots = new Set();
  for (let i = 0; i < equip.length; i++) {
    if (i !== slotIndex && equip[i]) {
      equippedInOtherSlots.add(equip[i].word);
    }
  }

  // 保留原始索引，排除其他槽已装备的卡片
  const candidates = [];
  for (let i = 0; i < bp.length; i++) {
    const card = bp[i];
    if (card.pos === slot.pos && !equippedInOtherSlots.has(card.word)) {
      candidates.push({ index: i, card });
    }
  }

  const panel = document.getElementById('equip-card-picker');
  const title = document.getElementById('equip-picker-title');
  const list = document.getElementById('equip-picker-list');
  const empty = document.getElementById('equip-picker-empty');

  title.textContent = '选择' + slot.label + '卡（' + candidates.length + '张可用）';
  list.innerHTML = '';
  panel.style.display = 'block';
  panel.dataset.slotIndex = slotIndex;

  // 如果该槽已有装备，显示卸下按钮
  if (equip[slotIndex]) {
    const unequipBtn = document.createElement('div');
    unequipBtn.className = 'equip-unequip-btn';
    unequipBtn.innerHTML = '⬅ 卸下「' + equip[slotIndex].word + '」';
    unequipBtn.addEventListener('click', () => unequipCard(slotIndex));
    list.appendChild(unequipBtn);
    list.appendChild(document.createElement('hr'));
  }

  if (candidates.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  for (const { index, card: w } of candidates) {
    const elInfo = DATA.getElementInfo(w.element);
    const q = w.quality || 'common';
    const qi = CARD_QUALITIES[q] || CARD_QUALITIES.common;
    const card = document.createElement('div');
    card.className = 'equip-picker-card';
    if (elInfo) card.style.background = elInfo.bg;
    card.innerHTML = '<div class="ep-word" style="color:' + (elInfo ? elInfo.color : '#333') + '">' + w.word + '</div>' +
      '<div class="ep-cn">' + w.cn + '</div>' +
      '<div style="font-size:11px;color:#999;margin-top:2px">' + (elInfo ? elInfo.icon : '') + ' ' + w.element + '</div>' +
      '<div style="font-size:10px;color:#666;margin-top:1px">' + qi.icon + ' ' + qi.label + '</div>';
    card.addEventListener('click', () => equipSelectedCard(slotIndex, index));
    list.appendChild(card);
  }
}

function equipSelectedCard(slotIndex, bpIndex) {
  const bp = loadBackpack();
  const equip = loadEquip();

  // 如果该槽已有装备，先退回背包
  if (equip[slotIndex]) {
    bp.push(equip[slotIndex]);
  }

  // 从背包移除新卡
  const card = bp.splice(bpIndex, 1)[0];
  if (!card) {
    saveBackpack(bp);
    saveEquip(equip);
    return;
  }

  // 存入装备槽
  equip[slotIndex] = { word: card.word, cn: card.cn, element: card.element, pos: card.pos, quality: card.quality || 'common' };

  saveBackpack(bp);
  saveEquip(equip);

  renderEquipSlots(equip);
  renderEquipSummary(equip);
  document.getElementById('equip-card-picker').style.display = 'none';
  showToast('✅ 已装备「' + card.word + '」');
}

function unequipCard(slotIndex) {
  const bp = loadBackpack();
  const equip = loadEquip();

  const card = equip[slotIndex];
  if (!card) return;

  // 退回背包
  bp.push(card);
  equip[slotIndex] = null;
  saveBackpack(bp);
  saveEquip(equip);

  renderEquipSlots(equip);
  renderEquipSummary(equip);
  document.getElementById('equip-card-picker').style.display = 'none';
  showToast('⬅ 已卸下「' + card.word + '」');
}

function closeEquipPicker() {
  document.getElementById('equip-card-picker').style.display = 'none';
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

async function showBlankCardInput() {
  // 预先加载参考词库
  await DATA.loadReference();

  // 构建输入弹窗
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '150';
  overlay.id = 'blank-card-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-box blank-card-modal';
  modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;padding:24px;width:90%;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,0.2);z-index:151;text-align:center';

  // 初始化元素选择状态
  _blankCardCallback = null;

  modal.innerHTML = `
    <div style="font-size:36px;margin-bottom:8px">🃏</div>
    <h3 style="margin-bottom:8px;margin-top:0">创建自定义单词</h3>
    <p style="font-size:13px;color:#888;margin-bottom:16px">输入英文单词和中文释义，确认后加入技能背包</p>
    <div style="margin-bottom:12px">
      <input id="bc-english" type="text" placeholder="英文单词" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px;outline:none;box-sizing:border-box">
    </div>
    <div style="margin-bottom:16px">
      <input id="bc-chinese" type="text" placeholder="中文释义" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px;outline:none;box-sizing:border-box">
    </div>
    <div id="bc-error" style="font-size:14px;color:#e53935;margin-bottom:8px;min-height:20px;font-weight:600"></div>
    <div id="bc-element-picker" style="display:none;margin-bottom:12px;padding:12px;background:#fafafa;border-radius:12px">
      <p style="font-size:14px;color:#333;margin:0 0 10px 0;font-weight:600">选择这个词的五行属性：</p>
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

  document.getElementById('bc-error').textContent = '';

  // 自动对焦
  setTimeout(() => document.getElementById('bc-english')?.focus(), 100);
}

function cancelBlankCard() {
  document.getElementById('blank-card-overlay')?.remove();
  document.querySelector('.blank-card-modal')?.remove();
  _blankCardCallback = null;
}

async function confirmBlankCard() {
  try {
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

    // 查参考词库（若预先加载失败则重试）
    await DATA.loadReference();
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
        btn.style.cssText = `background:${el.bg};padding:10px 12px;border-radius:10px;border:2px solid transparent;cursor:pointer;text-align:center;min-width:64px;transition:all 0.15s`;
        btn.dataset.element = el.name;
        btn.innerHTML = `<div style="font-size:28px">${el.icon}</div><div style="font-size:13px;font-weight:700;color:${el.color}">${el.name}</div>`;
        btn.addEventListener('click', () => {
          document.querySelectorAll('#bc-element-options .element-card').forEach(c => {
            c.style.borderColor = 'transparent';
            c.style.transform = 'scale(1)';
          });
          btn.style.borderColor = el.color;
          btn.style.transform = 'scale(1.08)';
          btn.dataset.selected = 'true';
          _blankCardCallback = el.name;
          document.getElementById('bc-error').textContent = '';
        });
        options.appendChild(btn);
      }
      elemPicker.style.display = 'block';
      errorEl.textContent = '请选择一个五行属性';
      document.getElementById('bc-confirm').textContent = '完成创建';
      return;
    }

    // 第二次确认：检查五行是否已选
    const selectedElement = _blankCardCallback;
    if (!selectedElement) {
      errorEl.textContent = '请先点击选择一个五行属性';
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
      quality: 'common',
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
  } catch (e) {
    console.error('空白单词卡出错:', e);
    const errorEl = document.getElementById('bc-error');
    if (errorEl) errorEl.textContent = '操作失败：' + e.message;
  }
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
    STATE.isThemeMode = false;
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
  _revived: false,  // 本场战斗是否已使用过复活石
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
    { id: 'letter', label: '初级·拼词', icon: '🔤', desc: '用字母拼单词攻击 · 适合1-4年级', locked: false },
    { id: 'sentence', label: '中级·造句', icon: '📝', desc: '用单词卡造句攻击 · 适合5-6年级', locked: false },
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
  BATTLE.isLetterMode = (level === 'letter');
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
  if (BATTLE.isLetterMode) {
    showLetterEquipScreen();
  } else {
    showEquipScreen();
  }
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
    const qq = card.quality || 'common';
    const qqi = CARD_QUALITIES[qq] || CARD_QUALITIES.common;
    div.innerHTML = `
      <span class="eq-word">${card.word}</span>
      <span class="eq-cn">${card.cn}</span>
      <span style="font-size:9px;color:#999;margin-top:1px;display:block">${qqi.icon} ${qqi.label}</span>
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

/* ========== 字母装备（低年级拼词模式） ========== */
function showLetterEquipScreen() {
  const lb = loadLetterBag();
  const availableLetters = [...lb].sort();
  const grid = document.getElementById('equip-grid');
  const hint = document.getElementById('equip-hint');
  const count = document.getElementById('equip-count');

  if (availableLetters.length < 12) {
    hint.textContent = `❗ 需要至少解锁12个字母，你只有 ${availableLetters.length} 个。先去学习模式收集吧！`;
    hint.style.color = '#e53935';
    grid.innerHTML = '';
    count.textContent = `已选 0 个字母`;
    document.getElementById('equip-element-counts').innerHTML = '';
    document.getElementById('btn-equip-confirm').disabled = true;
    document.getElementById('btn-equip-confirm').onclick = null;
    showScreen('screen-equip');
    return;
  }

  // 检查五行覆盖
  const elementSet = new Set();
  for (const ch of availableLetters) {
    elementSet.add(DATA.getLetterElement(ch));
  }
  const missing = DATA.ELEMENTS.map(e => e.name).filter(el => !elementSet.has(el));
  if (missing.length > 0) {
    hint.textContent = `❗ 缺少 ${missing.join('、')} 属性的字母，需要所有五行才能出战`;
    hint.style.color = '#e53935';
    grid.innerHTML = '';
    count.textContent = `已选 0 个字母`;
    document.getElementById('equip-element-counts').innerHTML = '';
    document.getElementById('btn-equip-confirm').disabled = true;
    document.getElementById('btn-equip-confirm').onclick = null;
    showScreen('screen-equip');
    return;
  }

  hint.textContent = '点击字母选择出战（至少12个，必须含全部五行）。战斗中字母可重复使用，同一个字母可多次放入槽位';
  hint.style.color = '';
  BATTLE._selectedLetters = [];

  grid.innerHTML = '';
  const elementOrder = DATA.ELEMENTS.map(e => e.name);
  const grouped = {};
  for (const el of elementOrder) grouped[el] = [];

  for (const ch of availableLetters) {
    const el = DATA.getLetterElement(ch);
    if (grouped[el]) grouped[el].push(ch);
  }

  for (const el of elementOrder) {
    const letters = grouped[el] || [];
    if (letters.length === 0) continue;
    const elInfo = DATA.getElementInfo(el);
    const groupDiv = document.createElement('div');
    groupDiv.style.cssText = 'margin-bottom:8px';
    groupDiv.innerHTML = `<div style="font-size:12px;color:${elInfo.color};font-weight:700;margin-bottom:4px">${elInfo.icon} ${el} (${letters.length})</div>`;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
    for (const ch of letters) {
      const tile = document.createElement('div');
      tile.className = `letter-tile tile-elem-${elInfo.id}`;
      tile.style.width = '40px';
      tile.style.height = '44px';
      tile.style.fontSize = '18px';
      tile.style.opacity = '0.4';        // 初始为未选中状态
      tile.style.borderStyle = 'dashed';
      tile.dataset.letter = ch;
      tile.textContent = ch.toLowerCase();
      tile.addEventListener('click', () => toggleLetterEquip(ch, tile));
      row.appendChild(tile);
    }
    groupDiv.appendChild(row);
    grid.appendChild(groupDiv);
  }

  BATTLE._selectedLetters = [];
  count.textContent = `已选 0 个字母`;
  document.getElementById('equip-element-counts').innerHTML = '';
  document.getElementById('btn-equip-confirm').disabled = true;
  document.getElementById('btn-equip-confirm').onclick = confirmLetterEquip;
  showScreen('screen-equip');
}

function toggleLetterEquip(ch, tileEl) {
  const idx = BATTLE._selectedLetters.indexOf(ch);
  if (idx >= 0) {
    BATTLE._selectedLetters.splice(idx, 1);
    tileEl.style.opacity = '0.4';
    tileEl.style.borderStyle = 'dashed';
  } else {
    BATTLE._selectedLetters.push(ch);
    tileEl.style.opacity = '1';
    tileEl.style.borderStyle = 'solid';
    tileEl.style.borderWidth = '3px';
  }

  // 更新计数
  const count = document.getElementById('equip-count');
  count.textContent = `已选 ${BATTLE._selectedLetters.length} 个字母`;

  // 五行统计
  const counts = {};
  for (const letter of BATTLE._selectedLetters) {
    const el = DATA.getLetterElement(letter);
    counts[el] = (counts[el] || 0) + 1;
  }
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

  // 验证：至少12个 + 全五行
  const allFive = DATA.ELEMENTS.every(e => (counts[e.name] || 0) > 0);
  document.getElementById('btn-equip-confirm').disabled = !(BATTLE._selectedLetters.length >= 12 && allFive);
}

function confirmLetterEquip() {
  const letters = BATTLE._selectedLetters;
  if (letters.length < 12) {
    document.getElementById('equip-hint').textContent = '❗ 至少选择12个字母';
    document.getElementById('equip-hint').style.color = '#e53935';
    return;
  }
  // 检查五行覆盖
  const counts = {};
  for (const ch of letters) {
    const el = DATA.getLetterElement(ch);
    counts[el] = (counts[el] || 0) + 1;
  }
  const allFive = DATA.ELEMENTS.every(e => (counts[e.name] || 0) > 0);
  if (!allFive) {
    document.getElementById('equip-hint').textContent = '❗ 需要覆盖全部五行';
    document.getElementById('equip-hint').style.color = '#e53935';
    return;
  }

  initLetterBattle(letters);
}

function initLetterBattle(selectedLetters) {
  const boss = BATTLE.boss;
  const playerLevel = getLevel(loadXp());
  const pStats = getPlayerStats(playerLevel);
  BATTLE.bossHp = boss.maxHp;
  BATTLE.bossMaxHp = boss.maxHp;
  BATTLE.playerHp = pStats.maxHp;
  BATTLE.playerMaxHp = pStats.maxHp;
  BATTLE.handCards = [];
  BATTLE.consumedSet = new Set();
  BATTLE.phase = 'boss';
  BATTLE.roundCount = 0;
  BATTLE.bossCorrectCount = 0;
  BATTLE.totalDamageDealt = 0;
  BATTLE.currentQuestion = null;
  BATTLE.selectedIndices = [];
  BATTLE.berserkSubRound = 0;
  BATTLE._revived = false;

  // 字母模式特有
  BATTLE.isLetterMode = true;
  BATTLE.battleLetters = [...selectedLetters];     // 当前可用字母
  BATTLE.battleLetterPlaced = [];                   // 当前摆放的字母索引
  BATTLE.battleLetterConsumed = new Set();          // 已消耗的字母索引

  startLetterBattle();
}

function startLetterBattle() {
  const boss = BATTLE.boss;
  const elInfo = DATA.getElementInfo(boss.element);
  document.getElementById('b-boss-icon').textContent = boss.icon;
  document.getElementById('b-boss-name').textContent = boss.name;
  document.getElementById('b-boss-atk').textContent = boss.atk;
  document.getElementById('b-boss-def').textContent = boss.def;
  const pLevel = getLevel(loadXp());
  document.querySelector('.battle-level-badge').textContent = `Lv.${pLevel}`;

  // 字母模式隐藏手牌区
  document.getElementById('battle-hand').style.display = 'none';

  updateHpBars();
  showScreen('screen-battle');
  bossTurn();
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
  BATTLE._revived = false;

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

  // 确保手牌区显示（非字母模式）
  document.getElementById('battle-hand').style.display = 'block';

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
/* === 初级挑战模式 Boss 出题（多种题型） === */
function generateLetterBossQuestion() {
  const types = ['cloze', 'match-cn', 'word-class'];
  const type = DATA.randomPick(types);
  return pracGenQuestion(type, 'grade3-4');
}

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
  let question;
  if (BATTLE.isLetterMode) {
    question = generateLetterBossQuestion();
    if (!question) question = DATA.generateClozeQuestion();
  } else {
    question = DATA.generateClozeQuestion('intermediate');
  }
  BATTLE.currentQuestion = question;

  // 出题失败安全处理
  if (!question) {
    transitionMsg('❌ 题目生成失败，请稍后再试', '退出战斗', () => {
      BATTLE.playerHp = 0;
      endBattle(false);
    });
    return;
  }

  const qEl = document.getElementById('bq-question');
  if (question.typeLabel) {
    // 通用多题型格式（letter mode）
    qEl.innerHTML = `<span class="boss-q-badge">${question.typeLabel}</span> ${question.question}`;
  } else {
    // 传统完形填空格式（sentence mode）
    qEl.innerHTML = `"${question.displaySentence}"<br><small style="font-size:14px;color:#888;font-weight:400">选择正确的词填入空白</small>`;
  }

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
    btn.textContent = opt.text || `${opt.word} (${opt.cn})`;
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
    // Boss掉血（固定10点奖励伤害）
    BATTLE.bossCorrectCount++;
    BATTLE.bossHp -= 10;
    BATTLE.totalDamageDealt += 10;
    resultEl.className = 'bq-result bq-correct';

    if (BATTLE.isLetterMode) {
      resultEl.innerHTML = `✅ 正确！Boss掉了10点HP！`;
    } else {
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
    }
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
    const correctOpt = question.options.find(o => o.isCorrect);
    const correctText = correctOpt.text || correctOpt.word || '';
    resultEl.innerHTML = `❌ 答错了！你掉了${rawDmg}点HP！${berserkLabel}<br>正确答案是「${correctText}」`;
    updateHpBars();

      if (BATTLE.playerHp <= 0) {
        BATTLE.playerHp = 0;
        updateHpBars();
        // check revival stone
        const reviveIdx = loadItems().findIndex(it => it.itemType === 'revival_stone');
        if (reviveIdx >= 0 && !BATTLE._revived) {
          showRevivalModal(reviveIdx);
          return;
        }
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
      if (BATTLE.isLetterMode) {
        showPhase('b-player-letter-turn');
        bpLetterTurn();
      } else {
        showPhase('b-player-turn');
        playerTurn();
      }
    }
  };
  document.getElementById('bq-next-btn').style.display = 'inline-block';
}

/* ========== 战斗退出 ========== */
function confirmBattleExit() {
  showModal('确定退出战斗吗？本次战斗不会保存进度。', () => {
    closeModal();
    // 重置战斗状态
    BATTLE.bossHp = 0;
    BATTLE.playerHp = 0;
    endBattle(false);
  });
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

/* ========== 字母拼词攻击（低年级挑战模式） ========== */

function bpLetterTurn() {
  BATTLE.phase = 'player';
  BATTLE.battleLetterPlaced = [];

  // 检查是否还有可用字母（单字母也可攻击，但会消耗）
  const available = BATTLE.battleLetters.filter((_, i) => !BATTLE.battleLetterConsumed.has(i));
  if (available.length === 0) {
    transitionMsg('💔 所有字母已消耗，无法继续战斗...', '查看结果', () => endBattle(false));
    return;
  }

  document.getElementById('b-round-label').textContent = `🔤 你的回合！拼词攻击（2+字母不消耗）或单字母攻击（消耗字母）！`;

  showPhase('b-player-letter-turn');
  document.getElementById('bp-letter-clue-emoji').textContent = '🔤';
  document.getElementById('bp-letter-clue-cn').textContent = '拼英文单词攻击Boss！单字母攻击会消耗该字母';
  document.getElementById('bp-letter-hint').textContent = `可用字母 ${available.length} 个 · 2+字母拼词不消耗，1个字母攻击会消耗`;
  document.getElementById('bp-letter-word-element').textContent = '';
  document.getElementById('bp-letter-error-msg').textContent = '';
  document.getElementById('bp-letter-slots').innerHTML = '';
  renderBattleLetterBank();
  bpLetterSyncUI();
}

function renderBattleLetterBank() {
  const bank = document.getElementById('bp-letter-bank');
  bank.innerHTML = '';
  for (let i = 0; i < BATTLE.battleLetters.length; i++) {
    if (BATTLE.battleLetterConsumed.has(i)) continue;
    const ch = BATTLE.battleLetters[i];
    const el = DATA.getLetterElement(ch);
    const elInfo = DATA.getElementInfo(el);
    const tile = document.createElement('div');
    tile.className = `letter-tile tile-elem-${elInfo.id}`;
    tile.dataset.letterIdx = String(i);
    tile.textContent = ch.toLowerCase();
    tile.addEventListener('click', () => bpLetterClickTile(i));
    bank.appendChild(tile);
  }

  if (bank.children.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'color:#bbb;font-size:13px;padding:8px;text-align:center;width:100%';
    empty.textContent = '所有字母已消耗';
    bank.appendChild(empty);
  }
}

function bpLetterClickTile(idx) {
  if (BATTLE.battleLetterConsumed.has(idx)) return;
  // 允许同一个字母多次放入槽位（如 too 需要2个o）
  BATTLE.battleLetterPlaced.push(idx);
  document.getElementById('bp-letter-error-msg').textContent = '';
  bpLetterSyncUI();
}

function bpLetterClickSlot(slotIdx) {
  if (slotIdx >= BATTLE.battleLetterPlaced.length) return;
  const idx = BATTLE.battleLetterPlaced[slotIdx];
  BATTLE.battleLetterPlaced.splice(slotIdx, 1);
  bpLetterSyncUI();
}

function bpLetterSyncUI() {
  // 渲染槽位
  const slotsEl = document.getElementById('bp-letter-slots');
  slotsEl.innerHTML = '';
  if (BATTLE.battleLetterPlaced.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'color:#bbb;font-size:14px;padding:8px;text-align:center;width:100%';
    placeholder.textContent = '点击下方字母拼单词';
    slotsEl.appendChild(placeholder);
  } else {
    for (let i = 0; i < BATTLE.battleLetterPlaced.length; i++) {
      const idx = BATTLE.battleLetterPlaced[i];
      const ch = BATTLE.battleLetters[idx];
      const el = DATA.getLetterElement(ch);
      const elInfo = DATA.getElementInfo(el);
      const slot = document.createElement('div');
      slot.className = 'spell-slot filled';
      slot.style.borderColor = elInfo.color;
      slot.style.background = elInfo.bg;
      slot.style.color = elInfo.color;
      slot.textContent = ch.toLowerCase();
      slot.addEventListener('click', () => bpLetterClickSlot(i));
      slotsEl.appendChild(slot);
    }
  }

  // 渲染字母元素预览
  const elemPreview = document.getElementById('bp-letter-word-element');
  if (BATTLE.battleLetterPlaced.length > 0) {
    const counts = {};
    for (const idx of BATTLE.battleLetterPlaced) {
      const el = DATA.getLetterElement(BATTLE.battleLetters[idx]);
      counts[el] = (counts[el] || 0) + 1;
    }
    const parts = DATA.ELEMENTS.map(e => {
      const n = counts[e.name] || 0;
      return n > 0 ? `${e.icon}${n}` : '';
    }).filter(Boolean);
    elemPreview.textContent = '五行分布: ' + parts.join(' · ');
  } else {
    elemPreview.textContent = '';
  }

  // 渲染字母牌
  renderBattleLetterBank();

  // 攻击按钮：1个字母 → 单字母攻击(消耗)，2+字母 → 拼词攻击(不消耗)
  const n = BATTLE.battleLetterPlaced.length;
  const btn = document.getElementById('btn-bp-letter-attack');
  if (n === 0) {
    btn.disabled = true;
    btn.textContent = '⚔️ 拼词攻击';
  } else if (n === 1) {
    btn.disabled = false;
    btn.textContent = '💥 单字母攻击(消耗该字母)';
  } else {
    btn.disabled = false;
    btn.textContent = '⚔️ 拼词攻击';
  }
}

function bpLetterReset() {
  BATTLE.battleLetterPlaced = [];
  bpLetterSyncUI();
  document.getElementById('bp-letter-error-msg').textContent = '';
}

function bpLetterPass() {
  // 跳过本回合
  BATTLE.battleLetterPlaced = [];
  document.getElementById('b-round-label').textContent = '';
  bossTurn();
}

async function bpLetterAttack() {
  const letters = BATTLE.battleLetterPlaced.map(i => BATTLE.battleLetters[i]);

  if (letters.length === 0) return;

  const isSingle = letters.length === 1;

  if (!isSingle) {
    // 多字母拼词：验证单词
    const word = letters.join('');
    await DATA.loadReference();
    const ref = DATA.lookupReferenceWord(word);
    if (!ref) {
      document.getElementById('bp-letter-error-msg').textContent = `❌ "${word}" 不是有效单词，请重试`;
      return;
    }

    document.getElementById('bp-letter-error-msg').textContent = '';

    // 计算伤害
    const pLevel = getLevel(loadXp());
    const pStats = getPlayerStats(pLevel);
    const result = calculateLetterDamage(letters, BATTLE.boss.element, pStats.atk, BATTLE.boss.def);
    BATTLE.bossHp = Math.max(0, BATTLE.bossHp - result.damage);
    BATTLE.totalDamageDealt += result.damage;

    // track all-five attacks
    if (result.dominantElement === '全五行') {
      saveLocal('allFiveAttacks', (loadLocal('allFiveAttacks', 0)) + 1);
    }

    // 多字母拼词：字母不消耗，放回字母库
    BATTLE.battleLetterPlaced = [];

    updateHpBars();

    const formulaDetail = `${letters.length}个字母 × ${pStats.atk} × ${result.multiplier}`;
    const defRatio = BATTLE.boss.def > 0 ? ` × 20/(20+${BATTLE.boss.def})` : '';
    const message = `
      <div style="font-weight:700;font-size:20px">${result.description}</div>
      <span class="bt-damage">-${result.damage} HP</span>
      <div style="font-size:13px;color:#888">${formulaDetail}${defRatio} = ${result.damage}</div>
      <div>拼词：「${word}」</div>
      <div style="font-size:12px;color:#999;margin-top:4px">${ref.pos ? '(' + (DATA.POS_LABELS[ref.pos] || ref.pos) + ')' : ''} ${letters.map(l => DATA.getLetterElement(l)).join('·')}</div>
      <div style="font-size:11px;color:#4caf50;margin-top:2px">✅ 字母可继续使用</div>
    `;

    // 检查 Boss 是否被击败
    if (BATTLE.bossHp <= 0) {
      BATTLE.bossHp = 0;
      updateHpBars();
      transitionMsg(`🎉 ${message}`, '查看结果', () => endBattle(true));
      return;
    }

    document.getElementById('bt-content').innerHTML = message;
    showPhase('b-transition');
    document.getElementById('b-round-label').textContent = '';
    document.getElementById('bt-next-btn').textContent = '继续 → Boss回合';
    document.getElementById('bt-next-btn').style.display = 'inline-block';
    document.getElementById('bt-next-btn').onclick = () => { bossTurn(); };
    return;
  }

  // === 单字母攻击（消耗字母） ===
  const singleCh = letters[0];

  // 验证：必须是字母（从字母库中来的，一定是合法字符）
  document.getElementById('bp-letter-error-msg').textContent = '';

  const pLevel = getLevel(loadXp());
  const pStats = getPlayerStats(pLevel);
  const result = calculateLetterDamage(letters, BATTLE.boss.element, pStats.atk, BATTLE.boss.def);
  BATTLE.bossHp = Math.max(0, BATTLE.bossHp - result.damage);
  BATTLE.totalDamageDealt += result.damage;

  // 消耗该字母
  for (const idx of BATTLE.battleLetterPlaced) {
    BATTLE.battleLetterConsumed.add(idx);
  }
  BATTLE.battleLetterPlaced = [];

  updateHpBars();

  const formulaDetail = `1个字母 × ${pStats.atk} × ${result.multiplier}`;
  const defRatio = BATTLE.boss.def > 0 ? ` × 20/(20+${BATTLE.boss.def})` : '';
  const message = `
    <div style="font-weight:700;font-size:20px">${result.description}</div>
    <span class="bt-damage">-${result.damage} HP</span>
    <div style="font-size:13px;color:#888">${formulaDetail}${defRatio} = ${result.damage}</div>
    <div>单字母攻击：「${singleCh}」</div>
    <div style="font-size:12px;color:#999;margin-top:4px">${DATA.getLetterElement(singleCh)} · 该字母已消耗</div>
    <div style="font-size:11px;color:#e53935;margin-top:2px">💔 字母 ${singleCh} 永久消耗</div>
  `;

  if (BATTLE.bossHp <= 0) {
    BATTLE.bossHp = 0;
    updateHpBars();
    transitionMsg(`🎉 ${message}`, '查看结果', () => endBattle(true));
    return;
  }

  // 检查是否还有可用字母
  const remaining = BATTLE.battleLetters.filter((_, i) => !BATTLE.battleLetterConsumed.has(i));
  if (remaining.length === 0) {
    transitionMsg(message + `<br><br>💔 所有字母已消耗，无法继续战斗！`, '查看结果', () => endBattle(false));
    return;
  }

  document.getElementById('bt-content').innerHTML = message;
  showPhase('b-transition');
  document.getElementById('b-round-label').textContent = '';
  document.getElementById('bt-next-btn').textContent = '继续 → Boss回合';
  document.getElementById('bt-next-btn').style.display = 'inline-block';
  document.getElementById('bt-next-btn').onclick = () => { bossTurn(); };
}

function calculateLetterDamage(letters, bossElement, playerAtk, bossDef) {
  const n = letters.length;
  let baseDamage = n * playerAtk;

  // 统计字母五行
  const elementCounts = {};
  for (const ch of letters) {
    const el = DATA.getLetterElement(ch);
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  }

  // 检测全五行
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

  if (isTie && Object.keys(elementCounts).length < allElements.length) {
    // 平局且不全五行 → 随机 0.7-1.3
    const randomMultiplier = Math.round((0.7 + Math.random() * 0.6) * 10) / 10;
    const defMult = 20 / (20 + (bossDef || 0));
    return { damage: Math.max(1, Math.round(baseDamage * randomMultiplier * defMult)), multiplier: randomMultiplier, dominantElement: '随机', description: `五行持平·随机系数×${randomMultiplier}` };
  }

  // 确定综合五行
  const domEl = dominantElement || allElements[0];

  // 双向查询生克关系
  const domRel = BATTLE.ELEMENT_RELATIONS[domEl];
  const bossRel = BATTLE.ELEMENT_RELATIONS[bossElement];
  let multiplier = 1.0;
  let description = '';

  if (domEl === bossElement) {
    multiplier = 1.0;
    description = `同属性·持平 (×1.0)`;
  } else if (domRel && domRel.ke === bossElement) {
    multiplier = 1.5;
    description = `${domEl}克${bossElement}·优势 (×1.5)`;
  } else if (bossRel && bossRel.ke === domEl) {
    multiplier = 0.5;
    description = `${bossElement}克${domEl}·劣势 (×0.5)`;
  } else if (DATA.SHENG[bossElement] === domEl) {
    multiplier = 1.2;
    description = `${bossElement}生${domEl}·借力 (×1.2)`;
  } else if (DATA.SHENG[domEl] === bossElement) {
    multiplier = 0.8;
    description = `${domEl}生${bossElement}·减效 (×0.8)`;
  } else {
    multiplier = 1.0;
    description = `持平 (×1.0)`;
  }

  const defMultiplier = 20 / (20 + (bossDef || 0));
  const finalDamage = Math.round(baseDamage * multiplier * defMultiplier);
  return { damage: Math.max(1, finalDamage), multiplier, dominantElement: domEl, description };
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

  // track all-five attacks
  if (result.dominantElement === '全五行') {
    saveLocal('allFiveAttacks', (loadLocal('allFiveAttacks', 0)) + 1);
  }

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

  // 未消耗的手牌退回背包（句子模式）
  if (!BATTLE.isLetterMode) {
    returnUnusedCards();
  }

  // 奖励
  const rewardArea = document.getElementById('br-reward-area');
  rewardArea.innerHTML = '';

  if (win) {
    // ==== 保底奖励：3张同五行卡 + 经验（受智慧加成） ====
    const bossEl = boss.element;
    const pLevel = getLevel(loadXp());
    const pStats = getPlayerStats(pLevel);
    const chalMult = BATTLE.isLetterMode ? 1.0 : 2.0;
    let xpReward = Math.round(30 * chalMult * (1 + (pStats.water - 10) * 0.01));
    // 等级衰减：letter mode 阈值 20 级，sentence mode 阈值 30 级
    const chalGradeMax = BATTLE.isLetterMode ? 4 : 6;
    const chalExceed = Math.min(5, Math.max(0, pLevel - chalGradeMax * 5));
    if (chalExceed > 0) xpReward = Math.round(xpReward * (1 - chalExceed * 0.1));

    const rewardCards = DATA.selectRandomCardsByElement(bossEl, 3);
    const bp = loadBackpack();
    const maxCap = getMaxBackpackCapacity(pLevel);

    for (const w of rewardCards) {
      if (bp.length >= maxCap) break;
      bp.push({
        word: w.word, cn: w.cn, element: w.element,
        pos: w.pos || '', sentence: w.sentence || '',
        date: new Date().toISOString().slice(0, 10),
        quality: 'common',
      });
    }

    // ==== 独立概率奖励（受幸运+护符加成） ====
    let lukMult = 1 + (pStats.luk - 10) * 0.01;
    if (BOOST_STATE.luckyCharmActive) {
      lukMult *= 1.5;
      BOOST_STATE.luckyCharmActive = false;
    }
    const roll = (p) => Math.random() < Math.min(1.0, p * lukMult);
    const extraRewards = [];

    // 50% → 额外一张同属性卡
    if (roll(0.5)) {
      const extra = DATA.selectRandomCardsByElement(bossEl, 1);
      if (extra.length > 0 && bp.length < maxCap) {
        bp.push({
          word: extra[0].word, cn: extra[0].cn, element: extra[0].element,
          pos: extra[0].pos || '', sentence: extra[0].sentence || '',
          date: new Date().toISOString().slice(0, 10),
          quality: 'common',
        });
        extraRewards.push(`🎴 额外 ${bossEl} 属性卡「${extra[0].word}」`);
      }
    }

    // 25% → 属性提升道具（同Boss五行）
    if (roll(0.25)) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'boost',
        element: bossEl, date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`✨ ${bossEl}属性提升道具`);
    }

    // 10% → 空白单词卡
    if (roll(0.1)) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'blank_card',
        date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`🃏 空白单词卡`);
    }

    // 2% → 全属性提升道具
    if (roll(0.02)) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'all_boost',
        date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`🌟 全属性提升道具`);
    }

    // 1% → 五行洗髓丹（不受幸运加成）
    if (Math.random() < 0.01) {
      const items = loadItems();
      items.push({
        type: 'item', itemType: 'element_reset',
        date: new Date().toISOString().slice(0, 10),
      });
      saveItems(items);
      extraRewards.push(`💊 五行洗髓丹`);
    }

    // 6% → 特殊头像解锁道具（仅限未解锁的）
    if (roll(0.06)) {
      const unlocked = getUnlockedSpecials();
      const locked = AVATARS_SPECIAL.filter(a => !unlocked.has(a.id));
      if (locked.length > 0) {
        const target = DATA.randomPick(locked);
        const items = loadItems();
        items.push({
          type: 'item', itemType: 'avatar_unlock',
          specialId: target.id,
          date: new Date().toISOString().slice(0, 10),
        });
        saveItems(items);
        extraRewards.push(`🖼️ 特殊头像「${target.label}」已解锁！`);
      }
    }

    saveBackpack(bp);
    addXp(xpReward);

    // 15% -> xp boost
    if (roll(0.15)) {
      const items = loadItems();
      items.push({ type: 'item', itemType: 'xp_boost', date: new Date().toISOString().slice(0, 10) });
      saveItems(items);
      extraRewards.push(`⏫ 经验加倍符`);
    }

    // 10% -> lucky charm
    if (roll(0.1)) {
      const items = loadItems();
      items.push({ type: 'item', itemType: 'lucky_charm', date: new Date().toISOString().slice(0, 10) });
      saveItems(items);
      extraRewards.push(`🍀 幸运护符`);
    }

    // 8% -> revival stone
    if (roll(0.08)) {
      const items = loadItems();
      items.push({ type: 'item', itemType: 'revival_stone', date: new Date().toISOString().slice(0, 10) });
      saveItems(items);
      extraRewards.push(`💎 复活石`);
    }

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

  // ach stats
  const achStats = loadAchStats();
  if (win) {
    achStats.bossWins = (achStats.bossWins || 0) + 1;
    if (BATTLE.bossCorrectCount > 0 && BATTLE.playerHp >= BATTLE.playerMaxHp) {
      achStats.bossPerfectWins = (achStats.bossPerfectWins || 0) + 1;
    }
  }
  saveAchStats(achStats);
  checkAchievements('after_battle');

  // track boss kills for avatar frames
  if (win) {
    const bKey = 'bossKills_' + BATTLE.boss.element;
    saveLocal(bKey, (loadLocal(bKey, 0)) + 1);
  }
}

/* ========== 复活石 ========== */
function showRevivalModal(itemIndex) {
  // 创建自定义复活弹窗
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '150';
  overlay.onclick = () => {}; // 阻止点击背景关闭

  const box = document.createElement('div');
  box.className = 'modal-box';
  box.innerHTML = `
    <p style="font-size:48px;margin:0">💎</p>
    <p style="font-size:18px;font-weight:700">你被击败了...</p>
    <p style="font-size:14px;color:#666">检测到你有复活石，是否使用？</p>
    <p style="font-size:13px;color:#888">恢复50%生命值继续战斗</p>
    <div class="modal-buttons">
      <button class="primary-btn" id="revive-confirm-btn">💎 复活</button>
      <button class="secondary-btn" onclick="document.getElementById('revival-overlay')?.remove();document.getElementById('revival-box')?.remove(); endBattle(false)">放弃</button>
    </div>
  `;
  overlay.id = 'revival-overlay';
  box.id = 'revival-box';
  document.body.appendChild(overlay);
  document.body.appendChild(box);

  document.getElementById('revive-confirm-btn').onclick = () => {
    // 消耗复活石
    const items = loadItems();
    const idx = items.findIndex(it => it.itemType === 'revival_stone');
    if (idx >= 0) {
      items.splice(idx, 1);
      saveItems(items);
    }
    // 恢复50% HP
    BATTLE._revived = true;
    BATTLE.playerHp = Math.round(BATTLE.playerMaxHp * 0.5);
    updateHpBars();
    // 关闭弹窗
    overlay.remove();
    box.remove();
    showToast('💎 已复活！恢复50%生命值');
  };
}

function returnUnusedCards() {
  const bp = loadBackpack();

  // 收集要移除或降级的背包索引
  const toRemove = new Set();
  const toDegrade = []; // {idx, newQuality}
  for (let i = 0; i < BATTLE.handCards.length; i++) {
    const card = BATTLE.handCards[i];
    if (card.source === 'equip' && BATTLE.consumedSet.has(i)) {
      const existing = bp[card.bpIndex];
      if (!existing) continue;
      const q = existing.quality || 'common';
      if (q === 'common') {
        toRemove.add(card.bpIndex);
      } else {
        const qi = QUALITY_ORDER.indexOf(q);
        if (qi > 0) {
          toDegrade.push({ idx: card.bpIndex, newQuality: QUALITY_ORDER[qi - 1] });
        } else {
          toRemove.add(card.bpIndex);
        }
      }
    }
  }

  // 降级
  for (const { idx, newQuality } of toDegrade) {
    if (idx >= 0 && idx < bp.length) bp[idx].quality = newQuality;
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
  initBoostState();
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
