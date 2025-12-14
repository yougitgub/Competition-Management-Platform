const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found. Make sure your .env file exists and contains MONGODB_URI.');
    process.exit(1);
}

const userEmail = process.argv[2];

if (!userEmail) {
    console.log('\nUsage: node scripts/set-admin.js <email>');
    console.log('Example: node scripts/set-admin.js user@example.com\n');
    process.exit(1);
}

async function promoteUser() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Inline schema definition to assume User structure
        // using strict: false allows us to interact with the collection 
        // without needing the exact schema definition from your project
        const userSchema = new mongoose.Schema({
            email: String,
            role: String
        }, { strict: false });

        // Use existing model or compile new one
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        console.log(`Searching for user: ${userEmail}`);
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            console.error('Error: User not found! Please register the user first on the website.');
            process.exit(1);
        }

        console.log(`Current role: ${user.role}`);
        user.role = 'admin';
        await user.save();

        console.log('-----------------------------------');
        console.log(`SUCCESS: User ${userEmail} is now an ADMIN.`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Operation failed:', error);
        process.exit(1);
    }
}

promoteUser();
