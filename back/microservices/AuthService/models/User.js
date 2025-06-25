import mongoose from 'mongoose';

const TOTPSecretSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  appName: { type: String, required: true },
  secret: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

//updatedat autom'atico
TOTPSecretSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TOTPSecret = mongoose.model('TOTPSecret', TOTPSecretSchema);
export default TOTPSecret;
