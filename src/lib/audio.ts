let ctx: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

/** Short lyre blip. Only call from a user gesture. */
export function playTone(freq = 440, dur = 0.12, gain = 0.045) {
  const audio = context();
  if (!audio) return;
  void audio.resume();
  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 1.4), t + dur);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp);
  amp.connect(audio.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function playSeal() {
  playTone(392, 0.08, 0.035);
  window.setTimeout(() => playTone(523, 0.12, 0.03), 70);
}

export function playSummon() {
  [196, 247, 330, 392].forEach((freq, index) => {
    window.setTimeout(() => playTone(freq, 0.22, 0.03), index * 90);
  });
}
