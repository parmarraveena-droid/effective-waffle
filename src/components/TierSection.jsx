import CreatorCard from './CreatorCard';

export default function TierSection({ tier, tierKey, creators, onCreatorClick }) {
  if (creators.length === 0) return null;

  return (
    <section style={{ marginBottom: '56px' }}>

      {/* Minimal section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          fontWeight: 500,
        }}>
          {tier.label}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.03em' }}>
          {tier.description}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' }}>
          {creators.length}
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gap: '2px',
        gridTemplateColumns: tierKey === 'tier1'
          ? 'repeat(auto-fill, minmax(220px, 1fr))'
          : tierKey === 'tier2'
          ? 'repeat(auto-fill, minmax(190px, 1fr))'
          : 'repeat(auto-fill, minmax(165px, 1fr))',
      }}>
        {creators.map(creator => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            onClick={onCreatorClick}
          />
        ))}
      </div>

    </section>
  );
}
