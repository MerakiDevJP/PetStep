// routes/pet.routes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');

// Rutas previas (Intactas)
router.get('/pets', petController.getPets);
router.get('/pets/:id', petController.getPetById);
router.post('/pets', petController.createPet);
router.post('/adoptions', petController.createAdoption);
router.post('/pets/:id/tracking', petController.addPetTracking);

// Rutas nuevas que complementan el archivo
router.put('/pets/:id', petController.updatePetFull);
router.patch('/pets/:id/status', petController.updatePetStatus);
router.delete('/pets/:id', petController.deletePet);

module.exports = router;