import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        // Required only if competition type is team, but we'll enforce in logic
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ user: 1, competition: 1 }, { unique: true });
// For teams, we might want unique team per competition?
// RegistrationSchema.index({ team: 1, competition: 1 }, { unique: true, partialFilterExpression: { team: { $exists: true } } });

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
