// models/adoptionRequest.model.js
const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'El ID de la mascota es obligatorio']
    },
    applicantName: {
        type: String,
        required: [true, 'El nombre del solicitante es obligatorio'],
        trim: true
    },
    applicantAge: {
        type: Number,
        required: [true, 'La edad es obligatoria']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'El teléfono de contacto es obligatorio'],
        trim: true
    },
    reasons: {
        type: String,
        required: [true, 'Los motivos de adopción son obligatorios'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Aprobada', 'Rechazada'],
        default: 'Pendiente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);