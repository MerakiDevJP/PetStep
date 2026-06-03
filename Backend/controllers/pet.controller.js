// controllers/pet.controller.js

// === ENDPOINTS EN FUNCIONAMIENTO (GET / POST) ===

// 1. GET: Obtener mascotas con o sin filtro de especie
const getPets = (req, res) => {
    const { especie } = req.query; 
    console.log(`Request recibida. Buscando mascotas de especie: ${especie || 'Todas'}`);

    const baseMascotas = [
        { id: 1, nombre: 'Gunter', especie: 'Gecko', estado: 'DISPONIBLE' },
        { id: 2, nombre: 'Chimuelo', especie: 'Ajolote', estado: 'EN_PROCESO' }
    ];

    if (especie) {
        const filtradas = baseMascotas.filter(m => m.especie.toLowerCase() === especie.toLowerCase());
        return res.status(200).json(filtradas);
    }
    res.status(200).json(baseMascotas);
};

// 2. GET: Obtener una sola mascota por ID
const getPetById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ id, nombre: 'Gunter', especie: 'Gecko', estado: 'DISPONIBLE' });
};

// 3. POST: Registrar una nueva mascota
const createPet = (req, res) => {
    const nuevaMascota = req.body;
    res.status(201).json({ message: 'Mascota registrada', data: nuevaMascota });
};

// 4. POST: Formulario de adopción con las validaciones que vimos
const createAdoption = (req, res) => {
    const { nombreAdoptante, correo, mascotaId } = req.body;

    if (!nombreAdoptante || !correo || !mascotaId) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Faltan campos obligatorios en la petición.'
        });
    }

    res.status(201).json({
        message: '¡Solicitud de adopción procesada con éxito!',
        data: { nombreAdoptante, correo, mascotaId, fechaRegistro: new Date() }
    });
};

// 5. POST: Línea de tiempo / Seguimiento
const addPetTracking = (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;
    res.status(201).json({ message: 'Seguimiento añadido', petId: id, comentario });
};


// 6. PUT: Actualización TOTAL de una mascota
const updatePetFull = (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body; 
    res.status(200).json({
        message: `PUT - Perfil de la mascota ${id} actualizado por completo.`,
        data: datosActualizados
    });
};

// 7. PATCH: Actualización PARCIAL (Solo el estado)
const updatePetStatus = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; 
    res.status(200).json({
        message: `PATCH - Estado de la mascota ${id} cambiado a ${estado}.`,
        fecha: new Date()
    });
};

// 8. DELETE: Eliminación del sistema
const deletePet = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        message: `DELETE - Mascota con ID ${id} eliminada correctamente.`
    });
};

// Exportar los métodos
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