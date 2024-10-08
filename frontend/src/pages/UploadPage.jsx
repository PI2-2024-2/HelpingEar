import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
      return;
    }

    const supportedFormats = ["audio/mp3", "audio/wav", "audio/x-m4a", "audio/ogg", "audio/mpeg"];
    if (!supportedFormats.includes(selectedFile.type)) {
      setError("Formato de audio no disponible");
      setFile(null);
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
    } else if (selectedFile.size > 10 * 1024 * 1024) {
      setError("El archivo supera el tamaño máximo de 10MB");
      setFile(null);
      setFileName(null);
      setFileURL(null);
      setIsFileValid(false);
    } else {
      setError(null);
      setFile(selectedFile); // Guardamos el archivo real
      setFileName(selectedFile.name);
      setFileURL(URL.createObjectURL(selectedFile));
      setIsFileValid(true);
    }
  };

  const handleGenerateSubtitles = async () => {
    if (!file) {
      setError("Hubo un error con el archivo");
      return;
    }

    // Crear un FormData para enviar el archivo al backend
    const formData = new FormData();
    formData.append("audio", file); // Enviar el archivo real

    try {
      const response = await fetch("https://helping-ear-1vmw.vercel.app/transcribir", { // Cambia esto según tu backend
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al generar la transcripción");
      }

      const data = await response.json();
      // Redirigir a la página de subtítulos con el archivo y la transcripción/traducción
      navigate("/subtitles", { state: { fileName, fileURL, ...data } });
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
          accept=".mp3,.wav,.m4a,.ogg"
        />
        <p className="file-name">
          {fileName ? fileName : "No se eligió ningún archivo"}
        </p>
        {error && <p className="error-message">{error}</p>}
        <p>Formatos soportados: MP3, WAV, M4A, OGG (máx. 10MB)</p>
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
