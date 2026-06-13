// controllers/pet.controller.js
const Pet = require('../models/pet.model');
const AdoptionRequest = require('../models/adoptionRequest.model');

// Helper: traduce status del schema al enum del frontend
function mapearEstado(status) {
    switch (status) {
        case 'Disponible': return 'DISPONIBLE';
        case 'En Proceso': return 'EN PROCESO';
        case 'Adoptado': return 'ADOPTADO';
        case 'Perdido': return 'PERDIDO';
        default: return 'DISPONIBLE';
    }
}

// Helper: traduce estado del frontend al status del schema
function mapearStatus(estado) {
    switch (estado) {
        case 'DISPONIBLE': return 'Disponible';
        case 'EN_PROCESO': return 'En Proceso';
        case 'ADOPTADO': return 'Adoptado';
        case 'PERDIDO': return 'Perdido';
        default: return 'Disponible';
    }
}

// Helper: formatea un documento Pet al formato que espera el frontend
function formatearMascota(p) {
    return {
        _id: p._id,
        id: p._id,
        nombre: p.name,
        especie: p.species,
        edad: p.age?.toString(),
        estado: mapearEstado(p.status),
        fotoUrl: p.fotoUrl || 'https://placedog.net/300/200', // ✅ foto real con fallback
        comentarios: []
    };
}

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
        res.status(200).json(mascotas.map(formatearMascota));
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

        res.status(200).json(formatearMascota(mascota));
    } catch (error) {
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

// 3. POST: Registrar una nueva mascota
const createPet = async (req, res) => {
    try {
        const nuevaMascota = new Pet({
            name: req.body.nombre || req.body.name,
            species: req.body.especie || req.body.species,
            breed: req.body.raza || req.body.breed || 'Mestizo',
            age: parseInt(req.body.edad || req.body.age) || 1,
            description: req.body.descripcion || req.body.historia || req.body.description || '',
            fotoUrl: req.body.fotoUrl || '',  // ✅ guardar foto
            status: mapearStatus(req.body.estado) || 'Disponible'
        });

        const guardada = await nuevaMascota.save();
        res.status(201).json({
            message: 'Mascota registrada en MongoDB',
            data: formatearMascota(guardada)
        });
    } catch (error) {
        res.status(400).json({ error: 'Bad Request', message: error.message });
    }
};

// 4. POST: Formulario de adopción
const createAdoption = async (req, res) => {
    try {
        const {
            nombreAdoptante, nombreSolicitante,  // ✅ acepta ambos
            correo, emailContacto,               // ✅ acepta ambos
            mascotaId,
            edadAdoptante, edadSolicitante,      // ✅ acepta ambos
            telefono, telefonoContacto,          // ✅ acepta ambos
            motivos, descripcionMotivos          // ✅ acepta ambos
        } = req.body;

        const nombre = nombreAdoptante || nombreSolicitante;
        const email = correo || emailContacto;
        const edad = edadAdoptante || edadSolicitante;
        const tel = telefono || telefonoContacto;
        const razon = motivos || descripcionMotivos;

        if (!nombre || !email) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Faltan campos obligatorios (nombre o correo).'
            });
        }

        // Si no viene mascotaId, buscar por nombre
        let idMascota = mascotaId;
        if (!idMascota && req.body.nombreMascota) {
            const mascotaEncontrada = await Pet.findOne({ name: req.body.nombreMascota });
            if (mascotaEncontrada) idMascota = mascotaEncontrada._id;
        }

        if (!idMascota) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'No se encontró la mascota especificada.'
            });
        }

        const mascota = await Pet.findById(idMascota);
        if (!mascota) {
            return res.status(404).json({ error: 'Not Found', message: 'La mascota no existe.' });
        }

        const nuevaSolicitud = new AdoptionRequest({
            pet: idMascota,
            applicantName: nombre,
            applicantAge: edad || 18,
            email: email,
            phone: tel || 'Sin teléfono',
            reasons: razon || 'Sin motivos especificados'
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


// 4b. POST: Reporte de mascota extraviada
const createLostReport = async (req, res) => {
    try {
        const { nombreSolicitante, emailContacto, telefonoContacto,
            edadSolicitante, direccionDomicilio, nombreMascota,
            urlFotoMascota, descripcionMotivos, mensajeAdicional,
            especieMascota } = req.body; // ✅ recibir especie

        if (!nombreSolicitante || !emailContacto || !nombreMascota) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Faltan campos obligatorios (nombreSolicitante, emailContacto o nombreMascota).'
            });
        }

        const mascotaExtraviada = new Pet({
            name: nombreMascota,
            species: especieMascota || 'Desconocida', // ✅ usar especie recibida
            breed: 'Mestizo',
            age: 0,
            description: descripcionMotivos || '',
            fotoUrl: urlFotoMascota || '',
            status: 'Perdido' // ✅ status correcto
        });

        const guardada = await mascotaExtraviada.save();
        res.status(201).json({
            message: '¡Reporte de mascota extraviada guardado con éxito!',
            data: formatearMascota(guardada)
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
            status: mapearStatus(req.body.estado)
        };

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true });

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `Mascota ${id} actualizada correctamente.`,
            data: formatearMascota(mascotaActualizada)
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

        const mascotaActualizada = await Pet.findByIdAndUpdate(
            id,
            { status: mapearStatus(estado) },
            { new: true, runValidators: true }
        );

        if (!mascotaActualizada) {
            return res.status(404).json({ error: 'Not Found', message: 'Mascota no encontrada' });
        }

        res.status(200).json({
            message: `Estado de mascota ${id} cambiado a ${estado}.`,
            data: formatearMascota(mascotaActualizada),
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

        res.status(200).json({ message: `Mascota ${id} eliminada correctamente.` });
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