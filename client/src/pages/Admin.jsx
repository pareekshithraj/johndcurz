import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', completed: '#6366f1', cancelled: '#ef4444' };

const TABS = ['Overview', 'Appointments', 'Schedule', 'Plans', 'Users'];

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleAppts, setScheduleAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/dashboard'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, apptRes, plansRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/appointments'),
        api.get('/admin/plans'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setAppointments(apptRes.data);
      setPlans(plansRes.data);
      setUsers(usersRes.data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'Schedule') {
      api.get(`/admin/schedule?date=${scheduleDate}`)
        .then(r => setScheduleAppts(r.data))
        .catch(() => setScheduleAppts([]));
    }
  }, [tab, scheduleDate]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      fetchAll(); // refresh stats
    } catch (e) {}
  };

  const deleteAppt = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/admin/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      fetchAll();
    } catch (e) {}
  };

  const savePlan = async (plan) => {
    try {
      await api.put(`/admin/plans/${plan.id}`, plan);
      setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      setEditingPlan(null);
    } catch (e) { alert('Failed to save plan'); }
  };

  if (!user || user.role !== 'admin') return null;

  const filteredAppts = filterStatus
    ? appointments.filter(a => a.status === filterStatus)
    : appointments;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo" id="admin-logo-link">
          <span className="logo-initials">JDC</span>
          <span className="logo-text">Admin</span>
        </Link>

        <nav className="admin-nav">
          {TABS.map(t => (
            <button key={t} className={`admin-nav-item${tab === t ? ' active' : ''}`}
              id={`admin-tab-${t.toLowerCase()}`} onClick={() => setTab(t)}>
              {t === 'Overview' && '📊'}
              {t === 'Appointments' && '📅'}
              {t === 'Schedule' && '🗓️'}
              {t === 'Plans' && '💎'}
              {t === 'Users' && '👥'}
              {t}
            </button>
          ))}
        </nav>

        <button className="admin-logout" id="admin-logout-btn" onClick={() => { logout(); navigate('/'); }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>{tab}</h1>
            <p>Welcome back, {user.name}</p>
          </div>
          <button className="btn btn-outline-dark" id="admin-refresh-btn" onClick={fetchAll}>↻ Refresh</button>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="loading-spinner" /></div>
        ) : (
          <>
            {/* === OVERVIEW === */}
            {tab === 'Overview' && stats && (
              <div className="admin-overview">
                <div className="overview-stats">
                  {[
                    { id: 'os-total', icon: '📅', label: 'Total Bookings', val: stats.total, color: '#6366f1' },
                    { id: 'os-pending', icon: '⏳', label: 'Pending', val: stats.pending, color: '#f59e0b' },
                    { id: 'os-confirmed', icon: '✅', label: 'Confirmed', val: stats.confirmed, color: '#10b981' },
                    { id: 'os-completed', icon: '🏁', label: 'Completed', val: stats.completed, color: '#8b5cf6' },
                    { id: 'os-clients', icon: '👥', label: 'Clients', val: stats.clients, color: '#3b82f6' },
                    { id: 'os-revenue', icon: '₹', label: 'Revenue', val: `₹${stats.revenue?.toLocaleString('en-IN')}`, color: '#10b981' },
                    { id: 'os-today', icon: '📍', label: "Today's Appts", val: stats.todayCount, color: '#f59e0b' },
                    { id: 'os-cancelled', icon: '❌', label: 'Cancelled', val: stats.cancelled, color: '#ef4444' },
                  ].map(s => (
                    <div key={s.id} className="overview-stat-card" id={s.id} style={{ borderColor: s.color + '30' }}>
                      <div className="osc-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
                      <div className="osc-val" style={{ color: s.color }}>{s.val}</div>
                      <div className="osc-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="overview-recent">
                  <h3>Recent Appointments</h3>
                  <table className="admin-table" id="recent-appts-table">
                    <thead>
                      <tr><th>Name</th><th>Plan</th><th>Date</th><th>Time</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(a => (
                        <tr key={a.id} id={`recent-${a.id}`}>
                          <td>{a.name}</td>
                          <td>{a.plan_name}</td>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td><span className="status-pill" style={{ background: STATUS_COLORS[a.status] + '22', color: STATUS_COLORS[a.status] }}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* === APPOINTMENTS === */}
            {tab === 'Appointments' && (
              <div className="admin-appointments" id="admin-appointments-section">
                <div className="admin-filters">
                  <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="filter-select">
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="filter-count">{filteredAppts.length} appointments</span>
                </div>

                <table className="admin-table" id="all-appts-table">
                  <thead>
                    <tr><th>#</th><th>Client</th><th>Plan</th><th>Date</th><th>Time</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredAppts.map(a => (
                      <tr key={a.id} id={`appt-row-${a.id}`}>
                        <td className="td-id">#{a.id}</td>
                        <td>
                          <div className="td-client">
                            <strong>{a.name}</strong>
                            <span>{a.email}</span>
                          </div>
                        </td>
                        <td>{a.plan_name}</td>
                        <td>{a.date}</td>
                        <td>{a.time}</td>
                        <td>{a.plan_price > 0 ? `₹${a.plan_price.toLocaleString('en-IN')}` : 'Quote'}</td>
                        <td>
                          <select
                            id={`status-select-${a.id}`}
                            value={a.status}
                            onChange={e => updateStatus(a.id, e.target.value)}
                            className="status-select"
                            style={{ color: STATUS_COLORS[a.status] }}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          <button className="btn-icon btn-delete" id={`delete-${a.id}`}
                            onClick={() => deleteAppt(a.id)} title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* === SCHEDULE === */}
            {tab === 'Schedule' && (
              <div className="admin-schedule" id="admin-schedule-section">
                <div className="schedule-header">
                  <input type="date" id="schedule-date-picker" value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)} className="date-picker-input" />
                  <h3>{new Date(scheduleDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                </div>

                {scheduleAppts.length === 0 ? (
                  <div className="schedule-empty" id="no-schedule">
                    <div className="empty-icon">📭</div>
                    <p>No appointments scheduled for this date.</p>
                  </div>
                ) : (
                  <div className="schedule-list" id="schedule-list">
                    {scheduleAppts.map(a => (
                      <div key={a.id} className={`schedule-item si-${a.status}`} id={`sched-${a.id}`}>
                        <div className="si-time">{a.time}</div>
                        <div className="si-info">
                          <strong>{a.name}</strong>
                          <span>{a.plan_name} • {a.email}</span>
                        </div>
                        <div className="si-status" style={{ color: STATUS_COLORS[a.status] }}>
                          ● {a.status}
                        </div>
                        <select
                          value={a.status}
                          onChange={e => { updateStatus(a.id, e.target.value); setScheduleAppts(prev => prev.map(s => s.id === a.id ? { ...s, status: e.target.value } : s)); }}
                          className="status-select"
                          id={`sched-status-${a.id}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* === PLANS EDITOR === */}
            {tab === 'Plans' && (
              <div className="admin-plans" id="admin-plans-section">
                <p className="admin-plans-hint">Click any field to edit plan details. Changes are saved when you click Save.</p>
                <div className="admin-plans-grid">
                  {plans.map(plan => (
                    <div key={plan.id} className="admin-plan-card" id={`admin-plan-${plan.id}`}>
                      {editingPlan?.id === plan.id ? (
                        <PlanEditor plan={editingPlan} onChange={setEditingPlan} onSave={savePlan} onCancel={() => setEditingPlan(null)} />
                      ) : (
                        <PlanPreview plan={plan} onEdit={() => setEditingPlan({ ...plan })} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === USERS === */}
            {tab === 'Users' && (
              <div className="admin-users" id="admin-users-section">
                <table className="admin-table" id="users-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} id={`user-row-${u.id}`}>
                        <td>{u.id}</td>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td><span className={`role-pill role-${u.role}`}>{u.role}</span></td>
                        <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PlanPreview({ plan, onEdit }) {
  return (
    <>
      <div className="apc-badge">{plan.badge || 'Standard'}</div>
      <div className="apc-name">{plan.name}</div>
      <div className="apc-price">₹{plan.price?.toLocaleString('en-IN') || 'Custom'}</div>
      <div className="apc-meta">{plan.sessions > 0 ? `${plan.sessions} session(s)` : 'Flexible'} • {plan.duration}</div>
      <ul className="apc-features">
        {plan.features?.map((f, i) => <li key={i}>✓ {f}</li>)}
      </ul>
      <button className="btn btn-plan btn-edit-plan" id={`edit-plan-${plan.id}`} onClick={onEdit}>
        ✏️ Edit Plan
      </button>
    </>
  );
}

function PlanEditor({ plan, onChange, onSave, onCancel }) {
  const updateFeature = (i, val) => {
    const feats = [...plan.features];
    feats[i] = val;
    onChange({ ...plan, features: feats });
  };
  const addFeature = () => onChange({ ...plan, features: [...plan.features, ''] });
  const removeFeature = (i) => onChange({ ...plan, features: plan.features.filter((_, fi) => fi !== i) });

  return (
    <div className="plan-editor" id={`plan-editor-${plan.id}`}>
      <div className="form-group">
        <label>Plan Name</label>
        <input value={plan.name} onChange={e => onChange({ ...plan, name: e.target.value })} />
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" value={plan.price} onChange={e => onChange({ ...plan, price: +e.target.value })} />
        </div>
        <div className="form-group">
          <label>Sessions</label>
          <input type="number" value={plan.sessions} onChange={e => onChange({ ...plan, sessions: +e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label>Duration</label>
        <input value={plan.duration} onChange={e => onChange({ ...plan, duration: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows={2} value={plan.description} onChange={e => onChange({ ...plan, description: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Badge Text <small>(e.g., Most Popular)</small></label>
        <input value={plan.badge || ''} onChange={e => onChange({ ...plan, badge: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Features</label>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input value={f} onChange={e => updateFeature(i, e.target.value)} style={{ flex: 1 }} />
            <button type="button" onClick={() => removeFeature(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
        ))}
        <button type="button" className="btn-add-feature" id={`add-feature-${plan.id}`} onClick={addFeature}>+ Add Feature</button>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-primary" id={`save-plan-${plan.id}`} onClick={() => onSave(plan)}>Save Changes</button>
        <button className="btn btn-outline-dark" id={`cancel-plan-${plan.id}`} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
