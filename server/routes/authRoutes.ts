import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Conversation from '../models/Conversation.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 1. Intercept Contact Form
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const secretName = process.env.ADMIN_NAME;
    const secretEmail = process.env.ADMIN_EMAIL;
    const secretMessage = process.env.ADMIN_TRIGGER_WORD;

    // Check if it exactly matches the secret Identity
    if (name?.trim() === secretName?.trim() && 
        email?.trim() === secretEmail?.trim() && 
        message?.trim() === secretMessage?.trim()
    ) {
        return res.status(200).json({ authTriggered: true });
    }

    try {
        // Find or create a conversation for this contact
        let conversation = await Conversation.findOne({ contactEmail: email.trim().toLowerCase() });

        const newMessage = {
            direction: 'inbound' as const,
            body: message,
            subject: 'Portfolio Contact Form',
            attachments: [],
            createdAt: new Date()
        };

        if (conversation) {
            // Append to existing conversation
            conversation.messages.push(newMessage);
            conversation.lastMessageAt = new Date();
            conversation.unreadCount += 1;
            conversation.contactName = name; // Update name in case it changed
            await conversation.save();
        } else {
            // Create new conversation
            conversation = await Conversation.create({
                contactName: name,
                contactEmail: email.trim().toLowerCase(),
                messages: [newMessage],
                lastMessageAt: new Date(),
                unreadCount: 1
            });
        }

        console.log(`[CRM] Message threaded for ${name} <${email}>`);
        return res.status(200).json({ success: true, message: 'Message logged in CRM.' });
    } catch (err: any) {
        console.error('Failed to log message:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Verify MPIN after Interception
router.post('/verify-mpin', async (req, res) => {
    const { mpin } = req.body;

    try {
        // We assume only one Admin exists in the database
        let admin = await Admin.findOne();

        // DEV OVERRIDE (For immediate testing until you can seed your database)
        // If there is no admin in the database yet, we will auto-create one. 
        // We set the MPIN to the generic 1411 (User can change this later).
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const mpinHash = await bcrypt.hash('1411', salt);
            admin = await Admin.create({ mpinHash });
        }

        // Compare MPIN
        // Since admin.matchMPIN is an instance method, we check it:
        // Note: we have to cast `admin` to any or extend the Document interface properly
        // Let's just do it directly with bcrypt here for typescript simplicity
        const isMatch = await bcrypt.compare(mpin, admin.mpinHash);

        if (isMatch) {
            // Sign JWT token
            const token = jwt.sign(
                { role: 'admin' }, 
                process.env.JWT_SECRET || 'fallback_secret', 
                { expiresIn: '30d' }
            );

            return res.status(200).json({ 
                success: true, 
                token 
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid MPIN' });
        }

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
