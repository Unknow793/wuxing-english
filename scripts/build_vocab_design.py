#!/c/Users/94233/AppData/Local/Python/bin/python.exe -X utf8
"""
五行英语牌 — 词表体系设计 v3.0 (终稿)
产出：完整的主题体系 + 各年级词表 + 建议emoji
"""
import json

with open('vocabulary.json', encoding='utf-8') as f:
    vocab = json.load(f)

existing = {w['word'].lower(): w for w in vocab['words']}

# ============================================================
# 1-2年级：12主题，272词
# ============================================================
G12 = """
┌─────────────────────────────────────────────────────────────┐
│  1-2年级 · 12主题 · 272词                                  │
├──────────┬────────┬──────┬──────────────────────────────────┤
│ 主题      │ emoji  │ 词数 │ 词表                              │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 动物      │ 🐾     │  20  │ cat🐱 dog🐶 fish🐟 bird🐦     │
│           │        │      │ rabbit🐰 pig🐷 cow🐮 sheep🐑  │
│           │        │      │ horse🐴 duck🦆 chicken🐔        │
│           │        │      │ frog🐸 bear🧸 lion🦁            │
│           │        │      │ elephant🐘 monkey🐵 panda🐼      │
│           │        │      │ tiger🐯 mouse🐭 snake🐍         │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 水果·食物 │ 🍎     │  25  │ apple🍎 banana🍊 orange🍊      │
│           │        │      │ grape🍇 pear🍐 peach🍑           │
│           │        │      │ watermelon🍉 strawberry🍓         │
│           │        │      │ lemon🍋 cherry🍒 pineapple🍍     │
│           │        │      │ coconut🥥 bread🍞 cake🎂         │
│           │        │      │ cookie🍪 candy🍬 egg🥚           │
│           │        │      │ milk🥛 juice🧃 water💧 rice🍚    │
│           │        │      │ noodle🍜 soup🥣 meat🥩 tea🫖    │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 颜色·形状 │ 🎨     │  18  │ red🔴 blue🔵 green🟢 yellow🟡  │
│           │        │      │ pink🩷 purple🟣 orange🟠         │
│           │        │      │ black⚫ white⚪ brown🟤           │
│           │        │      │ grey⬜ circle⭕ square🟧         │
│           │        │      │ triangle🔺 heart❤️ star⭐       │
│           │        │      │ line➖ dot🔴                      │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 数字      │ 🔢     │  11  │ one 1️⃣ two 2️⃣ three 3️⃣ four 4️⃣ │
│           │        │      │ five 5️⃣ six 6️⃣ seven 7️⃣        │
│           │        │      │ eight 8️⃣ nine 9️⃣ ten 🔟 zero 0️⃣│
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 身体      │ 🧍     │  14  │ eye👁️ ear👂 nose👃 mouth👄     │
│           │        │      │ head🗣️ hand✋ arm💪 leg🦵       │
│           │        │      │ foot🦶 hair💇 face😊 finger☝️   │
│           │        │      │ knee🦵 shoulder🤷                │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 家庭·称呼 │ 👪     │  12  │ mom👩 dad👨 sister👧 brother👦 │
│           │        │      │ baby👶 grandma👵 grandpa👴       │
│           │        │      │ family👪 uncle👨 aunt👩          │
│           │        │      │ cousin🧑 friend🤝                │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 交通工具  │ 🚗     │   9  │ car🚗 bus🚌 bike🚲 train🚂      │
│           │        │      │ plane✈️ boat⛵ ship🚢 truck🚛   │
│           │        │      │ taxi🚕                             │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 玩具·学校 │ 🧸     │  21  │ ball⚽ doll🪆 toy🧸 block🧱     │
│           │        │      │ kite🪁 balloon🎈 gift🎁 clock🕐  │
│           │        │      │ key🔑 card🃏 book📕 pen🖊️      │
│           │        │      │ pencil✏️ ruler📏 bag🎒 desk🪑   │
│           │        │      │ chair🪑 paper📄 eraser🧽          │
│           │        │      │ crayon🖍️ paint🎨                 │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 衣物      │ 👕     │  11  │ hat🧢 shirt👕 pants👖 dress👗   │
│           │        │      │ coat🧥 jacket🧥 shoe👟 sock🧦   │
│           │        │      │ scarf🧣 glove🧤 boot🥾           │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 动作·动词 │ 🤸     │  37  │ run🏃 jump🦘 eat🍽️ drink🥤     │
│           │        │      │ sleep😴 read📖 write✍️ draw🎨   │
│           │        │      │ sing🎤 dance💃 play🎮 swim🏊    │
│           │        │      │ walk🚶 sit🪑 stand🧍 look👀     │
│           │        │      │ see👀 listen👂 speak🗣️ smile😊 │
│           │        │      │ cry😢 laugh😂 give🎁 take🤲     │
│           │        │      │ make🛠️ help🤝 like❤️ want💭    │
│           │        │      │ go🏃 come👋 put📥 open🚪 close🚪│
│           │        │      │ have✋ fly🪰 clap👏 wave👋       │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 描述·形容词│ 📐    │  35  │ big🐘 small🐭 long📏 short📐   │
│           │        │      │ fast⚡ slow🐢 hot🔥 cold❄️      │
│           │        │      │ warm☀️ cool💧 happy😊 sad😢    │
│           │        │      │ angry😡 tired😴 hungry🍽️       │
│           │        │      │ thirsty🥤 good👍 bad👎 new🆕    │
│           │        │      │ old👴 pretty💕 sweet🍯 bright💡 │
│           │        │      │ dark🌚 soft🫳 hard🪨 heavy🏋️   │
│           │        │      │ light🪶 tall📏 young👶 thin📏   │
│           │        │      │ strong💪 cute🥰 clean🧹 dirty💩 │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 日常用语· │ 💬     │  59  │ hello👋 hi🖐️ goodbye👋          │
│ 代词·介词 │        │      │ yes✅ no❌ oh😮 wow😲           │
│           │        │      │ oops😅 aha😃 hey👋 ouch😣       │
│           │        │      │ ah😮                                 │
│           │        │      │ I🙋 you👉 he👨 she👩 it👆        │
│           │        │      │ we👥 they👥 me🙋 my📎 your📎     │
│           │        │      │ his📎 her📎 our📎 their📎          │
│           │        │      │ this👆 that👆 a🔤 an🔤 the🔤     │
│           │        │      │ some📦 every📅                       │
│           │        │      │ in📥 on📥 under⬇️ behind🚪        │
│           │        │      │ next to👉 between🔀 in front of👀 │
│           │        │      │ at📍 and➕ but🔄 or↔️ so🔗       │
│           │        │      │ because💡 up⬆️ down⬇️           │
│           │        │      │ here📍 there📍 now⏰ very💯      │
│           │        │      │ too➕ again🔄 always🔄            │
│           │        │      │ please🙏 sorry😔 thanks👍         │
│           │        │      │ welcome👋 excuse me🙋              │
└──────────┴────────┴──────┴──────────────────────────────────┘
"""

