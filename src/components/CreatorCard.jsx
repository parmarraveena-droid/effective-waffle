import { ARCHETYPES, TIERS } from '../data/creators';

const STATUS_COLORS = {
  contracted: { bg: '#EAF4EC', text: '#2D7A3A' },
  active: { bg: '#EEF2FA', text: '#2B4D8C' },
  pending: { bg: '#FEF6E7', text: '#8C5E1A' },
};

const PLATFORM_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  podcast: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm-1.5 14.93A7.003 7.003 0 015 9H3a9 9 0 0010.5 8.94V20H11v2h4v-2h-2.5v-2.07A9 9 0 0021 9h-2a7 7 0 01-7 7 7 7 0 01-1.5-.07z"/>
    </svg>
  ),
  substack: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
  ),
};

export default function CreatorCard({ creator, onClick }) {
  const archetype = ARCHETYPES[creator.archetype];
  const tier = TIERS[creator.tier];
  const statusStyle = STATUS_COLORS[creator.status] || STATUS_COLORS.active;

  return (
    <div
      className="creator-card bg-white rounded-sm overflow-hidden cursor-pointer"
      style={{ border: '1px solid var(--color-border)' }}
      onClick={() => onClick(creator)}
    >
      {/* Photo */}
      <div className="overflow-hidden" style={{ aspectRatio: '3/4', background: '#F0EDE8' }}>
        <img
          src={creator.photo}
          alt={creator.name}
          className="card-img w-full h-full object-cover"
          loading="lazy"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=400&background=E8E5E0&color=6B6B6B&bold=true`;
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3
              className="font-medium text-sm leading-tight"
              style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
            >
              {creator.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {creator.handle}
            </p>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0 ml-2"
            style={{ background: statusStyle.bg, color: statusStyle.text, letterSpacing: '0.02em' }}
          >
            {creator.status}
          </span>
        </div>

        {/* Archetype tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs"
            style={{ color: archetype.color, fontWeight: 500 }}
          >
            {archetype.label}
          </span>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {creator.location}
          </span>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
              {creator.followers}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>followers</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
              {creator.engagement}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>engagement</div>
          </div>
          {/* Platform icons */}
          <div className="flex gap-1.5 items-center">
            {creator.platforms.map(p => (
              <span key={p} style={{ color: 'var(--color-muted)' }} title={p}>
                {PLATFORM_ICONS[p]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
