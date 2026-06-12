# Supabase `user_profiles` 表结构

> 查询时间：2026-06-12
> 查询 SQL：`SELECT column_name FROM information_schema.columns WHERE table_name='user_profiles'`

## 现有列

| 列名 | 类型（推断） | 用途 | 代码对应 |
|------|-------------|------|---------|
| `id` | int8 (PK) | 用户ID | `USER_CACHE.id` |
| `username` | text | 用户名 | `USER_CACHE.username` |
| `password_hash` | text | 密码哈希 | — |
| `xp` | int8 | 经验值 | `USER_CACHE.xp` |
| `backpack` | jsonb | 单词背包 | `USER_CACHE.backpack` |
| `items` | jsonb | 道具列表 | `USER_CACHE.items` |
| `bonus` | jsonb | 五行永久加成 | `USER_CACHE.bonus` |
| `equip` | jsonb | 装备槽（4格） | `USER_CACHE.equip` |
| `achievements` | jsonb | 成就进度 | `USER_CACHE.achievements` |
| `avatarFrame` | text | 当前头像框ID | `USER_CACHE.avatarFrame` |
| `title` | text | 当前称号 | `USER_CACHE.title` |
| `letterBag` | jsonb | 已收集字母 | `USER_CACHE.letterBag` |
| `avatar` | text | 头像ID | `USER_CACHE.avatar` |
| `element` | text | 本命五行 | `USER_CACHE.element` |
| `created_at` | timestamptz | 创建时间 | — |
| `updated_at` | timestamptz | 更新时间 | — |

## PATCH 同步字段

`syncToSupabase()` / `syncToSupabaseNow()` 推送的字段（定义在 `_buildPatchBody()`）：

```
xp, backpack, items, bonus, equip, achievements,
avatarFrame, title, letterBag, updated_at
```

## 添加新列的标准

需要跨设备同步的数据才需要加列。仅本地生效的数据（如当前页面状态、临时缓存）用 localStorage 即可。

添加列 SQL 模板：
```sql
ALTER TABLE user_profiles
ADD COLUMN <列名> <类型> DEFAULT <默认值>;
```

常用类型：`jsonb DEFAULT '[]'`（数组）、`jsonb DEFAULT '{}'`（对象）、`text DEFAULT ''`（字符串）、`int8 DEFAULT 0`（数字）。
