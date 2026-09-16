import 'dotenv/config';
import app from './app.js';
import { connectDB } from './shared/config/db.js';

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`LMS server running on port ${PORT}`);
});
