#!/usr/bin/env python3
"""
为 5-6 年级生成句子组（intermediate tier）v3
基于预定义的天然句子列表，词形还原处理好缺词问题。
"""
import json, random, re

random.seed(42)

with open('vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)['words']

vocab_map = {}
for w in vocab:
    vocab_map[w['word'].lower()] = w

# 硬编码常见缺词（不在词库中的常见词/变形）
HARDCODED = {
    # 过去式
    "answered": {"cn":"回答","pos":"verb","element":"火"},
    "arrived": {"cn":"到达","pos":"verb","element":"水"},
    "built": {"cn":"建造","pos":"verb","element":"土"},
    "called": {"cn":"打电话","pos":"verb","element":"木"},
    "caught": {"cn":"抓住","pos":"verb","element":"金"},
    "cooked": {"cn":"烹饪","pos":"verb","element":"火"},
    "decided": {"cn":"决定","pos":"verb","element":"水"},
    "danced": {"cn":"跳舞","pos":"verb","element":"水"},
    "enjoyed": {"cn":"享受","pos":"verb","element":"火"},
    "finished": {"cn":"完成","pos":"verb","element":"金"},
    "followed": {"cn":"跟随","pos":"verb","element":"水"},
    "forgot": {"cn":"忘记","pos":"verb","element":"金"},
    "found": {"cn":"找到","pos":"verb","element":"水"},
    "heard": {"cn":"听到","pos":"verb","element":"木"},
    "jumped": {"cn":"跳","pos":"verb","element":"木"},
    "known": {"cn":"知道","pos":"verb","element":"木"},
    "laughed": {"cn":"笑","pos":"verb","element":"火"},
    "learned": {"cn":"学习","pos":"verb","element":"水"},
    "lived": {"cn":"居住","pos":"verb","element":"土"},
    "looked": {"cn":"看","pos":"verb","element":"木"},
    "lost": {"cn":"丢失","pos":"verb","element":"金"},
    "moved": {"cn":"移动","pos":"verb","element":"水"},
    "opened": {"cn":"打开","pos":"verb","element":"火"},
    "painted": {"cn":"绘画","pos":"verb","element":"木"},
    "passed": {"cn":"通过","pos":"verb","element":"金"},
    "played": {"cn":"玩","pos":"verb","element":"火"},
    "rained": {"cn":"下雨","pos":"verb","element":"水"},
    "ran": {"cn":"跑","pos":"verb","element":"木"},
    "reached": {"cn":"到达","pos":"verb","element":"土"},
    "sang": {"cn":"唱","pos":"verb","element":"火"},
    "sat": {"cn":"坐","pos":"verb","element":"土"},
    "saw": {"cn":"看见","pos":"verb","element":"木"},
    "smiled": {"cn":"微笑","pos":"verb","element":"火"},
    "solved": {"cn":"解决","pos":"verb","element":"金"},
    "stayed": {"cn":"停留","pos":"verb","element":"土"},
    "started": {"cn":"开始","pos":"verb","element":"火"},
    "studied": {"cn":"学习","pos":"verb","element":"水"},
    "talked": {"cn":"说话","pos":"verb","element":"火"},
    "visited": {"cn":"参观","pos":"verb","element":"金"},
    "waited": {"cn":"等待","pos":"verb","element":"土"},
    "walked": {"cn":"走路","pos":"verb","element":"木"},
    "watched": {"cn":"看","pos":"verb","element":"金"},
    "went": {"cn":"去","pos":"verb","element":"木"},
    # 第三人称
    "arrives": {"cn":"到达","pos":"verb","element":"水"},
    "runs": {"cn":"跑","pos":"verb","element":"木"},
    "tells": {"cn":"告诉","pos":"verb","element":"火"},
    "tastes": {"cn":"尝起来","pos":"verb","element":"土"},
    "likes": {"cn":"喜欢","pos":"verb","element":"火"},
    "needs": {"cn":"需要","pos":"verb","element":"金"},
    "hopes": {"cn":"希望","pos":"verb","element":"木"},
    "eats": {"cn":"吃","pos":"verb","element":"火"},
    "lives": {"cn":"居住","pos":"verb","element":"土"},
    # -ing
    "drawing": {"cn":"画","pos":"verb","element":"木"},
    "reading": {"cn":"读","pos":"verb","element":"水"},
    "playing": {"cn":"玩","pos":"verb","element":"火"},
    "learning": {"cn":"学习","pos":"verb","element":"水"},
    "sleeping": {"cn":"睡觉","pos":"verb","element":"土"},
    "raining": {"cn":"下雨","pos":"verb","element":"水"},
    "wearing": {"cn":"穿","pos":"verb","element":"火"},
    "building": {"cn":"建造","pos":"verb","element":"土"},
    "thinking": {"cn":"思考","pos":"verb","element":"木"},
    "ringing": {"cn":"响","pos":"verb","element":"金"},
    "cooking": {"cn":"烹饪","pos":"verb","element":"火"},
    "talking": {"cn":"说话","pos":"verb","element":"火"},
    "laughing": {"cn":"笑","pos":"verb","element":"火"},
    "doing": {"cn":"做","pos":"verb","element":"火"},
    "getting": {"cn":"变得","pos":"verb","element":"水"},
    # 比较级
    "better": {"cn":"更好","pos":"adj","element":"金"},
    "faster": {"cn":"更快","pos":"adj","element":"火"},
    "taller": {"cn":"更高","pos":"adj","element":"木"},
    "hotter": {"cn":"更热","pos":"adj","element":"火"},
    "heavier": {"cn":"更重","pos":"adj","element":"土"},
    "wider": {"cn":"更宽","pos":"adj","element":"水"},
    "easier": {"cn":"更简单","pos":"adj","element":"木"},
    "sweeter": {"cn":"更甜","pos":"adj","element":"土"},
    "warmer": {"cn":"更暖和","pos":"adj","element":"火"},
    "earlier": {"cn":"更早","pos":"adj","element":"金"},
    "more": {"cn":"更","pos":"adv","element":"火"},
    # 复数
    "apples": {"cn":"苹果","pos":"noun","element":"木"},
    "oranges": {"cn":"橙子","pos":"noun","element":"金"},
    "books": {"cn":"书","pos":"noun","element":"水"},
    "flowers": {"cn":"花","pos":"noun","element":"木"},
    "stars": {"cn":"星星","pos":"noun","element":"金"},
    "cats": {"cn":"猫","pos":"noun","element":"金"},
    "children": {"cn":"孩子们","pos":"noun","element":"火"},
    "parents": {"cn":"父母","pos":"noun","element":"土"},
    "questions": {"cn":"问题","pos":"noun","element":"水"},
    "years": {"cn":"年","pos":"noun","element":"土"},
    "keys": {"cn":"钥匙","pos":"noun","element":"金"},
    "countries": {"cn":"国家","pos":"noun","element":"土"},
    "others": {"cn":"其他人","pos":"noun","element":"火"},
    # 动词原形（特殊）
    "been": {"cn":"是（过去分词）","pos":"verb","element":"土"},
    "eaten": {"cn":"吃（过去分词）","pos":"verb","element":"火"},
    "seen": {"cn":"看见（过去分词）","pos":"verb","element":"木"},
    "become": {"cn":"成为","pos":"verb","element":"火"},
    "succeed": {"cn":"成功","pos":"verb","element":"金"},
    "cost": {"cn":"花费","pos":"verb","element":"金"},
    # 副词
    "beautifully": {"cn":"优美地","pos":"adv","element":"木"},
    "carefully": {"cn":"仔细地","pos":"adv","element":"金"},
    "quietly": {"cn":"安静地","pos":"adv","element":"水"},
    "happily": {"cn":"快乐地","pos":"adv","element":"火"},
    "loudly": {"cn":"大声地","pos":"adv","element":"火"},
    "yesterday": {"cn":"昨天","pos":"adv","element":"水"},
    "alone": {"cn":"独自","pos":"adv","element":"金"},
    "outside": {"cn":"在外面","pos":"adv","element":"木"},
    # 名词
    "mother": {"cn":"妈妈","pos":"noun","element":"土"},
    "father": {"cn":"爸爸","pos":"noun","element":"金"},
    "grandmother": {"cn":"奶奶","pos":"noun","element":"土"},
    "time": {"cn":"时间","pos":"noun","element":"金"},
    "food": {"cn":"食物","pos":"noun","element":"火"},
    "homework": {"cn":"作业","pos":"noun","element":"水"},
    "house": {"cn":"房子","pos":"noun","element":"土"},
    "picture": {"cn":"画","pos":"noun","element":"木"},
    "park": {"cn":"公园","pos":"noun","element":"木"},
    "gate": {"cn":"大门","pos":"noun","element":"金"},
    "station": {"cn":"车站","pos":"noun","element":"土"},
    "bridge": {"cn":"桥","pos":"noun","element":"水"},
    "forest": {"cn":"森林","pos":"noun","element":"木"},
    "river": {"cn":"河","pos":"noun","element":"水"},
    "garden": {"cn":"花园","pos":"noun","element":"木"},
    "kitchen": {"cn":"厨房","pos":"noun","element":"火"},
    "dinner": {"cn":"晚餐","pos":"noun","element":"火"},
    "pencil": {"cn":"铅笔","pos":"noun","element":"金"},
    "window": {"cn":"窗户","pos":"noun","element":"木"},
    "letter": {"cn":"信","pos":"noun","element":"土"},
    "noise": {"cn":"声音","pos":"noun","element":"金"},
    "fire": {"cn":"火","pos":"noun","element":"火"},
    "party": {"cn":"派对","pos":"noun","element":"火"},
    "wallet": {"cn":"钱包","pos":"noun","element":"金"},
    "exercise": {"cn":"锻炼","pos":"noun","element":"木"},
    "shelf": {"cn":"架子","pos":"noun","element":"金"},
    "top": {"cn":"顶部","pos":"noun","element":"木"},
    "road": {"cn":"路","pos":"noun","element":"土"},
    "football": {"cn":"足球","pos":"noun","element":"火"},
    "test": {"cn":"考试","pos":"noun","element":"水"},
    "music": {"cn":"音乐","pos":"noun","element":"木"},
    "weather": {"cn":"天气","pos":"noun","element":"金"},
    "class": {"cn":"课","pos":"noun","element":"土"},
    "english": {"cn":"英语","pos":"noun","element":"木"},
    "england": {"cn":"英国","pos":"noun","element":"金"},
    "china": {"cn":"中国","pos":"noun","element":"火"},
    "China": {"cn":"中国","pos":"noun","element":"火"},
    "English": {"cn":"英语","pos":"noun","element":"木"},
    "China": {"cn":"中国","pos":"noun","element":"火"},
    # 代词/助动词
    "us": {"cn":"我们（宾格）","pos":"pron","element":"土"},
    "me": {"cn":"我（宾格）","pos":"pron","element":"金"},
    "yours": {"cn":"你的","pos":"pron","element":"金"},
    "did": {"cn":"（助动词）","pos":"aux","element":"金"},
    "was": {"cn":"是（过去）","pos":"aux","element":"土"},
    "were": {"cn":"是（过去）","pos":"aux","element":"土"},
    "cannot": {"cn":"不能","pos":"aux","element":"金"},
    # 其他
    "TV": {"cn":"电视","pos":"noun","element":"火"},
    "over": {"cn":"在…上方","pos":"prep","element":"木"},
    "into": {"cn":"进入","pos":"prep","element":"水"},
    "through": {"cn":"穿过","pos":"prep","element":"金"},
    "beside": {"cn":"在…旁边","pos":"prep","element":"木"},
    "near": {"cn":"在…附近","pos":"prep","element":"水"},
    "across": {"cn":"穿过","pos":"prep","element":"金"},
    "around": {"cn":"围绕","pos":"prep","element":"土"},
    "under": {"cn":"在…下面","pos":"prep","element":"土"},
    "last": {"cn":"上一个","pos":"adj","element":"金"},
    "best": {"cn":"最好的","pos":"adj","element":"金"},
    "although": {"cn":"虽然","pos":"conj","element":"金"},
    "because": {"cn":"因为","pos":"conj","element":"火"},
    "since": {"cn":"自从","pos":"conj","element":"水"},
    "before": {"cn":"在…之前","pos":"prep","element":"木"},
    "if": {"cn":"如果","pos":"conj","element":"水"},
    "when": {"cn":"当…时","pos":"conj","element":"木"},
    # 形容词
    "late": {"cn":"迟的","pos":"adj","element":"金"},
    "strange": {"cn":"奇怪的","pos":"adj","element":"木"},
    "work": {"cn":"工作","pos":"noun","element":"金"},
    "felt": {"cn":"感到","pos":"verb","element":"水"},
    "live": {"cn":"居住","pos":"verb","element":"火"},
    "color": {"cn":"颜色","pos":"noun","element":"木"},
    "feel": {"cn":"感觉","pos":"verb","element":"水"},
    "start": {"cn":"开始","pos":"verb","element":"火"},
    "lies": {"cn":"谎言","pos":"noun","element":"金"},
    "flew": {"cn":"飞","pos":"verb","element":"木"},
    "box": {"cn":"箱子","pos":"noun","element":"土"},
    "asleep": {"cn":"睡着的","pos":"adj","element":"土"},
    "interesting": {"cn":"有趣的","pos":"adj","element":"火"},
    "difficult": {"cn":"困难的","pos":"adj","element":"金"},
    "main": {"cn":"主要的","pos":"adj","element":"土"},
    "third": {"cn":"第三的","pos":"adj","element":"木"},
    "useful": {"cn":"有用的","pos":"adj","element":"金"},
}

def lookup(word):
    """从词库查找单词，支持词形还原 + 硬编码补缺"""
    key = word.lower()

    # 1. 直接匹配
    if key in vocab_map:
        w = vocab_map[key]
        return {"word": w['word'], "cn": w['cn'], "pos": w['pos'], "element": w['element']}

    # 2. 硬编码表
    if key in HARDCODED:
        h = HARDCODED[key]
        return {"word": word, "cn": h['cn'], "pos": h['pos'], "element": h['element']}

    # 3. 词形还原匹配
    stem = key
    if stem.endswith('ing'):
        base = stem[:-3]
        if base in vocab_map: stem = base
        elif base + 'e' in vocab_map: stem = base + 'e'
    elif stem.endswith('ed'):
        base = stem[:-2]
        if base in vocab_map: stem = base
        elif base + 'e' in vocab_map: stem = base + 'e'
    elif stem.endswith('s') and not stem.endswith('ss'):
        base = stem[:-1]
        if base in vocab_map: stem = base
    elif stem.endswith('er'):
        base = stem[:-2]
        if base in vocab_map: stem = base
    elif stem.endswith('est'):
        base = stem[:-3]
        if base in vocab_map: stem = base
    elif stem.endswith('n') and stem[:-1] in vocab_map:
        stem = stem[:-1]  # known → know, seen → see
    elif stem == 'ran':
        stem = 'run'
    elif stem == 'sat':
        stem = 'sit'
    elif stem == 'sang':
        stem = 'sing'
    elif stem == 'went':
        stem = 'go'
    elif stem == 'told':
        stem = 'tell'

    if stem != key and stem in vocab_map:
        w = vocab_map[stem]
        return {"word": word, "cn": w['cn'], "pos": w['pos'], "element": w['element']}

    # 4. 保底
    return {"word": word, "cn": word, "pos": "noun", "element": "土"}

ELEM_PAIRS = [
    ["木","火"], ["火","土"], ["土","金"], ["金","水"], ["水","木"],
    ["木","土"], ["火","金"], ["土","水"], ["金","木"], ["水","火"],
]

# ── 预定义句子列表 ──
SENTENCES = [
    # === 情态动词 ===
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
    ("The cat is under the bed", "猫在床底下", ["The", "cat", "under", "the", "bed"]),
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

    # === 比较级 ===
    ("This book is better than that one", "这本书比那本好", ["This", "book", "better", "than", "that", "one"]),
    ("She runs faster than her brother", "她跑得比哥哥快", ["She", "runs", "faster", "than", "her", "brother"]),
    ("He is taller than his father", "他比爸爸高了", ["He", "taller", "than", "his", "father"]),
    ("Summer is hotter than winter", "夏天比冬天热", ["Summer", "hotter", "than", "winter"]),
    ("My bag is heavier than yours", "我的包比你的重", ["My", "bag", "heavier", "than", "yours"]),
    ("This road is wider than that road", "这条路比那条宽", ["This", "road", "wider", "than", "that", "road"]),
    ("This exercise is easier than that one", "这个练习比那个简单", ["This", "exercise", "easier", "than", "that", "one"]),
    ("I feel better than yesterday", "我感觉比昨天好", ["I", "feel", "better", "than", "yesterday"]),
    ("He arrived earlier than the others", "他比别人到得早", ["He", "arrived", "earlier", "than", "the", "others"]),
    ("This cake tastes sweeter than that one", "这个蛋糕比那个甜", ["This", "cake", "sweeter", "than", "that", "one"]),
    ("She is taller than me now", "她现在比我高了", ["She", "taller", "than", "me", "now"]),
    ("This movie is more interesting", "这部电影更有趣", ["This", "movie", "more", "interesting"]),
    ("He runs faster than before", "他比以前跑得快", ["He", "runs", "faster", "than", "before"]),
    ("The weather is getting warmer", "天气变暖和了", ["The", "weather", "getting", "warmer"]),
    ("This question is more difficult", "这个问题更难", ["This", "question", "more", "difficult"]),

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
    ("She is reading a book", "她正在读一本书", ["She", "reading", "a", "book"]),
    ("They are playing football", "他们在踢足球", ["They", "playing", "football"]),
    ("I am waiting for the bus", "我在等公交车", ["I", "waiting", "for", "the", "bus"]),
    ("He is drawing a picture", "他在画一幅画", ["He", "drawing", "a", "picture"]),
    ("We are learning English", "我们在学英语", ["We", "learning", "English"]),
    ("The baby is sleeping quietly", "宝宝在安静地睡觉", ["The", "baby", "sleeping", "quietly"]),
    ("It is raining outside", "外面在下雨", ["It", "raining", "outside"]),
    ("She is wearing a red dress", "她穿着一条红裙子", ["She", "wearing", "a", "red", "dress"]),
    ("They are building a new house", "他们在建新房子", ["They", "building", "a", "new", "house"]),
    ("I am thinking about the problem", "我在思考这个问题", ["I", "thinking", "about", "the", "problem"]),
    ("The phone is ringing loudly", "电话在响", ["The", "phone", "ringing", "loudly"]),
    ("He is cooking dinner in the kitchen", "他在厨房做晚饭", ["He", "cooking", "dinner", "in", "the", "kitchen"]),
    ("She is talking to her friend", "她在和朋友说话", ["She", "talking", "to", "her", "friend"]),
    ("The children are laughing happily", "孩子们在开心地笑", ["The", "children", "laughing", "happily"]),
    ("I am doing my homework", "我在做作业", ["I", "doing", "my", "homework"]),

    # === There be 句型 ===
    ("There is a big tree in the garden", "花园里有一棵大树", ["There", "a", "big", "tree", "in", "the", "garden"]),
    ("There are many books on the shelf", "书架上有很多书", ["There", "many", "books", "on", "the", "shelf"]),
    ("There was a strange noise last night", "昨晚有个奇怪的声音", ["There", "a", "strange", "noise", "last", "night"]),
    ("There were three cats under the table", "桌子底下有三只猫", ["There", "three", "cats", "under", "the", "table"]),
    ("There is a park near my house", "我家附近有个公园", ["There", "a", "park", "near", "my", "house"]),
    ("There are many flowers in spring", "春天有很多花", ["There", "many", "flowers", "in", "spring"]),
    ("There is a bridge across the river", "河上有一座桥", ["There", "a", "bridge", "across", "the", "river"]),
    ("There are five people in my family", "我家有五口人", ["There", "five", "people", "in", "my", "family"]),
    ("There were many stars in the sky", "天空中有很多星星", ["There", "many", "stars", "in", "the", "sky"]),
    ("There is a letter on the table", "桌子上有一封信", ["There", "a", "letter", "on", "the", "table"]),
    ("There are two apples in the bowl", "碗里有两个苹果", ["There", "two", "apples", "in", "the", "bowl"]),
    ("There was a fire last week", "上周发生了一场火灾", ["There", "a", "fire", "last", "week"]),

    # === 连词 (and/but/because/when/if) ===
    ("I like apples but she likes oranges", "我喜欢苹果但她喜欢橙子", ["I", "like", "apples", "but", "she", "likes", "oranges"]),
    ("He stayed home because it rained", "他待在家里因为下雨了", ["He", "stayed", "home", "because", "it", "rained"]),
    ("She smiled when she saw the gift", "她看到礼物时笑了", ["She", "smiled", "when", "she", "saw", "the", "gift"]),
    ("If you try you will succeed", "如果你尝试就会成功", ["If", "you", "try", "you", "will", "succeed"]),
    ("She laughed although she felt sad", "她笑了虽然她感到难过", ["She", "laughed", "although", "she", "felt", "sad"]),
    ("We sang and danced at the party", "我们在派对上唱歌跳舞", ["We", "sang", "and", "danced", "at", "the", "party"]),
    ("I called you but you did not answer", "我给你打电话但你沒接", ["I", "called", "you", "but", "you", "did", "not", "answer"]),

    # === 不定式 ===
    ("I want to eat some food", "我想吃点东西", ["I", "want", "eat", "some", "food"]),
    ("She likes to swim in the sea", "她喜欢在海里游泳", ["She", "likes", "swim", "in", "the", "sea"]),
    ("He needs to buy a new bag", "他需要买一个新包", ["He", "needs", "buy", "a", "new", "bag"]),
    ("They decided to leave early", "他们决定早点离开", ["They", "decided", "leave", "early"]),
    ("I love to read before sleep", "我喜欢睡前读书", ["I", "love", "read", "before", "sleep"]),
    ("She hopes to become a doctor", "她希望成为医生", ["She", "hopes", "become", "a", "doctor"]),
    ("We plan to visit the museum", "我们计划参观博物馆", ["We", "plan", "visit", "the", "museum"]),
    ("He forgot to close the window", "他忘了关窗户", ["He", "forgot", "close", "the", "window"]),
    ("They started to run faster", "他们开始跑得更快", ["They", "started", "run", "faster"]),

    # === 现在完成时 ===
    ("I have finished my homework", "我已经完成了作业", ["I", "have", "finished", "my", "homework"]),
    ("She has visited three countries", "她去过三个国家", ["She", "has", "visited", "three", "countries"]),
    ("We have lived here for five years", "我们在这里住了五年", ["We", "have", "lived", "here", "for", "five", "years"]),
    ("He has already eaten lunch", "他已经吃过午饭了", ["He", "has", "already", "eaten", "lunch"]),
    ("They have never been to China", "他们从未去过中国", ["They", "have", "never", "been", "China"]),
    ("I have known her for a long time", "我认识她很长时间了", ["I", "have", "known", "her", "for", "a", "long", "time"]),
    ("She has lost her wallet", "她丢了钱包", ["She", "has", "lost", "her", "wallet"]),
    ("We have seen this movie before", "我们以前看过这部电影", ["We", "have", "seen", "this", "movie", "before"]),
]

# ── 生成 ──
groups = []
used = set()

for sentence, context_cn, order_words in SENTENCES:
    raw_words = sentence.split()
    words = [lookup(w) for w in raw_words]

    # target_order: 只包含 order_words 指定的词（保持原顺序）
    order_set = [w.lower() for w in order_words]
    target_order = []
    for w in raw_words:
        if w.lower() in order_set:
            target_order.append(w)

    gid = 20001 + len(groups)
    pair = ELEM_PAIRS[len(groups) % len(ELEM_PAIRS)]
    groups.append({
        "id": gid,
        "tier": "intermediate",
        "elements": pair,
        "context_cn": context_cn,
        "target_sentence": sentence,
        "words": words,
        "target_order": target_order,
        "alternatives": {},
    })

output = {
    "description": "五行英语牌 — 句子组（含 intermediate）",
    "version": "2.0",
    "total_groups": len(groups),
    "groups": groups,
}

with open('sentence_groups_intermediate.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# 检查缺词
missing = [w for w in {w2['word'] for g in groups for w2 in g['words']} if lookup(w)['cn'] == w]
if missing:
    print(f"WARNING: {len(missing)} words still missing cn: {missing}")
else:
    print("OK: All words have Chinese translation!")

print(f"Generated {len(groups)} groups (ids {groups[0]['id']}~{groups[-1]['id']})")
