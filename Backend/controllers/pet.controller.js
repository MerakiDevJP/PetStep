// controllers/pet.controller.js

// 1. GET: Obtener todas las mascotas (Para la Galería del Dev 3)
// controllers/pet.controller.js

const getPets = (req, res) => {
    // Capturamos los query params de la Request (Ej: /api/pets?especie=Gecko)
    const { especie } = req.query; 

    console.log(`Request recibida. Buscando mascotas de especie: ${especie || 'Todas'}`);

    const baseMascotas = [
        { id: 1, nombre: 'Gunter', especie: 'Gecko', estado: 'DISPONIBLE' },
        { id: 2, nombre: 'Chimuelo', especie: 'Ajolote', estado: 'EN_PROCESO' }
    ];

    // Lógica interna basada en la Request
    if (especie) {
        const filtradas = baseMascotas.filter(m => m.especie.toLowerCase() === especie.toLowerCase());
        // Se envía una Response exitosa (200) con los datos filtrados
        return res.status(200).json(filtradas);
    }

    // Response por defecto si no hay filtros
    res.status(200).json(baseMascotas);
};

// 2. GET: Obtener una sola mascota por su ID (Para la vista de detalle)
const getPetById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ id, nombre: 'Gunter', especie: 'Gecko', estado: 'DISPONIBLE' });
};

// 3. POST: Registrar una nueva mascota en el refugio
const createPet = (req, res) => {
    const nuevaMascota = req.body;
    res.status(201).json({ message: 'Mascota registrada', data: nuevaMascota });
};

// 4. POST: Crear una solicitud de adopción (Para el Formulario Reactivo del Dev 2)
const createAdoption = (req, res) => {
    // Se capturam el cuerpo de la Request enviado desde el Formulario Reactivo
    const { nombreAdoptante, correo, mascotaId } = req.body;

    // Validación de la Request: Si faltan campos obligatorios
    if (!nombreAdoptante || !correo || !mascotaId) {
        // Se devuelve una Response con código 400 (Error del cliente)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Faltan campos obligatorios en la petición (nombreAdoptante, correo o mascotaId).'
        });
    }

    // Si todo está bien, se procesa y devuelve un código 201 (Creado)
    res.status(201).json({
        message: '¡Solicitud de adopción procesada con éxito!',
        data: { nombreAdoptante, correo, mascotaId, fechaRegistro: new Date() }
    });
};

// 5. PATCH: Actualizar SOLO el estado (Evita transiciones inválidas - Dev 1)
const updatePetStatus = (req, res) => {
    const { id } = req.params;
    const { nuevoEstado } = req.body; // Ejemplo: 'EN_PROCESO' o 'ADOPTADO'
    
    // Aquí irá la máquina de estados lógica que planeamos. Por ahora simulamos:
    res.status(200).json({
        message: `Estado de la mascota ${id} actualizado con éxito a: ${nuevoEstado}`,
        auditoria: { cambiadoPor: 'Admin_Refugio', fecha: new Date() }
    });
};

// 6. POST: Añadir comentarios/fotos de seguimiento post-adopción (SRP - Dev 3)
const addPetTracking = (req, res) => {
    const { id } = req.params;
    const { comentario, fotoUrl } = req.body;
    res.status(201).json({
        message: `Seguimiento añadido a la línea de tiempo de la mascota ${id}`,
        data: { comentario, fotoUrl, fecha: new Date() }
    });
};

module.exports = {
    getPets,
    getPetById,
    createPet,
    createAdoption,
    updatePetStatus,
    addPetTracking
};