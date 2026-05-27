import CreatorCard from './CreatorCard';

export default function TierSection({ tier, tierKey, creators, onCreatorClick }) {
  if (creators.length === 0) return null;

  return (
    <section className="mb-12">
      <div
        className="flex items-baseline gap-4 mb-6 pb-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em', margin: 0 }}
        >
          {tier.label}
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-muted)', margin: 0 }}>
          {tier.description}
        </p>
        <div className="ml-auto">
          <span
            className="text-xs px-2.5 py-1 rounded-sm"
            style={{ background: '#F0EDE8', color: 'var(--color-muted)' }}
          >
            {creators.length}
          </span>
        </div>
      </div>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: tierKey === 'tier1'
            ? 'repeat(auto-fill, minmax(220px, 1fr))'
            : tierKey === 'tier2'
            ? 'repeat(auto-fill, minmax(200px, 1fr))'
            : 'repeat(auto-fill, minmax(180px, 1fr))',
        }}
      >
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
