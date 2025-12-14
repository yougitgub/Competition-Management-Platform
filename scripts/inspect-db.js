const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    // Don't exit immediately if checking for local fallback manually, but standard behavior usually expects env to be set.
    // However, lib/db.js has a fallback, so we can mimic that or enforce env.
    console.log('Falling back to local if not set is not recommended for "inspect-db" on cloud. Exiting.');
    process.exit(1);
}

async function inspect() {
    try {
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`);
        console.log(collections.map(c => c.name).join(', '), '\n');

        for (const col of collections) {
            const name = col.name;
            console.log(`--- Collection: ${name} ---`);
            const count = await mongoose.connection.db.collection(name).countDocuments();
            console.log(`Total documents: ${count}`);

            const samples = await mongoose.connection.db.collection(name).find({}).limit(3).toArray();
            if (samples.length > 0) {
                console.log('Sample documents:');
                console.dir(samples, { depth: null, colors: true });
            } else {
                console.log('(Empty)');
            }
            console.log('\n');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

inspect();
