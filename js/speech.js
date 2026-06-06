/**
 * 五行英语牌 — 语音模块
 *
 * 跨平台方案（兼容 Android Chrome + iOS Safari）：
 * - Android Chrome: cancel() 后接 speak() 有竞态，用 rAF 间隔一帧
 * - iOS Safari: 需在用户手势上下文中执行，rAF 保留手势链
 * - 不主动选语音，由浏览器决定默认引擎
 */
const SPEECH = (() => {
  let enabled = true;
  const ss = window.speechSynthesis;
  const supported = !!ss;

  /** 预热语音引擎（Android Chrome 首次发音无声的 workaround） */
  (function warmup() {
    if (!supported) return;
    try {
      // 首次 getVoices 返回空数组时，Chrome 会触发 voiceschanged
      ss.getVoices();
      // 预热 TTS：发一个无声空 utterance，让浏览器初始化音频上下文
      const dummy = new SpeechSynthesisUtterance(' ');
      dummy.volume = 0;
      ss.speak(dummy);
    } catch (e) {}
  })();

  function speak(text, rate = 0.85, onEnd) {
    if (!enabled || !supported) return;

    // 先取消当前朗读
    ss.cancel();

    // 用 rAF 间隔一帧再 speak，避免 Android Chrome 的 cancel/speak 竞态
    requestAnimationFrame(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      utter.pitch = 1.1;
      if (onEnd) utter.onend = onEnd;
      utter.onerror = () => {};
      ss.speak(utter);
    });
  }

  function speakWord(word, onEnd) { speak(word, 0.75, onEnd); }
  function speakSentence(sentence, onEnd) { speak(sentence, 0.85, onEnd); }

  function stop() { if (supported) ss.cancel(); }
  function toggle() { if (!supported) return false; enabled = !enabled; return enabled; }
  function isEnabled() { return enabled; }
  function ready(cb) { if (cb) cb(supported); }

  return { speak, speakWord, speakSentence, stop, toggle, isEnabled, ready };
})();
