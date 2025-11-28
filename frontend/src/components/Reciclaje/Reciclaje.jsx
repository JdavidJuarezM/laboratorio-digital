import React, { useEffect, useState } from 'react';
import { useReciclaje } from './hooks/useReciclaje.js';
import { binData } from './constants.js';
import { initReciclajeAudio } from './soundService.js';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Basura, { BasuraVisual } from './Basura.jsx';
import Bote from './Bote.jsx';
import WelcomeModal from './WelcomeModal.jsx';
import Paisaje from './Paisaje.jsx';
import GameOverModal from './GameOverModal.jsx';
import PauseModal from './PauseModal.jsx';
import EcoBot from './EcoBot.jsx';
import PanelReciclaje from './PanelReciclaje';
import './Reciclaje.css';
import { useNavigate } from "react-router-dom";

// Componente de Corazón (Más bonito y visible)
const HeartIcon = ({ isLost }) => (
  <div className={`w-8 h-8 transition-all duration-500 ${isLost ? 'opacity-20 grayscale scale-75' : 'scale-110 drop-shadow-lg text-red-500'}`}>
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current filter drop-shadow-sm">
      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
    </svg>
  </div>
);

const Reciclaje = () => {
  const { state, dispatch, startGame, togglePause, toggleMute, handleDrop } = useReciclaje();
  const [activeItem, setActiveItem] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const MASTER_KEY = import.meta.env.VITE_TEACHER_CODE;
  const navigate = useNavigate();

  useEffect(() => { initReciclajeAudio(); }, []);

  function handleDragStart(event) {
    dispatch({ type: 'SET_DRAGGING', payload: true });
    setActiveItem(event.active.data.current);
  }

  function handleDragEnd(event) {
    dispatch({ type: 'SET_DRAGGING', payload: false });
    setActiveItem(null);
    const { active, over } = event;
    if (over && active) {
      const item = active.data.current;
      const binId = over.id;
      const bin = binData.find(b => b.id === binId);
      if (bin) handleDrop(item, bin);
    }
  }

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (adminPassword === MASTER_KEY) {
      setShowPanel(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div id="gameContainer" className={`w-full h-screen fixed inset-0 overflow-hidden font-sans selection:bg-none ${state.isFeverModeActive ? 'fever-mode' : ''}`}>

        {/* 1. CAPA DE FONDO (Animado) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-400 via-sky-200 to-green-100">
          <Paisaje />
        </div>

        {/* Efecto Flash */}
        {state.screenFlash && <div className="absolute inset-0 z-50 bg-white/60 animate-ping pointer-events-none" />}

        {/* 2. HUD SUPERIOR (Barra de Estado) */}
        <nav className="absolute top-0 left-0 w-full z-40 px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-lg border-b border-white/50 safe-area-top">

            {/* Info Jugador */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Puntos</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800 leading-none">{state.score}</span>
                      {state.currentStreak > 1 && (
                        <span className="text-xs font-bold text-orange-500 animate-bounce">🔥 x{state.currentStreak}</span>
                      )}
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-300 hidden md:block"></div>

                <div className="hidden md:flex items-center gap-2">
                    {[...Array(3)].map((_, i) => <HeartIcon key={i} isLost={i >= state.lives} />)}
                </div>
            </div>

            {/* Centro: Nivel */}
            <div className="absolute left-1/2 -translate-x-1/2 top-3">
                <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-black text-sm shadow-md border-2 border-yellow-200">
                    NIVEL {state.currentLevel}
                </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2">
                {/* Vidas en móvil */}
                <div className="flex md:hidden mr-2 gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-6 h-6 ${i >= state.lives ? 'opacity-20 grayscale' : 'text-red-500'}`}>
                           <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" /></svg>
                        </div>
                    ))}
                </div>

                <button onClick={togglePause} className="p-2 bg-white hover:bg-yellow-50 rounded-xl shadow-sm text-yellow-600 border border-yellow-100 text-xl transition">⏸</button>
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white hover:bg-red-50 rounded-xl shadow-sm text-red-600 border border-red-100 text-xl transition">🚪</button>
                <button onClick={() => setShowAdminLogin(true)} className="hidden md:block p-2 bg-gray-100 text-gray-500 rounded-xl">⚙️</button>
            </div>
        </nav>

        {/* 3. ÁREA DE JUEGO PRINCIPAL */}
        <main className="relative z-10 flex flex-col h-full pt-20 pb-0 pointer-events-none justify-between">

            {/* ZONA SUPERIOR: EcoBot y Mensajes */}
            <div className="relative flex-1 w-full flex justify-center items-center pointer-events-none min-h-[150px]">
                 {/* EcoBot Flotante */}
                 <div className="absolute right-4 top-4 md:right-20 md:top-10 pointer-events-auto animate-float">
                    <div className="w-24 h-24 md:w-36 md:h-36 drop-shadow-2xl filter hover:brightness-110 transition-all cursor-help">
                        <EcoBot message={state.botMessage} expression={state.botExpression} />
                    </div>
                 </div>
            </div>

            {/* ZONA MEDIA: Cinta Transportadora */}
            <div className="relative w-full flex justify-center pointer-events-auto z-20 mb-[-20px] md:mb-[-30px]">
                <div
                    id="conveyorBelt"
                    className={`
                        w-[90%] max-w-2xl h-32 md:h-48 
                        bg-slate-800 rounded-3xl border-b-8 border-slate-900 
                        shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                        relative flex items-center justify-center overflow-hidden
                        transform transition-transform duration-300
                        ${state.isFeverModeActive ? 'scale-105 ring-4 ring-yellow-400 shadow-yellow-500/50' : ''}
                    `}
                    style={{ '--belt-speed': `${state.timerSpeed / 100}s` }}
                >
                    {/* Detalles visuales de la cinta */}
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
                    <div className="conveyor-roller left scale-75 md:scale-100"></div>
                    <div className="conveyor-roller right scale-75 md:scale-100"></div>

                    {/* Item Spawner */}
                    <div className="relative z-30 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                        {state.currentItem && <Basura item={state.currentItem} />}
                    </div>

                    {/* Barra de Tiempo */}
                    <div className="absolute bottom-0 left-0 h-2 bg-slate-900 w-full">
                        <div className={`h-full transition-all duration-200 ${state.itemTimerFill < 30 ? 'bg-red-500' : state.itemTimerFill < 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${state.itemTimerFill}%` }} />
                    </div>
                </div>
            </div>

            {/* ZONA INFERIOR: Panel de Botes (El "Suelo" Moderno) */}
            <div className="w-full bg-white/30 backdrop-blur-lg border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto rounded-t-[2.5rem] z-10 pb-6 pt-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6">
                        {binData.map(bin => (
                            <div key={bin.id} className="aspect-square w-full relative group transition-transform active:scale-95">
                                <Bote id={bin.id} label={bin.label} icon={bin.icon} color={bin.color} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>

        {/* --- MODALES Y PANELES --- */}
        {state.gameState === 'welcome' && <WelcomeModal onStart={startGame} />}
        {state.gameState === 'gameOver' && <GameOverModal score={state.score} highScore={state.highScore} stats={state.gameStats} onRestart={startGame} />}
        {state.gameState === 'paused' && <PauseModal onResume={togglePause} />}

        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm border-4 border-green-500 animate-bounce-in">
              <h3 className="text-xl font-bold mb-4 text-green-800 text-center">Acceso Maestro</h3>
              <form onSubmit={handleAdminAccess} className="space-y-4">
                <input type="password" value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} className="w-full border-2 border-gray-200 p-3 rounded-xl text-center outline-none focus:border-green-500" placeholder="Código..." autoFocus />
                <div className="flex gap-2">
                    <button type="button" onClick={()=>setShowAdminLogin(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold text-gray-500">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold">Entrar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPanel && <PanelReciclaje onClose={() => { setShowPanel(false); window.location.reload(); }} />}
      </div>

      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeItem ? <BasuraVisual item={activeItem} isDragging={true} className="scale-125 drop-shadow-2xl cursor-grabbing" /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Reciclaje;