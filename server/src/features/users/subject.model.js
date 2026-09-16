import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    classSection: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSection', required: true },
  },
  { timestamps: true },
);

export const Subject = mongoose.model('Subject', subjectSchema);
