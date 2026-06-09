#!/usr/bin/env python3
"""
为 5-6 年级生成句子组（intermediate tier）
基于预定义的天然句子列表，每个句子手动编写确保语法正确。
"""
import json, random

random.seed(42)

with open('vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)['words']

# 构建快速查找表 {word: entry}
vocab_map = {}
for w in vocab:
    key = w['word'].lower()
    if key not in vocab_map:
        vocab_map[key] = w

def lookup(word):
    """从词库查找单词，找不到则生成一个默认条目"""
    w = vocab_map.get(word.lower())
    if w:
        return {"word": w['word'], "cn": w['cn'], "pos": w['pos'], "element": w['element']}
    # 默认（冠词/介词等小词可能不在词库中）
    return {"word": word, "cn": word, "pos": "art", "element": "土"}

# 五行属性对（10组，round-robin）
ELEM_PAIRS = [
    ["木","火"], ["火","土"], ["土","金"], ["金","水"], ["水","木"],
    ["木","土"], ["火","金"], ["土","水"], ["金","木"], ["水","火"],
]

# ── 预定义句子列表 ──
# 每条：(target_sentence, context_cn, [word, word, ...])  其中 word 列表不含冠词等目标顺序忽略的词
# 或者直接用空格分隔句子，程序自动处理

SENTENCES = [
    # === 情态动词 (can/must/should/will/may) ===
    ("I can read this book", "我能读这本书", ["I", "can", "read", "this", "book"]),
    ("You must finish your homework", "你必须完成作业", ["You", "must", "finish", "your", "homework"]),
    ("We should help our parents", "我们应该帮助父母", ["We", "should", "help", "our", "parents"]),
    ("She can swim very fast", "她能游得很快", ["She", "can", "swim", "very", "fast"]),
    ("They must arrive on time", "他们必须准时到达", ["They", "must", "arrive", "on", "time"]),
    ("He should drink more water", "他应该多喝水", ["He", "should", "drink", "more", "water"]),
    ("I will visit my grandmother", "我会去看望奶奶", ["I", "will", "visit", "my", "grandmother"]),
    ("You may use my pencil", "你可以用我的铅笔", ["You", "may", "use", "my", "pencil"]),
    ("We must keep the room clean", "我们必须保持房间干净", ["We", "must", "keep", "the", "room", "clean"]),
    ("She can speak English well", "她英语说得很好", ["She", "can", "speak", "English", "well"]),
    ("I cannot find my key", "我找不到钥匙了", ["I", "cannot", "find", "my", "key"]),
    ("You should try again", "你应该再试一次", ["You", "should", "try", "again"]),
    ("We will meet tomorrow", "我们明天见面", ["We", "will", "meet", "tomorrow"]),
    ("He can carry the box", "他能搬动这个箱子", ["He", "can", "carry", "the", "box"]),
    ("May I come in", "我可以进来吗", ["May", "I", "come", "in"]),

    # === 频率/方式副词 ===
    ("She always arrives early", "她总是早到", ["She", "always", "arrives", "early"]),
    ("He never eats meat", "他从不吃肉", ["He", "never", "eats", "meat"]),
    ("I often read before bed", "我睡前经常阅读", ["I", "often", "read", "before", "bed"]),
    ("We usually walk to school", "我们通常走路去学校", ["We", "usually", "walk", "to", "school"]),
    ("They sometimes play outside", "他们有时在外面玩", ["They", "sometimes", "play", "outside"]),
    ("He quickly finished his work", "他很快完成了工作", ["He", "quickly", "finished", "his", "work"]),
    ("She carefully painted the picture", "她仔细地画了这幅画", ["She", "carefully", "painted", "the", "picture"]),
    ("I suddenly heard a noise", "我突然听到了声音", ["I", "suddenly", "heard", "a", "noise"]),
    ("We finally reached the top", "我们终于到达了山顶", ["We", "finally", "reached", "the", "top"]),
    ("He easily solved the problem", "他轻松解决了问题", ["He", "easily", "solved", "the", "problem"]),
    ("She almost forgot the time", "她差点忘了时间", ["She", "almost", "forgot", "the", "time"]),
    ("I really like this song", "我真的很喜欢这首歌", ["I", "really", "like", "this", "song"]),
    ("They recently moved here", "他们最近搬到了这里", ["They", "recently", "moved", "here"]),
    ("He slowly opened the door", "他慢慢地打开了门", ["He", "slowly", "opened", "the", "door"]),
    ("She never tells lies", "她从不说谎", ["She", "never", "tells", "lies"]),

    # === 过去时 ===
    ("I visited the museum yesterday", "我昨天参观了博物馆", ["I", "visited", "the", "museum", "yesterday"]),
    ("She played the piano beautifully", "她钢琴弹得很美", ["She", "played", "the", "piano", "beautifully"]),
    ("They watched a movie last night", "他们昨晚看了一部电影", ["They", "watched", "a", "movie", "last", "night"]),
    ("He walked to the park alone", "他独自走到公园", ["He", "walked", "to", "the", "park", "alone"]),
    ("We learned a new song", "我们学了一首新歌", ["We", "learned", "a", "new", "song"]),
    ("My mother cooked dinner for us", "妈妈为我们做了晚餐", ["My", "mother", "cooked", "dinner", "for", "us"]),
    ("The dog followed me home", "狗跟着我回了家", ["The", "dog", "followed", "me", "home"]),
    ("I finished my homework quickly", "我快速完成了作业", ["I", "finished", "my", "homework", "quickly"]),
    ("She opened the window carefully", "她小心地打开了窗户", ["She", "opened", "the", "window", "carefully"]),
    ("They arrived at the station late", "他们到车站晚了", ["They", "arrived", "at", "the", "station", "late"]),
    ("He closed the door quietly", "他安静地关上了门", ["He", "closed", "the", "door", "quietly"]),
    ("I enjoyed the party very much", "我很喜欢这个派对", ["I", "enjoyed", "the", "party", "very", "much"]),
    ("She answered all the questions", "她回答了所有问题", ["She", "answered", "all", "the", "questions"]),
    ("They built a new bridge", "他们建了一座新桥", ["They", "built", "a", "new", "bridge"]),
    ("He caught a big fish", "他抓到了一条大鱼", ["He", "caught", "a", "big", "fish"]),

    # === 介词短语 ===
    ("The cat is under the bed", "猫在床底下", ["The", "cat", "is", "under", "the", "bed"]),
    ("She sat beside her friend", "她坐在朋友旁边", ["She", "sat", "beside", "her", "friend"]),
    ("He put the book on the shelf", "他把书放在书架上", ["He", "put", "the", "book", "on", "the", "shelf"]),
    ("They walked across the bridge", "他们走过了桥", ["They", "walked", "across", "the", "bridge"]),
    ("I waited for you at the gate", "我在门口等你", ["I", "waited", "for", "you", "at", "the", "gate"]),
    ("The bird flew over the house", "鸟飞过了房子", ["The", "bird", "flew", "over", "the", "house"]),
    ("She lives near the school", "她住在学校附近", ["She", "lives", "near", "the", "school"]),
    ("He jumped into the water", "他跳进了水里", ["He", "jumped", "into", "the", "water"]),
    ("They ran through the forest", "他们跑过了森林", ["They", "ran", "through", "the", "forest"]),
    ("I stayed at home all day", "我在家待了一整天", ["I", "stayed", "at", "home", "all", "day"]),
    ("The pencil is on the desk", "铅笔在桌子上", ["The", "pencil", "is", "on", "the", "desk"]),
    ("She looked out the window", "她向窗外看去", ["She", "looked", "out", "the", "window"]),
    ("He went into the room", "他走进了房间", ["He", "went", "into", "the", "room"]),
    ("They sat around the table", "他们围坐在桌子旁", ["They", "sat", "around", "the", "table"]),
    ("I found the key under the mat", "我在垫子下找到了钥匙", ["I", "found", "the", "key", "under", "the", "mat"]),

    # === 比较级 ===
    ("This book is better than that one", "这本书比那本好", ["This", "book", "is", "better", "than", "that", "one"]),
    ("She runs faster than her brother", "她跑得比哥哥快", ["She", "runs", "faster", "than", "her", "brother"]),
    ("He is taller than his father", "他比爸爸高了", ["He", "is", "taller", "than", "his", "father"]),
    ("Summer is hotter than winter", "夏天比冬天热", ["Summer", "is", "hotter", "than", "winter"]),
    ("My bag is heavier than yours", "我的包比你的重", ["My", "bag", "is", "heavier", "than", "yours"]),
    ("This road is wider than that road", "这条路比那条宽", ["This", "road", "is", "wider", "than", "that", "road"]),
    ("This exercise is easier than that one", "这个练习比那个简单", ["This", "exercise", "is", "easier", "than", "that", "one"]),
    ("I feel better than yesterday", "我感觉比昨天好", ["I", "feel", "better", "than", "yesterday"]),
    ("He arrived earlier than the others", "他比别人到得早", ["He", "arrived", "earlier", "than", "the", "others"]),
    ("This cake tastes sweeter than that one", "这个蛋糕比那个甜", ["This", "cake", "tastes", "sweeter", "than", "that", "one"]),
    ("She is taller than me now", "她现在比我高了", ["She", "is", "taller", "than", "me", "now"]),
    ("This movie is more interesting", "这部电影更有趣", ["This", "movie", "is", "more", "interesting"]),
    ("He runs faster than before", "他比以前跑得快", ["He", "runs", "faster", "than", "before"]),
    ("The weather is getting warmer", "天气变暖和了", ["The", "weather", "is", "getting", "warmer"]),
    ("This question is more difficult", "这个问题更难", ["This", "question", "is", "more", "difficult"]),

    # === 疑问句 ===
    ("Where do you live", "你住在哪里", ["Where", "do", "you", "live"]),
    ("What does she want", "她想要什么", ["What", "does", "she", "want"]),
    ("Why are you late", "你为什么迟到了", ["Why", "are", "you", "late"]),
    ("When will they arrive", "他们什么时候到", ["When", "will", "they", "arrive"]),
    ("How did you do that", "你是怎么做到的", ["How", "did", "you", "do", "that"]),
    ("Who is your best friend", "谁是你最好的朋友", ["Who", "is", "your", "best", "friend"]),
    ("Which color do you like", "你喜欢哪个颜色", ["Which", "color", "do", "you", "like"]),
    ("How many books do you have", "你有多少本书", ["How", "many", "books", "do", "you", "have"]),
    ("Where did you put my keys", "你把我的钥匙放哪了", ["Where", "did", "you", "put", "my", "keys"]),
    ("What time does the class start", "课几点开始", ["What", "time", "does", "the", "class", "start"]),
    ("How often do you exercise", "你多久锻炼一次", ["How", "often", "do", "you", "exercise"]),
    ("What did she say", "她说了什么", ["What", "did", "she", "say"]),
    ("Why did you cry", "你为什么哭了", ["Why", "did", "you", "cry"]),
    ("How much does it cost", "这个多少钱", ["How", "much", "does", "it", "cost"]),
    ("Where should we go", "我们应该去哪里", ["Where", "should", "we", "go"]),

    # === 现在进行时 ===
    ("She is reading a book", "她正在读一本书", ["She", "is", "reading", "a", "book"]),
    ("They are playing football", "他们在踢足球", ["They", "are", "playing", "football"]),
    ("I am waiting for the bus", "我在等公交车", ["I", "am", "waiting", "for", "the", "bus"]),
    ("He is drawing a picture", "他在画一幅画", ["He", "is", "drawing", "a", "picture"]),
    ("We are learning English", "我们在学英语", ["We", "are", "learning", "English"]),
    ("The baby is sleeping quietly", "宝宝在安静地睡觉", ["The", "baby", "is", "sleeping", "quietly"]),
    ("It is raining outside", "外面在下雨", ["It", "is", "raining", "outside"]),
    ("She is wearing a red dress", "她穿着一条红裙子", ["She", "is", "wearing", "a", "red", "dress"]),
    ("They are building a new house", "他们在建新房子", ["They", "are", "building", "a", "new", "house"]),
    ("I am thinking about the problem", "我在思考这个问题", ["I", "am", "thinking", "about", "the", "problem"]),
    ("The phone is ringing loudly", "电话在响", ["The", "phone", "is", "ringing", "loudly"]),
    ("He is cooking dinner in the kitchen", "他在厨房做晚饭", ["He", "is", "cooking", "dinner", "in", "the", "kitchen"]),
    ("She is talking to her friend", "她在和朋友说话", ["She", "is", "talking", "to", "her", "friend"]),
    ("The children are laughing happily", "孩子们在开心地笑", ["The", "children", "are", "laughing", "happily"]),
    ("I am doing my homework", "我在做作业", ["I", "am", "doing", "my", "homework"]),

    # === There be 句型 ===
    ("There is a big tree in the garden", "花园里有一棵大树", ["There", "is", "a", "big", "tree", "in", "the", "garden"]),
    ("There are many books on the shelf", "书架上有很多书", ["There", "are", "many", "books", "on", "the", "shelf"]),
    ("There was a strange noise last night", "昨晚有个奇怪的声音", ["There", "was", "a", "strange", "noise", "last", "night"]),
    ("There were three cats under the table", "桌子底下有三只猫", ["There", "were", "three", "cats", "under", "the", "table"]),
    ("There is a park near my house", "我家附近有个公园", ["There", "is", "a", "park", "near", "my", "house"]),
    ("There are many flowers in spring", "春天有很多花", ["There", "are", "many", "flowers", "in", "spring"]),
    ("There is a bridge across the river", "河上有一座桥", ["There", "is", "a", "bridge", "across", "the", "river"]),
    ("There are five people in my family", "我家有五口人", ["There", "are", "five", "people", "in", "my", "family"]),
    ("There were many stars in the sky", "天空中有很多星星", ["There", "were", "many", "stars", "in", "the", "sky"]),
    ("There is a letter on the table", "桌子上有一封信", ["There", "is", "a", "letter", "on", "the", "table"]),
    ("There are two apples in the bowl", "碗里有两个苹果", ["There", "are", "two", "apples", "in", "the", "bowl"]),
    ("There was a fire last week", "上周发生了一场火灾", ["There", "was", "a", "fire", "last", "week"]),

    # === 连词 (and/but/because/when/if) ===
    ("I like apples but she likes oranges", "我喜欢苹果但她喜欢橙子", ["I", "like", "apples", "but", "she", "likes", "oranges"]),
    ("He stayed home because it rained", "他待在家里因为下雨了", ["He", "stayed", "home", "because", "it", "rained"]),
    ("She smiled when she saw the gift", "她看到礼物时笑了", ["She", "smiled", "when", "she", "saw", "the", "gift"]),
    ("If you try you will succeed", "如果你尝试就会成功", ["If", "you", "try", "you", "will", "succeed"]),
    ("I read books and my sister watches TV", "我看书而妹妹看电视", ["I", "read", "books", "and", "my", "sister", "watches", "TV"]),
    ("She laughed although she felt sad", "她笑了虽然她感到难过", ["She", "laughed", "although", "she", "felt", "sad"]),
    ("We sang and danced at the party", "我们在派对上唱歌跳舞", ["We", "sang", "and", "danced", "at", "the", "party"]),
    ("He passed the test because he studied hard", "他通过了考试因为他努力学习", ["He", "passed", "the", "test", "because", "he", "studied", "hard"]),
    ("I called you but you did not answer", "我给你打电话但你沒接", ["I", "called", "you", "but", "you", "did", "not", "answer"]),

    # === 不定式/动名词 ===
    ("I want to eat some food", "我想吃点东西", ["I", "want", "to", "eat", "some", "food"]),
    ("She likes to swim in the sea", "她喜欢在海里游泳", ["She", "likes", "to", "swim", "in", "the", "sea"]),
    ("He needs to buy a new bag", "他需要买一个新包", ["He", "needs", "to", "buy", "a", "new", "bag"]),
    ("They decided to leave early", "他们决定早点离开", ["They", "decided", "to", "leave", "early"]),
    ("I love to read before sleep", "我喜欢睡前读书", ["I", "love", "to", "read", "before", "sleep"]),
    ("She hopes to become a doctor", "她希望成为医生", ["She", "hopes", "to", "become", "a", "doctor"]),
    ("We plan to visit the museum", "我们计划参观博物馆", ["We", "plan", "to", "visit", "the", "museum"]),
    ("He forgot to close the window", "他忘了关窗户", ["He", "forgot", "to", "close", "the", "window"]),
    ("They started to run faster", "他们开始跑得更快", ["They", "started", "to", "run", "faster"]),

    # === 被动/完成时（现在完成时） ===
    ("I have finished my homework", "我已经完成了作业", ["I", "have", "finished", "my", "homework"]),
    ("She has visited three countries", "她去过三个国家", ["She", "has", "visited", "three", "countries"]),
    ("We have lived here for five years", "我们在这里住了五年", ["We", "have", "lived", "here", "for", "five", "years"]),
    ("He has already eaten lunch", "他已经吃过午饭了", ["He", "has", "already", "eaten", "lunch"]),
    ("They have never been to China", "他们从未去过中国", ["They", "have", "never", "been", "to", "China"]),
    ("I have known her for a long time", "我认识她很长时间了", ["I", "have", "known", "her", "for", "a", "long", "time"]),
    ("She has lost her wallet", "她丢了钱包", ["She", "has", "lost", "her", "wallet"]),
    ("We have seen this movie before", "我们以前看过这部电影", ["We", "have", "seen", "this", "movie", "before"]),
]


# ── 生成句子组 ──
groups = []
used_sentences = set()

for sentence, context_cn, order_words in SENTENCES:
    sentence_lower = sentence.lower().rstrip('?!.')
    if sentence_lower in used_sentences:
        continue
    used_sentences.add(sentence_lower)

    # 从句子中提取所有单词
    raw_words = sentence.rstrip('?!.').split()

    # 构建 words 数组
    words = []
    for w in raw_words:
        words.append(lookup(w))

    # target_order：只包含 order_words 中指定顺序的单词
    order_word_set = {w.lower() for w in order_words}
    target_order = []
    for w in raw_words:
        if w.lower() in order_word_set:
            target_order.append(w)
            order_word_set.discard(w.lower())

    group = {
        "id": 20001 + len(groups),
        "tier": "intermediate",
        "elements": ELEM_PAIRS[len(groups) % len(ELEM_PAIRS)],
        "context_cn": context_cn,
        "target_sentence": sentence,
        "words": words,
        "target_order": target_order,
        "alternatives": {},
    }
    groups.append(group)

# 为部分句子添加可替换词（备选答案）
alt_groups = {}
alt_map = {
    "I": ["We"], "She": ["He"], "He": ["She"], "They": ["We"],
    "a": ["the"], "the": ["a"],
    "book": ["story"], "books": ["stories"],
    "big": ["large"], "small": ["little"],
    "happy": ["glad"], "sad": ["unhappy"],
    "quickly": ["fast"], "happily": ["cheerfully"],
}
for g in groups:
    alts = {}
    for i, w in enumerate(g['words']):
        wd = w['word'].lower()
        if wd in alt_map:
            alts[wd] = alt_map[wd]
    if alts:
        g['alternatives'] = alts

output = {
    "description": "五行英语牌 — 句子组（含 intermediate）",
    "version": "2.0",
    "total_groups": len(groups),
    "groups": groups,
}

with open('sentence_groups_intermediate.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated {len(groups)} intermediate sentence groups")
print(f"Sentences used: {len(used_sentences)}")
