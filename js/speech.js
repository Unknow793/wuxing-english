/**
 * 五行英语牌 — 语音模块
 * 使用 Web Speech API 朗读单词和句子。
 *
 * 手机端注意事项：
 * - Chrome/Android 上 getVoices() 首次调用返回空数组，
 *   需等待 voiceschanged 事件后才能获取语音列表。
 * - iOS Safari 严格要求首次 speak() 由用户手势触发。
 */
const SPEECH = (() => {
  let enabled = true;
  let _voicesLoaded = false;
  let _pendingQueue = []; // 等待语音就绪的待读文本

  /** 获取已缓存的英语语音 */
  function getEnglishVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    const english = voices.filter(v => v.lang.startsWith('en'));
    if (english.length === 0) return null;
    return english.find(v => v.name.includes('Female')) || english[0];
  }

  /** 确保 voices 已加载，返回是否可用 */
  function ensureVoices() {
    if (!window.speechSynthesis) return false;
    // Chrome: 如果 getVoices() 返回空数组，监听 voiceschanged
    if (!_voicesLoaded) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        _voicesLoaded = true;
      } else {
        // 注册一次 voiceschanged 监听
        if (!window.speechSynthesis._voiceListenerRegistered) {
          window.speechSynthesis._voiceListenerRegistered = true;
          window.speechSynthesis.onvoiceschanged = () => {
            _voicesLoaded = true;
            window.speechSynthesis.onvoiceschanged = null;
            // 处理积压队列
            while (_pendingQueue.length > 0) {
              const item = _pendingQueue.shift();
              doSpeak(item.text, item.rate);
            }
          };
        }
      }
    }
    return _voicesLoaded;
  }

  /** 内部执行发音 */
  function doSpeak(text, rate, onEnd) {
    if (!window.speechSynthesis) return false;

    // iOS Safari: 如果 speechSynthesis 处于 paused 状态则 resume
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.pitch = 1.1;

    if (onEnd) {
      utter.onend = onEnd;
    }

    const voice = getEnglishVoice();
    if (voice) utter.voice = voice;

    window.speechSynthesis.speak(utter);
    return true;
  }

  /**
   * 对外 speak 接口：
   * 如果 voices 尚未加载，将文本加入待读队列，
   * 等 voiceschanged 触发后自动朗读。
   * onEnd 回调在朗读完成后调用（不打断当前朗读）。
   */
  function speak(text, rate = 0.85, onEnd) {
    if (!enabled) return;
    if (!window.speechSynthesis) return;

    if (!ensureVoices()) {
      // voices 还没加载好，入队等待
      _pendingQueue.push({ text, rate });
      return;
    }

    doSpeak(text, rate, onEnd);
  }

  function speakWord(word, onEnd) {
    speak(word, 0.75, onEnd);
  }

  function speakSentence(sentence, onEnd) {
    speak(sentence, 0.85, onEnd);
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() { return enabled; }

  /**
   * 强制等待 voices 加载完成后执行回调。
   * 用于 iOS 等需要在用户手势中触发首次 speak 的场景。
   */
  function ready(callback) {
    if (!window.speechSynthesis) {
      if (callback) callback(false);
      return;
    }
    if (ensureVoices()) {
      if (callback) callback(true);
      return;
    }
    // 还没加载好，等 voiceschanged
    const check = () => {
      if (_voicesLoaded) {
        if (callback) callback(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }

  return { speak, speakWord, speakSentence, toggle, isEnabled, ready };
})();
