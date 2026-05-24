const router = require('express').Router();
const db = require('../db/database');

// GET /api/plans — all active plans
router.get('/', (req, res) => {
  const plans = db.prepare('SELECT * FROM plans WHERE is_active = 1 ORDER BY id').all();
  const parsed = plans.map(p => ({ ...p, features: JSON.parse(p.features) }));
  res.json(parsed);
});

// GET /api/plans/:slug
router.get('/:slug', (req, res) => {
  const plan = db.prepare('SELECT * FROM plans WHERE slug = ?').get(req.params.slug);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json({ ...plan, features: JSON.parse(plan.features) });
});

module.exports = router;
