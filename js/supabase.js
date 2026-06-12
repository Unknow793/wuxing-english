/* ========== Supabase 数据层 ========== */
const SUPABASE_URL = 'https://vonvatplexxuynjzkhvg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbnZhdHBsZXh4dXluanpraHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjE4OTMsImV4cCI6MjA5NjE5Nzg5M30.Ae-6nzhFJR24AwONFhEM3XgZ75WQP3Uou5wFcsN9Xyw';

const SB_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// 当前用户数据缓存
const USER_CACHE = {
  id: null,
  username: '',
  xp: 0,
  backpack: [],
  letterBag: [],
  items: [],
  bonus: { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
  avatar: '',
  element: '',   // 本命五行
  equip: [null, null, null, null],  // 4个装备槽
  achievements: [],   // [{id, status: 'locked'|'completed'|'reward_claimed'}]
  avatarFrame: '',    // 头像框ID
  title: '',          // 当前称号
};

/* ---------- localStorage辅助函数（仅本地，不同步Supabase） ---------- */
function saveLocal(key, value) {
  try { localStorage.setItem('wuxing_' + key, JSON.stringify(value)); } catch (e) {}
}
function loadLocal(key, fallback) {
  try { const v = localStorage.getItem('wuxing_' + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
function removeLocal(key) {
  try { localStorage.removeItem('wuxing_' + key); } catch (e) {}
}

/* ---------- 密码哈希 ---------- */
async function hashPassword(password, username) {
  const encoder = new TextEncoder();
  // 加盐：用户名 + 固定 salt，确保同名用户密码不同
  const data = encoder.encode(password + 'wuxing2026_' + username);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- 登录/注册模式 ---------- */
let _authMode = 'login'; // 'login' | 'register'

function switchAuthMode(mode) {
  _authMode = mode;
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  document.getElementById('auth-subtitle').textContent = mode === 'login' ? '输入你的账号密码登录' : '创建一个新账号';
  document.getElementById('login-btn').textContent = mode === 'login' ? '登录' : '注册';
  document.getElementById('login-error').textContent = '';
}

/* ---------- 纯登录（仅验证已有用户） ---------- */
async function loginUser(username, password) {
  const name = username.trim();
  if (!name) throw new Error('请输入用户名');
  if (!password || password.length < 4) throw new Error('密码至少4位');

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?username=eq.${encodeURIComponent(name)}&select=*`,
    { headers: SB_HEADERS }
  );
  const rows = await res.json();

  if (!rows || rows.length === 0) {
    throw new Error('用户不存在，请检查用户名或切换到注册');
  }

  const user = rows[0];
  const storedHash = user.password_hash || '';
  const inputHash = await hashPassword(password, name);
  if (!storedHash) {
    // 旧账号无密码 → 首次登录，将输入的密码设为永久密码
    await fetch(
      `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${user.id}`,
      { method: 'PATCH', headers: SB_HEADERS,
        body: JSON.stringify({ password_hash: inputHash, updated_at: new Date().toISOString() }) }
    );
  } else if (inputHash !== storedHash) {
    throw new Error('密码错误');
  }
  // 合并远程数据与本地备份（本地可能更新）
  const localData = loadAllFromLocal();
  const hasLocal = localData && localData.username === name;
  Object.assign(USER_CACHE, {
    id: user.id, username: user.username,
    xp: user.xp || 0, backpack: user.backpack || [],
    items: user.items || [], bonus: user.bonus || { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
    avatar: user.avatar || '', element: user.element || '',
    equip: user.equip || [null, null, null, null],
    achievements: user.achievements || [],
    avatarFrame: user.avatarFrame || '',
    title: user.title || '',
    letterBag: user.letterBag || [],
  });
  // 有本地数据且用户名匹配 → 合并两地数据（不简单覆盖，防止多设备互刷）
  if (hasLocal) {
    Object.assign(USER_CACHE, {
      xp: localData.xp ?? USER_CACHE.xp,
      backpack: localData.backpack ?? USER_CACHE.backpack,
      items: localData.items ?? USER_CACHE.items,
      bonus: localData.bonus ?? USER_CACHE.bonus,
      equip: localData.equip ?? USER_CACHE.equip,
      achievements: localData.achievements ?? USER_CACHE.achievements,
      avatarFrame: localData.avatarFrame ?? USER_CACHE.avatarFrame,
      title: localData.title ?? USER_CACHE.title,
    });
    // 字母背包：取并集（不覆盖，多地收集互不丢失）
    const remoteLetters = USER_CACHE.letterBag || [];
    const localLetters = localData.letterBag || [];
    USER_CACHE.letterBag = [...new Set([...remoteLetters, ...localLetters])];
  }
  saveAllToLocal();
  localStorage.setItem('wuxing_user', name);
  return USER_CACHE;
}

/* ---------- 纯注册（需确保用户名不重复） ---------- */
async function registerUser(username, password) {
  const name = username.trim();
  if (!name) throw new Error('请输入用户名');
  if (!password || password.length < 4) throw new Error('密码至少4位');

  // 先查重
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?username=eq.${encodeURIComponent(name)}&select=id`,
    { headers: SB_HEADERS }
  );
  const existing = await checkRes.json();
  if (existing && existing.length > 0) {
    throw new Error('用户名已存在，请换一个或切换到登录');
  }

  // 创建新账号
  const passHash = await hashPassword(password, name);
  const createRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles`,
    {
      method: 'POST', headers: SB_HEADERS,
      body: JSON.stringify({
        username: name, password_hash: passHash,
        xp: 0, backpack: [], items: [],
        bonus: { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
        avatar: '', element: '', equip: [null, null, null, null],
        achievements: [], avatarFrame: '', title: '',
      }),
    }
  );
  const newRows = await createRes.json();
  const created = Array.isArray(newRows) ? newRows[0] : newRows;
  Object.assign(USER_CACHE, {
    id: created.id, username: created.username,
    xp: 0, backpack: [], items: [],
    bonus: { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
    avatar: '', element: '', equip: [null, null, null, null],
    achievements: [], avatarFrame: '', title: '',
  });
  saveAllToLocal();
  localStorage.setItem('wuxing_user', name);
  return USER_CACHE;
}

/* ---------- 更新用户头像和本命五行 ---------- */
async function updateUserProfile(avatar, element) {
  if (!USER_CACHE.id) return;
  try {
    await fetch(
      `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${USER_CACHE.id}`,
      {
        method: 'PATCH',
        headers: SB_HEADERS,
        body: JSON.stringify({ avatar, element, updated_at: new Date().toISOString() }),
      }
    );
    USER_CACHE.avatar = avatar;
    USER_CACHE.element = element;
    saveAllToLocal();
  } catch (e) {
    console.warn('更新头像/五行失败', e);
  }
}

/* ---------- 全量本地持久化（localStorage 备份） ---------- */
function saveAllToLocal() {
  saveLocal('user_data', {
    id: USER_CACHE.id,
    username: USER_CACHE.username,
    xp: USER_CACHE.xp,
    backpack: USER_CACHE.backpack,
    letterBag: USER_CACHE.letterBag,
    items: USER_CACHE.items,
    bonus: USER_CACHE.bonus,
    avatar: USER_CACHE.avatar,
    element: USER_CACHE.element,
    equip: USER_CACHE.equip,
    achievements: USER_CACHE.achievements,
    avatarFrame: USER_CACHE.avatarFrame,
    title: USER_CACHE.title,
  });
}

function loadAllFromLocal() {
  return loadLocal('user_data', null);
}

/* ---------- 同步数据到 Supabase ---------- */
let _syncTimer = null;

/** 主数据 PATCH body（不含 letterBag，避免 schema cache 问题影响其他字段） */
function _buildPatchBody() {
  return JSON.stringify({
    xp: USER_CACHE.xp,
    backpack: USER_CACHE.backpack,
    items: USER_CACHE.items,
    bonus: USER_CACHE.bonus,
    equip: USER_CACHE.equip,
    achievements: USER_CACHE.achievements,
    avatarFrame: USER_CACHE.avatarFrame,
    title: USER_CACHE.title,
    updated_at: new Date().toISOString(),
  });
}

/** letterBag 单独 PATCH body（字段可能不被 schema cache 识别，单独发送避免影响主数据） */
function _buildLetterBagPatch() {
  return JSON.stringify({
    letterBag: USER_CACHE.letterBag,
    updated_at: new Date().toISOString(),
  });
}

/** 发送一次 PATCH，失败只 warn 不抛异常 */
async function _doPatch(body) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${USER_CACHE.id}`,
      { method: 'PATCH', headers: SB_HEADERS, body }
    );
    if (!res.ok) console.warn('Supabase PATCH 返回', res.status, await res.text().catch(()=>''));
  } catch (e) {
    console.warn('Supabase同步失败，数据已保存在本地', e);
  }
}

function syncToSupabase() {
  if (!USER_CACHE.id) return;
  // 同时也存一份到 localStorage
  saveAllToLocal();
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    await _doPatch(_buildPatchBody());
    await _doPatch(_buildLetterBagPatch()); // 单独发送，失败不影响主数据
    _syncTimer = null;
  }, 300);
}

