let ctx = null;
let master = null;
let muted = false;

const buffers = new Map(); // name -> AudioBuffer
const playing = new Map(); // name -> { src, gain }

function ensureCtx() {
  if (!ctx) {
    ctx = new window.AudioContext();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);

    // Tab-Visibility Handling
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden && ctx.state === 'running') ctx.suspend();
      else if (!document.hidden && ctx.state !== 'running') ctx.resume();
    });
  }
  return ctx;
}

export async function load(name, url) {
  const c = ensureCtx();
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  const buf = await c.decodeAudioData(arr);
  buffers.set(name, buf);
}

export async function loadAll(soundList) {
  await Promise.all(Object.entries(soundList).map(([n, u]) => load(n, u)));
}

export async function resumeIfNeeded() {
  const c = ensureCtx();
  if (c.state === 'suspended') await c.resume();
}

export function play(name, { volume = 0.8, rate = 1, pan = 0, randomize = 0 } = {}) {
  const c = ensureCtx();
  const buf = buffers.get(name);
  if (!buf) return null;

  if (c.state === 'suspended') c.resume();

  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = Math.max(0.01, rate + (Math.random() * 2 - 1) * randomize);

  const gain = c.createGain();
  gain.gain.value = Math.max(0, Math.min(1, volume));

  let out = gain;
  if (c.createStereoPanner && pan !== 0) {
    const panner = c.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(panner);
    out = panner;
  }

  src.connect(gain);
  out.connect(master);

  src.start();

  // Cleanup bei Ende
  src.addEventListener('ended', () => {
    const current = playing.get(name);
    if (current && current.src === src) {
      playing.delete(name);
    }
  });

  return { src, gain };
}
// Stoppt vor dem Abspielen bereits laufende Instanz mit selbem Namen
export function playExclusive(name, opts = {}) {
  stopByName(name);
  const handle = play(name, opts);
  if (handle) playing.set(name, handle);
  return handle;
}

export function stopByName(name) {
  const c = ensureCtx();
  const handle = playing.get(name);
  if (!handle) return;

  const { src, _ } = handle;

  try {
    src.stop();
  } catch {}

  playing.delete(name);
}
// Können in den Einstellungen angebunden werden damit der Nutzer die Master-Lautstärke entscheiden,
// bzw. das ganze Audio stummschalten kann.
export function setMasterVolume(v) {
  ensureCtx();
  const val = Math.max(0, Math.min(1, v));
  if (master) master.gain.value = muted ? 0 : val;
}

export function mute(on = true) {
  muted = !!on;
  ensureCtx();
  if (master) master.gain.value = muted ? 0 : 1;
}
