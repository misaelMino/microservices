// registration-service/routes/registrationRoutes.js

import express from'express';
const router = express.Router();
import Registration from '../models/Registration.js';
import qrcode from 'qrcode'; // Importar la librería qrcode
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos para el QR (npm install uuid)
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
// IMPORTANTE: Cuando tengas el Auth Service listo, aquí irían los middlewares
// const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Función auxiliar para generar un dato único para el QR
// Podría ser el _id de la inscripción una vez guardada, o un UUID
const generateUniqueQRCodeData = () => {
  return uuidv4(); // Genera un ID universal único
};

// --- POST /api/v1/registrations - Inscribir un participante a un evento ---
// Requiere rol de asistente (cuando se implemente la seguridad)
router.post('/', authMiddleware, roleMiddleware(['asistente']), async (req, res) => {
  try {
    // Cuando integres la seguridad, 'participanteId' vendrá del JWT:
    // const participanteId = req.user.id;
    // Por ahora, lo tomamos del body para pruebas:
    const { eventoId, tipoInscripcion, tarifa, participanteId } = req.body;

    if (!participanteId || !eventoId || tarifa === undefined) {
      return res.status(400).json({ message: 'Campos requeridos: participanteId, eventoId, tarifa' });
    }

    // Generar un dato único para el QR
    const qrData = generateUniqueQRCodeData();

    const registration = new Registration({
      participanteId,
      eventoId,
      tipoInscripcion: tipoInscripcion || 'regular', // Si no se especifica, usa 'regular'
      tarifa,
      codigoQR: qrData, // Almacenamos el dato original que representará el QR
      estado: 'pendiente' // Estado inicial de la inscripción
    });

    const newRegistration = await registration.save();

    // Generar la imagen del QR en formato base64 para devolverla en la respuesta
    const qrCodeImageBase64 = await qrcode.toDataURL(qrData);

    res.status(201).json({
      message: 'Inscripción creada exitosamente',
      registration: newRegistration,
      qrCodeImage: qrCodeImageBase64 // Imagen base64 para mostrar o incrustar
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- GET /api/v1/registrations/my - Obtener las inscripciones del usuario actual ---
// Requiere autenticación (cuando se implemente la seguridad)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    // Cuando integres la seguridad, 'participanteId' vendrá del JWT:
    // const participanteId = req.user.id;
    // Por ahora, lo tomamos de un query param para pruebas:
    const participanteId = req.query.participanteId;

    if (!participanteId) {
      return res.status(400).json({ message: 'participanteId es requerido como query parameter para esta prueba.' });
    }

    const myRegistrations = await Registration.find({ participanteId });
    res.json(myRegistrations);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de participante inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- GET /api/v1/registrations/events/:eventId/registrations - Obtener todas las inscripciones para un evento ---
// Requiere rol de organizador o administrador (cuando se implemente la seguridad)
router.get('/events/:eventId/registrations', roleMiddleware(['organizador']), authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ eventoId: eventId });

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron inscripciones para este evento.' });
    }
    res.json(registrations);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de evento inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- PUT /api/v1/registrations/:id/status - Actualizar el estado de una inscripción ---
// Requiere rol de organizador o administrador (cuando se implemente la seguridad)
router.put('/:id/status', roleMiddleware(['asistente', 'organizador']), authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pendiente', 'confirmado', 'cancelado'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Debe ser uno de: ${allowedStatuses.join(', ')}` });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    registration.estado = status;
    const updatedRegistration = await registration.save();
    res.json(updatedRegistration);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de inscripción inválido' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- GET /api/v1/registrations/:id/qr - Obtener el código QR de una inscripción ---
router.get('/:id/qr', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    // Generar la imagen del QR en base64 usando el dato 'codigoQR' almacenado
    const qrCodeImageBase64 = await qrcode.toDataURL(registration.codigoQR);

    res.json({
      qrCodeData: registration.codigoQR, // El dato original que representa el QR
      qrCodeImage: qrCodeImageBase64 // La imagen base64 del QR
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de inscripción inválido' });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;