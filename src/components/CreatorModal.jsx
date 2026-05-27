import { useEffect, useState } from 'react';
import { ARCHETYPES, TIERS } from '../data/creators';
import { useApp } from '../context/AppContext';

const STATUS_COLORS = {
  contracted: { dot: '#2A7A3B', label: 'Contracted' },
  active: { dot: '#2B5EA7', label: 'Active' },
  pending: { dot: '#A0652A', label: 'Pending' },
};

const PLATFORM_ICONS = {
  instagram: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  tiktok: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>,
  youtube: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  podcast: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm-1.5 14.93A7.003 7.003 0 015 9H3a9 9 0 0010.5 8.94V20H11v2h4v-2h-2.5v-2.07A9 9 0 0021 9h-2a7 7 0 01-7 7 7 7 0 01-1.5-.07z"/></svg>,
  substack: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>,
};

const TODAY = new Date().toISOString().slice(0, 10);

const DELIVERABLE_STATUS = {
  briefed:      { dot: '#8A8A8A', label: 'Briefed' },
  'in-progress':{ dot: '#2B5EA7', label: 'In Progress' },
  delivered:    { dot: '#A0652A', label: 'Delivered' },
  approved:     { dot: '#2A7A3B', label: 'Approved' },
};

export default function CreatorModal({ creator, onClose, onEdit }) {
  const { notes, addNote, deliverables, addDeliverable, campaigns } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!creator) return null;

  const archetype = ARCHETYPES[creator.archetype];
  const tier = TIERS[creator.tier];
  const status = STATUS_COLORS[creator.status] || STATUS_COLORS.active;

  const creatorNotes = notes[creator.id] || [];
  const creatorDeliverables = deliverables.filter(d => d.creatorId === creator.id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(creator.id, noteText.trim());
    setNoteText('');
  };

  const handleQuickDeliverable = () => {
    const title = prompt('Deliverable title:');
    if (!title) return;
    addDeliverable({
      id: crypto.randomUUID(),
      creatorId: creator.id,
      title,
      type: 'post',
      platform: creator.platforms[0] || 'instagram',
      dueDate: '',
      status: 'briefed',
      contractType: 'contracted',
      campaignId: null,
      notes: '',
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
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
          maxWidth: '780px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        {/* Photo — left column */}
        <div style={{ width: '300px', flexShrink: 0, background: '#F0EDED', overflow: 'hidden' }}>
          <img
            src={creator.photo}
            alt={creator.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=600&background=EDEAE6&color=8A8A8A`;
            }}
          />
        </div>

        {/* Detail — right column */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 36px' }}>

          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Tier + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {tier.label}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.dot }} />
              {status.label}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {creator.contractType}
            </span>
          </div>

          {/* Name */}
          <h2 style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '4px' }}>
            {creator.name}
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.04em', marginBottom: '6px' }}>
            {creator.handle}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.04em', marginBottom: '28px' }}>
            {archetype.label} · {creator.location}
          </p>

          {/* Bio */}
          <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#3A3A3A', marginBottom: '28px' }}>
            {creator.bio}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '28px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {[['Reach', creator.followers], ['Engagement', creator.engagement], ['Platforms', creator.platforms.length]].map(([label, val], i) => (
              <div key={label} style={{
                flex: 1,
                padding: '16px 0',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                paddingLeft: i > 0 ? '20px' : 0,
              }}>
                <div style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{val}</div>
                <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '3px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Platforms */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>Platforms</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {creator.platforms.map(p => (
                <span key={p} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px', letterSpacing: '0.06em', textTransform: 'capitalize',
                  color: 'var(--ink)', border: '1px solid var(--border)',
                  padding: '5px 10px',
                }}>
                  <span style={{ color: 'var(--muted)' }}>{PLATFORM_ICONS[p]}</span>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>Content Areas</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {creator.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', letterSpacing: '0.06em', textTransform: 'capitalize',
                  color: 'var(--muted)', background: 'var(--cream)',
                  padding: '4px 10px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <button style={{
              flex: 1, padding: '11px', background: 'var(--ink)', color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              View Profile
            </button>
            <button style={{
              flex: 1, padding: '11px', background: 'transparent', color: 'var(--ink)',
              border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Add to Campaign
            </button>
            <button style={{
              padding: '11px 16px', background: 'transparent', color: 'var(--muted)',
              border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Message
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
