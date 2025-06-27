import {
  createNotification,
  getNotificationsForUser,
  markAsRead
} from '../services/notificationService.js';

export const createNotificationController = async (req, res) => {
  try {
    const notification = await createNotification(req.body);
    res.status(201).json({ message: '📨 Notificación creada', notification });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await getNotificationsForUser(userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};


export const markAsReadController = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.json({ message: '✅ Notificación marcada como leída', notification });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
};
