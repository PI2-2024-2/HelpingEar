const cors = require('cors');
const express = require('express');
const transcripcionRoute = require('./routes/transcripcion');

const app = express();
app.use(cors());

const port = 3000;

app.use('/', transcripcionRoute);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});