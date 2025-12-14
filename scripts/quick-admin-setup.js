/**
 * Quick Admin Setup
 * 
 * This script creates a default admin user with predefined credentials.
 * IMPORTANT: Change these credentials in production!
 * 
 * Run this script with: node scripts/quick-admin-setup.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// ⚠️ CHANGE THESE CREDENTIALS FOR PRODUCTION! ⚠️
const ADMIN_CREDENTIALS = {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123456',  // Change this!
    role: 'admin'
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/competition-platform';

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'judge', 'student'], default: 'student' },
    image: String,
    studentId: String,
    bio: String,
    expertise: String,
}, { timestamps: true });

async function quickSetup() {
    try {
        console.log('🚀 Quick Admin Setup\n');
        console.log('⚠️  WARNING: This will create an admin with predefined credentials!');
        console.log('📧 Email:', ADMIN_CREDENTIALS.email);
        console.log('🔑 Password:', ADMIN_CREDENTIALS.password);
        console.log('');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Updating to ensure admin role and password...');

            const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
            existingAdmin.role = 'admin';
            existingAdmin.password = hashedPassword;
            existingAdmin.name = ADMIN_CREDENTIALS.name;
            await existingAdmin.save();

            console.log('✅ Admin user updated!');
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);

            await User.create({
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                password: hashedPassword,
                role: ADMIN_CREDENTIALS.role,
            });

            console.log('✅ Admin user created successfully!');
        }

        console.log('\n📝 Login Credentials:');
        console.log('   Email:', ADMIN_CREDENTIALS.email);
        console.log('   Password:', ADMIN_CREDENTIALS.password);
        console.log('\n⚠️  REMEMBER TO CHANGE THE PASSWORD AFTER FIRST LOGIN!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

quickSetup();
