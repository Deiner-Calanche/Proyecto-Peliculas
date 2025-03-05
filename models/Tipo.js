const { Schema, model } = require('mongoose');

const TipoSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = model('Tipo', TipoSchema);
