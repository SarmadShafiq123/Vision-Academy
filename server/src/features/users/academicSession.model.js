import mongoose from 'mongoose';

const academicSessionSchema = new mongoose.Schema(
  {
    year:      { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    isActive:  { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);
