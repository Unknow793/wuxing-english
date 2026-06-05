"""
五行英语牌 — 词库富集脚本

将 vocabulary.json + classify_words.py 中的五行分类合并，
并为每个单词生成例句，输出为前端直接使用的扁平化 JSON。
"""
import json

VOCAB_PATH = "vocabulary.json"
OUTPUT_PATH = "data_enriched.json"

# ========== 五行分类映射（从 classify_words.py 复制） ==========
huo = "火"
shui = "水"
mu = "木"
jin = "金"
tu = "土"

classification = {
    "noun": {
        "animal": {
            "rabbit": mu, "sheep": mu, "cow": mu, "panda": mu, "chicken": mu, "bird": mu,
            "horse": huo, "tiger": huo, "lion": huo, "monkey": huo, "dog": huo,
            "fish": shui, "frog": shui, "duck": shui, "snake": shui,
            "bear": tu, "elephant": tu, "pig": tu, "mouse": tu,
            "cat": jin,
        },
        "body": {
            "hand": huo, "mouth": huo,
            "eye": shui, "ear": shui, "nose": shui,
            "hair": mu, "arm": mu, "leg": mu,
            "head": jin, "face": jin, "finger": jin,
            "foot": tu,
        },
        "family": {
            "mom": huo, "dad": huo,
            "baby": shui, "sister": shui,
            "brother": mu, "family": mu,
            "grandpa": jin,
            "grandma": tu,
        },
        "food": {
            "meat": huo, "egg": huo, "cake": huo, "cookie": huo,
            "water": shui, "milk": shui, "juice": shui, "tea": shui, "soup": shui, "ice cream": shui,
            "rice": mu, "bread": mu, "noodle": mu,
            "salt": jin, "honey": jin, "butter": jin,
            "candy": tu, "chocolate": tu,
        },
        "fruit": {
            "apple": mu, "pear": mu, "lemon": mu,
            "strawberry": huo, "cherry": huo,
            "watermelon": shui, "grape": shui, "orange": shui,
            "pineapple": jin, "coconut": jin,
            "banana": tu, "peach": tu,
        },
        "nature": {
            "sun": huo,
            "rain": shui, "river": shui, "sea": shui, "cloud": shui,
            "tree": mu, "flower": mu, "wind": mu,
            "star": jin, "moon": jin, "snow": jin,
            "sky": tu, "mountain": tu, "stone": tu,
        },
        "school": {
            "pen": huo,
            "paper": shui,
            "book": mu, "pencil": mu, "ruler": mu, "eraser": mu,
            "desk": jin, "chair": jin,
            "bag": tu, "teacher": tu,
        },
        "toy": {
            "balloon": shui,
            "block": mu, "kite": mu,
            "clock": jin, "key": jin, "card": jin,
            "ball": huo, "doll": huo, "toy": huo,
            "gift": tu,
        },
        "vehicle": {
            "car": huo, "bus": huo, "truck": huo, "train": huo,
            "boat": shui, "ship": shui,
            "plane": jin, "bike": jin,
        },
        "clothes": {
            "coat": huo, "jacket": huo,
            "scarf": shui, "dress": shui,
            "shirt": mu, "pants": mu, "sock": mu,
            "shoe": jin, "glove": jin,
            "hat": tu,
        },
        "house": {
            "lamp": huo,
            "window": shui, "kitchen": shui,
            "bed": mu, "table": mu, "sofa": mu, "door": mu,
            "phone": jin,
            "room": tu, "garden": tu,
        },
        "shape": {
            "star": huo, "triangle": huo, "line": huo,
            "circle": shui, "heart": shui,
            "cross": mu,
            "square": jin,
            "dot": tu,
        },
        "color": {
            "red": huo, "orange": huo, "pink": huo,
            "blue": shui, "purple": shui, "black": shui,
            "green": mu,
            "white": jin, "grey": jin,
            "yellow": tu, "brown": tu,
        },
        "time": {
            "day": huo, "morning": huo,
            "night": shui, "evening": shui,
            "tomorrow": mu,
            "week": jin, "year": jin,
            "today": tu,
        },
    },
    "verb": {
        "run": huo, "jump": huo, "dance": huo, "sing": huo, "play": huo,
        "laugh": huo, "want": huo, "go": huo, "open": huo, "look": huo,
        "swim": shui, "drink": shui, "cry": shui, "smile": shui,
        "see": shui, "listen": shui, "come": shui,
        "draw": mu, "read": mu, "write": mu, "like": mu, "know": mu, "make": mu,
        "take": jin, "put": jin, "close": jin, "give": jin, "help": jin,
        "sit": tu, "stand": tu, "sleep": tu, "walk": tu,
        "eat": tu, "have": tu, "speak": tu,
    },
    "adj": {
        "hot": huo, "warm": huo, "bright": huo, "happy": huo, "angry": huo,
        "fast": huo, "brave": huo,
        "cold": shui, "cool": shui, "dark": shui, "sad": shui, "sweet": shui,
        "soft": shui, "light": shui,
        "new": mu, "young": mu, "tall": mu, "thin": mu,
        "hard": jin, "pretty": jin, "strong": jin, "cute": jin,
        "small": tu, "short": tu, "slow": tu, "tired": tu, "hungry": tu,
        "thirsty": tu, "good": tu, "bad": tu, "old": tu, "clean": tu,
        "dirty": tu, "long": tu, "big": tu, "heavy": tu, "quiet": tu,
    },
    "pron": {
        "I": huo, "my": huo, "me": huo,
        "you": shui, "your": shui,
        "we": mu, "our": mu,
        "he": tu, "she": tu, "his": tu, "her": tu, "this": tu, "that": tu,
        "it": jin, "they": jin, "their": jin,
    },
    "num": {
        "one": huo, "two": huo, "three": huo,
        "four": shui, "five": shui, "six": shui,
        "seven": jin, "eight": jin,
        "nine": tu, "ten": tu, "zero": mu,
    },
    "prep": {
        "in": shui, "on": huo, "under": tu, "behind": mu,
        "in front of": huo, "next to": mu, "between": jin, "at": tu,
    },
    "conj": {
        "and": mu, "or": shui, "but": jin, "because": tu, "so": huo,
    },
    "art": {
        "a": huo, "an": shui, "the": tu, "every": mu, "some": jin,
    },
    "interj": {
        "hello": shui, "hi": shui, "goodbye": jin, "yes": huo,
        "no": tu, "oh": huo, "wow": huo, "oops": shui,
        "aha": mu, "hey": mu, "hmm": mu, "ouch": jin, "ah": tu,
    },
    "adv": {
        "now": huo, "very": tu, "too": shui, "again": mu,
        "always": jin, "here": tu, "there": jin, "up": huo, "down": shui,
    },
}

