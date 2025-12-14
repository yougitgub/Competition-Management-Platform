import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    score: {
        type: Number,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
