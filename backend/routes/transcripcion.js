const express = require('express');
const multer = require('multer');
const { transcribirAudio } = require('../services/speechServices');

const router = express.Router();

// Almacena el audio en momoria
const upload = multer({ storage: multer.memoryStorage() });

// Manejo del get
router.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de transcripción! Usa POST en /transcribir para subir un archivo.');
});

router.post('/transcribir', upload.single('audio'), async (req, res) => {
    try {
        // Verifica si el archivo fue cargado
        if (!req.file) {
            return res.status(400).send('No se cargó ningún archivo.');
        }

        const audioBytes = req.file.buffer.toString('base64');

        const resultado = await transcribirAudio(audioBytes);

        res.json(resultado);

    } catch (error) {
        console.error('Error durante la transcripción:', error);
        res.status(500).send('Ocurrió un error durante la transcripción.');
    }
});

module.exports = router;