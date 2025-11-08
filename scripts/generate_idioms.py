import json
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
random.seed(42)

core_source = BASE_DIR / "data" / "core_idioms.txt"
if not core_source.exists():
  raise SystemExit("Missing data/core_idioms.txt")

core_entries = []
for raw_line in core_source.read_text(encoding="utf-8").splitlines():
  line = raw_line.strip()
  if not line or line.startswith("#"):
    continue
  parts = [segment.strip() for segment in line.split("|", 3)]
  if len(parts) != 4:
    raise ValueError(f"Invalid line in core data: {raw_line}")
  kanji, kana, translation, note = parts
  core_entries.append(
    {
      "kanji": kanji,
      "kana": kana,
      "translation": translation,
      "note": note,
    }
  )

prefixes = [
  {"kanji": "心光", "reading": "しんこう", "english": "your heartlight", "note": "Guard your quiet glow."},
  {"kanji": "朝露", "reading": "あさつゆ", "english": "the morning dew", "note": "Fresh starts adore softness."},
  {"kanji": "桜影", "reading": "さくらかげ", "english": "the cherry shade", "note": "Beauty can feel calm."},
  {"kanji": "風音", "reading": "かざおと", "english": "the wind song", "note": "Let breezes score your day."},
  {"kanji": "星灯", "reading": "ほしあかり", "english": "the star lanterns", "note": "Tiny lights still guide."},
  {"kanji": "雪輪", "reading": "ゆきわ", "english": "the snow halos", "note": "Even cold carries magic."},
  {"kanji": "月虹", "reading": "げっこう", "english": "the moonbow hues", "note": "Look for hidden rainbows."},
  {"kanji": "森息", "reading": "もりいき", "english": "the forest breath", "note": "Nature exhales on your behalf."},
  {"kanji": "灯心", "reading": "とうしん", "english": "the lantern wicks", "note": "Keep your flame trimmed yet steady."},
  {"kanji": "波詠", "reading": "なみよみ", "english": "the wave chants", "note": "Let rhythm teach patience."},
  {"kanji": "青磁", "reading": "せいじ", "english": "the celadon calm", "note": "Cool tones settle the mind."},
  {"kanji": "霞路", "reading": "かすみじ", "english": "those misty roads", "note": "Soft focus invites curiosity."},
  {"kanji": "羽音", "reading": "はおと", "english": "each wing beat", "note": "Tiny flutters prove life."},
  {"kanji": "柔光", "reading": "じゅうこう", "english": "that gentle light", "note": "Subtlety is still radiant."},
  {"kanji": "朝凪", "reading": "あさなぎ", "english": "the morning calm", "note": "Still waters welcome planning."},
  {"kanji": "静謡", "reading": "せいよう", "english": "the quiet songs", "note": "Humming soothes the spirit."},
  {"kanji": "花冠", "reading": "はなかんむり", "english": "flower crowns", "note": "Adorn yourself in grace."},
  {"kanji": "梅詩", "reading": "うめうた", "english": "plum poems", "note": "Winter blooms prove resilience."},
  {"kanji": "露庭", "reading": "つゆにわ", "english": "the dewy courtyard", "note": "Pause where freshness lingers."},
  {"kanji": "潮香", "reading": "しおか", "english": "the sea breeze", "note": "Salt air rewrites moods."},
  {"kanji": "空鼓", "reading": "そらつづみ", "english": "the sky drums", "note": "Thunder reminds you of power."},
  {"kanji": "琴線", "reading": "きんせん", "english": "your heart strings", "note": "Stay tuned to empathy."},
  {"kanji": "暁筆", "reading": "ぎょうひつ", "english": "the dawnlit pens", "note": "Write before doubt wakes up."},
  {"kanji": "希光", "reading": "きこう", "english": "hope-light", "note": "Look for silver edges."},
  {"kanji": "笑羽", "reading": "えみは", "english": "smiling wings", "note": "Levity is allowed."},
  {"kanji": "響野", "reading": "ひびの", "english": "the echoing fields", "note": "Your voice travels far."},
  {"kanji": "涼泉", "reading": "りょうせん", "english": "the cool springs", "note": "Refreshment lives in still pools."},
  {"kanji": "柑香", "reading": "かんこう", "english": "bright citrus zest", "note": "Brightness can be tasted."},
  {"kanji": "瑞火", "reading": "ずいか", "english": "the auspicious flame", "note": "Keep an ember of faith."},
  {"kanji": "茜宙", "reading": "あかねそら", "english": "those crimson skies", "note": "Sunsets prove endings can glow."},
  {"kanji": "瑞芽", "reading": "ずいが", "english": "lucky sprouts", "note": "New growth arrives quietly."},
  {"kanji": "琴歩", "reading": "ことほ", "english": "musical steps", "note": "Walk like you are composing."},
  {"kanji": "雫灯", "reading": "しずくび", "english": "droplet lanterns", "note": "Tiny sparks count."},
  {"kanji": "虹架", "reading": "にじか", "english": "rainbow bridges", "note": "Connections can be colorful."},
  {"kanji": "星庭", "reading": "ほしにわ", "english": "your starlit garden", "note": "Tend to dreams at night."},
]

