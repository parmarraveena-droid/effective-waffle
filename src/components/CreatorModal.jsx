import { useEffect } from 'react';
import { ARCHETYPES, TIERS } from '../data/creators';

const STATUS_COLORS = {
  contracted: { bg: '#EAF4EC', text: '#2D7A3A' },
  active: { bg: '#EEF2FA', text: '#2B4D8C' },
  pending: { bg: '#FEF6E7', text: '#8C5E1A' },
};

const CONTRACT_COLORS = {
  Annual: { bg: '#F0EDE8', text: '#6B5840' },
  Project: { bg: '#EDF2F7', text: '#4A6375' },
  Handshake: { bg: '#F7F0ED', text: '#7A4A3A' },
};

export default function CreatorModal({ creator, onClose }) {
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!creator) return null;

  const archetype = ARCHETYPES[creator.archetype];
  const tier = TIERS[creator.tier];
  const statusStyle = STATUS_COLORS[creator.status] || STATUS_COLORS.active;
  const contractStyle = CONTRACT_COLORS[creator.contractType] || CONTRACT_COLORS.Handshake;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(13,13,13,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-panel bg-white w-full md:max-w-3xl md:rounded-sm overflow-hidden"
        style={{
          maxHeight: '90vh',
          border: '1px solid var(--color-border)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex flex-col md:flex-row" style={{ maxHeight: '90vh' }}>

          {/* Left — Photo */}
          <div
            className="flex-shrink-0 w-full md:w-72"
            style={{ background: '#F0EDE8' }}
          >
            <div className="w-full md:h-full" style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
              <img
                src={creator.photo}
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=400&background=E8E5E0&color=6B6B6B&bold=true`;
                }}
              />
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Close */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider"
                    style={{
                      background: '#F0EDE8',
                      color: 'var(--color-muted)',
                      letterSpacing: '0.1em',
                      fontSize: '0.6rem',
                      fontWeight: 600,
                    }}
                  >
                    {tier.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{ background: statusStyle.bg, color: statusStyle.text }}
                  >
                    {creator.status}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{ background: contractStyle.bg, color: contractStyle.text }}
                  >
                    {creator.contractType}
                  </span>
                </div>
                <h2
                  className="font-display text-2xl"
                  style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                >
                  {creator.name}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
                  {creator.handle} · {creator.location}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted)',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  padding: '4px',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Archetype */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-6"
              style={{ background: '#F8F6F2', border: '1px solid var(--color-border)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: archetype.color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--color-ink)' }}>
                {archetype.label}
              </span>
            </div>

            {/* Bio */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#3D3D3D' }}>
              {creator.bio}
            </p>

            {/* Stats */}
            <div
              className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-sm"
              style={{ background: '#F8F6F2' }}
            >
              <div>
                <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                  {creator.followers}
                </div>
                <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                  Total Reach
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                  {creator.engagement}
                </div>
                <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}>
                  Avg. Engagement
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="mb-6">
              <div
                className="text-xs uppercase tracking-wider mb-3"
                style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}
              >
                Platforms
              </div>
              <div className="flex gap-2 flex-wrap">
                {creator.platforms.map(p => (
                  <span
                    key={p}
                    className="text-xs px-3 py-1.5 rounded-sm capitalize"
                    style={{
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-ink)',
                      background: 'white',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div
                className="text-xs uppercase tracking-wider mb-3"
                style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}
              >
                Content Areas
              </div>
              <div className="flex gap-2 flex-wrap">
                {creator.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-sm capitalize"
                    style={{ background: '#F0EDE8', color: '#6B5840' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex gap-3 pt-6"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                className="flex-1 py-2.5 text-sm font-medium rounded-sm"
                style={{
                  background: 'var(--color-ink)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                View Full Profile
              </button>
              <button
                className="flex-1 py-2.5 text-sm font-medium rounded-sm"
                style={{
                  background: 'transparent',
                  color: 'var(--color-ink)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Add to Campaign
              </button>
              <button
                className="px-4 py-2.5 text-sm font-medium rounded-sm"
                style={{
                  background: 'transparent',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
