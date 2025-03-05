const { Schema, model } = require('mongoose');

const MediaSchema = new Schema({
    serial: { type: String, unique: true, required: true },
    titulo: { type: String, required: true },
    sinopsis: { type: String },
    url: { type: String, unique: true, required: true },
    imagen: { type: String },
    anioEstreno: { type: Number },
    genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
    director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = model('Media', MediaSchema);
