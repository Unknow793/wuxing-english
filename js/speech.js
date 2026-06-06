/**
 * 五行英语牌 — 语音模块
 *
 * 极简实现：不等待 voices 加载，不选语音引擎，直接调用 speak()。
 * 手机端各浏览器对 Web Speech API 的实现差异较大，
 * 移除所有前置检测逻辑，由浏览器自行处理兼容性。
 */
const SPEECH = (() => {
  let enabled = true;

  /** 如果浏览器不支持 speechSynthesis，静默降级 */
  const ss = window.speechSynthesis;
  const supported = !!ss;

  function speak(text, rate = 0.85, onEnd) {
    if (!enabled || !supported) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.pitch = 1.1;
    if (onEnd) utter.onend = onEnd;
    utter.onerror = () => {}; // 静默处理

    ss.speak(utter);
  }

  function speakWord(word, onEnd) { speak(word, 0.75, onEnd); }
  function speakSentence(sentence, onEnd) { speak(sentence, 0.85, onEnd); }

  /** 停止当前朗读 */
  function stop() {
    if (supported) ss.cancel();
  }

  function toggle() {
    if (!supported) return false;
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() { return enabled; }

  /** 回调语音是否可用 */
  function ready(callback) {
    if (callback) callback(supported);
  }

  return { speak, speakWord, speakSentence, stop, toggle, isEnabled, ready };
})();
