// frontend/src/components/Reciclaje/EcoBot.jsx
import React, { useRef, useEffect } from 'react';

const EcoBot = ({ message, expression }) => {
  const botRef = useRef(null);
  const pupilLeftRef = useRef(null);
  const pupilRightRef = useRef(null);
  const eyelidLeftRef = useRef(null);
  const eyelidRightRef = useRef(null);
  const mouthRef = useRef(null);

  // Efecto para el seguimiento ocular
  useEffect(() => {
    const handleBotEyeTracking = (e) => {
      if (!botRef.current || !pupilLeftRef.current || !pupilRightRef.current) return;

      const botRect = botRef.current.getBoundingClientRect();
      const botX = botRect.left + botRect.width / 2;
      const botY = botRect.top + botRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const angle = Math.atan2(mouseY - botY, mouseX - botX);
      const maxPupilMove = 3;
      const pupilX = Math.cos(angle) * maxPupilMove;
      const pupilY = Math.sin(angle) * maxPupilMove;

      pupilLeftRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      pupilRightRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    };

    document.addEventListener('mousemove', handleBotEyeTracking);
    return () => {
      document.removeEventListener('mousemove', handleBotEyeTracking);
    };
  }, []);

  // Efecto para las expresiones faciales
  useEffect(() => {
    if (!mouthRef.current || !eyelidLeftRef.current || !eyelidRightRef.current) return;

    const normalMouth = 'M35 65 Q50 85 65 65';
    const happyMouth = 'M35 70 Q50 85 65 70';
    const sadMouth = 'M35 60 Q50 45 65 60';

    switch (expression) {
      case 'happy':
        mouthRef.current.setAttribute('d', happyMouth);
        eyelidLeftRef.current.setAttribute('ry', 8);
        eyelidRightRef.current.setAttribute('ry', 8);
        break;
      case 'sad':
        mouthRef.current.setAttribute('d', sadMouth);
        eyelidLeftRef.current.setAttribute('ry', 4);
        eyelidRightRef.current.setAttribute('ry', 4);
        break;
      case 'paused':
        eyelidLeftRef.current.setAttribute('ry', 1);
        eyelidRightRef.current.setAttribute('ry', 1);
        break;
      default:
        mouthRef.current.setAttribute('d', normalMouth);
        eyelidLeftRef.current.setAttribute('ry', 8);
        eyelidRightRef.current.setAttribute('ry', 8);
    }
  }, [expression]);

  return (
    <>
      <div id="ecoBot" ref={botRef}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width="100%" height="100%">
          <defs>
            <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' style={{ stopColor: '#a8e6cf', stopOpacity: 1 }} />
              <stop offset='100%' style={{ stopColor: '#5cb87a', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx='50' cy='50' r='45' fill='url(#grad)' stroke='#3fb162' strokeWidth='4' />
          <rect x='30' y='20' width='10' height='20' rx='5' fill='#388E3C' />
          <rect x='60' y='20' width='10' height='20' rx='5' fill='#388E3C' />
          <circle ref={eyelidLeftRef} id='eyelid-left' cx='40' cy='30' r='8' fill='#fff' />
          <circle ref={pupilLeftRef} id='pupil-left' cx='40' cy='30' r='4' fill='#000' style={{ transition: 'transform 0.1s ease-out' }} />
          <circle ref={eyelidRightRef} id='eyelid-right' cx='70' cy='30' r='8' fill='#fff' />
          <circle ref={pupilRightRef} id='pupil-right' cx='70' cy='30' r='4' fill='#000' style={{ transition: 'transform 0.1s ease-out' }} />
          <path ref={mouthRef} id="bot-mouth" d='M35 65 Q50 85 65 65' stroke='#388E3C' strokeWidth='4' fill='none' style={{ transition: 'd 0.3s ease-in-out' }} />
          <rect x='40' y='5' width='20' height='10' rx='5' fill='#3fb162' />
          <path d='M25 40 A5 5 0 0 1 20 45 L20 55 A5 5 0 0 1 25 60 L30 60 L30 40 Z' fill='#388E3C' />
          <path d='M75 40 A5 5 0 0 0 80 45 L80 55 A5 5 0 0 0 75 60 L70 60 L70 40 Z' fill='#388E3C' />
        </svg>
      </div>
      <div id="botMessage" className={`speech-bubble ${message ? 'show' : ''}`}>
        {message}
      </div>
    </>
  );
};

export default React.memo(EcoBot);