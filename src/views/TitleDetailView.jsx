import { ARCHETYPES, TIERS } from '../data/creators';
import { useApp } from '../context/AppContext';
import CreatorCard from '../components/CreatorCard';

const BENCH_ARCHETYPES = ['lifestyle', 'fashion', 'food', 'entertainment'];

export default function TitleDetailView({ title, onBack, onCreatorClick }) {
  const { creators } = useApp();

  const assigned = creators.filter(c =>
    c.titleAssignments?.some(a => a.titleId === title.id)
  );

  const byTier = tier => assigned.filter(c =>
    c.titleAssignments.find(a => a.titleId === title.id)?.tier === tier
  );

  const tier1 = byTier('tier1');
  const tier2 = byTier('tier2');
  const benchCreators = byTier('bench');

  const benchByArchetype = BENCH_ARCHETYPES.map(arch => ({
    arch,
    label: ARCHETYPES[arch].label,
    color: ARCHETYPES[arch].color,
    creators: benchCreators.filter(c => c.archetype === arch),
  })).filter(g => g.creators.length > 0);

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '20px', display: 'block' }}
        >
          ← All Titles
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0', paddingBottom: '16px', borderBottom: '3px solid var(--ink)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: '32px', height: '3px', background: title.accent, marginBottom: '12px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, lineHeight: 1 }}>
              {title.name}
            </h1>
            <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '6px' }}>
              {title.tagline}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
            {[['Tier I', tier1.length], ['Tier II', tier2.length], ['Bench', benchCreators.length]].map(([label, count]) => (
              <div key={label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{count}</div>
                <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier I */}
      {tier1.length > 0 && (
        <TierBlock label="Tier I" description={TIERS.tier1.description} creators={tier1} onCreatorClick={onCreatorClick} minCardWidth="220px" />
      )}

      {/* Tier II */}
      {tier2.length > 0 && (
        <TierBlock label="Tier II" description={TIERS.tier2.description} creators={tier2} onCreatorClick={onCreatorClick} minCardWidth="190px" />
      )}

      {/* Bench — grouped by archetype */}
      {benchCreators.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>Creator Bench</span>
            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{TIERS.bench.description}</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' }}>{benchCreators.length}</span>
          </div>

          {benchByArchetype.map(({ arch, label, color, creators: archCreators }) => (
            <div key={arch} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontSize: '10px', color: 'var(--border)' }}>({archCreators.length})</span>
                {archCreators.some(c => c.titleAssignments.find(a => a.titleId === title.id)?.exclusive) && (
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: title.accent, marginLeft: '4px' }}>
                    Incl. exclusive
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))' }}>
                {archCreators.map(c => <CreatorCard key={c.id} creator={c} onClick={onCreatorClick} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {assigned.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)', fontSize: '12px' }}>
          No creators assigned to this title yet.
        </div>
      )}
    </div>
  );
}

function TierBlock({ label, description, creators, onCreatorClick, minCardWidth }) {
  return (
    <section style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>Tier {label === 'Tier I' ? 'I' : 'II'}</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{description}</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' }}>{creators.length}</span>
      </div>
      <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))` }}>
        {creators.map(c => <CreatorCard key={c.id} creator={c} onClick={onCreatorClick} />)}
      </div>
    </section>
  );
}