/* ---------- 兼容原 localStorage load/save 函数 ---------- */
function loadXp() { return USER_CACHE.xp || 0; }
function saveXp(xp) { USER_CACHE.xp = xp; syncToSupabase(); }

function loadBackpack() { return USER_CACHE.backpack || []; }
function saveBackpack(bp) { USER_CACHE.backpack = bp; syncToSupabase(); }

function loadLetterBag() { return new Set(USER_CACHE.letterBag || []); }
function saveLetterBag(set) { USER_CACHE.letterBag = [...set]; syncToSupabase(); }

function loadItems() { return USER_CACHE.items || []; }
function saveItems(items) { USER_CACHE.items = items; syncToSupabase(); }

function loadBonus() { return USER_CACHE.bonus || { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 }; }
function saveBonus(bonus) { USER_CACHE.bonus = bonus; syncToSupabase(); }

function loadEquip() { return USER_CACHE.equip || [null, null, null, null]; }
function saveEquip(equip) { USER_CACHE.equip = equip; syncToSupabase(); }

/* ---------- 登录/注册UI处理 ---------- */
async function handleAuth() {
  const nameInput = document.getElementById('login-name');
  const passInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');
  const loadingEl = document.getElementById('login-loading');
  const btn = document.getElementById('login-btn');

  const name = nameInput.value.trim();
  const password = passInput.value;
  if (!name) { errorEl.textContent = '请输入用户名'; return; }
  if (!password || password.length < 4) { errorEl.textContent = '密码至少4位'; return; }

  errorEl.textContent = '';
  btn.disabled = true;
  loadingEl.style.display = 'block';

  try {
    if (_authMode === 'login') {
      await loginUser(name, password);
    } else {
      await registerUser(name, password);
    }
    // 保存本地备份
    saveAllToLocal();
    // 检查是否已完成注册（选过头像和五行）
    if (USER_CACHE.avatar && USER_CACHE.element) {
      goHomeAfterLogin();
    } else {
      showRegAvatarScreen();
    }
  } catch (e) {
    errorEl.textContent = e.message || '操作失败，请重试';
  } finally {
    btn.disabled = false;
    loadingEl.style.display = 'none';
  }
}

