import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true,
    },
    team: { // Or student, depending on competition type. Let's assume Team primarily, or handle both.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    judge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    criteria: {
        type: Map,
        of: Number, // e.g. "Creativity": 10, "Execution": 8
    },
    totalScore: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
