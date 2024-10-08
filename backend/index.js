const cors = require('cors');
const express = require('express');
const transcripcionRoute = require('./routes/transcripcion');

const app = express();
app.use(cors({
    origin: 'https://helping-ear.vercel.app/'  
  }));

const port = process.env.PORT || 3000;

app.use('/', transcripcionRoute);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
