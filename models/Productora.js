const { Schema, model } = require('mongoose');

const ProductoraSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
    slogan: { type: String },
    descripcion: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = model('Productora', ProductoraSchema);
