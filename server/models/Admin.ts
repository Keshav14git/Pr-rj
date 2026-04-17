import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    mpinHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.matchMPIN = async function (enteredMPIN: string) {
  return await bcrypt.compare(enteredMPIN, this.mpinHash);
};

// Compile model from schema
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
