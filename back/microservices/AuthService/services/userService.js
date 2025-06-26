import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const registerUser = async ({ email, username, password, roleName }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: 'El usuario ya existe' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = await Role.findOne({ name: roleName }) || null;

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    role: role?._id
  });

  return await newUser.save();
};
