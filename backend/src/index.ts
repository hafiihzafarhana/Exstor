import express, { Express } from 'express';

import { cloudinaryConfig } from './config';
import { Server } from './server';
import { dbCon } from './db';

// Setup Cloudinary langsung
cloudinaryConfig();

// Inisialisasi instance express dan server langsung
const app: Express = express();
const server: Server = new Server(app);

// Periksa koneksi database langsung
dbCon();

// Mulai server langsung
server.starting();

export default app;
