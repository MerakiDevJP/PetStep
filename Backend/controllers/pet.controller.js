// controllers/pet.controller.js
const Pet = require('../models/pet.model');
const AdoptionRequest = require('../models/adoptionRequest.model');

// 1. GET: Obtener mascotas con o sin filtro de especie
const getPets = async (req, res) => {
    try {
        const { especie } = req.query;
        let filtro = {};
        
        // Mantener el filtro si existe
        if (especie) {
            filtro.especie = { $regex: new RegExp(especie, 'i') };
        }

        const mascotas = await Pet.find(filtro);

        const mascotasConImagen = mascotas.map(mascota => {
            const m = mascota.toObject();
            // URL de imagen directa
            m.fotoUrl = m.fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500';
            return m;
        });

        res.status(200).json(mascotasConImagen);
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

// 3. POST: Registrar una nueva mascota desde el catálogo
const createPet = async (req, res) => {
    try {
        const nuevaMascota = new Pet({
            nombre: req.body.nombre,
            especie: req.body.especie,
            estado: req.body.estado || 'DISPONIBLE',
            fotoUrl: req.body.fotoUrl,
            descripcion: req.body.descripcion || req.body.historia || req.body.history,
            salud: req.body.salud,
            temperamento: req.body.temperamento,
            comentarios: req.body.comentarios || []
        });

        const mascotaGuardada = await nuevaMascota.save();
        res.status(201).json({ message: 'Mascota registrada en MongoDB', data: mascotaGuardada });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 4. POST: Procesar exclusivamente Solicitudes de Adopción tradicional
const createAdoption = async (req, res) => {
    try {
        const { fullName, email, petId, petName } = req.body;
        console.log("Datos recibidos:", { fullName, email, petId, petName });

        let mascota;
        // Búsqueda inteligente
        if (petId) {
            mascota = await Pet.findById(petId);
        } else if (petName) {
            // Buscamos por nombre si no hay ID
            mascota = await Pet.findOne({ nombre: petName });
        }

        if (!mascota) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        // ... resto de tu código de guardado ...

        res.status(201).json({ message: 'Éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4b. POST: Nuevo Módulo exclusivo para registrar Mascotas Extraviadas (Versión Dinámica Integrada)
const createLostReport = async (req, res) => {
    try {
        const { petName, petDescription, fullName, phone, address, message, fotoUrl } = req.body;

        if (!petName || !fullName) {
            return res.status(400).json({ error: 'Bad Request', message: 'El nombre de la mascota y del informante son obligatorios.' });
        }

        console.log(`Procesando reporte de mascota extraviada: ${petName}`);

        const mascotaExtraviada = new Pet({
            nombre: petName,
            especie: 'Perro',
            estado: 'EXTRAVIADO',
            // Usa fotoUrl si viene en el body, de lo contrario aplica el placeholder real de internet
            fotoUrl: fotoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500',
            descripcion: petDescription || 'No especificada',
            salud: 'Desconocido (Reporte de extravío)',
            temperamento: 'Desconocido',
            comentarios: [{
                autor: fullName,
                texto: `Reportado como extraviado en: ${address}. Nota: ${message || 'Sin observaciones'}. Teléfono de contacto: ${phone}`,
                fecha: new Date()
            }]
        });

        const guardada = await mascotaExtraviada.save();
        res.status(201).json({
            message: '¡Reporte de mascota extraviada guardada con éxito en MongoDB!',
            data: guardada
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
            nombre: req.body.nombre,
            especie: req.body.especie,
            estado: req.body.estado,
            fotoUrl: req.body.fotoUrl,
            descripcion: req.body.descripcion || req.body.historia,
            salud: req.body.salud,
            temperamento: req.body.temperamento,
            comentarios: req.body.comentarios
        };

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true });

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `PUT - Perfil de la mascota ${id} actualizado por completo en MongoDB.`,
            data: mascotaActualizada
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 7. PATCH: Actualización PARCIAL (Solo el estado)
const updatePetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, { estado: estado }, { new: true, runValidators: true });

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `PATCH - Estado de la mascota ${id} cambiado a ${estado}.`,
            data: mascotaActualizada,
            fecha: new Date()
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 8. DELETE: Eliminación de la base de datos
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const mascotaEliminada = await Pet.findByIdAndDelete(id);

        if (!mascotaEliminada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `DELETE - Mascota con ID ${id} eliminada correctamente de MongoDB.`
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
    createLostReport,
    addPetTracking,
    updatePetFull,
    updatePetStatus,
    deletePet
};