import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Importamos useLocation para recibir el estado
import logo from '../assets/logo.png'; 

function SubtitlesPage() {
  const location = useLocation();
  const { fileName, fileURL } = location.state || {}; // Obtenemos el nombre del archivo y la URL temporal del estado
  const [currentSubtitle, setCurrentSubtitle] = useState('Los subtítulos aparecerán aquí');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app-container">
      <div className="upload-box">
        <div className="header">
          <img src={logo} alt="HelpingEar Logo" className="logo" />
          <h1>HelpingEar</h1>
          <p className="subtitle">Visualizador de Subtítulos para: {fileName}</p>
        </div>
        <div className="audio-player">
          {/* Utilizamos la URL temporal para reproducir el archivo de audio subido */}
          <audio ref={audioRef} controls className="audio">
            <source src={fileURL} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
        <button className="play-button" onClick={togglePlayPause}>
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
        <div className="subtitle-box">
          <p>{currentSubtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default SubtitlesPage;
