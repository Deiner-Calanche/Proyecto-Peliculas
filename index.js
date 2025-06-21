const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./db/connect-mongo');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
getConnection();

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/generos', require('./routes/generoRoutes'));
app.use('/directores', require('./routes/directorRoutes'));
app.use('/productoras', require('./routes/productoraRoutes'));
app.use('/tipos', require('./routes/tipoRoutes'));
app.use('/medias', require('./routes/mediaRoutes'));

app.get('/', (req, res) => {
  res.send('✅ API funcionando correctamente');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
