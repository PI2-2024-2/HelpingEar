import React from 'react';
import UploadPage from './components/UploadPage'; 
import './styles/styles.css'; 

function App() {
  return (
    <div className="app-container">
      <UploadPage /> {/* Llamamos al componente de subir archivos */}
    </div>
  );
}

export default App;
