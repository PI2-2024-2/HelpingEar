const express = require('express');
const multer = require('multer');
const { transcribirAudio } = require('../services/speechServices');
const { traducirTexto } = require('../services/translationServices');

// Crear el enrutador de Express
const router = express.Router();

// Configurar multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Mapeo de formatos de audio y sus codificaciones compatibles con Google Cloud Speech-to-Text
const audioFormatos = {
    'audio/mpeg': { encoding: 'MP3', sampleRateHertz: 44100 },        // Para archivos .mp3
    'audio/ogg': { encoding: 'WEBM_OPUS', sampleRateHertz: 48000 },    // Para archivos .ogg 
    'audio/wav': { encoding: 'FLAC', sampleRateHertz: 44100 },    // Falta procesar los .wav
    'audio/wave': { encoding: 'LINEAR16', sampleRateHertz: 48000 }, 
};


// Ruta de trascripción
router.post('/transcribir', upload.single('audio'), async (req, res) => {
    try {
        // Verifica si el archivo fue cargado
        if (!req.file) {
            return res.status(400).send('No se cargó ningún archivo.');
        }

        console.log('Mimetype del archivo:', req.file.mimetype);
        // Detecta el formato del archivo
        const mimetype = req.file.mimetype;
        const formato = audioFormatos[mimetype];

        if (!formato) {
            return res.status(400).send('Formato de archivo no compatible. Aceptamos MP3 y OGG.');
        }

        if (formato.sampleRateHertz === 0 || !formato.sampleRateHertz) {
            return res.status(400).send('La tasa de muestreo del archivo no es válida.');
        }

        const audioBytes = req.file.buffer.toString('base64');
        const resultado = await transcribirAudio(audioBytes, formato.encoding, formato.sampleRateHertz);

        const textoTraducido = await traducirTexto(resultado.transcripcionSinTiempos, 'es', 'en');  // Traducir de español a inglés

        res.json({
            transcripcion: resultado.transcripcionSinTiempos,
            transcripcionConTiempos: resultado.transcripcionConTiempos,
            traduccion: textoTraducido
        });

    } catch (error) {
        console.error('Error durante la transcripción:', error);
        res.status(500).send('Ocurrió un error durante la transcripción.');
    }
});

module.exports = router;