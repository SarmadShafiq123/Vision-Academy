import mongoose from 'mongoose';

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Throws on failure so the server does not start in a broken state.
 */
export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected:', mongoose.connection.host);
}
