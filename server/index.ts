import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import fs from 'fs';
import Experience from './models/Experience.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB and Auto-Seed Legacy Data if Database is empty
connectDB().then(async () => {
    try {
        const count = await Experience.countDocuments();
        if (count === 0) {
            console.log("[CMS] Database is empty. Auto-seeding from legacy experience.json...");
            const dataPath = path.join(__dirname, '../client/src/data/experience.json');
            if (fs.existsSync(dataPath)) {
                const legacyData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                const seedData = legacyData.map((exp: any, index: number) => ({
                    company: exp.company,
                    role: exp.role,
                    duration: exp.duration,
                    location: exp.location,
                    responsibilities: exp.responsibilities,
                    projects: exp.projects,
                    order: index
                }));
                await Experience.insertMany(seedData);
                console.log("[CMS] Successfully restored original 7 timeline nodes into MongoDB.");
            }
        }
    } catch (error) {
        console.error("[CMS] Seeding failed:", error);
    }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Authentication Route
app.use('/api/auth', authRoutes);


// Protected Portfolio Cloud Asset Vault & S-Curve CMS Routes
app.use('/api/portfolio', portfolioRoutes);

// Expose static uploads for attachments
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
