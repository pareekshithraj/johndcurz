const router = require('express').Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

// Available time slots
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

// GET /api/appointments/slots?date=YYYY-MM-DD&plan_id=1
router.get('/slots', (req, res) => {
  const { date, plan_id } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  // Get booked slots for that date
  const booked = db.prepare(`
    SELECT time FROM appointments
    WHERE date = ? AND status != 'cancelled'
  `).all(date).map(r => r.time);

  const available = TIME_SLOTS.filter(s => !booked.includes(s));
  res.json({ date, available, booked });
});

// POST /api/appointments — create booking (requires auth)
router.post('/', authenticate, (req, res) => {
  const { plan_id, date, time, notes, phone } = req.body;
  const { id: user_id, name, email } = req.user;

  if (!plan_id || !date || !time) {
    return res.status(400).json({ error: 'plan_id, date and time are required' });
  }

  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(plan_id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  // Check if slot is already taken
  const conflict = db.prepare(`
    SELECT id FROM appointments WHERE date = ? AND time = ? AND status != 'cancelled'
  `).get(date, time);
  if (conflict) return res.status(409).json({ error: 'This time slot is already booked' });

  const result = db.prepare(`
    INSERT INTO appointments (user_id, plan_id, name, email, phone, plan_name, plan_price, date, time, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(user_id, plan_id, name, email, phone || '', plan.name, plan.price, date, time, notes || '');

  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(appointment);
});

// GET /api/appointments/my — user's own bookings
router.get('/my', authenticate, (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, p.duration, p.sessions
    FROM appointments a
    LEFT JOIN plans p ON a.plan_id = p.id
    WHERE a.user_id = ?
    ORDER BY a.date DESC, a.time DESC
  `).all(req.user.id);
  res.json(appointments);
});

module.exports = router;
