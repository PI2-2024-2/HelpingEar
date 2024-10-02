const speech = require('@google-cloud/speech');
const path = require('path');

// Inicializa el cliente de Google Cloud Speech con credenciales específicas
const clienteSpeech = new speech.SpeechClient({
    keyFilename: path.join(__dirname, '../credenciales-speech.json')
});

const transcribirAudio = async (audioBytes, encoding, sampleRateHertz) => {
    // Crea el objeto de audio para la transcripción
    const audio = {
        content: audioBytes,
    };

    // Configura el reconocimiento de audio para español (Colombia), con marcas de tiempo
    const config = {
        encoding: encoding,  
        languageCode: 'es-CO',  // Idioma en español de Col
        enableWordTimeOffsets: true  // Habilita las marcas de tiempo
    };

    if (sampleRateHertz) {
        config.sampleRateHertz = sampleRateHertz;
    }

    // Realiza la transcripción del audio
    const [response] = await clienteSpeech.recognize({
        audio: audio,
        config: config,
    });

     // Imprime la respuesta completa para depuración
     console.log('Respuesta de Google Speech-to-Text:', JSON.stringify(response, null, 2));

    // Transcripción sin marcas de tiempo
    const transcripcionSinTiempos = response.results
        .map(result => result.alternatives[0].transcript)
        .join(' ');

    // Transcripción con marcas de tiempo
    const transcripcionConTiempos = response.results
        .map(result => {
            return result.alternatives[0].words.map(wordInfo => {
                // Marca de tiempo inicial 
                const startSecs = `${wordInfo.startTime.seconds}` + '.' + wordInfo.startTime.nanos / 1e9;
                // Marca de tiempo final
                const endSecs = `${wordInfo.endTime.seconds}` + '.' + wordInfo.endTime.nanos / 1e9;
                return `${wordInfo.word} (start: ${startSecs}, end: ${endSecs})`;
            }).join(' ');
        })
        .join('\n');

    return {
        transcripcionSinTiempos,
        transcripcionConTiempos
    };
};

module.exports = {
    transcribirAudio
};