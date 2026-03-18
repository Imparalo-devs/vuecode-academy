// ⚠️ VueCode Academy - Intentionally vulnerable database setup
const Database = require('better-sqlite3')
const config = require('./config')

const db = new Database(config.database.path)

// VULNERABILITY: No migrations, schema created inline
// VULNERABILITY: Passwords stored as plain text (no hashing enforced at DB level)
// VULNERABILITY: No indexes on frequently queried columns
// VULNERABILITY: No foreign key constraints enabled
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT,
    role TEXT DEFAULT 'user',
    api_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    user_id INTEGER,
    is_private INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    user_id INTEGER,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// VULNERABILITY: Seed data with plain text passwords
const seedUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()
if (seedUsers.count === 0) {
  // VULNERABILITY: Plain text passwords in seed data
  db.prepare(`INSERT INTO users (username, email, password, role, api_key) VALUES (?, ?, ?, ?, ?)`).run(
    'admin', 'admin@academy.local', 'admin123', 'admin', 'sk-admin-key-12345'
  )
  db.prepare(`INSERT INTO users (username, email, password, role, api_key) VALUES (?, ?, ?, ?, ?)`).run(
    'alice', 'alice@academy.local', 'password123', 'user', 'sk-alice-key-67890'
  )
  db.prepare(`INSERT INTO users (username, email, password, role, api_key) VALUES (?, ?, ?, ?, ?)`).run(
    'bob', 'bob@academy.local', 'bob123', 'user', 'sk-bob-key-abcdef'
  )

  // Seed some notes
  db.prepare(`INSERT INTO notes (title, content, user_id, is_private) VALUES (?, ?, ?, ?)`).run(
    'Welcome to VueCode Academy', 'This is a public note for learning purposes.', 1, 0
  )
  db.prepare(`INSERT INTO notes (title, content, user_id, is_private) VALUES (?, ?, ?, ?)`).run(
    'Admin Secret Notes', 'These are private admin notes with sensitive data.', 1, 1
  )
  db.prepare(`INSERT INTO notes (title, content, user_id, is_private) VALUES (?, ?, ?, ?)`).run(
    'My Personal Note', 'Alice personal note content here.', 2, 1
  )
}

module.exports = db
