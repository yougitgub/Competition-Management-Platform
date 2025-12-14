/**
 * Admin User Creation Script
 * 
 * This script creates an admin user in the database.
 * Run this script with: node scripts/create-admin.js
 * 
 * You can also modify the credentials directly in this file before running.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/competition-platform';

// User Schema (inline to avoid import issues)
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'judge', 'student'],
        default: 'student',
    },
    image: String,
    studentId: String,
    bio: String,
    expertise: String,
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('🔐 Admin User Creation Script\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get admin details
        const name = await question('Enter admin name: ');
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password (min 6 characters): ');

        // Validate inputs
        if (!name || !email || !password) {
            console.log('❌ All fields are required!');
            process.exit(1);
        }

        if (password.length < 6) {
            console.log('❌ Password must be at least 6 characters!');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('\n⚠️  User with this email already exists!');
            const update = await question('Do you want to update this user to admin role? (yes/no): ');

            if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.role = 'admin';
                existingUser.name = name;
                existingUser.password = hashedPassword;
                await existingUser.save();
                console.log('✅ User updated to admin successfully!');
            } else {
                console.log('❌ Operation cancelled');
            }
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create admin user
            const admin = await User.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
            });

            console.log('\n✅ Admin user created successfully!');
            console.log('📧 Email:', admin.email);
            console.log('👤 Name:', admin.name);
            console.log('🔑 Role:', admin.role);
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        rl.close();
        process.exit(0);
    }
}

// Run the script
createAdmin();
