// routes/pet.routes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');

router.get('/pets', petController.getPets);
router.get('/pets/:id', petController.getPetById);
router.post('/pets', petController.createPet);
router.post('/adoptions', petController.createAdoption);
router.post('/lost-reports', petController.createLostReport); 
router.post('/pets/:id/tracking', petController.addPetTracking);
router.put('/pets/:id', petController.updatePetFull);
router.patch('/pets/:id/status', petController.updatePetStatus);
router.delete('/pets/:id', petController.deletePet);
router.get('/adoptions', petController.getAdoptions);       
router.patch('/adoptions/:id/approve', petController.approveAdoption); 

module.exports = router;