import { ARCHETYPES, TIERS } from '../data/creators';
import { useApp } from '../context/AppContext';
import CreatorCard from '../components/CreatorCard';

const TIER1_COUNT = 2;
const TIER2_COUNT = 4;
const BENCH_COUNT = 8;
const BENCH_ARCHETYPES = ['lifestyle', 'fashion', 'food', 'entertainment'];

// --- placeholder generation ---

const PH_NAMES = {
  lifestyle: ['Ava Chen','Noah Park','Luna Rivera','Ethan Cole','Zara White','Liam Foster','Nadia Bell','Owen Gray','Piper Stone','Rael Moss','Sienna Hart','Tom Wald','Uma Price','Val Cross','Will Fern','Xena Bloom','Yael Frost','Zoe Marsh','Arlo Vance','Bea Moon'],
  fashion:   ['Sophia Lane','Hugo West','Cleo Stone','Remy Black','Iris Gold','Felix York','Vera Nash','Miles Clay','Nina Fox','Quinn Rowe','Pia Stern','Rosa Holt','Seb Lake','Tara Bale','Uri Haze','Viv Roy','Wade Knox','Xia Cole','Yara Swift','Zion Hale'],
  food:      ['Olive Kim','Nico Bloom','Sage Quinn','Leo Hart','Fern Costa','Ada Moore','Rex Lund','Ivy Cross','Jay Holm','Kira Dale','Lou Ming','Mara Oak','Nia Ford','Otto Pine','Pip Hall','Rory Dean','Sky Noel','Taj Bell','Una Kaye','Vio Carr'],
  entertainment: ['Jade Fox','Sol King','Stella Moon','Kai Ray','Amber Chase','River Blue','Nova Frost','Tess Rae','Uma Lark','Vex Stone','Wren Gray','Xion Ward','Yen Wu','Zeb Hart','Ace Vega','Brix Lane','Cru Nash','Dax Reed','Elli Shore','Frey Carr'],
};

const PH_FOLLOWERS = {
  tier2:  ['155K','210K','285K','340K','430K','520K','615K','720K','810K','940K'],
  bench:  ['22K','28K','35K','44K','51K','63K','72K','85K','96K','118K'],
};

const PH_ENGAGEMENT = {
  tier2:  ['4.2%','5.1%','5.8%','6.3%','7.0%','7.6%','8.2%','9.0%'],
  bench:  ['9.3%','10.1%','11.4%','12.0%','12.8%','13.5%','14.2%','15.1%'],
};

const PH_PLATFORMS = {
  lifestyle:     [['instagram','tiktok'],['instagram','substack'],['tiktok','youtube'],['instagram'],['tiktok','instagram','substack']],
  fashion:       [['instagram','tiktok'],['instagram'],['tiktok'],['instagram','youtube'],['tiktok','instagram']],
  food:          [['instagram','youtube'],['instagram','tiktok'],['youtube'],['instagram'],['tiktok','youtube']],
  entertainment: [['tiktok','youtube'],['tiktok'],['youtube'],['instagram','tiktok'],['youtube','instagram']],
};

function titleSeed(titleId) {
  return parseInt(titleId.replace(/\D/g, ''), 10) || 1;
}

