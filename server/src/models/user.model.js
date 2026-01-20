import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  displayName: { 
    type: String, 
    required: true 
  },
  firstName: String,
  lastName: String,
  image: String,
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  favorites: { type: [String], default: [] } 
}, { timestamps: true });

export default mongoose.model('User', UserSchema);