# ============================================================
# 3-4年级：15个类目，新增约320词（累计~590）
# ============================================================
G34 = """
┌─────────────────────────────────────────────────────────────┐
│  3-4年级（在1-2基础上新增）· 15类 · ~320词                │
├──────────┬────────┬──────┬──────────────────────────────────┤
│ 类目      │ 建议   │ 词数 │ 核心词表                          │
│           │ emoji  │      │                                    │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 食物·生活 │ 🍳     │  15  │ breakfast lunch dinner plate bowl │
│           │        │      │ cup fork spoon knife delicious    │
│           │        │      │ yummy honey butter chocolate salt │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 房屋·家具 │ 🏠     │  19  │ wall floor stairs mirror shelf   │
│           │        │      │ drawer closet bathroom bedroom   │
│           │        │      │ kitchen garden room door window  │
│           │        │      │ bed table sofa lamp phone        │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 场所·建筑 │ 🏪     │  21  │ library hospital supermarket     │
│           │        │      │ restaurant museum bridge farm    │
│           │        │      │ village building gym pool shop   │
│           │        │      │ store park zoo school home       │
│           │        │      │ street city classroom playground │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 季节·天气 │ 🌤️     │  30  │ spring summer autumn winter     │
│ ·自然     │        │      │ season weather rainy sunny       │
│           │        │      │ cloudy windy snowy dry wet       │
│           │        │      │ field hill lake island river sea │
│           │        │      │ mountain sky cloud rain snow wind│
│           │        │      │ sun moon star tree flower stone  │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 时间·星期 │ 📅     │  21  │ Mon Tue Wed Thu Fri Sat Sun      │
│           │        │      │ month hour minute noon midnight  │
│           │        │      │ calendar day night morning       │
│           │        │      │ evening today tomorrow week year │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 身体·健康 │ 💊     │   7  │ headache toothache cough fever   │
│           │        │      │ wash brush comb                  │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 动词Ⅱ    │ 🏃     │  75  │ carry catch climb cook cut dig   │
│           │        │      │ drop feed fill fix follow grow   │
│           │        │      │ hide hit hold hurt kick knock    │
│           │        │      │ lay leave lift lock mix move     │
│           │        │      │ pass pick point pour pull push   │
│           │        │      │ raise reach ride roll save share │
│           │        │      │ shout show shake smell spend     │
│           │        │      │ spill stretch sweep throw tie    │
│           │        │      │ touch turn use visit wait wake   │
│           │        │      │ wash wave wear win wish wrap yell│
│           │        │      │ tell say think know get find love│
│           │        │      │ ask am are is be has have can    │
│           │        │      │ will do does                     │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 形容词Ⅱ  │ 🎭     │  54  │ busy careful clever curious      │
│           │        │      │ different early excited famous   │
│           │        │      │ fine friendly funny gentle glad   │
│           │        │      │ great healthy honest important   │
│           │        │      │ interesting kind large late lazy │
│           │        │      │ loud lovely naughty nervous noisy│
│           │        │      │ proud quick ready real rich safe │
│           │        │      │ shy silly simple special strange │
│           │        │      │ sure surprised terrible thick    │
│           │        │      │ tiny true useful weak wet wide   │
│           │        │      │ wonderful wrong nice fun brave   │
│           │        │      │ quiet                             │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 运动·爱好 │ ⚽     │  15  │ sport game team race match score │
│           │        │      │ goal music song drum guitar piano│
│           │        │      │ violin movie story               │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 代词·    │ 🔄     │  26  │ myself yourself himself herself   │
│ 限定词Ⅱ  │        │      │ itself everyone everything nobody │
│           │        │      │ nothing somebody something        │
│           │        │      │ anybody anything all both each    │
│           │        │      │ no none any many much more most   │
│           │        │      │ few little enough other           │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 介词·    │ 🔗     │  30  │ after before since until while    │
│ 连词Ⅱ    │        │      │ during through across along around│
│           │        │      │ into onto past toward without     │
│           │        │      │ against except among about above  │
│           │        │      │ below off out outside inside      │
│           │        │      │ by for to with then               │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 疑问·副词 │ ❓     │  26  │ when which whose what where why   │
│           │        │      │ how already usually often         │
│           │        │      │ sometimes never ever just still   │
│           │        │      │ even only really almost perhaps   │
│           │        │      │ maybe quite together well soon not│
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 数词·量词 │ 🔢     │   7  │ hundred thousand first second    │
│           │        │      │ third once twice                  │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 其他补充  │ ➕     │   6  │ boy girl man woman child yes no  │
│           │        │      │ ok                                 │
└──────────┴────────┴──────┴──────────────────────────────────┘
"""

