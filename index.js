const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./db/connect-mongo');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
getConnection();

// Importar rutas
app.use('/generos', require('./routes/generoRoutes'));
app.use('/directores', require('./routes/directorRoutes'));
app.use('/productoras', require('./routes/productoraRoutes'));
app.use('/tipos', require('./routes/tipoRoutes'));
app.use('/media', require('./routes/mediaRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));