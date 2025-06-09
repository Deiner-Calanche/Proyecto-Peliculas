const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hasheado
  rol: { 
    type: String, 
    enum: ['administrador', 'docente'], 
    required: true 
  },
  estado: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);
