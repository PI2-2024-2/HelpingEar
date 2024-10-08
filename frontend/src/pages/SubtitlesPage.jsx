import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function SubtitlesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, fileURL, transcripcion, transcripcionConTiempos, traduccion } = location.state || {};

  const audioRef = useRef(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('Los subtitulos apareceran aqui');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false); // Estado para alternar entre traducción y transcripción

  const formatTime = (time) => {
    return parseFloat(time.split('.').length === 3 ? time.replace(/\.(?=[^.]*$)/, '') : time);
  }

  // Parsear transcripcionConTiempos
  const parseSubtitles = (transcriptionWithTimestamps, n) => {
    const subtitleArray = transcriptionWithTimestamps.split(')').filter(Boolean).map((sub) => {
      const [text, times] = sub.split(' (start:');
      const [start1, end1] = times.replace('end: ', '').replace(')', '').split(', ');
      
      const start = formatTime(start1.trim());
      const end = formatTime(end1.trim());
      
      return { startTime: start, endTime: end, text: text.trim() };
    });

    const result = [];
    for (let i = 0; i < subtitleArray.length; i += n) {
      const group = subtitleArray.slice(i, i + n);
      const start = group[0].startTime;
      const end = group[group.length - 1].endTime;
      const text = group.map(item => item.text).join(' ');
      
      result[i / n] = { startTime: start, endTime: end, text: text };
    }

    return result;
  };

  const subtitles = parseSubtitles(transcripcionConTiempos, 5);
  
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

    currentSub && setCurrentSubtitle(currentSub.text);
  };

  const handleDownload = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEnded = () => {
    setIsPlaying(false); 
  };  

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="split-container">
        <div className="left-column">
          <div className="header">
            <img src={logo} alt="HelpingEar Logo" className="logo" />
            <h1>HelpingEar</h1>
            <p className="subtitle">Subtítulos para: {fileName}</p>
          </div>
          <div className="audio-player">
            <audio ref={audioRef} controls className="audio">
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

        <div className="right-column">
          <div className="transcription">
            <h3>{showTranslation ? 'Traducción al Inglés' : 'Transcripción Completa'}</h3>
            <p>{showTranslation ? traduccion : transcripcion}</p>
            <button className="toggle-translation-button" onClick={toggleTranslation}>
              {showTranslation ? 'Volver a la Transcripción' : 'Traducir al Inglés'}
            </button>
            <button
              className="download-button"
              onClick={() =>
                handleDownload(
                  showTranslation ? traduccion : transcripcion,
                  showTranslation ? `${fileName}_translation.txt` : `${fileName}_transcription.txt`
                )
              }
            >
              {showTranslation ? 'Descargar Traducción' : 'Descargar Transcripción'}
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
