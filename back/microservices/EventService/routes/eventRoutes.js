// event-service/routes/eventRoutes.js

import express from 'express';
import Event from '../models/Event.js'; 
const router = express.Router();
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
// Aquí importarías tu middleware de autenticación/autorización cuando lo tengas
// const authMiddleware = require('../middleware/authMiddleware');

// GET /events - Obtener todos los eventos
router.get('/', authMiddleware, roleMiddleware(['asistente', 'organizador']), async (req, res) => {
  try {
    // Puedes añadir lógica para filtrar por estado, por ejemplo:
    const { estado } = req.query; // Si la URL es /events?estado=activo
    const query = estado ? { estado } : {};

    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /events/:id - Obtener detalles de un evento específico
router.get('/:id', authMiddleware, roleMiddleware(['organizador']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(event);
  } catch (err) {
    // Es importante manejar el error cuando el ID no tiene un formato válido para MongoDB
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID de evento inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});

// POST /events - Crear un nuevo evento
// Aquí iría el authMiddleware con los roles necesarios
router.post('/', authMiddleware, roleMiddleware(['organizador']), async (req, res) => { // , authMiddleware.authorize(['organizador', 'administrador'])
    console.log('Cuerpo de la petición recibido:', req.body); // <-- Añade esta línea
  try {
    const event = new Event({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      fechaInicio: req.body.fechaInicio,
      fechaFin: req.body.fechaFin,
      ubicacion: req.body.ubicacion,
      capacidad: req.body.capacidad,
      // estado es 'planificacion' por defecto, organizadorId vendría del JWT después
      organizadorId: req.body.organizadorId // Temporalmente, luego se extraerá del JWT
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request si hay errores de validación
  }
});

// PUT /events/:id - Actualizar un evento
// Aquí iría el authMiddleware con los roles necesarios (organizadores, administradores)
router.put('/:id', authMiddleware, roleMiddleware(['organizador']), async (req, res) => { // , authMiddleware.authorize(['organizador', 'administrador'])
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    // Lógica para verificar que el usuario autenticado sea el organizador o un administrador
    // if (req.user.role === 'organizador' && event.organizadorId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'No autorizado para actualizar este evento' });
    // }

    // Actualiza solo los campos permitidos o enviados
    // Mongoose aplicará las validaciones del esquema (ej. 'required', 'enum')
    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    // Errores de validación de Mongoose, por ejemplo
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    // Para IDs inválidos
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID de evento inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /events/:id - Eliminar un evento
// Aquí iría el authMiddleware con los roles necesarios (organizadores, administradores)
router.delete('/:id', authMiddleware, roleMiddleware(['organizador']), async (req, res) => { // , authMiddleware.authorize(['organizador', 'administrador'])
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    // Lógica para verificar que el usuario autenticado sea el organizador o un administrador
    // if (req.user.role === 'organizador' && event.organizadorId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'No autorizado para eliminar este evento' });
    // }

    await Event.deleteOne({ _id: req.params.id }); // Correcto para Mongoose 6+
    res.json({ message: 'Evento eliminado' }); // Puedes devolver un 204 No Content para DELETE exitoso sin cuerpo
  } catch (err) {
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID de evento inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});


export default router;