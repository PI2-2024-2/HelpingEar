const { TranslationServiceClient } = require('@google-cloud/translate');
require('dotenv').config();

// Ruta al env de las credenciales de tranlate
const credenciales_translate = JSON.parse(process.env.GOOGLE_TRANSLATE_CREDENTIALS);

const clienteTraductor = new TranslationServiceClient({
    credentials: credenciales_translate,
    projectID: credenciales_translate.project_id
});

async function traducirTexto(texto, idiomaOrigen, idiomaDestino) {
    try {
        const projectId = credenciales_translate.project_id; // Extraer el project_id desde el archivo de credenciales
        const parent = clienteTraductor.locationPath(projectId, 'global');

        const [response] = await clienteTraductor.translateText({
            parent,
            contents: [texto],
            mimeType: 'text/plain',
            sourceLanguageCode: idiomaOrigen,
            targetLanguageCode: idiomaDestino,
        });

        return response.translations[0].translatedText;
    } catch (error) {
        console.error('Error al traducir texto:', error);
        throw new Error('Error en la traducción');
    }
}

module.exports = {
    traducirTexto
};