# ========== 例句模板 ==========
# 每个单词的简单例句（小学低年级水平）
sentences = {
    # 名词 — 动物
    "cat": "I see a cat.", "dog": "I like dogs.", "fish": "I see a fish.", "bird": "A bird can fly.",
    "rabbit": "I see a rabbit.", "pig": "The pig is pink.", "cow": "The cow is big.", "sheep": "The sheep is white.",
    "horse": "The horse can run.", "duck": "The duck swims.", "chicken": "The chicken eats.", "frog": "A green frog.",
    "bear": "The bear is big.", "lion": "The lion is brave.", "elephant": "The elephant is big.", "monkey": "The monkey is funny.",
    "panda": "I like pandas.", "tiger": "The tiger runs.", "mouse": "A small mouse.", "snake": "A long snake.",
    # 名词 — 身体
    "eye": "I have two eyes.", "ear": "I have two ears.", "nose": "This is my nose.", "mouth": "Open your mouth.",
    "head": "This is my head.", "hand": "I have two hands.", "foot": "I have two feet.", "arm": "This is my arm.",
    "leg": "This is my leg.", "hair": "I have black hair.", "face": "This is my face.", "finger": "I have ten fingers.",
    # 名词 — 家庭
    "mom": "I love my mom.", "dad": "I love my dad.", "sister": "I love my sister.", "brother": "I love my brother.",
    "baby": "The baby is cute.", "grandma": "I love my grandma.", "grandpa": "I love my grandpa.", "family": "I love my family.",
    # 名词 — 食物
    "rice": "I eat rice.", "bread": "I eat bread.", "milk": "I drink milk.", "egg": "I eat an egg.",
    "meat": "I eat meat.", "cake": "I like cake.", "candy": "I like candy.", "noodle": "I eat noodles.",
    "soup": "I like soup.", "juice": "I drink juice.", "water": "I drink water.", "tea": "I drink tea.",
    "cookie": "I like cookies.", "ice cream": "I like ice cream.", "salt": "This is salt.", "honey": "The honey is sweet.",
    "butter": "This is butter.", "chocolate": "I like chocolate.",
    # 名词 — 水果
    "apple": "I eat an apple.", "banana": "I eat a banana.", "orange": "I eat an orange.", "grape": "I eat grapes.",
    "watermelon": "I like watermelon.", "strawberry": "I like strawberries.", "pear": "I eat a pear.", "peach": "I eat a peach.",
    "lemon": "The lemon is sour.", "cherry": "I like cherries.", "pineapple": "I like pineapple.", "coconut": "This is a coconut.",
    # 名词 — 自然
    "sun": "The sun is hot.", "moon": "The moon is bright.", "star": "I see stars.", "sky": "The sky is blue.",
    "cloud": "White clouds.", "rain": "The rain falls.", "wind": "The wind blows.", "snow": "White snow.",
    "tree": "A tall tree.", "flower": "Pretty flowers.", "river": "The river flows.", "mountain": "A high mountain.",
    "sea": "The sea is blue.", "stone": "A heavy stone.",
    # 名词 — 学校
    "book": "I read a book.", "pen": "I write with a pen.", "pencil": "I draw with a pencil.", "ruler": "This is a ruler.",
    "bag": "This is my bag.", "desk": "This is my desk.", "chair": "This is my chair.", "teacher": "I like my teacher.",
    "paper": "I write on paper.", "eraser": "This is an eraser.",
    # 名词 — 玩具
    "ball": "I play with a ball.", "doll": "I like dolls.", "toy": "I like toys.", "block": "I play with blocks.",
    "kite": "I fly a kite.", "balloon": "A red balloon.", "gift": "A nice gift.", "clock": "The clock ticks.",
    "key": "This is a key.", "card": "I make a card.",
    # 名词 — 交通工具
    "car": "A red car.", "bus": "I take the bus.", "bike": "I ride a bike.", "train": "I take the train.",
    "plane": "A fast plane.", "boat": "A small boat.", "ship": "A big ship.", "truck": "A big truck.",
    # 名词 — 衣物
    "shirt": "I wear a shirt.", "shoe": "I wear shoes.", "sock": "I wear socks.", "hat": "I wear a hat.",
    "coat": "I wear a coat.", "pants": "I wear pants.", "dress": "A pretty dress.", "glove": "I wear gloves.",
    "scarf": "A warm scarf.", "jacket": "I wear a jacket.",
    # 名词 — 房屋
    "door": "Open the door.", "window": "Open the window.", "room": "This is my room.", "bed": "This is my bed.",
    "table": "This is the table.", "lamp": "The lamp is bright.", "sofa": "I sit on the sofa.", "phone": "The phone rings.",
    "garden": "Pretty garden.", "kitchen": "This is the kitchen.",
    # 名词 — 形状
    "circle": "A round circle.", "square": "A big square.", "triangle": "A triangle.", "heart": "A red heart.",
    "line": "A straight line.", "cross": "A red cross.",
    # 名词 — 颜色
    "red": "It is red.", "blue": "It is blue.", "yellow": "It is yellow.", "green": "It is green.",
    "black": "It is black.", "white": "It is white.", "pink": "It is pink.", "purple": "It is purple.",
    "orange": "It is orange.", "brown": "It is brown.", "grey": "It is grey.",
    # 名词 — 时间
    "day": "Good day!", "night": "Good night!", "morning": "Good morning!", "evening": "Good evening!",
    "today": "Today is fun.", "tomorrow": "See you tomorrow.", "week": "A week has seven days.", "year": "Happy new year!",

    # 动词
    "run": "I can run.", "jump": "I can jump.", "eat": "I eat well.", "drink": "I drink water.",
    "sleep": "I sleep well.", "read": "I read a book.", "write": "I write a word.", "draw": "I draw a picture.",
    "sing": "I sing a song.", "dance": "I can dance.", "play": "I play outside.", "swim": "I can swim.",
    "walk": "I walk to school.", "sit": "Sit down, please.", "stand": "Stand up, please.", "look": "Look at me!",
    "listen": "Listen to me.", "speak": "I speak English.", "smile": "Smile, please!", "cry": "Don't cry.",
    "laugh": "Laugh out loud!", "give": "Give me a hug.", "take": "Take a seat.", "make": "Make a wish.",
    "help": "Help me, please.", "like": "I like you.", "want": "I want water.", "see": "I see you.",
    "know": "I know that.", "have": "I have a book.", "go": "Let's go!", "come": "Come here!",
    "put": "Put it down.", "open": "Open the door.", "close": "Close the door.",

    # 形容词
    "big": "A big house.", "small": "A small bug.", "long": "A long snake.", "short": "A short pencil.",
    "fast": "A fast car.", "slow": "A slow turtle.", "hot": "The sun is hot.", "cold": "It is cold outside.",
    "warm": "Warm hands.", "cool": "Cool water.", "happy": "I am happy.", "sad": "Don't be sad.",
    "angry": "I am not angry.", "tired": "I am tired.", "hungry": "I am hungry.", "thirsty": "I am thirsty.",
    "good": "Good job!", "bad": "Too bad.", "new": "A new toy.", "old": "An old house.",
    "clean": "Clean hands.", "dirty": "Dirty hands.", "pretty": "A pretty flower.", "sweet": "Sweet candy.",
    "bright": "Bright light.", "dark": "Dark night.", "soft": "Soft bed.", "hard": "Hard stone.",
    "heavy": "Heavy box.", "light": "Light bag.", "tall": "A tall tree.", "young": "A young cat.",
    "thin": "A thin book.", "strong": "Strong man.", "cute": "So cute!", "brave": "Be brave!",
    "quiet": "Be quiet.",

    # 代词
    "I": "I am happy.", "you": "You are nice.", "he": "He is tall.", "she": "She is kind.",
    "it": "It is big.", "we": "We are friends.", "they": "They are cute.", "my": "This is my book.",
    "your": "This is your book.", "his": "This is his book.", "her": "This is her book.", "our": "This is our home.",
    "their": "This is their home.", "me": "Look at me!", "this": "This is a pen.", "that": "That is a book.",

    # 数词
    "one": "I have one nose.", "two": "I have two eyes.", "three": "Three birds.", "four": "Four cats.",
    "five": "Five fingers.", "six": "Six ducks.", "seven": "Seven days.", "eight": "Eight legs.",
    "nine": "Nine stars.", "ten": "Ten toes.", "zero": "Zero is nothing.",

    # 介词
    "in": "It is in the box.", "on": "It is on the desk.", "under": "It is under the bed.", "behind": "Behind the door.",
    "in front of": "In front of me.", "next to": "Next to the table.", "between": "Between the chairs.", "at": "At school.",

    # 连词
    "and": "You and me.", "or": "Tea or juice?", "but": "Small but strong.", "because": "Because it is fun.",
    "so": "So happy!",

    # 冠词
    "a": "A cat.", "an": "An apple.", "the": "The sun.", "every": "Every day.", "some": "Some water.",

    # 感叹词
    "hello": "Hello!", "hi": "Hi!", "goodbye": "Goodbye!", "yes": "Yes, I do.",
    "no": "No, thanks.", "oh": "Oh, I see.", "wow": "Wow, so big!", "oops": "Oops, sorry!",
    "aha": "Aha, I know!", "hey": "Hey, look!", "hmm": "Hmm, let me see.", "ouch": "Ouch, it hurts!",
    "ah": "Ah, I see.",

    # 副词
    "now": "Now go!", "very": "Very good!", "too": "Me too.", "again": "Say it again.",
    "always": "Always be nice.", "here": "Come here.", "there": "Over there.", "up": "Look up!",
    "down": "Sit down.",
}


