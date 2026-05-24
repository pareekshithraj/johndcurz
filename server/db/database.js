const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'johndcruz.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL for performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create Tables ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    phone      TEXT,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'client',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS plans (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    sessions    INTEGER NOT NULL,
    duration    TEXT    NOT NULL,
    price       INTEGER NOT NULL,
    description TEXT    NOT NULL,
    features    TEXT    NOT NULL,
    badge       TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id),
    plan_id    INTEGER REFERENCES plans(id),
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    phone      TEXT    NOT NULL,
    plan_name  TEXT    NOT NULL,
    plan_price INTEGER NOT NULL,
    date       TEXT    NOT NULL,
    time       TEXT    NOT NULL,
    notes      TEXT,
    status     TEXT    NOT NULL DEFAULT 'pending',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed Plans ─────────────────────────────────────────────
const existingPlans = db.prepare('SELECT COUNT(*) as c FROM plans').get();

if (existingPlans.c === 0) {
  const insertPlan = db.prepare(`
    INSERT INTO plans (name, slug, sessions, duration, price, description, features, badge, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const plans = [
    {
      name: 'Starter Session',
      slug: 'starter',
      sessions: 1,
      duration: '45 mins',
      price: 500,
      description: 'A focused one-on-one consultation — ideal for first-timers seeking clarity and direction.',
      features: JSON.stringify(['1-on-1 with John', '45 minute private session', 'Session notes & guidance', 'Follow-up resource list']),
      badge: null
    },
    {
      name: 'Care Package',
      slug: 'care',
      sessions: 1,
      duration: '1 hour',
      price: 1000,
      description: 'A focused one-hour counseling session for personal support and steady progress.',
      features: JSON.stringify(['1 individual session', '1 hour duration', 'Progress check-in', 'WhatsApp support']),
      badge: 'Most Popular'
    },
    {
      name: 'Full Support Program',
      slug: 'full',
      sessions: 1,
      duration: '1 hour',
      price: 1500,
      description: 'A comprehensive one-on-one support session for deeper care, planning, and practical follow-through.',
      features: JSON.stringify(['1 individual session', '1 hour duration', 'Priority booking', 'Full action plan', 'WhatsApp access']),
      badge: 'Best Value'
    },
    {
      name: 'Custom Session',
      slug: 'custom',
      sessions: 1,
      duration: 'Flexible duration',
      price: 0,
      description: 'Have unique needs? Request a fully personalized one-on-one session built around you.',
      features: JSON.stringify(['1-on-1 private session', 'Flexible duration', 'Tailored approach', 'Special requirements welcome']),
      badge: 'Flexible'
    }
  ];

  plans.forEach(p => {
    insertPlan.run(p.name, p.slug, p.sessions, p.duration, p.price, p.description, p.features, p.badge);
  });

  console.log('✅ Plans seeded');
} else {
  // Update existing plans with new descriptions/durations
  const updates = [
    { slug: 'starter', description: 'A focused one-on-one consultation — ideal for first-timers seeking clarity and direction.', duration: '45 mins' },
    { slug: 'care',    description: 'A focused one-hour counseling session for personal support and steady progress.', duration: '1 hour' },
    { slug: 'full',    description: 'A comprehensive one-on-one support session for deeper care, planning, and practical follow-through.', duration: '1 hour' },
    { slug: 'custom',  description: 'Have unique needs? Request a fully personalized one-on-one session built around you.', duration: 'Flexible duration' },
  ];
  const upd = db.prepare('UPDATE plans SET description = ?, duration = ?, updated_at = datetime(\'now\') WHERE slug = ?');
  updates.forEach(u => upd.run(u.description, u.duration, u.slug));
}

// ── Seed Admin User ────────────────────────────────────────
const adminEmail = 'john@johndcruz.com';
const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, email, phone, password, role)
    VALUES (?, ?, ?, ?, 'admin')
  `).run('John D Cruz', adminEmail, '1234567890', hash);
  console.log('✅ Admin user seeded (john@johndcruz.com / admin123)');
}

module.exports = db;
