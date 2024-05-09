import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  toWatch: [{ type: String }],
  watched: { type: Map, of: Number }
});

const User = mongoose.model('User', userSchema);

export default User;