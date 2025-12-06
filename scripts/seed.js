import path from 'path';
import fs from 'fs';
import db from '../lib/db.js';
import { hashPassword } from '../lib/auth.js';

async function seed() {
  console.log('Seeding database...');
  const adminEmail = 'admin@example.com';
  const exists = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

  // Always set/reset the password to ensure it matches the current auth mode (plain text)
  const pw = 'password123'; // Logic now uses plain text

  if (exists) {
    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(pw, adminEmail);
    console.log('Updated existing admin user password to plain text: password123');
  } else {
    const stmt = db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
    stmt.run('Admin User', adminEmail, pw, 'admin');
    console.log('Created admin user: admin@example.com / password123');
  }

  // Create a sample competition if none exist
  const comp = db.prepare('SELECT * FROM competitions LIMIT 1').get();
  if (!comp) {
    const stmt = db.prepare('INSERT INTO competitions (title,description,rules,start_date,end_date,max_participants) VALUES (?,?,?,?,?,?)');
    stmt.run('Math Olympiad', 'An inter-school math competition', 'No calculators', '2025-12-01', '2025-12-10', 100);
    console.log('Inserted sample competition.');
  }

  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
