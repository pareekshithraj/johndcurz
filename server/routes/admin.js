const router = require('express').Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

// All admin routes require admin role

// GET /api/admin/appointments — all bookings
router.get('/appointments', requireAdmin, (req, res) => {
  const { status, date } = req.query;
  let query = `
    SELECT a.*, u.phone as user_phone
    FROM appointments a
    LEFT JOIN users u ON a.user_id = u.id
  `;
  const params = [];
  const conditions = [];

  if (status) { conditions.push('a.status = ?'); params.push(status); }
  if (date) { conditions.push('a.date = ?'); params.push(date); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY a.date DESC, a.time DESC';

  res.json(db.prepare(query).all(...params));
});

// PATCH /api/admin/appointments/:id — update status
router.patch('/appointments/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const result = db.prepare('UPDATE appointments SET status = ? WHERE id = ?')
    .run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Appointment not found' });

  res.json(db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id));
});

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ message: 'Deleted successfully' });
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM appointments').get().c;
  const pending = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status = 'pending'").get().c;
  const confirmed = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status = 'confirmed'").get().c;
  const completed = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status = 'completed'").get().c;
  const cancelled = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status = 'cancelled'").get().c;
  const clients = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'client'").get().c;
  const revenue = db.prepare("SELECT COALESCE(SUM(plan_price),0) as r FROM appointments WHERE status != 'cancelled'").get().r;
  const today = new Date().toISOString().split('T')[0];
  const todayCount = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE date = ?').get(today).c;

  res.json({ total, pending, confirmed, completed, cancelled, clients, revenue, todayCount });
});

// GET /api/admin/plans — all plans
router.get('/plans', requireAdmin, (req, res) => {
  const plans = db.prepare('SELECT * FROM plans ORDER BY id').all();
  res.json(plans.map(p => ({ ...p, features: JSON.parse(p.features) })));
});

// PUT /api/admin/plans/:id — update plan
router.put('/plans/:id', requireAdmin, (req, res) => {
  const { name, sessions, duration, price, description, features, badge, is_active } = req.body;

  const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features;

  db.prepare(`
    UPDATE plans SET
      name = COALESCE(?, name),
      sessions = COALESCE(?, sessions),
      duration = COALESCE(?, duration),
      price = COALESCE(?, price),
      description = COALESCE(?, description),
      features = COALESCE(?, features),
      badge = ?,
      is_active = COALESCE(?, is_active),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(name, sessions, duration, price, description, featuresStr, badge || null, is_active, req.params.id);

  const updated = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
  res.json({ ...updated, features: JSON.parse(updated.features) });
});

// GET /api/admin/schedule?date=YYYY-MM-DD
router.get('/schedule', requireAdmin, (req, res) => {
  const { date } = req.query;
  const today = date || new Date().toISOString().split('T')[0];
  const appointments = db.prepare(`
    SELECT * FROM appointments WHERE date = ? ORDER BY time
  `).all(today);
  res.json(appointments);
});

// GET /api/admin/users
router.get('/users', requireAdmin, (req, res) => {
  const users = db.prepare("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC").all();
  res.json(users);
});

module.exports = router;
