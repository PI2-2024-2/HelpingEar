import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function UploadPage() {
  const [fileName, setFileName] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
      return;
    }

    const supportedFormats = ["audio/mp3", "audio/wav", "audio/x-m4a"];
    if (!supportedFormats.includes(file.type)) {
      setError("Formato de audio no disponible");
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
    } else if (file.size > 10 * 1024 * 1024) {
      setError("El archivo supera el tamaño máximo de 10MB");
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
    } else {
      setError(null);
      setFileName(file.name);
      setFileURL(URL.createObjectURL(file));
      setIsFileValid(true);
    }
  };

  const handleGenerateSubtitles = async () => {
    if (!fileName) {
      setError("Hubo un error con el archivo");
      return;
    }

    // Crear un FormData para enviar el archivo al backend
    ////////////////////////////////////////////////////////////////////
    // Actualizar las rutas 
    const formData = new FormData();
    formData.append('file', fileURL); // Aqui hay que ponerlo segun como se espere en el backend**

    try {
      const response = await fetch('http://<url>/transcribe', { //Aqui poner la ruta para el fetch**
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al generar la transcripción');
      }

      const data = await response.json();
      navigate("/subtitles", { state: { fileName, fileURL, ...data } }); // Mandar el JSON completo
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <img src={logo} alt="HelpingEar Logo" className="logo" />
        <h1>HelpingEar</h1>
        <p>Seleccione un archivo de audio</p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".mp3,.wav,.m4a"
        />
        <p className="file-name">
          {fileName ? fileName : "No se eligió ningún archivo"}
        </p>
        {error && <p className="error-message">{error}</p>}
        <p>Formatos soportados: MP3, WAV, M4A (máx. 10MB)</p>
        {fileURL && (
          <div>
            <audio controls>
              <source src={fileURL} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
        <button onClick={handleGenerateSubtitles} disabled={!isFileValid}>
          Generar transcripción
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
