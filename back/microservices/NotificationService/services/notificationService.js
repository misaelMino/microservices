import Notification from '../models/Notification.js';

export const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

export const getNotificationsForUser = async (userId) => {
  return await Notification.find({
    $or: [
      { recipientUserId: userId },
      { recipientUserId: null } // global
    ]
  }).sort({ createdAt: -1 });
};

export const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};
