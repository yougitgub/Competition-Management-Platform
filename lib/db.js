import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT CHECK(role IN ('admin','teacher','student')) NOT NULL DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  rules TEXT,
  start_date TEXT,
  end_date TEXT,
  max_participants INTEGER
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  competition_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(student_id, competition_id),
  FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  competition_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  position INTEGER,
  score REAL,
  FOREIGN KEY(competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  result_id INTEGER NOT NULL,
  pdf_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(result_id) REFERENCES results(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

export default db;
export const getUserByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email);
export const getUserById = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);
export const createUser = (user) => {
  const stmt = db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
  const info = stmt.run(user.name, user.email, user.password_hash, user.role || 'student');
  return getUserById(info.lastInsertRowid);
};

export const createCompetition = (c) => {
  const stmt = db.prepare('INSERT INTO competitions (title,description,rules,start_date,end_date,max_participants) VALUES (?,?,?,?,?,?)');
  const info = stmt.run(c.title, c.description || null, c.rules || null, c.start_date || null, c.end_date || null, c.max_participants || null);
  return db.prepare('SELECT * FROM competitions WHERE id = ?').get(info.lastInsertRowid);
};

export const updateCompetition = (id, c) => {
  const stmt = db.prepare('UPDATE competitions SET title=?,description=?,rules=?,start_date=?,end_date=?,max_participants=? WHERE id=?');
  stmt.run(c.title, c.description || null, c.rules || null, c.start_date || null, c.end_date || null, c.max_participants || null, id);
  return db.prepare('SELECT * FROM competitions WHERE id = ?').get(id);
};

export const deleteCompetition = (id) => {
  const stmt = db.prepare('DELETE FROM competitions WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};

export const listCompetitions = () => db.prepare('SELECT * FROM competitions ORDER BY start_date DESC').all();
export const getCompetition = (id) => db.prepare('SELECT * FROM competitions WHERE id = ?').get(id);

export const createRegistration = (student_id, competition_id) => {
  const stmt = db.prepare('INSERT INTO registrations (student_id, competition_id) VALUES (?,?)');
  const info = stmt.run(student_id, competition_id);
  return db.prepare('SELECT * FROM registrations WHERE id = ?').get(info.lastInsertRowid);
};

export const listRegistrationsByCompetition = (competition_id) => db.prepare('SELECT r.*, u.name, u.email FROM registrations r JOIN users u ON u.id = r.student_id WHERE r.competition_id = ?').all(competition_id);
export const getRegistration = (student_id, competition_id) => db.prepare('SELECT * FROM registrations WHERE student_id = ? AND competition_id = ?').get(student_id, competition_id);

export const createResult = (competition_id, student_id, position, score) => {
  const stmt = db.prepare('INSERT INTO results (competition_id, student_id, position, score) VALUES (?,?,?,?)');
  const info = stmt.run(competition_id, student_id, position, score);
  return db.prepare('SELECT * FROM results WHERE id = ?').get(info.lastInsertRowid);
};

export const listResultsByCompetition = (competition_id) => db.prepare('SELECT r.*, u.name, u.email FROM results r JOIN users u ON u.id = r.student_id WHERE r.competition_id = ? ORDER BY r.position ASC').all(competition_id);

// helper to return results joined with competition title
export const listAllResultsWithCompetition = () => db.prepare('SELECT r.*, u.name, u.email, c.title as competition_title FROM results r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id ORDER BY c.start_date DESC, r.position ASC').all();

export const createCertificateRecord = (result_id, pdf_url) => {
  const stmt = db.prepare('INSERT INTO certificates (result_id,pdf_url) VALUES (?,?)');
  const info = stmt.run(result_id, pdf_url);
  return db.prepare('SELECT * FROM certificates WHERE id = ?').get(info.lastInsertRowid);
};

export const getCertificate = (id) => db.prepare('SELECT c.*, r.position, r.score, r.competition_id, r.student_id, u.name as student_name, comp.title as competition_title FROM certificates c JOIN results r ON r.id = c.result_id JOIN users u ON u.id = r.student_id JOIN competitions comp ON comp.id = r.competition_id WHERE c.id = ?').get(id);

export const createSession = (token, user_id, expires_at) => db.prepare('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)').run(token, user_id, expires_at);
export const getSession = (token) => db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
export const deleteSession = (token) => db.prepare('DELETE FROM sessions WHERE token = ?').run(token);

