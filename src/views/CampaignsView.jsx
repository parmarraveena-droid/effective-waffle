import { useState } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_CONFIG = {
  planning: { dot: '#8A8A8A', label: 'Planning', bg: '#F5F5F3' },
  active:   { dot: '#2B5EA7', label: 'Active',   bg: '#EEF3FA' },
  complete: { dot: '#2A7A3B', label: 'Complete',  bg: '#EEF6F0' },
};

const DELIVERABLE_STATUS_DOT = {
  briefed:      '#8A8A8A',
  'in-progress':'#2B5EA7',
  delivered:    '#A0652A',
  approved:     '#2A7A3B',
};

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

const BLANK_CAMPAIGN = {
  name: '',
  brand: '',
  status: 'planning',
  startDate: '',
  endDate: '',
  notes: '',
};

function CampaignForm({ campaign, onClose, onSave }) {
  const [form, setForm] = useState(campaign
    ? { name: campaign.name, brand: campaign.brand, status: campaign.status, startDate: campaign.startDate, endDate: campaign.endDate, notes: campaign.notes }
    : { ...BLANK_CAMPAIGN }
  );

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      id: campaign ? campaign.id : crypto.randomUUID(),
      creatorIds: campaign ? campaign.creatorIds : [],
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
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {campaign ? 'Edit Campaign' : 'New Campaign'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Campaign Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Summer Glow" />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Brand</label>
          <input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand or client name" />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Status</label>
          <select style={{ ...inputStyle, appearance: 'none' }} value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.entries(STATUS_CONFIG).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input type="date" style={inputStyle} value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input type="date" style={inputStyle} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: 1.6 }}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Campaign brief, goals…"
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
            {campaign ? 'Save Changes' : 'Create Campaign'}
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