suffixes = [
  {"kanji": "開花", "reading": "かいか", "english": "open into bloom.", "note": "Patience lets petals unfurl."},
  {"kanji": "躍動", "reading": "やくどう", "english": "leap with motion.", "note": "Move the body, free the mind."},
  {"kanji": "飛翔", "reading": "ひしょう", "english": "take fearless flight.", "note": "Big skies welcome you."},
  {"kanji": "朗唱", "reading": "ろうしょう", "english": "sing their name aloud.", "note": "Voice your hope."},
  {"kanji": "鮮映", "reading": "せんえい", "english": "paint the day in vivid color.", "note": "Saturate your routine with art."},
  {"kanji": "透光", "reading": "とうこう", "english": "let light pass through doubt.", "note": "Transparency calms the nerves."},
  {"kanji": "柔響", "reading": "じゅうきょう", "english": "echo softly in every room.", "note": "Gentleness carries far."},
  {"kanji": "瑞雨", "reading": "ずいう", "english": "shower gentle blessings.", "note": "Let compassion fall like rain."},
  {"kanji": "澄照", "reading": "ちょうしょう", "english": "clarify everything they touch.", "note": "Clarity feels like kindness."},
  {"kanji": "慈風", "reading": "じふう", "english": "blow kindness across the field.", "note": "Soft breezes reassure."},
  {"kanji": "豊穣", "reading": "ほうじょう", "english": "promise generous harvest.", "note": "Abundance rewards steady tending."},
  {"kanji": "余香", "reading": "よこう", "english": "leave a trailing fragrance.", "note": "Let memories smell sweet."},
  {"kanji": "舞穂", "reading": "まいほ", "english": "swirl like dancing grain.", "note": "Celebrate each milestone."},
  {"kanji": "明暁", "reading": "めいぎょう", "english": "announce a bright dawn.", "note": "Expect morning miracles."},
  {"kanji": "恵路", "reading": "けいろ", "english": "smooth the path ahead.", "note": "Gratitude paves the way."},
  {"kanji": "照耀", "reading": "しょうよう", "english": "radiate quiet brilliance.", "note": "Shine softly yet surely."},
  {"kanji": "輝路", "reading": "きろ", "english": "light up the road.", "note": "Let hope be your headlamp."},
  {"kanji": "翔昇", "reading": "しょうしょう", "english": "ascend with grace.", "note": "Rise without rushing."},
  {"kanji": "柔映", "reading": "じゅうえい", "english": "cast a velvet glow.", "note": "Cozy light heals edges."},
  {"kanji": "結心", "reading": "けっしん", "english": "gather hearts together.", "note": "Togetherness amplifies joy."},
  {"kanji": "凪息", "reading": "なぎいき", "english": "exhale calm breezes.", "note": "Keep your nervous system soothed."},
  {"kanji": "祈灯", "reading": "きとう", "english": "glimmer with prayerful light.", "note": "Intentions deserve ceremony."},
  {"kanji": "慶祝", "reading": "けいしゅく", "english": "celebrate loudly.", "note": "Throw confetti for small wins."},
  {"kanji": "詩紡", "reading": "しぼう", "english": "weave new poetry.", "note": "Give language to your feeling."},
  {"kanji": "潤歌", "reading": "じゅんか", "english": "sing with soothing rain.", "note": "Hydrate your imagination."},
  {"kanji": "煌星", "reading": "こうせい", "english": "sprinkle stardust everywhere.", "note": "Add shimmer to the mundane."},
  {"kanji": "笑福", "reading": "しょうふく", "english": "spread laughter and fortune.", "note": "Joy is generous."},
  {"kanji": "恋歌", "reading": "こいうた", "english": "hum love songs to life.", "note": "Romance the ordinary."},
  {"kanji": "息吹", "reading": "いぶき", "english": "breathe fresh energy.", "note": "Inhale possibility."},
  {"kanji": "守灯", "reading": "しゅとう", "english": "keep a protective flame.", "note": "Hold space for yourself."},
]

combo_entries = []
for prefix in prefixes:
  for suffix in suffixes:
    kanji = prefix["kanji"] + suffix["kanji"]
    kana = prefix["reading"] + suffix["reading"]
    translation = "Let {} {}".format(prefix["english"].strip(), suffix["english"].strip()).strip()
    if not translation.endswith(('.', '!', '?')):
      translation += '.'
    note = (prefix.get("note", "") + " " + suffix.get("note", "")).strip()
    combo_entries.append(
      {
        "kanji": kanji,
        "kana": kana,
        "translation": translation,
        "note": note,
      }
    )

existing = {entry["kanji"] for entry in core_entries}
unique_combos = [entry for entry in combo_entries if entry["kanji"] not in existing]

needed = 1001 - len(core_entries)
if needed > len(unique_combos):
  raise ValueError("Not enough generated expressions to reach 1001 entries")

random.shuffle(unique_combos)
idioms = core_entries + unique_combos[:needed]
random.shuffle(idioms)

output_path = BASE_DIR / "data" / "idioms.json"
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(json.dumps(idioms, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {len(idioms)} idioms to {output_path}")
