/// models/pet.model.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    species: { type: String, required: [true, 'La especie es obligatoria'], trim: true },
    breed: { type: String, trim: true, default: 'Mestizo' },
    age: { type: Number, required: [true, 'La edad es obligatoria'] },
    description: { type: String, trim: true },
    fotoUrl: { type: String, trim: true, default: '' }, // ✅ nuevo campo
    status: { type: String, enum: ['Disponible', 'En Proceso', 'Adoptado' , 'Perdido', 'Recuperado'], default: 'Disponible' }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);