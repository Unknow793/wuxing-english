# 五行英语牌 — 修改日志

> 项目状态追踪文件。每次修改（无论是否提交）均在此记录，避免跨会话遗忘。

---

## 2026-06-13

### 头像框系统重构 + 成就扩展

- **动画层级重分配**：初（静态）→ 极（亮度呼吸）→ 臻（脉冲缩放），三阶递进
- **删除3个等级框**（木之框·初/炎之框·极/金之框·臻）
- **颜色体系统一**：五元素每色三阶同色，彩系列三阶同用彩虹环，仅动画区分
- **排行榜完整支持头像框**：改用 class-based CSS，镜像个人页效果（含动画）
- **新增4组头像框**：紫/粉/橙/黑，各3阶 = 12个新框
- **紫色系**（紫·初/极/臻）→ Boss 击败次数（1/10/50次）
- **粉色系**（粉·初/极/臻）→ 拼对单词数（10/50/200词）
- **黑色系**（黑·初/极/臻）→ 无伤击败 Boss（1/10/30次）
- **橙色系**（橙·初/极/臻）→ 条件待定
- **新增成就**：拼词小能手（10词）、不败传奇（50 Boss，含称号）、完美防御·极（10无伤）、完美防御·臻（30无伤）
- **成就扩展**：完美防御拆分为三级（初/极/臻），拼词系列补全三级
- 测试用「解锁全部头像框」按钮

## 2026-06-12

### Commit `4a03268`
- 低年级学习模式（1-2年级/3-4年级）奖励改为持久 `screen-reward` 页面，替代 showToast 自动消失
- 修复"拼对 X/5"分母：改为 `spellRequiredCount`（1或2）
- HTML 拼写进度占位文本 `1/5` → `—`
- 中级挑战模式 bossTurn 传 `'intermediate'` 给 generateClozeQuestion，排除 beginner 句子组

### 待办：中级挑战模式难度调整
- 当前中级挑战模式玩家用单词卡组句攻击，整体难度体验需要审视和调整
- 下次优化方向：Boss 属性数值、玩家伤害公式、手牌消耗机制等

### Commit `9842894`
- 22种头像框（含CSS动画），排行榜/个人页展示，等级自动解锁
- 卡牌品质系统（普通→铜→银→金→传说），装备加成按品质计算
- 合成界面：同词同品质两张合成升一级，传说封顶
- 降级机制：高品质卡卸装/退回时降一级而非消失
- 成就系统：7项成就，含称号解锁，完成通知浮层
- 背包容量改为 100+等级×2+额外槽，挑战掉落背包格
- 三种新道具：经验加倍符（15分钟双倍XP）、幸运护符、复活石
- 卡片图鉴页：按五行分类展示收集进度
- 经验加倍计时指示器，主页可见
- 道具背包界面优化，支持道具详情和使用
- Supabase avatarFrame 列支持

### 相关的未提交改动
- 头像框动画效果还有小问题待修复

---

## [Uncommitted] 2026-06-10 — 练习模式题型分化 + 挑战模式多题型 + 字母小写化

### 练习模式三分级（题型分化）
- 主页练习按钮改为选年级界面（screen-practice-select），分 grade1-2 / grade3-4 / grade5-6
- **grade1-2**：完形填空、中英配对、单词分类（3种，去掉词性判断和五行生克）
- **grade3-4**：完形填空、中英配对、词性判断、单词分类（4种，去掉五行生克）
- **grade5-6**：保持不变（完形填空、中英配对、词性判断、五行生克）
- 补上之前缺失的「单词分类」题型（pracGenWordClass）—— 给单词选所属主题分类
- 曾添加「看图选词」遇到 emoji 与具体词不匹配问题，后移除
- 曾添加「单词拼写」因与中英配对重复感强，后移除
- 修复：screen-practice-select 有内联 `style="display:none"` 导致屏幕不可见
- 修复：结算页"再来一轮"按钮未传递当前 mode（默认回到 grade5-6）

