import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a team name'],
        trim: true,
    },
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Competition',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    joinRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    description: {
        type: String,
        trim: true,
    },
    school: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
