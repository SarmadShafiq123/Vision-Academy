import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './shared/config/db.js';

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`LMS server running on port ${PORT}`);
});
