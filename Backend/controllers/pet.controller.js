// controllers/pet.controller.js
const Pet = require('../models/pet.model');
const AdoptionRequest = require('../models/adoptionRequest.model');

// 1. GET: Obtener mascotas con o sin filtro de especie
const getPets = async (req, res) => {
    try {
        const { especie } = req.query;
        console.log(`Request recibida. Buscando mascotas de especie: ${especie || 'Todas'}`);

        let filtro = {};
        if (especie) {
            filtro.species = { $regex: new RegExp(especie, 'i') };
        }

        const mascotas = await Pet.find(filtro);
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

// 2. GET: Obtener una sola mascota por ID
const getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const mascota = await Pet.findById(id);

        if (!mascota) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }
        res.status(200).json(mascota);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

// 3. POST: Registrar una nueva mascota
const createPet = async (req, res) => {
    try {
        const nuevaMascota = new Pet({
            name: req.body.nombre,
            species: req.body.especie,
            breed: req.body.raza,
            age: req.body.edad,
            description: req.body.descripcion,
            status: req.body.estado || 'Disponible'
        });

        const mascotaGuardada = await nuevaMascota.save();
        res.status(201).json({ message: 'Mascota registrada en MongoDB', data: mascotaGuardada });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 4. POST: Formulario de adopción
const createAdoption = async (req, res) => {
    try {
        const { nombreAdoptante, correo, mascotaId, edadAdoptante, telefono, motivos } = req.body;

        if (!nombreAdoptante || !correo || !mascotaId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Faltan campos obligatorios (nombreAdoptante, correo o mascotaId).'
            });
        }

        const mascota = await Pet.findById(mascotaId);
        if (!mascota) {
            return res.status(404).json({ error: 'Not Found', message: 'La mascota especificada no existe.' });
        }

        const nuevaSolicitud = new AdoptionRequest({
            pet: mascotaId,
            applicantName: nombreAdoptante,
            applicantAge: edadAdoptante || 18,
            email: correo,
            phone: telefono || 'Sin teléfono',
            reasons: motivos || 'Sin motivos especificados'
        });

        const solicitudGuardada = await nuevaSolicitud.save();

        mascota.status = 'En Proceso';
        await mascota.save();

        res.status(201).json({
            message: '¡Solicitud de adopción procesada con éxito!',
            data: solicitudGuardada
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 5. POST: Línea de tiempo / Seguimiento
const addPetTracking = async (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;
    res.status(201).json({ message: 'Seguimiento añadido', petId: id, comentario });
};

// 6. PUT: Actualización TOTAL de una mascota
const updatePetFull = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = {
            name: req.body.nombre,
            species: req.body.especie,
            breed: req.body.raza,
            age: req.body.edad,
            description: req.body.descripcion,
            status: req.body.estado
        };

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true });

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `Mascota ${id} actualizada correctamente.`,
            data: mascotaActualizada
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 7. PATCH: Actualización PARCIAL (solo estado)
const updatePetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, { status: estado }, { new: true, runValidators: true });

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `Estado de mascota ${id} cambiado a ${estado}.`,
            data: mascotaActualizada,
            fecha: new Date()
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 8. DELETE: Eliminación del sistema
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const mascotaEliminada = await Pet.findByIdAndDelete(id);

        if (!mascotaEliminada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `Mascota ${id} eliminada correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

module.exports = {
    getPets,
    getPetById,
    createPet,
    createAdoption,
    addPetTracking,
    updatePetFull,
    updatePetStatus,
    deletePet
};