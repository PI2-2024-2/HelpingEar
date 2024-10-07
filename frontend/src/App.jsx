import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage'; 
import SubtitlesPage from './pages/SubtitlesPage'
import './styles/styles.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/subtitles" element={<SubtitlesPage />} />
      </Routes>
    </Router>
  );
}


export default App;
