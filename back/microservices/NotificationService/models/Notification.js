import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null }, // null = global
  type: { type: String, enum: ['global', 'reminder', 'alert'], required: true },
  relatedActivityId: { type: mongoose.Schema.Types.ObjectId, ref: 'activities', default: null },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
