// frontend/src/components/Reciclaje/soundService.js
import * as Tone from 'tone';

let isInitialized = false;
let music;

// Synths for different sound effects
const synths = {
  correct: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } }).toDestination(),
  error: new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination(),
  levelUp: new Tone.MembraneSynth().toDestination(),
  streak: new Tone.PluckSynth().toDestination(),
  'bomb-explode': new Tone.NoiseSynth({ noise: { type: 'brown' }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.2 } }).toDestination(),
  'bomb-spawn': new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination(),
  'powerup-spawn': new Tone.Synth({ oscillator: { type: 'fmsquare' }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.2, release: 0.2 } }).toDestination(),
};

// Sound effect triggers
const soundActions = {
  correct: () => synths.correct.triggerAttackRelease('C5', '8n'),
  error: () => synths.error.triggerAttackRelease('C3', '8n'),
  levelUp: () => {
    const now = Tone.now();
    synths.levelUp.triggerAttackRelease('C4', '8n', now);
    synths.levelUp.triggerAttackRelease('G4', '8n', now + 0.1);
    synths.levelUp.triggerAttackRelease('C5', '8n', now + 0.2);
  },
  streak: () => synths.streak.triggerAttackRelease('G5', '16n'),
  'bomb-explode': () => synths['bomb-explode'].triggerAttackRelease('2n'),
  'bomb-spawn': () => synths['bomb-spawn'].triggerAttackRelease('F#4', '16n'),
  'powerup-spawn': () => synths['powerup-spawn'].triggerAttackRelease('A5', '4n'),
};

function startBackgroundMusic() {
  if (music) return; // Don't start if already running

  const musicSynth = new Tone.Synth({
    oscillator: { type: 'amtriangle' },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
  }).toDestination();
  musicSynth.volume.value = -18; // Lower volume for background music

  const musicPattern = new Tone.Sequence((time, note) => {
    musicSynth.triggerAttackRelease(note, '8n', time);
  }, ['C4', ['E4', 'G4'], 'B3', ['D4', 'G4']], '4n');

  musicPattern.start(0);
  Tone.Transport.start();

  music = { synth: musicSynth, pattern: musicPattern };
}

export const initReciclajeAudio = async () => {
  if (isInitialized) return;
  await Tone.start();
  startBackgroundMusic();
  isInitialized = true;
};

export const playSound = (name) => {
  if (!isInitialized || !soundActions[name]) return;
  soundActions[name]();
};

export const toggleMute = () => {
  Tone.Destination.mute = !Tone.Destination.mute;
  return Tone.Destination.mute;
};

export const pauseMusic = () => {
  if (Tone.Transport.state === 'started') {
    Tone.Transport.pause();
  }
};

export const resumeMusic = () => {
  if (Tone.Transport.state === 'paused') {
    Tone.Transport.start();
  }
};

export const stopBackgroundMusic = () => {
  if (music) {
    Tone.Transport.stop();
    music.pattern.dispose();
    music.synth.dispose();
    music = null;
  }
  isInitialized = false;
};
