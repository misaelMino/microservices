import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  password: String, // Hasheado
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' }, // Referencia
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
