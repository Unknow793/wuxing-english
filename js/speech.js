/**
 * 五行英语牌 — 语音模块
 * 使用 Web Speech API 朗读单词和句子。
 */
const SPEECH = (() => {
  let enabled = true;

  function speak(text, rate = 0.85) {
    if (!enabled) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.pitch = 1.1;
    // Pick a decent English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
      || voices.find(v => v.lang.startsWith('en'))
      || null;
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }

  function speakWord(word) {
    speak(word, 0.75);
  }

  function speakSentence(sentence) {
    speak(sentence, 0.85);
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() { return enabled; }

  return { speak, speakWord, speakSentence, toggle, isEnabled };
})();
