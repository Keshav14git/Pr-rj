import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protectAdmin } from '../middleware/authMiddleware.js';
import Experience from '../models/Experience.js';

const router = express.Router();

// ----------------------------------------------------------------------
// CLOUDINARY CONFIG (lazy — ensures dotenv has loaded)
// ----------------------------------------------------------------------
let cloudinaryConfigured = false;
function ensureCloudinary() {
    if (!cloudinaryConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
            api_key: process.env.CLOUDINARY_API_KEY || '',
            api_secret: process.env.CLOUDINARY_API_SECRET || '',
        });
        console.log('[Cloudinary] Configured with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
        cloudinaryConfigured = true;
    }
}

// Use memory storage — we manually stream to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ----------------------------------------------------------------------
// EXPERIENCE API ENDPOINTS
// ----------------------------------------------------------------------

// @route   GET /api/portfolio/experiences
// @desc    Get all experiences (sorted by `order`) for public site & admin
// @access  Public
router.get('/experiences', async (req, res) => {
    try {
        const exps = await Experience.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: exps });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/portfolio/experiences
// @desc    Create a new experience company timeline node
// @access  Private/Admin
router.post('/experiences', protectAdmin, async (req, res) => {
    try {
        const count = await Experience.countDocuments();
        
        const newExp = await Experience.create({
            ...req.body,
            order: req.body.order !== undefined ? req.body.order : count
        });

        res.status(201).json({ success: true, data: newExp });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/portfolio/experiences/reorder
// @desc    Bulk update the 'order' field for multiple experiences after drag-and-drop
// @access  Private/Admin
router.put('/experiences/reorder', protectAdmin, async (req, res) => {
    // Expects: { items: [{ _id: '...', order: 0 }, { _id: '...', order: 1 }] }
    try {
        const { items } = req.body;
        
        // Bulk write for optimal performance
        const bulkOps = items.map((item: { _id: string, order: number }) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $set: { order: item.order } }
            }
        }));

        await Experience.bulkWrite(bulkOps);

        const updated = await Experience.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/portfolio/experiences/:id
// @desc    Update a specific experience node (nested projects included)
// @access  Private/Admin
router.put('/experiences/:id', protectAdmin, async (req, res) => {
    try {
        const exp = await Experience.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
        
        res.status(200).json({ success: true, data: exp });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/portfolio/experiences/:id
// @desc    Delete a specific experience node
// @access  Private/Admin
router.delete('/experiences/:id', protectAdmin, async (req, res) => {
    try {
        const exp = await Experience.findByIdAndDelete(req.params.id);
        if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
        
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------------------------------------------------
// CLOUD ASSET VAULT
// ----------------------------------------------------------------------

// @route   POST /api/portfolio/upload
// @desc    Upload an image to Cloudinary and return the secure URL
// @access  Private/Admin
router.post('/upload', protectAdmin, upload.single('image'), async (req, res) => {
    try {
        ensureCloudinary();

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Stream the buffer directly to Cloudinary
        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'portfolio_assets',
                    public_id: `proj_${Date.now()}_${Math.round(Math.random() * 1000)}`,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file!.buffer);
        });

        res.status(200).json({
            success: true,
            url: result.secure_url
        });
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Cloud Upload Failed' });
    }
});

// ----------------------------------------------------------------------
// ADMIN DASHBOARD STATS
// ----------------------------------------------------------------------

import Conversation from '../models/Conversation.js';

// @route   GET /api/portfolio/stats
// @desc    Get aggregated stats for Admin Dashboard
// @access  Private/Admin
router.get('/stats', protectAdmin, async (req, res) => {
    try {
        const exps = await Experience.find();
        let totalProjects = 0;
        exps.forEach(exp => {
            if (exp.projects) totalProjects += exp.projects.length;
        });

        const unreadEmails = await Conversation.countDocuments({ isRead: false });
        const sectionCount = await Section.countDocuments();

        res.status(200).json({ 
            success: true, 
            stats: {
                totalProjects,
                unreadEmails,
                totalExperiences: exps.length,
                totalSections: sectionCount
            } 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------------------------------------------------
// DYNAMIC SECTION BUILDER
// ----------------------------------------------------------------------

import Section from '../models/Section.js';

// @route   GET /api/portfolio/sections
// @desc    Get all dynamic sections
// @access  Public
router.get('/sections', async (req, res) => {
    try {
        const sections = await Section.find().sort({ placementIndex: 1 });
        res.status(200).json({ success: true, data: sections });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/portfolio/sections
// @desc    Create a new dynamic section
// @access  Private/Admin
router.post('/sections', protectAdmin, async (req, res) => {
    try {
        // Find highest placement if not provided
        if (req.body.placementIndex === undefined) {
             const highest = await Section.findOne().sort({ placementIndex: -1 });
             req.body.placementIndex = highest ? highest.placementIndex + 1 : 0;
        }

        const newSection = await Section.create(req.body);
        res.status(201).json({ success: true, data: newSection });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/portfolio/sections/:id
// @desc    Update a dynamic section
// @access  Private/Admin
router.put('/sections/:id', protectAdmin, async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        
        res.status(200).json({ success: true, data: section });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/portfolio/sections/:id
// @desc    Delete a dynamic section
// @access  Private/Admin
router.delete('/sections/:id', protectAdmin, async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
