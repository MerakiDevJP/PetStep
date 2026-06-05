// routes/pet.routes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');

// --- RUTAS DE MASCOTAS ---
router.get('/pets', petController.getPets);               // Listar todas
router.get('/pets/:id', petController.getPetById);         // Obtener una
router.post('/pets', petController.createPet);             // Registrar nueva

// --- RUTA DE SOLICITUD DE ADOPCIÓN ---
router.post('/adoptions', petController.createAdoption);   // Enviar formulario

// --- RUTAS DE FLUJO Y AUDITORÍA (Diferenciador Técnico) ---
router.patch('/pets/:id/status', petController.updatePetStatus); // Cambiar estado (DISPONIBLE -> EN_PROCESO)
router.post('/pets/:id/tracking', petController.addPetTracking); // Agregar comentarios/fotos (Línea de tiempo)

module.exports = router;