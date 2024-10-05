import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

function SubtitlesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, fileURL, transcription } = location.state || {}; 
  const simulatedTranscription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
   Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
   Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
  const [currentSubtitle, setCurrentSubtitle] = useState('Los subtítulos aparecerán aquí');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Simular subtítulos en tiempo real
  const subtitles = [
    { startTime: 0, endTime: 5, text: 'Esto es un subtítulo en tiempo real 1.' },
    { startTime: 5, endTime: 10, text: 'Esto es un subtítulo en tiempo real 2.' },
  ];

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const currentSub = subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime < sub.endTime
    );
    setCurrentSubtitle(currentSub ? currentSub.text : 'Los subtítulos aparecerán aquí');
  };

  // Función para descargar la transcripción
  const handleDownloadTranscription = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}_transcription.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="split-container">
        {/* Columna izquierda: Subtítulos en tiempo real y reproductor */}
        <div className="left-column">
          <div className="header">
            <img src={logo} alt="HelpingEar Logo" className="logo" />
            <h1>HelpingEar</h1>
            <p className="subtitle">Subtítulos para: {fileName}</p>
          </div>
          <div className="audio-player">
            <audio ref={audioRef} onTimeUpdate={handleAudioTimeUpdate} controls className="audio">
              <source src={fileURL} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
          <div className="play-button-container">
            <button className="play-button" onClick={togglePlayPause}>
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </button>
          </div>
          <div className="subtitle-box">
            <p>{currentSubtitle}</p>
          </div>
        </div>

        {/* Columna derecha: Transcripción completa */}
        <div className="right-column">
          <div className="transcription">
            <h3>Transcripción Completa:</h3>
            <p>{simulatedTranscription}</p>
            <button className="download-button" onClick={handleDownloadTranscription}>
              Descargar Transcripción
            </button>
          </div>
          <button className="back-button" onClick={handleBack}>
            Subir otro audio
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubtitlesPage;