function makePlaceholder(titleId, tier, archetype, slotIndex) {
  const seed = titleSeed(titleId);
  const nameIdx = (seed * 3 + slotIndex * 7) % PH_NAMES[archetype].length;
  const name = PH_NAMES[archetype][nameIdx];
  const handle = '@' + name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  const tierKey = tier === 'tier2' ? 'tier2' : 'bench';
  const followers = PH_FOLLOWERS[tierKey][(seed + slotIndex) % PH_FOLLOWERS[tierKey].length];
  const engagement = PH_ENGAGEMENT[tierKey][(seed * 2 + slotIndex) % PH_ENGAGEMENT[tierKey].length];
  const platforms = PH_PLATFORMS[archetype][(seed + slotIndex) % PH_PLATFORMS[archetype].length];

  return {
    id: `ph-${titleId}-${tier}-${archetype}-${slotIndex}`,
    name,
    handle,
    tier,
    archetype,
    followers,
    engagement,
    platforms,
    status: slotIndex % 4 === 0 ? 'pending' : 'active',
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=600&background=EDEAE6&color=8A8A8A&bold=true`,
    tags: [],
    bio: '',
    location: '',
    contractType: 'Handshake',
    titleAssignments: [],
    placeholder: true,
  };
}

function padToCount(existing, titleId, tier, archetype, target) {
  const needed = target - existing.length;
  if (needed <= 0) return existing.slice(0, target);
  return [
    ...existing,
    ...Array.from({ length: needed }, (_, i) =>
      makePlaceholder(titleId, tier, archetype, existing.length + i)
    ),
  ];
}

// --- component ---

export default function TitleDetailView({ title, onBack, onCreatorClick }) {
  const { creators } = useApp();

  const assigned = creators.filter(c =>
    c.titleAssignments?.some(a => a.titleId === title.id)
  );

  const byTier = tier => assigned.filter(c =>
    c.titleAssignments.find(a => a.titleId === title.id)?.tier === tier
  );

  // Tier I — pad to TIER1_COUNT (real creators take priority)
  const tier1Real = byTier('tier1');
  const tier1 = padToCount(tier1Real, title.id, 'tier1', 'lifestyle', TIER1_COUNT);

  // Tier II — pad to TIER2_COUNT, cycling archetypes for placeholders
  const tier2Real = byTier('tier2');
  const tier2 = padToCount(
    tier2Real,
    title.id,
    'tier2',
    BENCH_ARCHETYPES[(titleSeed(title.id)) % BENCH_ARCHETYPES.length],
    TIER2_COUNT,
  );
  // give each placeholder a different archetype by overriding post-pad
  tier2.forEach((c, i) => {
    if (c.placeholder) {
      c.archetype = BENCH_ARCHETYPES[(titleSeed(title.id) + i) % BENCH_ARCHETYPES.length];
    }
  });

  // Bench — all 4 archetypes, each padded to BENCH_COUNT
  const benchReal = byTier('bench');
  const benchByArchetype = BENCH_ARCHETYPES.map(arch => ({
    arch,
    label: ARCHETYPES[arch].label,
    color: ARCHETYPES[arch].color,
    creators: padToCount(
      benchReal.filter(c => c.archetype === arch),
      title.id,
      'bench',
      arch,
      BENCH_COUNT,
    ),
    hasExclusive: benchReal
      .filter(c => c.archetype === arch)
      .some(c => c.titleAssignments.find(a => a.titleId === title.id)?.exclusive),
  }));

  const totalBench = BENCH_ARCHETYPES.length * BENCH_COUNT;

  // Don't open detail modal for placeholder cards
  const handleCreatorClick = (creator) => {
    if (!creator.placeholder) onCreatorClick(creator);
  };

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
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '16px', borderBottom: '3px solid var(--ink)' }}>
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
            {[['Tier I', TIER1_COUNT], ['Tier II', TIER2_COUNT], ['Bench', totalBench]].map(([label, count]) => (
              <div key={label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{count}</div>
                <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier I */}
      <TierBlock
        label="Tier I"
        description={TIERS.tier1.description}
        creators={tier1}
        onCreatorClick={handleCreatorClick}
        minCardWidth="220px"
      />

      {/* Tier II */}
      <TierBlock
        label="Tier II"
        description={TIERS.tier2.description}
        creators={tier2}
        onCreatorClick={handleCreatorClick}
        minCardWidth="190px"
      />

      {/* Creator Bench — all 4 archetypes × 8 */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>Creator Bench</span>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{TIERS.bench.description}</span>
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' }}>{totalBench}</span>
        </div>

        {benchByArchetype.map(({ arch, label, color, creators: archCreators, hasExclusive }) => (
          <div key={arch} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
              <span style={{ fontSize: '10px', color: 'var(--border)' }}>({BENCH_COUNT})</span>
              {hasExclusive && (
                <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: title.accent, marginLeft: '4px' }}>
                  Incl. exclusive
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))' }}>
              {archCreators.map(c => <CreatorCard key={c.id} creator={c} onClick={handleCreatorClick} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function TierBlock({ label, description, creators, onCreatorClick, minCardWidth }) {
  return (
    <section style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{description}</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' }}>{creators.length}</span>
      </div>
      <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))` }}>
        {creators.map(c => <CreatorCard key={c.id} creator={c} onClick={onCreatorClick} />)}
      </div>
    </section>
  );
}