# ============================================================
# 5-6年级：9个类目，新增约300词（累计~900，精简版）
# ============================================================
G56 = """
┌─────────────────────────────────────────────────────────────┐
│  5-6年级（在1-4基础上新增）· 9类 · ~300词                 │
├──────────┬────────┬──────┬──────────────────────────────────┤
│ 类目      │ 建议   │ 词数 │ 核心词表                          │
│           │ emoji  │      │                                    │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 抽象概念  │ 💭     │  28  │ idea plan dream truth secret      │
│           │        │      │ memory thought wish hope chance   │
│           │        │      │ choice decision reason result     │
│           │        │      │ example problem answer question   │
│           │        │      │ information news message rule map │
│           │        │      │ list address number price size    │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 人与社会  │ 👥     │  25  │ neighbor guest host member group │
│           │        │      │ community country world people    │
│           │        │      │ person adult parent relative owner│
│           │        │      │ leader player worker farmer driver│
│           │        │      │ nurse doctor student pupil        │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 自然·环境 │ 🌍     │  17  │ earth space planet environment    │
│           │        │      │ forest ocean desert climate       │
│           │        │      │ temperature energy power light    │
│           │        │      │ shadow sound noise voice smell    │
│           │        │      │ taste                              │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 学校·学习 │ 📚     │  26  │ lesson class subject math science│
│           │        │      │ history geography language English│
│           │        │      │ exam test grade homework practice │
│           │        │      │ study learn teach explain         │
│           │        │      │ understand remember forget prepare│
│           │        │      │ improve check correct review      │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 动词Ⅲ    │ 🚀     │  80  │ accept add allow appear arrive    │
│           │        │      │ believe borrow break bring build  │
│           │        │      │ buy celebrate change collect      │
│           │        │      │ compare complete connect consider │
│           │        │      │ continue control copy count cover │
│           │        │      │ create cross decide deliver       │
│           │        │      │ describe discover divide enjoy    │
│           │        │      │ enter escape explore fail finish  │
│           │        │      │ guess happen imagine include      │
│           │        │      │ increase invent invite join judge │
│           │        │      │ keep lead lend manage mean meet   │
│           │        │      │ mind miss notice offer own pack   │
│           │        │      │ paint perform plan prefer prepare │
│           │        │      │ prevent produce promise protect   │
│           │        │      │ prove receive refuse relax remind │
│           │        │      │ repeat reply report return search │
│           │        │      │ separate serve share sign solve   │
│           │        │      │ suggest supply support suppose    │
│           │        │      │ teach test thank train travel     │
│           │        │      │ treat trust try understand warn   │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 形容词Ⅲ  │ 🌟     │  60  │ able active amazing ancient       │
│           │        │      │ attractive available basic boring │
│           │        │      │ certain comfortable common        │
│           │        │      │ confident convenient correct      │
│           │        │      │ dangerous deep delicious difficult│
│           │        │      │ disappointed empty excellent      │
│           │        │      │ expensive favorite female foreign │
│           │        │      │ free fresh full generous handsome │
│           │        │      │ helpful huge independent           │
│           │        │      │ intelligent likely local lucky    │
│           │        │      │ modern natural necessary normal   │
│           │        │      │ obvious opposite ordinary painful │
│           │        │      │ perfect personal physical pleasant│
│           │        │      │ polite popular positive possible  │
│           │        │      │ potential powerful precious proper│
│           │        │      │ public recent regular responsible │
│           │        │      │ ridiculous rough satisfactory     │
│           │        │      │ sensitive serious sharp significant│
│           │        │      │ silent similar smooth social solid│
│           │        │      │ specific standard straight strict │
│           │        │      │ suitable surprised talented       │
│           │        │      │ technical temporary terrific      │
│           │        │      │ tight tough traditional typical   │
│           │        │      │ unique useful valuable various    │
│           │        │      │ violent visible wealthy welcome   │
│           │        │      │ wild wise wonderful                │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 时间·频率 │ ⏰     │  21  │ always usually often sometimes    │
│ ·副词     │        │      │ never rarely frequently           │
│           │        │      │ occasionally immediately suddenly │
│           │        │      │ quickly slowly carefully easily   │
│           │        │      │ happily finally recently          │
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 节日·文化 │ 🎊     │  12  │ Christmas Easter Halloween       │
│           │        │      │ lantern firework dragon culture   │
│           │        │      │ tradition custom holiday celebrate│
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 科技·媒体 │ 💻     │  15  │ computer internet website email  │
│           │        │      │ screen keyboard mouse video photo │
│           │        │      │ camera digital online search robot│
├──────────┼────────┼──────┼──────────────────────────────────┤
│ 连词·介词 │ 🔗     │  15  │ although though unless whether   │
│ ·情态     │        │      │ should would could must may might │
│           │        │      │ both either neither nor if when   │
└──────────┴────────┴──────┴──────────────────────────────────┘
"""

print(G12)
print(G34)
print(G56)

# ============================================================
# 统计汇总
# ============================================================
print('=' * 60)
print('  词汇量分布汇总')
print('=' * 60)
print(f'  1-2年级:  272 词 (累计272)')
print(f'  3-4年级:  +321 词 (累计593)')
print(f'  5-6年级:  +299 词 (累计892)')
print(f'  {"─" * 40}')
print(f'  总计:     ~892 词（接近1000目标）')
print(f'  {"─" * 40}')
print(f'  缺失调整空间: 约100词留给补充和特殊词汇')
print()
print('  需翻译的新词:')
g12_new = sum(1 for theme in [
    ['knee','shoulder','uncle','aunt','cousin','taxi','crayon','paint','boot',
     'fly','clap','wave','please','sorry','thanks','welcome','excuse me']
] for w in theme if w not in existing)
print(f'  1-2年级: ~17 词')
print(f'  3-4年级: ~250 词')
print(f'  5-6年级: ~260 词')
print(f'  合计新增翻译: ~527 词')
print()
print('  1-2年级全部支持 emoji 配图')
print('  3-4年级大部分支持 emoji，抽象词需 SVG/文字')
print('  5-6年级抽象概念多，以文字为主')
