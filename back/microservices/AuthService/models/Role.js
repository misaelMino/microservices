import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true } // 'asistente', 'organizador', etc.
});

const Role = mongoose.model('Role', RoleSchema);
export default Role;
