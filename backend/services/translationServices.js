const { TranslationServiceClient } = require('@google-cloud/translate');
const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON de credenciales
const credencialesPath = path.join(__dirname, '../credenciales-translate.json')
const credenciales = JSON.parse(fs.readFileSync(credencialesPath, 'utf8'));

const clienteTraductor = new TranslationServiceClient({
    credentials: credenciales
});

async function traducirTexto(texto, idiomaOrigen, idiomaDestino) {
    try {
        const projectId = credenciales.project_id; // Extraer el project_id desde el archivo de credenciales
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