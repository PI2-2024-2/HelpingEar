import React, { useState } from 'react';
import logo from '../assets/logo.png'; 

function UploadPage() {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false); // Para habilitar/deshabilitar el botón

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName(null);
      setIsFileValid(false);
      return;
    }

    const supportedFormats = ['audio/mp3', 'audio/wav', 'audio/x-m4a'];
    if (!supportedFormats.includes(file.type)) {
      setError('Formato de audio no disponible');
      setFileName(null);
      setIsFileValid(false);
    } else if (file.size > 10 * 1024 * 1024) {
      setError('El archivo supera el tamaño máximo de 10MB');
      setFileName(null);
      setIsFileValid(false);
    } else {
      setError(null);
      setFileName(file.name);
      setIsFileValid(true); // Archivo válido
    }
  };

  const handleGenerateSubtitles = () => {
    if (!fileName) {
      setError('Hubo un error con el archivo');
    } else {
      // Aquí es donde mandas el archivo al backend
      console.log('Generando subtítulos para', fileName);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <img src={logo} alt="HelpingEar Logo" className="logo" />
        <h1>HelpingEar</h1>
        <p>Seleccione un archivo de audio</p>
        <input type="file" onChange={handleFileChange} accept=".mp3,.wav,.m4a" />
        <p className="file-name">
          {fileName ? fileName : 'No se eligió ningún archivo'}
        </p>
        {error && <p className="error-message">{error}</p>}
        <p>Formatos soportados: MP3, WAV, M4A (máx. 10MB)</p>
        <button onClick={handleGenerateSubtitles} disabled={!isFileValid}>
          Generar subtítulos
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