### 初级挑战模式 Boss 多题型
- bossTurn() 中 letter mode 不再只出完形填空，改为从完形填空/中英配对/单词分类中随机抽取
- 新增 CSS `.boss-q-badge` 显示题型标签
- 修复 answerBossQuestion 中 `opt.word` 引用在非完形格式下为 undefined 的问题

### 字母小写化显示
- 所有字母牌显示改为小写（letter bag、equip 选字母、战斗字母库、拼词槽位）
- 内部数据仍用大写存储，仅 display 时 `.toLowerCase()`
- 涉及 6 处渲染点：showLetterBag、renderSpellBank、syncSpellUI、showLetterEquipScreen、renderBattleLetterBank、bpLetterSyncUI

### 句子组打标签 + 参考词库扩充
- 50 组以前未打 tier 标签的句子组标记为 `beginner`（以前是 untiered，不参与任何模式）
- 分布：50 beginner + 189 intermediate = 239 组
- reference_vocab.json 并入 vocabulary.json 中缺失的 74 个词（lazy, panda, monday 等），从 4350 → 4424 词
- generateClozeQuestion 支持 tier 参数筛选句子组，且干扰项也按同级别词池筛选

### 等级衰减全面覆盖
- 练习模式（pracShowResult）：超出推荐等级逐级 -10%，最低 50%
- 拼写奖励（showSpellReward）：同上衰减逻辑
- 挑战模式（endBattle）：letter mode 阈值 20 级，sentence mode 阈值 30 级
- 学习模式（getStudyXp）：此前已有，逻辑保持一致

### 修复的 Bug
- updateBank() 中 `STATE.words.indexOf(w)` 对重复单词（如 "the" 出现两次）返回错误 Index，改为使用 `widx` 直接定位
- 挑战模式 letter mode 字母不消耗（多字母拼词），可重复使用同字母牌
- 单字母攻击永久消耗字母
- 学习模式 replay 时按钮状态重置

---

## 2026-06-09 — 装备槽优化 + 背包管理

### Commit `3d9b440`
- 装备卡从背包移除（卸下装备时自动放回背包）
- 卸下回退逻辑
- 排除挑战选牌时已装备的卡
- 空白卡容错

相关的未提交改动：
- showLetterEquipScreen 改为单次选择（不允许多次选同一字母）+ 战斗中同一字母牌可多次放入槽位
- bpLetterClickTile 去掉重复检查，允许同一字母 index 重复放置

---

## 2026-06-08 — 挑战模式概率调整 + 随堂测验

### Commit `5eacd28`
- 调整挑战模式掉落概率（25%/6%）
- 同步奖励说明包含随堂测验

### Commit `0991a20`
- 学习阶段增加随堂测验（间隔抽测已学单词）
- 连句提示加强
- 修复重复单词选中 bug

相关的未提交改动：
- 挑战模式使用 `generateClozeQuestion(tier)` 对接 tier 筛选
- 初级挑战模式字母可重复使用（不再消耗）
- low-grade 学习模式 replay 修复按钮不可见

---

## 2026-06-07 — 登录分离 + 排行榜 + 装备槽 + 头像系统

### Commit `68f63e7` — 分离登录与注册界面
- 登录和注册用 tab 切换，防止输错用户名误建账号

### Commit `0b8d604` — 挑战模式装备样式
- 装备技能牌卡片样式 + 选中高亮

### Commit `2d2a6a9` — 排行榜 equip 恢复
- 数据库已加列后恢复 equip 查询字段

### Commit `aa1f84a` — 排行榜热修复
- equip 字段导致查询失败（数据库尚无该列）

### Commit `9d4e4d9` — 排行榜战力
- 战力统计纳入装备加成 + 同步 equip 字段

### Commit `d4467cd` — 装备槽系统
- 名动形代 + 10% 属性加成
- 五行洗髓丹（Boss 1% 掉落）
- 奖励说明 + 升级系数调整

### Commit `adf7e74` — 头像系统
- 31+28 张头像图片
- 更换头像功能
- 练习模式（初版）
- 练级 Bug 修复

### Commit `ebea33d` — 个人信息面板
- 五维雷达图（动态 maxVal 解决满分溢出 + 顶点属性标签）
- 主页改造
- 排行榜

---

