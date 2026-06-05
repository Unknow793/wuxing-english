"""
五行英语牌 — 词汇五行属性分类脚本

三层分类法：
  第1层 — 自然意象（直觉归属）：sun→火, rain→水, tree→木, star→金, mountain→土
  第2层 — 习性/来源关联：动物按栖息地+性情，食物按来源+加工方式
  第3层 — 约定分配：无自然关联的词（代词/连词等），为平衡五行分布而人为约定

输出分类统计，标识需要补词的缺口。
"""

import json
from collections import defaultdict

VOCAB_PATH = "vocabulary.json"

# ============================================================
# 分类映射表
# 格式: { 词性: { 子分类(可选): { 单词: 元素 } } }
# 使用变体: 火(Huo) 水(Shui) 木(Mu) 金(Jin) 土(Tu)
# ============================================================

huo = "火"
shui = "水"
mu = "木"
jin = "金"
tu = "土"

# -- 第一层：自然意象 --
# (在下面的具体映射中内联处理)

# -- 第二、三层：习性与约定 --
classification = {
    "noun": {
        "animal": {
            # 木：温顺食草/栖树
            "rabbit": mu, "sheep": mu, "cow": mu, "panda": mu, "chicken": mu, "bird": mu,
            # 火：好动勇猛
            "horse": huo, "tiger": huo, "lion": huo, "monkey": huo, "dog": huo,
            # 水：水生/喜水
            "fish": shui, "frog": shui, "duck": shui, "snake": shui,
            # 土：大型/穴居
            "bear": tu, "elephant": tu, "pig": tu, "mouse": tu,
            # 金：灵巧敏捷
            "cat": jin,
            # 补充动物（见统计后添加）
        },
        "body": {
            # 火：活跃部位
            "hand": huo, "mouth": huo,
            # 水：感官/流体
            "eye": shui, "ear": shui, "nose": shui,
            # 木：生长/伸展
            "hair": mu, "arm": mu, "leg": mu,
            # 金：硬结构
            "head": jin, "face": jin, "finger": jin,
            # 土：承载/支撑
            "foot": tu,
        },
        "family": {
            # 火：温暖/主动
            "mom": huo, "dad": huo,
            # 水：流动/连接
            "baby": shui, "sister": shui,
            # 木：生长/家谱
            "brother": mu, "family": mu,
            # 金：刚硬/结构
            "grandpa": jin,
            # 土：承载
            "grandma": tu,
        },
        "food": {
            # 火：需火烹饪
            "meat": huo, "egg": huo, "cake": huo, "cookie": huo,
            # 水：液体/冷饮
            "water": shui, "milk": shui, "juice": shui, "tea": shui, "soup": shui, "ice cream": shui,
            # 木：植物/谷物
            "rice": mu, "bread": mu, "noodle": mu,
            # 金：矿物/结晶/金色
            "salt": jin, "honey": jin, "butter": jin,
            # 土：大地产出
            "candy": tu, "chocolate": tu,
        },
        "fruit": {
            # 木：树生/绿色系
            "apple": mu, "pear": mu, "lemon": mu,
            # 火：红色系/暖色
            "strawberry": huo, "cherry": huo,
            # 水：多汁/含水量高
            "watermelon": shui, "grape": shui, "orange": shui,
            # 金：金色外壳/坚硬
            "pineapple": jin, "coconut": jin,
            # 土：甜/大地
            "banana": tu, "peach": tu,
        },
        "nature": {
            # 火：太阳/热/光
            "sun": huo,
            # 水：雨/水/冷
            "rain": shui, "river": shui, "sea": shui, "cloud": shui,
            # 木：植物/风（木动生风）
            "tree": mu, "flower": mu, "wind": mu,
            # 金：明亮/坚硬
            "star": jin, "moon": jin, "snow": jin,
            # 土：大地/山/石
            "sky": tu, "mountain": tu, "stone": tu,
        },
        "school": {
            # 火：消耗/书写（笔尖生火）
            "pen": huo,
            # 水：涂改/流动
            "paper": shui,
            # 木：纸质/植物来源
            "book": mu, "pencil": mu, "ruler": mu, "eraser": mu,
            # 金：金属/硬质
            "desk": jin, "chair": jin,
            # 土：承载/厚重
            "bag": tu, "teacher": tu,
        },
        "toy": {
            # 水：流体/弹性
            "balloon": shui,
            # 木：自然材料
            "block": mu, "kite": mu,
            # 金：金属/机关
            "clock": jin, "key": jin, "card": jin,
            # 火：玩乐/活力
            "ball": huo, "doll": huo, "toy": huo,
            # 土：礼物/重物
            "gift": tu,
        },
        "vehicle": {
            # 火：引擎/动力
            "car": huo, "bus": huo, "truck": huo, "train": huo,
            # 水：水上
            "boat": shui, "ship": shui,
            # 金：金属/机械
            "plane": jin, "bike": jin,
        },
        "clothes": {
            # 火：保暖/红
            "coat": huo, "jacket": huo,
            # 水：柔软/流动
            "scarf": shui, "dress": shui,
            # 木：天然纤维
            "shirt": mu, "pants": mu, "sock": mu,
            # 金：硬质/装饰
            "shoe": jin, "glove": jin,
            # 土：厚重/保护
            "hat": tu,
        },
        "house": {
            # 火：光源/热源
            "lamp": huo,
            # 水：进出/管道
            "window": shui, "kitchen": shui,
            # 木：家具/结构
            "bed": mu, "table": mu, "sofa": mu, "door": mu,
            # 金：电器/五金
            "phone": jin,
            # 土：根基/空间
            "room": tu, "garden": tu,
        },
        "shape": {
            # 火：光芒/角
            "star": huo, "triangle": huo, "line": huo,
            # 水：圆润/流动
            "circle": shui, "heart": shui,
            # 木：直线/伸展（十字形如树木交叉）
            "cross": mu,
            # 金：方正/硬朗
            "square": jin,
            # 土：稳定/实心（点如地面）
            "dot": tu,
        },
        "color": {
            # 火：暖色
            "red": huo, "orange": huo, "pink": huo,
            # 水：冷色
            "blue": shui, "purple": shui, "black": shui,
            # 木：植物色
            "green": mu,
            # 金：金属色
            "white": jin, "grey": jin,
            # 土：大地色
            "yellow": tu, "brown": tu,
        },
        "time": {
            # 火：白昼/光
            "day": huo, "morning": huo,
            # 水：夜晚/暗
            "night": shui, "evening": shui,
            # 木：生长/未来
            "tomorrow": mu,
            # 金：刻度/分割
            "week": jin, "year": jin,
            # 土：当下/稳固
            "today": tu, "yesterday": tu,
        },
    },
    "verb": {
        # 火：动作/能量/向上
        "run": huo, "jump": huo, "dance": huo, "sing": huo, "play": huo,
        "laugh": huo, "want": huo, "go": huo, "open": huo, "look": huo,
        # 水：流动/情感
        "swim": shui, "drink": shui, "cry": shui, "smile": shui,
        "see": shui, "listen": shui, "come": shui,
        # 木：生长/创造
        "draw": mu, "read": mu, "write": mu, "like": mu, "know": mu, "make": mu,
        # 金：精确/切割/获取
        "take": jin, "put": jin, "close": jin, "give": jin, "help": jin,
        # 土：静止/支撑
        "sit": tu, "stand": tu, "sleep": tu, "walk": tu,
        "eat": tu, "have": tu, "speak": tu,
    },
    "adj": {
        # 火：热/亮/暖色
        "hot": huo, "warm": huo, "bright": huo, "happy": huo, "angry": huo,
        "fast": huo, "brave": huo,
        # 水：冷/暗/柔
        "cold": shui, "cool": shui, "dark": shui, "sad": shui, "sweet": shui,
        "soft": shui, "light": shui,
        # 木：生长/新/自然
        "new": mu, "green": mu, "young": mu, "tall": mu, "thin": mu,
        # 金：硬/明亮/锐利
        "hard": jin, "pretty": jin, "strong": jin, "cute": jin,
        # 土：重/老/脏/稳固
        "small": tu, "short": tu, "slow": tu, "tired": tu, "hungry": tu,
        "thirsty": tu, "good": tu, "bad": tu, "old": tu, "clean": tu,
        "dirty": tu, "long": tu, "big": tu, "heavy": tu, "quiet": tu,
    },
    "pron": {
        # 按约定平均分配
        "I": huo, "my": huo, "me": huo,  # 火：自我主动
        "you": shui, "your": shui,        # 水：流向对方
        "we": mu, "our": mu,              # 木：扩展包容
        "he": tu, "she": tu, "his": tu, "her": tu, "this": tu, "that": tu,  # 土：稳定存在
        "it": jin, "they": jin, "their": jin,  # 金：结构性角色
    },
    "num": {
        # 火：1-3 起始
        "one": huo, "two": huo, "three": huo,
        # 水：4-6 流动
        "four": shui, "five": shui, "six": shui,
        # 金：7-8 硬朗
        "seven": jin, "eight": jin,
        # 土：9-10 圆满承载
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


def classify():
    with open(VOCAB_PATH, "r", encoding="utf-8") as f:
        vocab = json.load(f)

    # 扁平化词汇表并检查未被分类的词
    all_words = {}  # (pos, subcategory, word) -> cn
    for pos, pos_data in vocab["parts_of_speech"].items():
        if "subcategories" in pos_data:
            for subcat, subdata in pos_data["subcategories"].items():
                for w in subdata["words"]:
                    key = (pos, subcat, w["word"])
                    all_words[key] = w["cn"]
        else:
            for w in pos_data["words"]:
                key = (pos, None, w["word"])
                all_words[key] = w["cn"]

    # 统计分类
    stats = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    # stats[element][pos][subcategory_or_flat] = count
    unmatched = []
    element_order = [huo, mu, tu, jin, shui]

    for (pos, subcat, word), cn in all_words.items():
        # 查找分类
        element = None
        if pos in classification:
            if subcat and subcat in classification[pos]:
                element = classification[pos][subcat].get(word)
            # 对于没有子分类的POS（动词/形容词等），查找顶层
            if element is None and subcat is None:
                element = classification[pos].get(word)

        if element:
            label = subcat if subcat else "__flat__"
            stats[element][pos][label] += 1
        else:
            unmatched.append((pos, subcat, word, cn))

    # ---- 输出报告 ----
    print("=" * 70)
    print("五行英语牌 — 词汇分类统计报告")
    print("=" * 70)

    # 按元素汇总
    print("\n【一、各元素总词数】")
    totals_by_element = {}
    for elem in element_order:
        total = sum(sum(subcat_counts.values()) for subcat_counts in stats[elem].values())
        totals_by_element[elem] = total
        print(f"  {elem}: {total} 个词")

    # 按元素×词性 矩阵
    all_pos = list(vocab["parts_of_speech"].keys())
    pos_labels = {
        "noun": "名词", "verb": "动词", "adj": "形容词", "pron": "代词",
        "num": "数词", "prep": "介词", "conj": "连词", "art": "冠词",
        "interj": "感叹词", "adv": "副词",
    }

    print("\n【二、五行 × 词性 分布矩阵】")
    header = f"{'词性':<8}"
    for elem in element_order:
        header += f"  {elem:>3}"
    header += f"  {'小计':>3}"
    print(header)
    print("-" * (8 + 6 * len(element_order) + 6))
    for pos in all_pos:
        label = pos_labels.get(pos, pos)
        line = f"{label:<8}"
        row_total = 0
        for elem in element_order:
            count = sum(stats[elem][pos].values())
            row_total += count
            line += f"  {count:>3}"
        line += f"  {row_total:>3}"
        print(line)

    print(f"\n总词汇量: {sum(totals_by_element.values())}")

    # 各元素内词性分布（看是否有元素缺某种词性）
    print("\n【三、各元素内部词性覆盖检查】")
    for elem in element_order:
        covered = []
        missing = []
        for pos in all_pos:
            count = sum(stats[elem][pos].values())
            if count > 0:
                covered.append(f"{pos_labels.get(pos, pos)}({count})")
            else:
                missing.append(pos_labels.get(pos, pos))
        print(f"  {elem} ({totals_by_element[elem]}词):")
        print(f"    已覆盖: {', '.join(covered)}")
        if missing:
            print(f"    [!] 缺少: {', '.join(missing)}")

    # 名词子分类的五行分布
    print("\n【四、名词子分类 × 五行 分布】")
    noun_subcats = vocab["parts_of_speech"]["noun"]["subcategories"]
    subcats_order = list(noun_subcats.keys())
    subcat_labels = {k: v["name_cn"] for k, v in noun_subcats.items()}
    for subcat in subcats_order:
        line = f"  {subcat_labels[subcat]:<12}"
        for elem in element_order:
            count = stats[elem]["noun"][subcat]
            line += f"  {elem}={count}"
        subcat_total = sum(stats[elem]["noun"][subcat] for elem in element_order)
        line += f"  合计={subcat_total}"
        print(line)

    # 未匹配的词（如果有）
    if unmatched:
        print(f"\n[!] 未分类的词 ({len(unmatched)}个)】")
        for pos, subcat, word, cn in unmatched[:20]:
            print(f"  {pos}/{subcat}: {word} ({cn})")
        if len(unmatched) > 20:
            print(f"  ...及其他 {len(unmatched)-20} 个")

    # 变异系数（评估平衡性）
    print("\n【五、均衡度分析】")
    for pos in all_pos:
        counts = []
        for elem in element_order:
            c = sum(stats[elem][pos].values())
            if c > 0:
                counts.append(c)
        if len(counts) >= 3:
            avg = sum(counts) / len(counts)
            # 简单变异系数
            variance = sum((c - avg) ** 2 for c in counts) / len(counts)
            cv = (variance ** 0.5) / avg if avg > 0 else 0
            status = "[OK]" if cv < 0.5 else "[WARN]" if cv < 1.0 else "[BAD]"
            print(f"  {pos_labels.get(pos, pos):<8} cv={cv:.2f} {status}  (各元素: {', '.join(map(str, counts))})")

    return stats, all_words, unmatched


if __name__ == "__main__":
    stats, all_words, unmatched = classify()