function CampaignDetail({ campaign, creators, deliverables, onClose, onEdit, onAddCreator, onRemoveCreator }) {
  const campaignDeliverables = deliverables.filter(d => d.campaignId === campaign.id);
  const assignedCreators = creators.filter(c => campaign.creatorIds.includes(c.id));
  const status = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.planning;
  const [search, setSearch] = useState('');

  const unassigned = creators.filter(c =>
    !campaign.creatorIds.includes(c.id) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase()))
  );

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
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                background: status.bg,
                color: status.dot,
                padding: '3px 8px',
              }}>
                {status.label}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{campaign.brand}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
              {campaign.name}
            </h2>
            {(campaign.startDate || campaign.endDate) && (
              <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px', letterSpacing: '0.03em' }}>
                {campaign.startDate} — {campaign.endDate}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={onEdit}
              style={{
                padding: '7px 14px', background: 'transparent', color: 'var(--ink)',
                border: '1px solid var(--border)', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              Edit
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        </div>

        {campaign.notes && (
          <p style={{ fontSize: '11px', lineHeight: 1.7, color: '#3A3A3A', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            {campaign.notes}
          </p>
        )}

        {/* Assigned Creators */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
            Creators ({assignedCreators.length})
          </div>
          {assignedCreators.length === 0 ? (
            <p style={{ fontSize: '11px', color: 'var(--muted)' }}>No creators assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {assignedCreators.map(c => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    border: '1px solid var(--border)', padding: '5px 10px',
                  }}
                >
                  <img
                    src={c.photo}
                    alt={c.name}
                    style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '50%' }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=40&background=EDEAE6&color=8A8A8A`; }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--ink)' }}>{c.name}</span>
                  <button
                    onClick={() => onRemoveCreator(c.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '14px', lineHeight: 1, marginLeft: '2px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add creator search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Add creator by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: '260px' }}
            />
            {search && unassigned.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, width: '260px',
                background: '#fff', border: '1px solid var(--border)',
                borderTop: 'none', zIndex: 10, maxHeight: '160px', overflowY: 'auto',
              }}>
                {unassigned.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    onClick={() => { onAddCreator(c.id); setSearch(''); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 10px', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      fontSize: '11px', color: 'var(--ink)',
                      borderBottom: '1px solid var(--border)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {c.name} <span style={{ color: 'var(--muted)' }}>{c.handle}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deliverables for this campaign */}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
            Deliverables ({campaignDeliverables.length})
          </div>
          {campaignDeliverables.length === 0 ? (
            <p style={{ fontSize: '11px', color: 'var(--muted)' }}>No deliverables linked to this campaign.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Creator', 'Title', 'Type', 'Due', 'Status'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaignDeliverables.map(d => {
                  const c = creators.find(cr => cr.id === d.creatorId);
                  const sc = DELIVERABLE_STATUS_DOT[d.status] || '#8A8A8A';
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 500 }}>{c ? c.name : `#${d.creatorId}`}</td>
                      <td style={{ padding: '8px 10px' }}>{d.title}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--muted)', textTransform: 'capitalize' }}>{d.type}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{d.dueDate || '—'}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc, flexShrink: 0 }} />
                          <span style={{ textTransform: 'capitalize', color: 'var(--ink)' }}>{d.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CampaignsView() {
  const { campaigns, deliverables, creators, addCampaign, updateCampaign, deleteCampaign } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const delCount = id => deliverables.filter(d => d.campaignId === id).length;

  const handleSave = (data) => {
    if (editTarget) {
      updateCampaign(data);
      setDetailTarget(data);
    } else {
      addCampaign(data);
    }
  };

  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (c, e) => { e && e.stopPropagation(); setEditTarget(c); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const openDetail = (c) => setDetailTarget(c);
  const closeDetail = () => setDetailTarget(null);

  const addCreatorToCampaign = (creatorId) => {
    if (!detailTarget) return;
    const updated = { ...detailTarget, creatorIds: [...detailTarget.creatorIds, creatorId] };
    updateCampaign(updated);
    setDetailTarget(updated);
  };

  const removeCreatorFromCampaign = (creatorId) => {
    if (!detailTarget) return;
    const updated = { ...detailTarget, creatorIds: detailTarget.creatorIds.filter(id => id !== creatorId) };
    updateCampaign(updated);
    setDetailTarget(updated);
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Campaigns
          </h1>
          <span style={{
            fontSize: '10px', letterSpacing: '0.06em',
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            padding: '3px 8px',
            color: 'var(--muted)',
          }}>
            {campaigns.length}
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
          + New Campaign
        </button>
      </div>

      {/* Grid */}
      {campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '0.04em' }}>No campaigns yet.</p>
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
            + Create First Campaign
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2px',
        }}>
          {campaigns.map(c => {
            const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.planning;
            const numDeliverables = delCount(c.id);
            return (
              <div
                key={c.id}
                onClick={() => openDetail(c)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                {/* Status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: status.bg,
                    color: status.dot,
                    padding: '3px 8px',
                  }}>
                    {status.label}
                  </span>
                  <button
                    onClick={e => openEdit(c, e)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--muted)', padding: '2px',
                    }}
                    title="Edit"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>

                {/* Name */}
                <h3 style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: '4px' }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '16px' }}>{c.brand}</p>

                {/* Date range */}
                {(c.startDate || c.endDate) && (
                  <p style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.03em', marginBottom: '16px' }}>
                    {c.startDate} — {c.endDate}
                  </p>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{c.creatorIds.length}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2px' }}>Creators</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{numDeliverables}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2px' }}>Deliverables</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CampaignForm
          campaign={editTarget}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      {detailTarget && !showForm && (
        <CampaignDetail
          campaign={detailTarget}
          creators={creators}
          deliverables={deliverables}
          onClose={closeDetail}
          onEdit={() => openEdit(detailTarget)}
          onAddCreator={addCreatorToCampaign}
          onRemoveCreator={removeCreatorFromCampaign}
        />
      )}
    </div>
  );
}
