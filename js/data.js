/**
 * 五行英语牌 — 数据层
 * 加载富集词汇表，提供按元素、词性等的查询功能。
 */
const DATA = (() => {
  let words = [];
  let byElement = {};
  let byPos = {};
  let loaded = false;

  // 参考词库（COCA 5000 → 4350去重，用于验证空白单词卡输入）
  let refVocab = [];
  let refVocabMap = {};  // { word: pos }
  let refLoaded = false;

  // 句子组
  let sentenceGroups = [];
  let groupsByPair = {};
  let groupsLoaded = false;

  const ELEMENTS = [
    { id: 'huo', name: '火', icon: '🔥', color: '#ff5722', bg: '#fff3e0', cls: 'elem-huo' },
    { id: 'shui', name: '水', icon: '💧', color: '#2196f3', bg: '#e3f2fd', cls: 'elem-shui' },
    { id: 'mu', name: '木', icon: '🌳', color: '#4caf50', bg: '#e8f5e9', cls: 'elem-mu' },
    { id: 'jin', name: '金', icon: '⭐', color: '#f57f17', bg: '#fff8e1', cls: 'elem-jin' },
    { id: 'tu', name: '土', icon: '⛰️', color: '#795548', bg: '#efebe9', cls: 'elem-tu' },
  ];

  const ELEM_MAP = { huo: '火', shui: '水', mu: '木', jin: '金', tu: '土' };
  const ELEM_REVERSE = { '火': 'huo', '水': 'shui', '木': 'mu', '金': 'jin', '土': 'tu' };

  // 五行相生：木→火→土→金→水→木
  const SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const POS_ORDER = ['pron', 'verb', 'adj', 'noun'];
  const POS_LABELS = { noun: '名词', verb: '动词', adj: '形容词', pron: '代词' };

  // 判定是否为虚词（不计入中级模式的通过阈值）
  const FUNCTION_POS = new Set(['art', 'prep', 'aux', 'conj']);
  function isFunctionWord(pos) { return FUNCTION_POS.has(pos); }

  async function load() {
    if (loaded) return;
    try {
      const [vocabResp, groupResp] = await Promise.all([
        fetch('vocabulary.json'),
        fetch('sentence_groups.json'),
      ]);
      const vocabData = await vocabResp.json();
      words = vocabData.words;

      // Build indices
      byElement = {};
      byPos = {};
      for (const w of words) {
        const el = w.element;
        if (!byElement[el]) byElement[el] = [];
        byElement[el].push(w);
        const p = w.pos;
        if (!byPos[p]) byPos[p] = [];
        byPos[p].push(w);
      }

      // Load sentence groups
      const groupData = await groupResp.json();
      sentenceGroups = groupData.groups;
      groupsByPair = {};
      for (const g of sentenceGroups) {
        const key = [g.elements[0], g.elements[1]].sort().join('-');
        if (!groupsByPair[key]) groupsByPair[key] = [];
        groupsByPair[key].push(g);
      }

      loaded = true;
    } catch (e) {
      console.error('Failed to load vocabulary:', e);
    }
  }

  /** 加载参考词库（验证空白单词卡用） */
  async function loadReference() {
    if (refLoaded) return;
    try {
      const resp = await fetch('reference_vocab.json');
      const data = await resp.json();
      refVocab = data;
      refVocabMap = {};
      for (const entry of refVocab) {
        refVocabMap[entry.w] = entry.p;
      }
      refLoaded = true;
    } catch (e) {
      console.warn('Failed to load reference vocabulary:', e);
    }
  }

  /** 在参考词库中查找单词，返回 { word, pos } 或 null */
  function lookupReferenceWord(word) {
    if (!word) return null;
    const key = word.toLowerCase().trim();
    const pos = refVocabMap[key];
    if (pos) return { word: key, pos };
    // 尝试去掉末尾s/es/ed/ing再查（简单词形还原）
    const stripped = key.replace(/'(s|t|re|ve|ll|d)$/, '').replace(/ing$/, '').replace(/ed$/, '').replace(/es$/, '').replace(/s$/, '');
    if (stripped !== key) {
      const p = refVocabMap[stripped];
      if (p) return { word: key, pos: p };
    }
    return null;
  }

  /** 从所有句子组中随机选一组（不限五行，可按 tier 筛选） */
  function selectAnySentenceGroup(tier) {
    if (sentenceGroups.length === 0) return null;
    const candidates = sentenceGroups.filter(g => {
      if (tier === 'beginner') return !g.tier || g.tier === 'beginner';
      if (tier === 'intermediate') return g.tier === 'intermediate';
      return true; // no filter
    });
    if (candidates.length === 0) return null;
    const group = randomPick(candidates);
    const wordMap = {};
    for (const w of group.words) wordMap[w.word] = w;
    for (const w of group.words) {
      if (!w.sentence) {
        const fromVocab = byElement[w.element]?.find(v => v.word.toLowerCase() === w.word.toLowerCase() && v.pos === w.pos);
        if (fromVocab) w.sentence = fromVocab.sentence;
      }
    }
    const targetOrder = group.target_order.map(w => wordMap[w]).filter(Boolean);
    return {
      words: group.words,
      targetOrder,
      targetSentence: group.target_sentence,
      contextCn: group.context_cn || '',
    };
  }

  /** 根据用户和系统选的五行，匹配一个句子组 */
  function selectSentenceGroup(userElem, sysElem) {
    const key = [userElem, sysElem].sort().join('-');
    const matching = groupsByPair[key] || [];
    if (matching.length === 0) return null;
    const group = randomPick(matching);
    const wordMap = {};
    for (const w of group.words) wordMap[w.word] = w;

    // 补上 sentence 字段（从主词库查）
    for (const w of group.words) {
      if (!w.sentence) {
        const fromVocab = byElement[w.element]?.find(v => v.word.toLowerCase() === w.word.toLowerCase() && v.pos === w.pos);
        if (fromVocab) w.sentence = fromVocab.sentence;
      }
    }

    const targetOrder = group.target_order.map(w => wordMap[w]).filter(Boolean);
    return {
      words: group.words,
      targetOrder,
      targetSentence: group.target_sentence,
      contextCn: group.context_cn || '',
    };
  }

  /** 从（指定五行或全部）中选 4 个词（pron, verb, adj, noun 各一） */
  function selectWords4(userElem, sysElem) {
    let combined;
    if (userElem && sysElem) {
      const pool1 = byElement[userElem] || [];
      const pool2 = byElement[sysElem] || [];
      combined = [...pool1, ...pool2];
    } else {
      combined = words;
    }

    const selected = [];
    for (const pos of POS_ORDER) {
      const candidates = combined.filter(w => w.pos === pos);
      if (candidates.length > 0) {
        selected.push(candidates[Math.floor(Math.random() * candidates.length)]);
      }
    }
    // Shuffle learning order (not the grammatical order)
    return shuffleArray([...selected]);
  }

  /** 获取句子目标顺序（pron → verb → adj → noun） */
  function getTargetOrder(words4) {
    const map = {};
    for (const w of words4) map[w.pos] = w;
    return POS_ORDER.filter(p => map[p]).map(p => map[p]);
  }

  /** 子序列匹配检测，返回 { count, matched:[] } */
  function checkSubsequence(userArr, targetArr) {
    let ti = 0;
    const matched = [];
    for (const item of userArr) {
      if (ti < targetArr.length && item.word === targetArr[ti].word) {
        matched.push(item);
        ti++;
      }
    }
    return { count: matched.length, matched };
  }

  function getElementInfo(elementName) {
    const id = ELEM_REVERSE[elementName];
    return ELEMENTS.find(e => e.id === id) || null;
  }

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(a) {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** 从指定五行属性中随机抽取 count 个词（用于挑战模式奖励） */
  function selectRandomCardsByElement(element, count) {
    const candidates = byElement[element] || [];
    const shuffled = shuffleArray(candidates);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /** 从词汇表查找单词的词性（用于补全老背包数据） */
  function lookupWordPos(word, element) {
    const lowered = word.toLowerCase();
    const match = words.find(w => w.word.toLowerCase() === lowered && w.element === element);
    return match ? match.pos : '';
  }

  /** 生成 Boss 完形填空题 */
  function generateClozeQuestion() {
    const allGroups = sentenceGroups.length > 0 ? sentenceGroups : null;
    if (!allGroups) return null;

    const group = randomPick(allGroups);
    // 选一个实词来挖空 (noun/verb/adj)
    const contentWords = group.words.filter(w => ['noun', 'verb', 'adj'].includes(w.pos));
    if (contentWords.length === 0) return null;
    const target = randomPick(contentWords);

    // 找干扰项：同一词性、不同词
    const samePos = byPos[target.pos] || [];
    let distractors = shuffleArray(
      samePos.filter(w => w.word.toLowerCase() !== target.word.toLowerCase())
    ).slice(0, 2);
    while (distractors.length < 2) {
      const fallback = words.find(w => w.word.toLowerCase() !== target.word.toLowerCase() && !distractors.includes(w));
      if (fallback) distractors.push(fallback);
      else break;
    }

    const options = shuffleArray([
      { word: target.word, cn: target.cn, isCorrect: true },
      ...distractors.map(w => ({ word: w.word, cn: w.cn, isCorrect: false })),
    ]);

    // check alternatives: if a distractor is also acceptable, mark it correct
    const alts = group.alternatives && group.alternatives[target.word];
    if (alts && alts.length > 0) {
      for (const opt of options) {
        if (alts.some(a => a.toLowerCase() === opt.word.toLowerCase())) {
          opt.isCorrect = true;
        }
      }
    }

    // 构建带空白的句子展示
    // 由于句子中的词形可能与 target_order 不一致（如 has vs have），
    // 需要按顺序对齐 sentence 和 target_order 来定位挖空位置
    const sentenceWords = group.target_sentence.split(/\s+/);
    let displaySentence;
    let foundIdx = -1;

    // 方法：遍历句子单词，与 target_order 顺序对齐，找到目标词对应的位置
    let orderIdx = 0;
    for (let i = 0; i < sentenceWords.length; i++) {
      const clean = sentenceWords[i].replace(/[^a-zA-Z]/g, '');
      if (orderIdx < group.target_order.length) {
        const orderWord = group.target_order[orderIdx];
        // 如果当前句子词匹配 target_order 中的词，或与目标词同义（词根匹配）
        if (clean.toLowerCase() === orderWord.toLowerCase()) {
          if (orderWord.toLowerCase() === target.word.toLowerCase()) {
            foundIdx = i;
            break;
          }
          orderIdx++;
        }
        // 否则跳过冠词/介词等（句子有但 target_order 没有的词）
      } else {
        // target_order 已耗尽，但句子还有剩余词
        if (clean.toLowerCase() === target.word.toLowerCase()) {
          foundIdx = i;
          break;
        }
      }
    }

    // 如果上面的方法没找到，尝试词根匹配（处理 has vs have, eats vs eat 等）
    if (foundIdx === -1) {
      const targetRoot = target.word.toLowerCase().replace(/^(have?|has)$/, 'hav');
      for (let i = 0; i < sentenceWords.length; i++) {
        const clean = sentenceWords[i].replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (clean === target.word.toLowerCase() ||
            (clean.startsWith(target.word.toLowerCase()) && target.word.length >= 3) ||
            (target.word.toLowerCase().startsWith(clean) && clean.length >= 3)) {
          foundIdx = i;
          break;
        }
      }
    }

    if (foundIdx >= 0) {
      const before = sentenceWords.slice(0, foundIdx).join(' ');
      const after = sentenceWords.slice(foundIdx + 1).join(' ');
      displaySentence = (before ? before + ' ' : '') + '______' + (after ? ' ' + after : '');
    } else {
      // 最后手段：替换句子第一个实词（跳过冠词/代词）
      let replaced = false;
      for (let i = 0; i < sentenceWords.length; i++) {
        const clean = sentenceWords[i].replace(/[^a-zA-Z]/g, '');
        if (!['a','an','the','i','you','he','she','it','we','they'].includes(clean.toLowerCase())) {
          sentenceWords[i] = sentenceWords[i].replace(clean, '______');
          replaced = true;
          break;
        }
      }
      displaySentence = replaced ? sentenceWords.join(' ') : group.target_sentence.replace(/\S+/, '______');
    }

    return {
      type: 'cloze',
      displaySentence,
      options,
      correctWord: target,
      sourceGroup: group,
    };
  }

  return { load, words, byElement, byPos, ELEMENTS, ELEM_MAP, ELEM_REVERSE, SHENG,
    POS_ORDER, POS_LABELS, selectWords4, getTargetOrder, checkSubsequence,
    selectSentenceGroup, selectAnySentenceGroup, getElementInfo, randomPick, shuffleArray,
    isFunctionWord, generateClozeQuestion, lookupWordPos, sentenceGroups,
    selectRandomCardsByElement,
    loadReference, lookupReferenceWord };
})();
