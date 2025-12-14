import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    password: {
        type: String,
        required: false, // Optional for OAuth, but required for Credentials (handled in validation)
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['admin', 'judge', 'student'],
        default: 'student',
    },
    image: {
        type: String,
    },
    // Additional fields for students/judges
    studentId: { type: String }, // For school ID
    bio: { type: String },
    expertise: { type: String }, // For judges
}, {
    timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
