// models/pet.model.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la mascota es obligatorio'],
        trim: true
    },
    especie: {
        type: String,
        required: [true, 'La especie es obligatoria'],
        trim: true
    },
    estado: {
        type: String,
        enum: ['DISPONIBLE', 'RECONECTADO', 'EN_PROCESO', 'RESERVADO', 'EXTRAVIADO', 'HALLADO'],
        default: 'DISPONIBLE'
    },
    fotoUrl: {
        type: String,
        required: [true, 'La URL de la foto es obligatoria'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    salud: {
        type: String,
        required: [true, 'El estado de salud es obligatorio'],
        trim: true
    },
    temperamento: {
        type: String,
        required: [true, 'El temperamento es obligatorio'],
        trim: true
    },
    comentarios: [{
        autor: { type: String, trim: true },
        texto: { type: String, trim: true },
        fecha: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true // Mantiene automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Pet', petSchema);