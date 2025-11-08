const ROMAJI_DIGRAPHS = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  ぢゃ: "ja",
  ぢゅ: "ju",
  ぢょ: "jo",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  しぇ: "she",
  じぇ: "je",
  ちぇ: "che",
  てぃ: "ti",
  でぃ: "di",
  とぅ: "tu",
  どぅ: "du",
  ふぁ: "fa",
  ふぃ: "fi",
  ふぇ: "fe",
  ふぉ: "fo",
  ふゃ: "fya",
  ふゅ: "fyu",
  ふょ: "fyo",
  うぃ: "wi",
  うぇ: "we",
  うぉ: "wo",
  ゔぁ: "va",
  ゔぃ: "vi",
  ゔぇ: "ve",
  ゔぉ: "vo",
  ゔゅ: "vyu",
  キャ: "kya",
  キュ: "kyu",
  キョ: "kyo",
  ギャ: "gya",
  ギュ: "gyu",
  ギョ: "gyo",
  シャ: "sha",
  シュ: "shu",
  ショ: "sho",
  ジャ: "ja",
  ジュ: "ju",
  ジョ: "jo",
  チャ: "cha",
  チュ: "chu",
  チョ: "cho",
  ヂャ: "ja",
  ヂュ: "ju",
  ヂョ: "jo",
  ニャ: "nya",
  ニュ: "nyu",
  ニョ: "nyo",
  ヒャ: "hya",
  ヒュ: "hyu",
  ヒョ: "hyo",
  ビャ: "bya",
  ビュ: "byu",
  ビョ: "byo",
  ピャ: "pya",
  ピュ: "pyu",
  ピョ: "pyo",
  ミャ: "mya",
  ミュ: "myu",
  ミョ: "myo",
  リャ: "rya",
  リュ: "ryu",
  リョ: "ryo",
  シェ: "she",
  ジェ: "je",
  チェ: "che",
  ティ: "ti",
  ディ: "di",
  トゥ: "tu",
  ドゥ: "du",
  ファ: "fa",
  フィ: "fi",
  フェ: "fe",
  フォ: "fo",
  フャ: "fya",
  フュ: "fyu",
  フョ: "fyo",
  ウィ: "wi",
  ウェ: "we",
  ウォ: "wo",
  ヴァ: "va",
  ヴィ: "vi",
  ヴェ: "ve",
  ヴォ: "vo",
  ヴュ: "vyu",
};

