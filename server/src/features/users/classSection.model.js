import mongoose from 'mongoose';

const classSectionSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    section:         { type: String, required: true, trim: true },
    academicSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
  },
  { timestamps: true },
);

export const ClassSection = mongoose.model('ClassSection', classSectionSchema);
