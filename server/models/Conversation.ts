import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number },
    path: { type: String, required: true } // local file path for serving
}, { _id: true });

const threadMessageSchema = new mongoose.Schema({
    direction: {
        type: String,
        enum: ['inbound', 'outbound'],
        required: true
    },
    messageId: { type: String, unique: true, sparse: true }, // Add this to prevent duplicates
    body: { type: String, required: true },
    subject: { type: String, default: '' },
    attachments: [attachmentSchema],
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const conversationSchema = new mongoose.Schema({
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    messages: [threadMessageSchema],
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, { timestamps: true });

// Index for fast lookups by email
conversationSchema.index({ contactEmail: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
