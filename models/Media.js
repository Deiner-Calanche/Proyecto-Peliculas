const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  sinopsis: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  imagen: {
    type: String,
    required: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now,
  },
  anio_estreno: {
    type: Number,
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  genero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genero',
    required: true,
  },
  tipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipo',
    required: true,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director',
    required: true,
  },
  productora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Productora',
    required: true,
  }
});

module.exports = mongoose.model('Media', mediaSchema);
