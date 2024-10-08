const cors = require('cors');
const express = require('express');
const transcripcionRoute = require('./routes/transcripcion');

const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://helping-ear.vercel.app', 'https://helping-ear-1vmw.vercel.app'];

// Configuración de CORS para permitir múltiples orígenes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Si el origen no está en la lista de permitidos, bloquear la solicitud
      const msg = 'El CORS policy no permite el acceso desde este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Rutas
app.use('/', transcripcionRoute);

app.use(cors({
    origin: 'https://helping-ear.vercel.app/'  
  }));

const port = process.env.PORT || 3000;

app.use('/', transcripcionRoute);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