const ROMAJI_BASE = {};
[
  ["a", ["あ", "ア", "ぁ", "ァ"]],
  ["i", ["い", "イ", "ぃ", "ィ", "ゐ", "ヰ"]],
  ["u", ["う", "ウ", "ぅ", "ゥ"]],
  ["e", ["え", "エ", "ぇ", "ェ", "ゑ", "ヱ"]],
  ["o", ["お", "オ", "ぉ", "ォ", "を", "ヲ"]],
  ["ka", ["か", "カ", "ゕ", "ヵ"]],
  ["ki", ["き", "キ"]],
  ["ku", ["く", "ク"]],
  ["ke", ["け", "ケ", "ゖ", "ヶ"]],
  ["ko", ["こ", "コ"]],
  ["ga", ["が", "ガ"]],
  ["gi", ["ぎ", "ギ"]],
  ["gu", ["ぐ", "グ"]],
  ["ge", ["げ", "ゲ"]],
  ["go", ["ご", "ゴ"]],
  ["sa", ["さ", "サ"]],
  ["shi", ["し", "シ"]],
  ["su", ["す", "ス"]],
  ["se", ["せ", "セ"]],
  ["so", ["そ", "ソ"]],
  ["za", ["ざ", "ザ"]],
  ["ji", ["じ", "ジ", "ぢ", "ヂ"]],
  ["zu", ["ず", "ズ", "づ", "ヅ"]],
  ["ze", ["ぜ", "ゼ"]],
  ["zo", ["ぞ", "ゾ"]],
  ["ta", ["た", "タ"]],
  ["chi", ["ち", "チ"]],
  ["tsu", ["つ", "ツ"]],
  ["te", ["て", "テ"]],
  ["to", ["と", "ト"]],
  ["da", ["だ", "ダ"]],
  ["de", ["で", "デ"]],
  ["do", ["ど", "ド"]],
  ["na", ["な", "ナ"]],
  ["ni", ["に", "ニ"]],
  ["nu", ["ぬ", "ヌ"]],
  ["ne", ["ね", "ネ"]],
  ["no", ["の", "ノ"]],
  ["ha", ["は", "ハ"]],
  ["hi", ["ひ", "ヒ"]],
  ["fu", ["ふ", "フ"]],
  ["he", ["へ", "ヘ"]],
  ["ho", ["ほ", "ホ"]],
  ["ba", ["ば", "バ"]],
  ["bi", ["び", "ビ"]],
  ["bu", ["ぶ", "ブ"]],
  ["be", ["べ", "ベ"]],
  ["bo", ["ぼ", "ボ"]],
  ["pa", ["ぱ", "パ"]],
  ["pi", ["ぴ", "ピ"]],
  ["pu", ["ぷ", "プ"]],
  ["pe", ["ぺ", "ペ"]],
  ["po", ["ぽ", "ポ"]],
  ["ma", ["ま", "マ"]],
  ["mi", ["み", "ミ"]],
  ["mu", ["む", "ム"]],
  ["me", ["め", "メ"]],
  ["mo", ["も", "モ"]],
  ["ya", ["や", "ヤ", "ゃ", "ャ"]],
  ["yu", ["ゆ", "ユ", "ゅ", "ュ"]],
  ["yo", ["よ", "ヨ", "ょ", "ョ"]],
  ["ra", ["ら", "ラ"]],
  ["ri", ["り", "リ"]],
  ["ru", ["る", "ル"]],
  ["re", ["れ", "レ"]],
  ["ro", ["ろ", "ロ"]],
  ["wa", ["わ", "ワ", "ゎ", "ヮ"]],
  ["n", ["ん", "ン"]],
  ["vu", ["ゔ", "ヴ"]],
].forEach(([romaji, chars]) => {
  chars.forEach((kana) => {
    ROMAJI_BASE[kana] = romaji;
  });
});

export function kanaToRomaji(input = "") {
  if (!input) return "";
  const text = input.normalize ? input.normalize("NFC") : input;
  let output = "";
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === " " || char === "　") {
      output += " ";
      continue;
    }
    if (char === "ー") {
      const match = output.match(/[aeiou]$/);
      if (match) {
        output += match[0];
      }
      continue;
    }
    if (char === "っ" || char === "ッ") {
      const nextChunk = getRomajiChunk(text, i + 1);
      if (nextChunk.value) {
        const consonant = nextChunk.value.charAt(0);
        if (/[a-z]/i.test(consonant)) {
          output += consonant;
        }
      }
      continue;
    }
    if (char === "ん" || char === "ン") {
      const nextChunk = getRomajiChunk(text, i + 1);
      if (nextChunk.value && /^[aiueoy]/.test(nextChunk.value)) {
        output += "n'";
      } else {
        output += "n";
      }
      continue;
    }
    const chunk = getRomajiChunk(text, i);
    if (chunk.length > 1) {
      output += chunk.value;
      i += chunk.length - 1;
      continue;
    }
    if (chunk.value) {
      output += chunk.value;
    } else {
      output += char;
    }
  }
  return output;
}

function getRomajiChunk(text, index) {
  if (index >= text.length) {
    return { value: "", length: 0 };
  }
  const twoChar = text.slice(index, index + 2);
  if (ROMAJI_DIGRAPHS[twoChar]) {
    return { value: ROMAJI_DIGRAPHS[twoChar], length: 2 };
  }
  const char = text[index];
  if (ROMAJI_BASE[char]) {
    return { value: ROMAJI_BASE[char], length: 1 };
  }
  return { value: "", length: 1 };
}
