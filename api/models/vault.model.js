import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entries: [{
    name: String,
    type: {
      type: String,
      enum: ['password', 'seed'],
      default: 'password'
    },
    value: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const Vault = mongoose.model('Vault', vaultSchema);
export default Vault;