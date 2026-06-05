// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// IMPORTAR RUTAS MODULARIZADAS
const petRoutes = require('./routes/pet.routes');

// Registrar las rutas en la aplicación
app.use('/api', petRoutes);

app.listen(PORT, () => {
    console.log(`Servidor limpio y modularizado en http://localhost:${PORT}`);
});