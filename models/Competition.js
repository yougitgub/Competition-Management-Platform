import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a competition title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    type: {
        type: String,
        enum: ['individual', 'team', 'mixed'],
        default: 'individual',
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming',
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date'],
    },
    location: {
        type: String,
        default: 'Main Hall',
    },
    rules: {
        type: [String],
        default: [],
    },
    imageUrl: {
        type: String,
    },
    maxParticipants: {
        type: Number,
    },
    judges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

export default mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);
