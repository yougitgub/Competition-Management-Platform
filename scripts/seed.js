const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Minimal Schemas for seeding to avoid ESM/CommonJS issues
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: 'student' }
}, { strict: false });

const CompetitionSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  startDate: Date,
  endDate: Date,
  maxParticipants: Number,
  type: String,
  category: String,
  rules: [String]
}, { strict: false });

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Competition = mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);

    // 1. Seed Admin User
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    const adminPassword = 'password123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`✅ Updated existing admin user: ${adminEmail} (password: ${adminPassword})`);
    } else {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Created admin user: ${adminEmail} (password: ${adminPassword})`);
    }

    // 2. Seed Sample Competition
    const existingComp = await Competition.findOne({});
    if (!existingComp) {
      await Competition.create({
        title: 'Math Olympiad',
        description: 'An inter-school math competition',
        rules: ['No calculators allowed', 'Bring your own stationery'],
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-10'),
        maxParticipants: 100,
        type: 'individual',
        category: 'Math',
        status: 'upcoming'
      });
      console.log('✅ Inserted sample competition: Math Olympiad');
    } else {
      console.log('ℹ️  Competitions already exist. Skipping competition seed.');
    }

    console.log('\n🏁 Seeding completed successfully.');

  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
