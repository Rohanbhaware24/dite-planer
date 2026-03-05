import mongoose from 'mongoose';

const progressEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      thigh: Number,
      arm: Number,
    },
    notes: String,
    photoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.ProgressEntry || mongoose.model('ProgressEntry', progressEntrySchema);
