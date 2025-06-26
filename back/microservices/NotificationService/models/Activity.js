import mongoose from 'mongoose';

const ActivitiesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'rooms' },
  exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

//updatedat autom'atico
ActivitiesSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Activity = mongoose.model('Activities', ActivitiesSchema);

export default Activity;
