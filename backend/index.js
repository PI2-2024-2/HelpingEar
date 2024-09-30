const express = require('express');
const transcripcionRoute = require('./routes/transcripcion');

const app = express();
const port = 3000;

app.use('/', transcripcionRoute);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});