#!/usr/bin/env python3
"""
生成 5-6 年级句子组（intermediate tier）
产出约 150 组连词成句，覆盖 8 种语法结构：
  1. 情态动词  2. 副词  3. 过去时  4. 介词短语
  5. 比较级    6. 疑问句  7. 现在进行时  8. There be
每组包含 5-6 个单词，五行属性对 round-robin 分配。
"""
import json, random

random.seed(42)

# ── 加载词库 ──────────────────────────────────────────────
with open('vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)['words']

# 按词性索引（intermediate 优先，不足时从 beginner 补）
by_pos = {}
for w in vocab:
    by_pos.setdefault(w['pos'], []).append(w)

def pick(pos, exclude_words=set()):
    """从指定词性选一个不在 exclude_words 中的单词"""
    pool = [w for w in by_pos.get(pos, []) if w['word'] not in exclude_words]
    return random.choice(pool) if pool else None

def pick_any(exclude_words=set()):
    """随机选一个实词（noun/verb/adj）"""
    pool = [w for w in vocab
            if w['pos'] in ('noun','verb','adj')
            and w['word'] not in exclude_words]
    return random.choice(pool) if pool else None

def make_entry(w):
    """构造 words 数组中的条目"""
    return {"word": w['word'], "cn": w['cn'], "pos": w['pos'], "element": w['element']}

# ── 五行属性对（10组，round-robin） ────
ELEM_PAIRS = [
    ["木","火"], ["火","土"], ["土","金"], ["金","水"], ["水","木"],
    ["木","土"], ["火","金"], ["土","水"], ["金","木"], ["水","火"],
]

# ── 句子模板 ──────────────────────────────────────────────
# 每个模板：description, slots（词性列表）, sentence（格式化串中用 {0}{1}... 对应 slot 的 word）,
# order_idx（参与 target_order 的 slot 索引）, get_context（生成中文场景的函数）

def t_modal():
    """1. 情态动词: S + can/must/should + V + (art) + (adj) + N"""
    aux = pick('aux', {'do','does','be','am','is','are','was','were'})
    subj = pick('pron')
    verb = pick('verb')
    art  = pick('art')
    adj  = pick('adj')
    noun = pick('noun')
    if not all([aux, subj, verb, art, adj, noun]): return None
    used = {aux['word'], subj['word'], verb['word'], art['word'], adj['word'], noun['word']}
    slots = [subj, aux, verb, art, adj, noun]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']}"
    ctx = f"用「{aux['cn']}」表达：{subj['cn']}{verb['cn']}{art['cn']}{adj['cn']}{noun['cn']}"
    alt = {}
    if aux['word'] in ('can','must','should','will','may','might','could','would'):
        others = [a for a in ['can','must','should','will','may'] if a != aux['word']]
        if others:
            alt[aux['word']] = [random.choice(others)]
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,2,4,5]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": alt,
    }

def t_adverb():
    """2. 副词: S + adv + V + (art) + (adj) + N"""
    subj = pick('pron')
    adv  = pick('adv', {'not','then','just','even','only','well','also','already','still','ever'})
    verb = pick('verb')
    art  = pick('art')
    adj  = pick('adj')
    noun = pick('noun')
    if not all([subj, adv, verb, art, adj, noun]): return None
    slots = [subj, adv, verb, art, adj, noun]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']}"
    ctx = f"{subj['cn']}{adv['cn']}{verb['cn']}{adj['cn']}{noun['cn']}"
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,2,4,5]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": {},
    }

def t_past():
    """3. 过去时: S + V-ed + (art) + (adj) + N + (time_adv)"""
    subj = pick('pron')
    verb = pick('verb')
    art  = pick('art')
    adj  = pick('adj')
    noun = pick('noun')
    time_words = by_pos.get('adv', [])
    time = random.choice([w for w in time_words if w['word'] in ('yesterday','today','then','once','recently','finally','after','before')] or [None])
    if not all([subj, verb, art, adj, noun]): return None
    slots = [subj, verb, art, adj, noun]
    sent_parts = [slots[0]['word'], slots[1]['word'], slots[2]['word'], slots[3]['word'], slots[4]['word']]
    order_idx = [0, 1, 3, 4]
    if time:
        sent_parts.append(time['word'])
        slots.append(time)
        order_idx.append(5)
    sent = ' '.join(sent_parts)
    ctx = f"（过去）{subj['cn']}{verb['cn']}{adj['cn']}{noun['cn']}"
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in order_idx if i < len(slots)],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": {},
    }

def t_prep():
    """4. 介词短语: S + V + (art) + N + prep + (art) + (adj) + N"""
    subj = pick('pron')
    verb = pick('verb')
    art1 = pick('art')
    noun1= pick('noun')
    prep = pick('prep')
    art2 = pick('art')
    adj2 = pick('adj')
    noun2= pick('noun')
    if not all([subj, verb, art1, noun1, prep, art2, adj2, noun2]): return None
    slots = [subj, verb, art1, noun1, prep, art2, adj2, noun2]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']} {slots[6]['word']} {slots[7]['word']}"
    ctx = f"{subj['cn']}{verb['cn']}{art1['cn']}{noun1['cn']}（{prep['cn']}）{art2['cn']}{adj2['cn']}{noun2['cn']}"
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,3,4,6,7]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": {},
    }

