// client/src/components/Supermercado/services/soundService.js
import * as Tone from "tone";

let isSoundReady = false;
let synth;

export const initAudio = async () => {
    if (Tone.context.state !== "running") {
        await Tone.start();
    }
    // CAMBIO: Usamos PolySynth en lugar de Synth para permitir sonidos simultáneos
    // y evitar el error "Start time must be strictly greater..."
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    isSoundReady = true;
};

export const playSound = (note, duration, time) => {
    if (!isSoundReady || !synth) return;
    try {
        // Si no se pasa 'time', usamos Tone.now()
        // PolySynth maneja automáticamente la asignación de voces
        synth.triggerAttackRelease(note, duration, time);
    } catch (e) {
        console.error("Audio error:", e);
    }
};

export const playSuccessSound = () => {
    const now = Tone.now();
    playSound("E5", "8n", now);
    playSound("G5", "8n", now + 0.1);
};

export const playErrorSound = () => playSound("C3", "8n");
export const playClickSound = () => playSound("C4", "16n");