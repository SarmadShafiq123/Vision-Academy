import express from 'express';
import cors from 'cors';
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
import cookieParser from 'cookie-parser';
import authRoutes from './features/auth/auth.routes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
