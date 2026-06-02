// controllers/pet.controller.js

// 1. GET: Obtener todas las mascotas (Para la Galería del Dev 3)
const getPets = (req, res) => {
    const mascotasPrueba = [
        { id: 1, nombre: 'Gunter', especie: 'Gecko', estado: 'DISPONIBLE', edad: 2 },
        { id: 2, nombre: 'Chimuelo', especie: 'Ajolote', estado: 'EN_PROCESO', edad: 1 }
    ];
    res.status(200).json(mascotasPrueba);
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
    const nuevaSolicitud = req.body;
    res.status(201).json({ message: 'Solicitud de adopción recibida', data: nuevaSolicitud });
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