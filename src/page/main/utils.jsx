class selfAudio {
  constructor(a) {
    this.audioCtx = new AudioContext();
    // 创建音调控制对象
    this.oscillator = this.audioCtx.createOscillator();
    // 创建音量控制对象
    this.gainNode = this.audioCtx.createGain();
    // 音调音量关联
    this.oscillator.connect(this.gainNode);
    // 音量和设备关联
    this.gainNode.connect(this.audioCtx.destination);
    // 音调类型指定为正弦波
    this.oscillator.type = 'sine';
    // 是否正在播放
    this.isPlay = false;
    this.timer = null;
  }

  successSay = () => {
    // 设置音调频率
    this.oscillator.frequency.value = 260.0;
    this.say();
  };

  errorSay = () => {
    // 设置音调频率
    this.oscillator.frequency.value = 196.0;
    this.say();
  };

  say = () => {
    if (this.isPlay) {
      clearTimeout(this.timer);
      this.isPlay = false;
      this.oscillator.stop();
      return;
    }
    this.isPlay = true;
    // 先把当前音量设为0
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    // 0.01秒时间内音量从刚刚的0变成1，线性变化
    this.gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);
    // 声音走起
    this.oscillator.start(this.audioCtx.currentTime);
    // 1秒时间内音量从刚刚的1变成0.001，指数变化
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1);
    // 1秒后停止声音
    this.timer = setTimeout(() => {
      this.isPlay = false;
      this.oscillator.stop();
    }, 1000);
  };
}

export { selfAudio };
