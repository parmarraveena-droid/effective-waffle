import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ARCHETYPES, PLATFORMS } from '../data/creators';

const TIER_OPTIONS = [
  { value: 'tier1', label: 'Tier I' },
  { value: 'tier2', label: 'Tier II' },
  { value: 'bench', label: 'Creator Bench' },
];

const STATUS_OPTIONS = [
  { value: 'contracted', label: 'Contracted' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
];

const CONTRACT_OPTIONS = [
  { value: 'Annual', label: 'Annual' },
  { value: 'Project', label: 'Project' },
  { value: 'Handshake', label: 'Handshake' },
];

const BLANK = {
  name: '',
  handle: '',
  tier: 'tier2',
  archetype: 'lifestyle',
  location: '',
  followers: '',
  engagement: '',
  status: 'active',
  contractType: 'Project',
  platforms: [],
  bio: '',
  tags: '',
  photo: '',
};

const labelStyle = {
  fontSize: '9px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '5px',
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

const selectStyle = { ...inputStyle, appearance: 'none' };

export default function CreatorForm({ mode, creator, onClose }) {
  const { addCreator, updateCreator, creators } = useApp();

  const [form, setForm] = useState(() => {
    if (mode === 'edit' && creator) {
      return {
        ...BLANK,
        ...creator,
        tags: Array.isArray(creator.tags) ? creator.tags.join(', ') : (creator.tags || ''),
      };
    }
    return BLANK;
  });

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const togglePlatform = p => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const tagsArr = form.tags
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const payload = { ...form, tags: tagsArr };
    if (mode === 'edit') {
      updateCreator(payload);
    } else {
      const maxId = creators.reduce((m, c) => Math.max(m, c.id || 0), 0);
      addCreator({ ...payload, id: maxId + 1 });
    }
    onClose();
  };

  const photoSrc = form.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'New')}&size=600&background=EDEAE6&color=8A8A8A`;

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
          maxWidth: '820px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        {/* Photo preview — left */}
        <div style={{ width: '260px', flexShrink: 0, background: '#F0EDED', overflow: 'hidden', position: 'relative' }}>
          <img
            src={photoSrc}
            alt={form.name || 'Preview'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'New')}&size=600&background=EDEAE6&color=8A8A8A`;
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            padding: '20px 16px 16px',
          }}>
            <div style={{ fontSize: '11px', color: '#fff', letterSpacing: '0.04em', fontWeight: 500 }}>
              {form.name || '—'}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
              {form.handle || '—'}
            </div>
          </div>
        </div>

        {/* Form — right */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '36px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {mode === 'edit' ? 'Edit Creator' : 'Add Creator'}
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label style={labelStyle}>Handle</label>
              <input style={inputStyle} value={form.handle} onChange={e => set('handle', e.target.value)} placeholder="@handle" />
            </div>
            <div>
              <label style={labelStyle}>Tier</label>
              <select style={selectStyle} value={form.tier} onChange={e => set('tier', e.target.value)}>
                {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Archetype</label>
              <select style={selectStyle} value={form.archetype} onChange={e => set('archetype', e.target.value)}>
                {Object.entries(ARCHETYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State" />
            </div>
            <div>
              <label style={labelStyle}>Followers</label>
              <input style={inputStyle} value={form.followers} onChange={e => set('followers', e.target.value)} placeholder="e.g. 1.2M" />
            </div>
            <div>
              <label style={labelStyle}>Engagement Rate</label>
              <input style={inputStyle} value={form.engagement} onChange={e => set('engagement', e.target.value)} placeholder="e.g. 4.8%" />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={selectStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Contract Type</label>
              <select style={selectStyle} value={form.contractType} onChange={e => set('contractType', e.target.value)}>
                {CONTRACT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Platforms</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(PLATFORMS).map(([key, { label }]) => {
                const active = form.platforms.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => togglePlatform(key)}
                    style={{
                      fontSize: '10px', letterSpacing: '0.06em', textTransform: 'capitalize',
                      padding: '5px 12px',
                      border: active ? '1px solid var(--ink)' : '1px solid var(--border)',
                      background: active ? 'var(--ink)' : '#fff',
                      color: active ? '#fff' : 'var(--muted)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Photo URL</label>
            <input style={inputStyle} value={form.photo} onChange={e => set('photo', e.target.value)} placeholder="https://..." />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: 1.6 }}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="Short creator biography..."
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="wellness, fitness, mindset" />
          </div>

          <div style={{ marginTop: '28px', display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
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
              {mode === 'edit' ? 'Save Changes' : 'Add Creator'}
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
    </div>
  );
}