def t_compare():
    """5. 比较级: S + V + adj-er + than + (pron)"""
    subj = pick('pron')
    verb = random.choice([w for w in by_pos.get('verb',[]) if w['word'] in ('be','look','feel','seem','get','become')] or [pick('verb')])
    adj  = pick('adj')
    than = next((w for w in by_pos.get('prep',[]) if w['word']=='than'), None)
    obj  = pick('pron')
    if not all([subj, verb, adj, than, obj]): return None
    slots = [subj, verb, adj, than, obj]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']}"
    ctx = f"{subj['cn']}{verb['cn']}比{obj['cn']}{adj['cn']}"
    alt = {}
    if subj['word'] != obj['word']:
        alt[adj['word']] = [a['word'] for a in by_pos.get('adj',[]) if a['word'] != adj['word']][:1]
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,2,3,4]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": alt,
    }

def t_question():
    """6. 疑问句: Q-word + aux + S + V + (art) + (adj) + N"""
    qwords = [w for w in by_pos.get('adv',[]) if w['word'] in ('what','where','when','why','how','who','which')]
    if not qwords: return None
    qw = random.choice(qwords)
    aux = pick('aux', {'be','am','is','are','was','were'})
    subj= pick('pron')
    verb= pick('verb')
    art = pick('art')
    adj = pick('adj')
    noun= pick('noun')
    if not all([qw, aux, subj, verb, art, adj, noun]): return None
    slots = [qw, aux, subj, verb, art, adj, noun]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']} {slots[6]['word']}?"
    ctx = f"用{qw['cn']}提问：{subj['cn']}{aux['cn']}{verb['cn']}{adj['cn']}{noun['cn']}"
    alt = {}
    if qw['word'] in ('what','where','when','why','how'):
        others = [q for q in ['what','where','when','why','how'] if q != qw['word']]
        alt[qw['word']] = [random.choice(others)]
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,2,3,5,6]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": alt,
    }

def t_continuous():
    """7. 现在进行时: S + be + V-ing + (art) + (adj) + N"""
    subj = pick('pron')
    be_verbs = [w for w in by_pos.get('aux',[]) if w['word'] in ('am','is','are')]
    if not be_verbs: return None
    be = random.choice(be_verbs)
    verb = pick('verb')
    art  = pick('art')
    adj  = pick('adj')
    noun = pick('noun')
    if not all([subj, be, verb, art, adj, noun]): return None
    slots = [subj, be, verb, art, adj, noun]
    # V-ing form (crude: add -ing, handle common cases)
    vword = verb['word']
    if vword.endswith('e') and not vword.endswith('ee'):
        ving = vword[:-1] + 'ing'
    elif len(vword) <= 4 and vword[-1] not in 'aeiou':
        ving = vword + vword[-1] + 'ing'
    else:
        ving = vword + 'ing'
    sent = f"{slots[0]['word']} {slots[1]['word']} {ving} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']}"
    ctx = f"（正在）{subj['cn']}{verb['cn']}{adj['cn']}{noun['cn']}"
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,2,4,5]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": {},
    }

def t_therebe():
    """8. There be: There + be + (art/num) + (adj) + N + prep + (art) + (adj) + N"""
    there = {"word":"There","cn":"有","pos":"adv","element":"土"}
    be = random.choice(by_pos.get('aux', []) + by_pos.get('verb', []))
    # ensure be is actually 'is' or 'are'
    be_candidates = [w for w in by_pos.get('verb',[]) if w['word'] in ('is','are','was','were')]
    if not be_candidates: return None
    be = random.choice(be_candidates)
    art1 = pick('art')
    adj1 = pick('adj')
    noun1= pick('noun')
    prep = pick('prep')
    art2 = pick('art')
    adj2 = pick('adj')
    noun2= pick('noun')
    if not all([be, art1, adj1, noun1, prep, art2, adj2, noun2]): return None
    slots = [there, be, art1, adj1, noun1, prep, art2, adj2, noun2]
    sent = f"{slots[0]['word']} {slots[1]['word']} {slots[2]['word']} {slots[3]['word']} {slots[4]['word']} {slots[5]['word']} {slots[6]['word']} {slots[7]['word']} {slots[8]['word']}"
    ctx = f"有{art1['cn']}{adj1['cn']}{noun1['cn']}{prep['cn']}{art2['cn']}{adj2['cn']}{noun2['cn']}"
    return {
        "words": [make_entry(w) for w in slots],
        "target_order": [slots[i]['word'] for i in [0,1,3,4,5,7,8]],
        "target_sentence": sent,
        "context_cn": ctx,
        "alternatives": {},
    }

# ── 生成 ──────────────────────────────────────────────────
TEMPLATES = [t_modal, t_adverb, t_past, t_prep, t_compare, t_question, t_continuous, t_therebe]
GROUPS_PER_TYPE = 20  # 8*20 = 160 groups

groups = []
gid = 10001
pair_idx = 0

for _ in range(GROUPS_PER_TYPE):
    for tmpl_fn in TEMPLATES:
        for attempt in range(50):
            result = tmpl_fn()
            if result and len(result['words']) >= 4:
                # check not duplicating exact same sentence
                if not any(g['target_sentence'] == result['target_sentence'] for g in groups):
                    break
                result = None
        if not result:
            continue
        group = {
            "id": gid,
            "tier": "intermediate",
            "elements": ELEM_PAIRS[pair_idx % len(ELEM_PAIRS)],
            "context_cn": result['context_cn'],
            "target_sentence": result['target_sentence'],
            "words": result['words'],
            "target_order": result['target_order'],
            "alternatives": result['alternatives'],
        }
        groups.append(group)
        gid += 1
        pair_idx += 1

output = {
    "description": "五行英语牌 — 句子组（含 intermediate）",
    "version": "2.0",
    "total_groups": len(groups),
    "groups": groups,
}

with open('sentence_groups_intermediate.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated {len(groups)} intermediate sentence groups")
print(f"ID range: {groups[0]['id']} ~ {groups[-1]['id']}" if groups else "No groups generated!")
