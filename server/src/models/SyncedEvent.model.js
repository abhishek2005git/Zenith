import mongoose from 'mongoose';

const SyncedEventSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  launchId: { 
    type: String, 
    required: true 
  },
  googleEventId: { 
    type: String, 
    required: true 
  },
  lastKnownNet: { 
    type: Date, 
    required: true 
  }
}, { timestamps: true });

// Ensure a user can't sync the same launch twice
SyncedEventSchema.index({ userId: 1, launchId: 1 }, { unique: true });

export default mongoose.model('SyncedEvent', SyncedEventSchema);