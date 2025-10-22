import * as Tone from "tone";

// Sintetizadores existentes
const clickSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
}).toDestination();
const hoverSynth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 },
}).toDestination();

// --- 👇 NUEVOS SINTETIZADORES AÑADIDOS 👇 ---
const successSynth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.4 },
}).toDestination();
const errorSynth = new Tone.FMSynth({
  harmonicity: 3,
  modulationIndex: 10,
  detune: 0,
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 },
  modulation: { type: "square" },
  modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 },
}).toDestination();

let isAudioReady = false;

const initializeAudio = async () => {
  if (!isAudioReady) {
    await Tone.start();
    isAudioReady = true;
    console.log("Audio context started successfully!");
  }
};

const soundService = {
  start: initializeAudio,

  playClick: () => {
    if (!isAudioReady) return;
    clickSynth.triggerAttackRelease("C5", "8n");
  },

  playHover: () => {
    if (!isAudioReady) return;
    hoverSynth.triggerAttackRelease("A5", "16n");
  },

  // --- 👇 NUEVAS FUNCIONES AÑADIDAS 👇 ---
  playSuccess: () => {
    if (!isAudioReady) return;
    successSynth.triggerAttackRelease("C6", "8n", Tone.now());
  },

  playError: () => {
    if (!isAudioReady) return;
    errorSynth.triggerAttackRelease("C3", "8n");
  },
};

export default soundService;
