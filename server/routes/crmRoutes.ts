import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protectAdmin } from '../middleware/authMiddleware.js';
import Conversation from '../models/Conversation.js';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config for attachments
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// @route   GET /api/crm/conversations
// @desc    Get all conversations (threaded inbox)
// @access  Private/Admin
router.get('/conversations', protectAdmin, async (_req, res) => {
    try {
        const conversations = await Conversation.find({})
            .sort({ lastMessageAt: -1 })
            .select('contactName contactEmail lastMessageAt unreadCount status messages');
        
        // Return conversations with just a preview of the last message
        const previews = conversations.map(c => {
            const lastMsg = c.messages[c.messages.length - 1];
            return {
                _id: c._id,
                contactName: c.contactName,
                contactEmail: c.contactEmail,
                lastMessageAt: c.lastMessageAt,
                unreadCount: c.unreadCount,
                status: c.status,
                messageCount: c.messages.length,
                lastMessagePreview: lastMsg ? lastMsg.body.substring(0, 100) : '',
                lastMessageDirection: lastMsg ? lastMsg.direction : 'inbound'
            };
        });

        res.status(200).json({ success: true, data: previews });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/crm/conversations/:id
// @desc    Get a single conversation with full message thread
// @access  Private/Admin
router.get('/conversations/:id', protectAdmin, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Mark as read
        conversation.unreadCount = 0;
        await conversation.save();

        res.status(200).json({ success: true, data: conversation });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/crm/conversations/:id/reply
// @desc    Send a reply with optional attachments
// @access  Private/Admin
router.post('/conversations/:id/reply', protectAdmin, upload.array('attachments', 5), async (req, res) => {
    const { text, subject } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Build attachment metadata for DB
        const attachmentDocs = (files || []).map(f => ({
            filename: f.filename,
            originalName: f.originalname,
            mimetype: f.mimetype,
            size: f.size,
            path: `/uploads/${f.filename}`
        }));

        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Build nodemailer attachments
        const emailAttachments = (files || []).map(f => ({
            filename: f.originalname,
            path: f.path
        }));

        const replySubject = subject || `Re: Your Inquiry — Rohit Jangra`;

        await transporter.sendMail({
            from: `"Rohit Jangra" <${process.env.EMAIL_USER}>`,
            replyTo: process.env.EMAIL_USER,
            to: conversation.contactEmail,
            subject: replySubject,
            text: text,
            attachments: emailAttachments
        });

        // Append outbound message to conversation thread
        conversation.messages.push({
            direction: 'outbound',
            body: text,
            subject: replySubject,
            attachments: attachmentDocs,
            createdAt: new Date()
        });
        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.status(200).json({ success: true, message: 'Reply sent', data: conversation });

    } catch (error: any) {
        console.error('Reply error:', error);
        res.status(500).json({ success: false, message: 'Failed to send reply. Check .env email config.' });
    }
});

// @route   DELETE /api/crm/conversations/:id
// @desc    Delete an entire conversation
// @access  Private/Admin
router.delete('/conversations/:id', protectAdmin, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (conversation) {
            await conversation.deleteOne();
            res.status(200).json({ success: true, message: 'Conversation deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Conversation not found' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