def get_word_word(word_lower, categories):
    """在分类映射中查找单词的五行属性"""
    if isinstance(categories, dict):
        if word_lower in categories:
            return categories[word_lower]
        for v in categories.values():
            if isinstance(v, dict) and word_lower in v:
                return v[word_lower]
    return None


def enrich():
    with open(VOCAB_PATH, "r", encoding="utf-8") as f:
        vocab = json.load(f)

    words_flat = []
    element_stats = {e: 0 for e in ["金", "木", "水", "火", "土"]}
    unmatched = []

    for pos, pos_data in vocab["parts_of_speech"].items():
        if "subcategories" in pos_data:
            for subcat, subdata in pos_data["subcategories"].items():
                for w in subdata["words"]:
                    word_src = w["word"].strip()
                    word_lower = word_src.lower()
                    element = None
                    if pos in classification and subcat in classification[pos]:
                        element = classification[pos][subcat].get(word_src) or classification[pos][subcat].get(word_lower)
                    if not element:
                        element = classification[pos].get(word_src) if pos in classification else None
                        if not element:
                            element = classification[pos].get(word_lower) if pos in classification else None
                    if element:
                        words_flat.append({
                            "word": w["word"],
                            "cn": w["cn"],
                            "pos": pos,
                            "subcategory": subcat,
                            "category_cn": subdata["name_cn"],
                            "element": element,
                            "sentence": sentences.get(word_lower, f"I see {w['word']}."),
                        })
                        element_stats[element] = element_stats.get(element, 0) + 1
                    else:
                        unmatched.append((pos, subcat, w["word"]))
        else:
            for w in pos_data["words"]:
                word_src = w["word"].strip()
                word_lower = word_src.lower()
                element = classification.get(pos, {}).get(word_src) or classification.get(pos, {}).get(word_lower) if pos in classification else None
                if element:
                    words_flat.append({
                        "word": w["word"],
                        "cn": w["cn"],
                        "pos": pos,
                        "subcategory": None,
                        "category_cn": pos_data.get("name_cn", ""),
                        "element": element,
                        "sentence": sentences.get(word_lower, f"I see {w['word']}."),
                    })
                    element_stats[element] = element_stats.get(element, 0) + 1
                else:
                    unmatched.append((pos, None, w["word"]))

    output = {
        "name": "五行英语牌词汇库",
        "version": "1.0",
        "total_words": len(words_flat),
        "words": words_flat,
        "element_stats": element_stats,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"[OK] 输出 {OUTPUT_PATH}")
    print(f"   总词数: {len(words_flat)}")
    for e, c in element_stats.items():
        print(f"   {e}: {c}")
    if unmatched:
        print(f"\n[WARN] 未分类: {len(unmatched)} 个")
        for p, s, w in unmatched:
            print(f"   {p}/{s}: {w}")


if __name__ == "__main__":
    enrich()