function goHomeAfterLogin() {
  showScreen('screen-home');
  updateHomeXpDisplay();
  updateBackpackCount();
  checkAvatarFrameUnlocks();
}

/* ---------- 获取所有用户（排行榜用） ---------- */
/* ---------- 立即同步到 Supabase（跳过 debounce，等待完成） ---------- */
async function syncToSupabaseNow() {
  if (!USER_CACHE.id) return;
  saveAllToLocal();
  if (_syncTimer) { clearTimeout(_syncTimer); _syncTimer = null; }
  await _doPatch(_buildPatchBody());
  await _doPatch(_buildLetterBagPatch());
}

async function fetchAllUsers() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_profiles?select=username,avatar,element,xp,bonus,equip,avatarFrame&order=xp.desc&limit=100`,
      { headers: SB_HEADERS }
    );
    return await res.json();
  } catch (e) {
    console.warn('获取用户列表失败', e);
    return [];
  }
}

/* ---------- 登出 ---------- */
function handleLogout() {
  if (confirm('切换用户将返回登录页，确定吗？')) {
    localStorage.removeItem('wuxing_user');
    USER_CACHE.id = null;
    USER_CACHE.username = '';
    USER_CACHE.xp = 0;
    USER_CACHE.backpack = [];
    USER_CACHE.letterBag = [];
    USER_CACHE.items = [];
    USER_CACHE.bonus = { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 };
    USER_CACHE.avatar = '';
    USER_CACHE.element = '';
    USER_CACHE.achievements = [];
    USER_CACHE.avatarFrame = '';
    USER_CACHE.title = '';
    showScreen('screen-login');
    document.getElementById('login-password').value = '';
  }
}
