import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }] // Array of Cloudinary URLs
});

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    responsibilities: [{ type: String }],
    projects: [projectSchema],
    order: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
