/* ========== Supabase 数据层 ========== */
const SUPABASE_URL = 'https://vonvatplexxuynjzkhvg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbnZhdHBsZXh4dXluanpraHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjE4OTMsImV4cCI6MjA5NjE5Nzg5M30.Ae-6nzhFJR24AwONFhEM3XgZ75WQP3Uou5wFcsN9Xyw';

const SB_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// 当前用户数据缓存（内存，代替 localStorage）
const USER_CACHE = {
  id: null,
  username: '',
  xp: 0,
  backpack: [],
  items: [],
  bonus: { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
};

/* ---------- 用户登录 ---------- */
async function loginUser(username) {
  const name = username.trim();
  if (!name) throw new Error('请输入名字');

  // 查是否存在
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?username=eq.${encodeURIComponent(name)}&select=*`,
    { headers: SB_HEADERS }
  );
  const rows = await res.json();

  if (rows && rows.length > 0) {
    // 已有用户
    Object.assign(USER_CACHE, {
      id: rows[0].id,
      username: rows[0].username,
      xp: rows[0].xp || 0,
      backpack: rows[0].backpack || [],
      items: rows[0].items || [],
      bonus: rows[0].bonus || { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
    });
  } else {
    // 新用户
    const body = JSON.stringify({
      username: name,
      xp: 0,
      backpack: [],
      items: [],
      bonus: { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
    });
    const createRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_profiles`,
      {
        method: 'POST',
        headers: SB_HEADERS,
        body,
      }
    );
    const newRows = await createRes.json();
    const created = Array.isArray(newRows) ? newRows[0] : newRows;
    Object.assign(USER_CACHE, {
      id: created.id,
      username: created.username,
      xp: created.xp || 0,
      backpack: created.backpack || [],
      items: created.items || [],
      bonus: created.bonus || { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 },
    });
  }

  localStorage.setItem('wuxing_user', name); // 记住用户名
  return USER_CACHE;
}

/* ---------- 同步数据到 Supabase ---------- */
let _syncTimer = null;

function syncToSupabase() {
  if (!USER_CACHE.id) return;

  // 防抖：连续调用只触发一次写入
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${USER_CACHE.id}`,
        {
          method: 'PATCH',
          headers: SB_HEADERS,
          body: JSON.stringify({
            xp: USER_CACHE.xp,
            backpack: USER_CACHE.backpack,
            items: USER_CACHE.items,
            bonus: USER_CACHE.bonus,
            updated_at: new Date().toISOString(),
          }),
        }
      );
    } catch (e) {
      console.warn('数据同步失败，下次操作自动重试', e);
    }
    _syncTimer = null;
  }, 300); // 300ms 防抖
}

/* ---------- 兼容原 localStorage load/save 函数 ---------- */
function loadXp() { return USER_CACHE.xp || 0; }
function saveXp(xp) { USER_CACHE.xp = xp; syncToSupabase(); }

function loadBackpack() { return USER_CACHE.backpack || []; }
function saveBackpack(bp) { USER_CACHE.backpack = bp; syncToSupabase(); }

function loadItems() { return USER_CACHE.items || []; }
function saveItems(items) { USER_CACHE.items = items; syncToSupabase(); }

function loadBonus() { return USER_CACHE.bonus || { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 }; }
function saveBonus(bonus) { USER_CACHE.bonus = bonus; syncToSupabase(); }

/* ---------- 登录UI处理 ---------- */
async function handleLogin() {
  const input = document.getElementById('login-name');
  const errorEl = document.getElementById('login-error');
  const loadingEl = document.getElementById('login-loading');
  const btn = document.getElementById('login-btn');

  const name = input.value.trim();
  if (!name) { errorEl.textContent = '请输入名字'; return; }

  errorEl.textContent = '';
  btn.disabled = true;
  loadingEl.style.display = 'block';

  try {
    await loginUser(name);
    showScreen('screen-home');
    updateHomeXpDisplay();
    updateBackpackCount();
  } catch (e) {
    errorEl.textContent = '登录失败，请重试：' + e.message;
  } finally {
    btn.disabled = false;
    loadingEl.style.display = 'none';
  }
}

/* ---------- 登出UI处理 ---------- */
function handleLogout() {
  if (confirm('切换用户将返回登录页，确定吗？')) {
    logoutUser();
    showScreen('screen-login');
  }
}

/* ---------- 登出 ---------- */
function logoutUser() {
  localStorage.removeItem('wuxing_user');
  USER_CACHE.id = null;
  USER_CACHE.username = '';
  USER_CACHE.xp = 0;
  USER_CACHE.backpack = [];
  USER_CACHE.items = [];
  USER_CACHE.bonus = { wood: 0, fire: 0, earth: 0, water: 0, metal: 0 };
}
