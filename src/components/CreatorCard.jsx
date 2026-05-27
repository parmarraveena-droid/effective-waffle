import { ARCHETYPES } from '../data/creators';

const STATUS_COLORS = {
  contracted: '#2A7A3B',
  active: '#2B5EA7',
  pending: '#A0652A',
};

export default function CreatorCard({ creator, onClick }) {
  const archetype = ARCHETYPES[creator.archetype];

  return (
    <div className="creator-card" onClick={() => onClick(creator)}>

      {/* Photo */}
      <div className="photo-wrap">
        <img
          src={creator.photo}
          alt={creator.name}
          loading="lazy"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=600&background=EDEAE6&color=8A8A8A`;
          }}
        />

        {/* Hover overlay */}
        <div className="overlay">
          <div className="overlay-handle">{creator.handle}</div>
          <div className="overlay-stats">
            <div className="overlay-stat">
              {creator.followers}
              <span>Reach</span>
            </div>
            <div className="overlay-stat">
              {creator.engagement}
              <span>Eng.</span>
            </div>
            <div className="overlay-stat">
              {creator.platforms.length}
              <span>Platforms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Name row */}
      <div style={{ paddingTop: '10px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', color: 'var(--ink)', lineHeight: 1.3 }}>
            {creator.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span
              className="status-dot"
              style={{ background: STATUS_COLORS[creator.status] || STATUS_COLORS.active }}
            />
          </div>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.04em', marginTop: '2px' }}>
          {archetype.label}
        </div>
      </div>

    </div>
  );
}
