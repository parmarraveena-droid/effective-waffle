import { useState } from 'react';
import { useApp } from '../context/AppContext';

const TODAY = new Date().toISOString().slice(0, 10);

const STATUS_CONFIG = {
  briefed:     { dot: '#8A8A8A', label: 'Briefed' },
  'in-progress': { dot: '#2B5EA7', label: 'In Progress' },
  delivered:   { dot: '#A0652A', label: 'Delivered' },
  approved:    { dot: '#2A7A3B', label: 'Approved' },
};

const TYPE_OPTIONS = ['post', 'story', 'reel', 'video', 'podcast', 'newsletter', 'appearance', 'other'];
const PLATFORM_OPTIONS = ['instagram', 'tiktok', 'youtube', 'podcast', 'substack'];
const STATUS_OPTIONS = ['briefed', 'in-progress', 'delivered', 'approved'];
const CONTRACT_OPTIONS = ['contracted', 'handshake'];

const inputStyle = {
  width: '100%',
  border: '1px solid var(--border)',
  padding: '8px 10px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '11px',
  color: 'var(--ink)',
  background: '#fff',
  outline: 'none',
  borderRadius: 0,
};

const labelStyle = {
  fontSize: '9px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '5px',
};

const BLANK_DELIVERABLE = {
  creatorId: '',
  title: '',
  type: 'post',
  platform: 'instagram',
  dueDate: '',
  status: 'briefed',
  contractType: 'contracted',
  campaignId: null,
  notes: '',
};

function isOverdue(d) {
  return d.dueDate < TODAY && d.status !== 'approved';
}

function DeliverableForm({ deliverable, onClose, creators, campaigns, onSave }) {
  const [form, setForm] = useState(deliverable
    ? { ...deliverable, campaignId: deliverable.campaignId || '', creatorId: String(deliverable.creatorId) }
    : { ...BLANK_DELIVERABLE, creatorId: creators[0] ? String(creators[0].id) : '' }
  );

  const [search, setSearch] = useState('');

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const filteredCreators = search
    ? creators.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase()))
    : creators;

  const handleSave = () => {
    if (!form.title.trim() || !form.creatorId) return;
    onSave({
      ...form,
      creatorId: Number(form.creatorId),
      campaignId: form.campaignId || null,
      id: deliverable ? deliverable.id : crypto.randomUUID(),
    });
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="modal-panel"
        style={{
          background: '#fff',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {deliverable ? 'Edit Deliverable' : 'Add Deliverable'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Creator *</label>
          <input
            type="text"
            placeholder="Search creators…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: '6px' }}
          />
          <select
            style={{ ...inputStyle, appearance: 'none' }}
            value={form.creatorId}
            onChange={e => set('creatorId', e.target.value)}
            size={Math.min(filteredCreators.length, 4)}
          >
            {filteredCreators.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name} ({c.handle})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Deliverable title" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Platform</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.platform} onChange={e => set('platform', e.target.value)}>
              {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Due Date</label>
            <input type="date" style={inputStyle} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Contract</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.contractType} onChange={e => set('contractType', e.target.value)}>
              {CONTRACT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Campaign</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.campaignId || ''} onChange={e => set('campaignId', e.target.value || null)}>
              <option value="">None</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: 1.6 }}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Additional notes…"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: '11px',
              background: 'var(--ink)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            {deliverable ? 'Save Changes' : 'Add Deliverable'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '11px 20px', background: 'transparent', color: 'var(--ink)',
              border: '1px solid var(--border)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.briefed;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      <span style={{ fontSize: '10px', letterSpacing: '0.04em', color: 'var(--ink)', textTransform: 'capitalize' }}>{cfg.label}</span>
    </span>
  );
}

export default function DeliverablesView() {
  const { deliverables, campaigns, creators, addDeliverable, updateDeliverable, deleteDeliverable } = useApp();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const creatorMap = Object.fromEntries(creators.map(c => [c.id, c]));
  const campaignMap = Object.fromEntries(campaigns.map(c => [c.id, c]));

  const filtered = deliverables.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return isOverdue(d);
    return d.status === filter;
  });

  const overdueCount = deliverables.filter(isOverdue).length;

  const handleSave = (data) => {
    if (editTarget) {
      updateDeliverable(data);
    } else {
      addDeliverable(data);
    }
  };

  const openEdit = (d) => { setEditTarget(d); setShowForm(true); };
  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const FILTER_PILLS = [
    { key: 'all', label: 'All' },
    { key: 'briefed', label: 'Briefed' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'approved', label: 'Approved' },
    { key: 'overdue', label: `Overdue${overdueCount ? ` (${overdueCount})` : ''}` },
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Deliverables
          </h1>
          <span style={{
            fontSize: '10px', letterSpacing: '0.06em',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            padding: '3px 8px',
            color: 'var(--muted)',
          }}>
            {deliverables.length}
          </span>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: 'var(--ink)', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '9px 18px',
          }}
        >
          + Add Deliverable
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTER_PILLS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '5px 14px',
              border: '1px solid',
              borderColor: filter === key ? 'var(--ink)' : 'var(--border)',
              background: filter === key ? 'var(--ink)' : '#fff',
              color: filter === key ? '#fff' : 'var(--muted)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '0.04em' }}>
            {deliverables.length === 0 ? 'No deliverables yet.' : 'No deliverables match this filter.'}
          </p>
          {deliverables.length === 0 && (
            <button
              onClick={openAdd}
              style={{
                marginTop: '16px',
                background: 'none', border: '1px solid var(--border)',
                padding: '8px 18px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '10px',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)',
              }}
            >
              + Add First Deliverable
            </button>
          )}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Creator', 'Title', 'Type', 'Platform', 'Due Date', 'Status', 'Contract', 'Campaign', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--muted)', fontWeight: 400,
                  borderBottom: '1px solid var(--border)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const creator = creatorMap[d.creatorId];
              const campaign = d.campaignId ? campaignMap[d.campaignId] : null;
              const overdue = isOverdue(d);
              return (
                <tr
                  key={d.id}
                  onClick={() => openEdit(d)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: overdue ? '#FFF8F6' : '#fff',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = overdue ? '#FEEFEB' : 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.background = overdue ? '#FFF8F6' : '#fff'}
                >
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{creator ? creator.name : `#${d.creatorId}`}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '10px' }}>{creator ? creator.handle : ''}</div>
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: '200px' }}>
                    <span style={{ fontWeight: 400 }}>{d.title}</span>
                    {overdue && (
                      <span style={{
                        marginLeft: '6px', fontSize: '9px', letterSpacing: '0.08em',
                        color: '#C0392B', textTransform: 'uppercase',
                      }}>overdue</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)', textTransform: 'capitalize' }}>{d.type}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)', textTransform: 'capitalize' }}>{d.platform}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {d.dueDate || '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <StatusDot status={d.status} />
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)', textTransform: 'capitalize' }}>{d.contractType}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                    {campaign ? campaign.name : '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        title="Edit"
                        onClick={() => openEdit(d)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--muted)', padding: '2px 4px', lineHeight: 1,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        title="Delete"
                        onClick={() => deleteDeliverable(d.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--muted)', padding: '2px 4px', lineHeight: 1,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C0392B'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showForm && (
        <DeliverableForm
          deliverable={editTarget}
          creators={creators}
          campaigns={campaigns}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