## 2026-06-06 — 密码系统 + 语音 + 多用户

### Commit `746eb5c` — 旧账号自动绑定密码
### Commit `a9f1aee` — 密码登录 + 注册系统
- 角色注册（选头像 + 本命五行）
- Supabase 密码哈希

### Commit `55118ab` — 语音语速降低
### Commit `0b5c1f7` — rAF 竞态修复
### Commit `2eaf8a6` — 极简语音模块
### Commit `84d632a` — 简化语音引擎 + 句子溢出修复
### Commit `1a482f1` — 响应式字号
### Commit `d582caf` — 长句子溢出修复
### Commit `24a9559` — 手机端发音修复

### Commit `6bd9a46` — Supabase 多用户支持
- 用户数据同步
- 登录/注册系统

---

## 2026-06-05 — 项目初始化

### Commit `aff763b`
- 五行英语牌 v0.1
- 五行属性驱动的英语学习卡牌游戏
- 基础框架：学习模式 + 挑战模式 + 背包系统

---

## 核心技术约定

### 字母大小写策略
- 数据层：**大写存储**（`LETTER_ELEMENTS` keys 为 A-Z，`letterBag` 为大写）
- 显示层：**小写渲染**（所有 `textContent` 使用 `.toLowerCase()`）
- 查找：`getLetterElement(letter)` 内部做 `letter.toUpperCase()`，兼容输入

### 词库分层
- `vocabulary.json`：940 词，教学用（含 tier/category/element 等元数据）
- `reference_vocab.json`：4424 词，纯验证用（COCA 5000 + 合并 curriculum 缺失词）
- `sentence_groups.json`：239 组（50 beginner + 189 intermediate）

### 题型定义
| 标识 | 说明 | 可用年级 |
|------|------|----------|
| cloze | 完形填空（选词填空） | 全部 |
| match-cn | 中英配对（英文选中文） | 全部 |
| pos | 词性判断（选名词/动词等） | grade3-4, grade5-6 |
| word-class | 单词分类（选主题类别） | grade1-2, grade3-4 |
| shengke | 五行生克 | grade5-6 仅 |

### 挑战模式级别
| 级别 | 标签 | 适用年级 | 攻击方式 | 题型 |
|------|------|----------|----------|------|
| 初级 | 初级·拼词 | 1-4年级 | 字母拼词 | 完形/配对/分类 |
| 中级 | 中级·造句 | 5-6年级 | 单词卡造句 | 完形填空 |

---

## 2026-06-12 — Bug修复：数据持久化 + 挑战模式崩溃 + 装备品质显示

### 未提交
- **数据持久化修复**：saveXp/saveBackpack 等函数现在同时写 localStorage 备份，登录时优先合并本地数据（防止 Supabase 同步失败导致丢数据）
- **DATA.words 引用问题修复**：data.js 改用 getter/setter 暴露 words/sentenceGroups 等属性，解决 `load()` 后 `DATA.words` 仍指向空数组的变量引用问题
- **挑战模式 Boss 崩溃修复**：pracGenMatchCn 增加空池检查，bossTurn 增加出题失败安全处理（显示退出按钮）
- **战斗退出按钮**：战斗界面右上角增加退出按钮
- **装备品质显示**：装备选择器和挑战选牌界面显示卡牌品质

### 2026-06-12 第二波（已提交）
- **PATCH 拆分**：letterBag 拆为独立 PATCH，防止 PostgREST schema cache 问题阻塞装备/经验同步
- **排行榜战力同步**：calcPowerForUser 公式与个人页对齐（品质系数+等级），syncToSupabaseNow 排行榜前强制执行同步
- **登录合并取并集**：letterBag 登录时合并两地取并集，防止多设备互刷丢失
- **sentence_groups 缺 elements 修复**：补上 25 组 beginner 句子的 elements 字段，修复个人页崩溃
- **Supabase 表结构文档**：新增 docs/supabase-schema.md
- **语音速度调回正常**：speak() 默认 1.0，speakWord/speakSentence 同步回调
- **返回导航修复**：成就/装备页返回按钮改为 `showProfile()`，不再跳到主页
