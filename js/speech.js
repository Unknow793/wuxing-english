/**
 * 五行英语牌 — 语音模块
 *
 * 使用 Web Speech API。手机端注意事项：
 * - 不主动选择语音引擎，交给浏览器默认（兼容更多设备）
 * - 不提前 cancel()，避免 Android Chrome 的竞态问题
 * - 首次 speak() 如需异步加载 voices，入队等待 voiceschanged 后自动回放
 */
const SPEECH = (() => {
  let enabled = true;
  let _ready = false;
  let _queue = [];

  /** 初始化：尝试加载 voices，如果为空则监听 voiceschanged */
  function init() {
    if (!window.speechSynthesis) return;
    if (_ready) return;

    // 某些浏览器（Chrome Android）首次 getVoices 可能为空
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      _ready = true;
      return;
    }

    // 监听 voiceschanged（只注册一次）
    if (!window.speechSynthesis.__spInit) {
      window.speechSynthesis.__spInit = true;
      window.speechSynthesis.onvoiceschanged = () => {
        _ready = true;
        window.speechSynthesis.onvoiceschanged = null;
        // 回放队列
        const q = _queue.slice();
        _queue = [];
        for (const item of q) {
          doSpeak(item.text, item.rate, item.onEnd);
        }
      };
    }
  }
  init();

  /** 内部发音 */
  function doSpeak(text, rate, onEnd) {
    if (!window.speechSynthesis) return;

    // iOS: 如果被暂停则恢复
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.pitch = 1.1;
    if (onEnd) utter.onend = onEnd;
    utter.onerror = () => {}; // 静默处理错误

    window.speechSynthesis.speak(utter);
  }

  function speak(text, rate = 0.85, onEnd) {
    if (!enabled || !window.speechSynthesis) return;

    if (!_ready) {
      _queue.push({ text, rate, onEnd });
      return;
    }

    doSpeak(text, rate, onEnd);
  }

  function speakWord(word, onEnd) { speak(word, 0.75, onEnd); }
  function speakSentence(sentence, onEnd) { speak(sentence, 0.85, onEnd); }

  /** 停止当前朗读 */
  function stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function toggle() { enabled = !enabled; return enabled; }
  function isEnabled() { return enabled; }

  /** 等待语音就绪后执行回调 */
  function ready(callback) {
    if (!window.speechSynthesis) { callback(false); return; }
    if (_ready) { callback(true); return; }
    // 还没就绪，等 voiceschanged
    const check = () => {
      if (_ready) { callback(true); return; }
      setTimeout(check, 100);
    };
    setTimeout(check, 100);
  }

  return { speak, speakWord, speakSentence, stop, toggle, isEnabled, ready };
})();
