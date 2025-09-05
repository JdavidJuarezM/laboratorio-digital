// src/components/Vocabulario/services/ttsService.js

import * as Tone from "tone";

// --- Sintetizadores de Sonido ---
let correctLetterSynth,
  correctWordSynth,
  wrongSound,
  backspaceSound,
  skipSound,
  gameOverSound;
let isSoundReady = false;

const createSynths = () => {
  if (!isSoundReady) {
    correctLetterSynth = new Tone.MembraneSynth().toDestination();
    correctWordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
    }).toDestination();
    wrongSound = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.05 },
    }).toDestination();
    backspaceSound = new Tone.PluckSynth().toDestination();
    skipSound = new Tone.Synth().toDestination();
    gameOverSound = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
    }).toDestination();
    isSoundReady = true;
  }
};

export const initAudio = () => {
  if (Tone.context.state !== "running") {
    Tone.context
      .resume()
      .then(() => {
        createSynths();
      })
      .catch((err) => {
        console.error("ERROR al iniciar el contexto de audio de Tone.js:", err);
      });
  } else {
    createSynths();
  }
};

const soundCooldowns = new Map();
const COOLDOWN_TIME_MS = 100;

const withCooldown = (soundFunction) => {
  return (...args) => {
    if (soundCooldowns.get(soundFunction)) return;
    soundFunction(...args);
    soundCooldowns.set(soundFunction, true);
    setTimeout(
      () => soundCooldowns.set(soundFunction, false),
      COOLDOWN_TIME_MS
    );
  };
};

export const audioEffects = {
  playCorrectLetter: withCooldown(() =>
    correctLetterSynth?.triggerAttackRelease("C4", "16n")
  ),
  playCorrectWord: withCooldown(() =>
    correctWordSynth?.triggerAttackRelease(["C4", "E4", "G4"], "8n")
  ),
  playWrong: withCooldown(() => wrongSound?.triggerAttackRelease("16n")),
  playBackspace: withCooldown(() => backspaceSound?.triggerAttackRelease("G4")),
  playSkip: withCooldown(() => skipSound?.triggerAttackRelease("C3", "8n")),
  playGameOver: withCooldown(() =>
    gameOverSound?.triggerAttackRelease(["C3", "F#3", "C2"], "2n")
  ),
};

// --- Lógica de Voz del Navegador ---
const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
}
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// ESTA ES LA FUNCIÓN CLAVE CORREGIDA
export const speakWord = (word) => {
  if (synth.speaking) {
    synth.cancel();
  }
  const utterThis = new SpeechSynthesisUtterance(word);

  const spanishVoice = voices.find(
    (voice) =>
      voice.lang === "es-MX" || voice.lang === "es-US" || voice.lang === "es-ES"
  );

  utterThis.voice = spanishVoice || voices.find((v) => v.lang.startsWith("es"));
  utterThis.pitch = 1;
  utterThis.rate = 0.9;
  synth.speak(utterThis);
};
