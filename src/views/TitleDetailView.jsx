import { ARCHETYPES, TIERS } from '../data/creators';
import { useApp } from '../context/AppContext';
import CreatorCard from '../components/CreatorCard';

const TIER1_COUNT = 2;
const TIER2_COUNT = 4;
const BENCH_COUNT = 8;
const BENCH_ARCHETYPES = ['lifestyle', 'fashion', 'food', 'entertainment'];

// --- placeholder generation ---

const PH_NAMES = {
  lifestyle:     ['Ava Chen','Noah Park','Luna Rivera','Ethan Cole','Zara White','Liam Foster','Nadia Bell','Owen Gray','Piper Stone','Rael Moss','Sienna Hart','Tom Wald','Uma Price','Val Cross','Will Fern','Xena Bloom','Yael Frost','Zoe Marsh','Arlo Vance','Bea Moon'],
  fashion:       ['Sophia Lane','Hugo West','Cleo Stone','Remy Black','Iris Gold','Felix York','Vera Nash','Miles Clay','Nina Fox','Quinn Rowe','Pia Stern','Rosa Holt','Seb Lake','Tara Bale','Uri Haze','Viv Roy','Wade Knox','Xia Cole','Yara Swift','Zion Hale'],
  food:          ['Olive Kim','Nico Bloom','Sage Quinn','Leo Hart','Fern Costa','Ada Moore','Rex Lund','Ivy Cross','Jay Holm','Kira Dale','Lou Ming','Mara Oak','Nia Ford','Otto Pine','Pip Hall','Rory Dean','Sky Noel','Taj Bell','Una Kaye','Vio Carr'],
  entertainment: ['Jade Fox','Sol King','Stella Moon','Kai Ray','Amber Chase','River Blue','Nova Frost','Tess Rae','Uma Lark','Vex Stone','Wren Gray','Xion Ward','Yen Wu','Zeb Hart','Ace Vega','Brix Lane','Cru Nash','Dax Reed','Elli Shore','Frey Carr'],
};

// Confirmed old-format Unsplash portrait photo IDs (2:3 crop)
const PH_PHOTOS = [
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1504257432389-52343af06ae3',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1488716820095-cbe80883c496',
  'photo-1487412720507-e7ab37603c6f',
  'photo-1488161628813-04466f872be2',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1502823403499-6ccfcf4fb453',
  'photo-1596815064285-45ed8a9c0463',
  'photo-1463453091185-61582044d556',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1500648767791-00dcc994a43e',
  'photo-1534751516642-a1af1ef26a56',
  'photo-1507591064344-4c6ce005b128',
  'photo-1539571696357-5a69c17a67c6',
  'photo-1506277886164-e25aa3f4ef7f',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1580489944761-15a19d654956',
  'photo-1586297135537-94bc9ba060aa',
  'photo-1547425260-76bcadfb4f2c',
  'photo-1554151228-14d9def656e4',
  'photo-1570295999919-56ceb5ecca61',
  'photo-1494790108377-be9c29b29330',
  'photo-1519345182560-3f2917c472ef',
  'photo-1544005313-94ddf0286df2',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1527980965255-d3b416303d12',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1521119989659-a83eee488004',
];

const PH_BIOS = {
  lifestyle: [
    'Wellness creator and movement coach building a devoted following around mindful living and intentional daily routines.',
    'Slow living advocate blending minimalism, home wellness, and considered consumption into a warm editorial voice.',
    'Outdoor wellness guide specializing in recovery, breathwork, and adventure-inspired fitness programming.',
    'Yoga instructor and mindfulness educator with a nurturing community built on trust, consistency, and authentic sharing.',
    'Health optimization creator translating evidence-based wellness into accessible, inspiring content for everyday life.',
    'Pilates and mobility coach with a highly engaged niche audience in functional movement and longevity.',
    'Nature-immersed lifestyle creator exploring the intersection of mental health, outdoor ritual, and conscious living.',
    'Home and self-care creator with a slow, intentional practice centered on seasonal rhythms and restorative routines.',
  ],
  fashion: [
    'Editorial style creator with a refined eye for color, proportion, and emerging designer profiles from around the world.',
    'Sustainable fashion advocate empowering a conscious audience to dress with intention, creativity, and longevity in mind.',
    'Beauty creator specializing in skincare education, clean formulas, and skin-positive storytelling across platforms.',
    "Men's style and grooming creator with exceptional conversion rates and an audience of discerning high-intent buyers.",
    'Vintage styling expert and fashion archivist transforming archive pieces into modern, wearable editorial statements.',
    'Luxury accessories and RTW creator with deep brand relationships and a loyal following of aspiring tastemakers.',
    'Street-to-editorial creator known for unexpected styling combinations and a fearless, evolving personal aesthetic.',
    'Hair and beauty educator with tutorial-first content that prioritizes technique, product literacy, and inclusive beauty.',
  ],
  food: [
    'Recipe developer and food photographer creating vibrant, accessible content that makes home cooking feel effortless.',
    'Heritage cuisine creator bridging traditional techniques and cultural memory with a modern, approachable format.',
    'Pastry and baking educator whose content around fermentation, sourdough, and technique-first cooking has built a devoted following.',
    'Farm-to-table advocate and seasonal cooking specialist with a deeply loyal community rooted in sustainable eating.',
    'Restaurant culture journalist and dining critic building nuanced, honest culinary narratives across text and video.',
    'Cocktail creator and beverage educator covering craft spirits, low-ABV alternatives, and the culture of drinking well.',
    'Meal prep and accessible nutrition creator helping a busy audience eat well without sacrificing flavor or culture.',
    'Food systems advocate whose storytelling connects ingredient sourcing, community identity, and delicious everyday results.',
  ],
  entertainment: [
    'Culture commentator and micro-documentary creator known for sharp, bingeable video essays on contemporary life.',
    'Comedy writer and on-screen talent whose dry wit and social commentary resonates strongly across generational audiences.',
    'Music essayist and cultural critic with a dedicated niche audience built around thoughtful, long-form video exploration.',
    'Pop culture analyst and trend forecaster with a strong track record of early-adoption and culturally resonant content.',
    'Lifestyle storyteller blending humor, candor, and contemporary commentary for a diverse Millennial and Gen Z audience.',
    'Gaming and digital culture creator with a highly engaged community and strong crossover appeal into lifestyle content.',
    'Film and television critic whose accessible reviews and thematic deep-dives have earned a loyal, intellectually curious audience.',
    'Live events and nightlife journalist building an authentic voice at the intersection of culture, music, and community.',
  ],
};

const PH_TAGS = {
  lifestyle: [
    ['wellness','fitness','mindfulness'],['slow living','interiors','mindfulness'],
    ['outdoors','recovery','adventure'],['yoga','breathwork','community'],
    ['health','longevity','performance'],['pilates','mobility','body care'],
    ['nature','mental health','rituals'],['home','self-care','seasonal living'],
  ],
  fashion: [
    ['editorial','luxury','emerging designers'],['sustainable','vintage','conscious fashion'],
    ['skincare','clean beauty','skin positivity'],['menswear','grooming','luxury'],
    ['vintage','archive','styling'],['accessories','RTW','luxury'],
    ['streetwear','personal style','editorial'],['beauty','hair','tutorials'],
  ],
  food: [
    ['recipe development','food photography','home cooking'],['heritage','cultural cuisine','technique'],
    ['baking','fermentation','sourdough'],['farm-to-table','seasonal','sustainable'],
    ['dining','restaurant culture','criticism'],['cocktails','spirits','beverage'],
    ['meal prep','nutrition','accessibility'],['food systems','sourcing','community'],
  ],
  entertainment: [
    ['pop culture','documentary','video essays'],['comedy','social commentary','scripted'],
    ['music','culture','long-form video'],['trends','culture','analysis'],
    ['storytelling','comedy','lifestyle'],['gaming','digital culture','lifestyle'],
    ['film','television','criticism'],['nightlife','events','culture'],
  ],
};

const PH_LOCATIONS = [
  'New York, NY','Los Angeles, CA','Chicago, IL','Austin, TX','Brooklyn, NY',
  'San Francisco, CA','Miami, FL','Nashville, TN','Portland, OR','Seattle, WA',
  'Denver, CO','Atlanta, GA','Boston, MA','Philadelphia, PA','Dallas, TX',
  'Washington, DC','Minneapolis, MN','Phoenix, AZ','New Orleans, LA','Detroit, MI',
];

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
  const nameIdx    = (seed * 3  + slotIndex * 7)  % PH_NAMES[archetype].length;
  const photoIdx   = (seed * 11 + slotIndex * 13) % PH_PHOTOS.length;
  const bioIdx     = (seed * 5  + slotIndex * 3)  % PH_BIOS[archetype].length;
  const tagsIdx    = bioIdx % PH_TAGS[archetype].length;
  const locIdx     = (seed * 7  + slotIndex * 9)  % PH_LOCATIONS.length;
  const tierKey    = tier === 'tier2' ? 'tier2' : 'bench';
  const followers  = PH_FOLLOWERS[tierKey][(seed + slotIndex)      % PH_FOLLOWERS[tierKey].length];
  const engagement = PH_ENGAGEMENT[tierKey][(seed * 2 + slotIndex) % PH_ENGAGEMENT[tierKey].length];
  const platforms  = PH_PLATFORMS[archetype][(seed + slotIndex)    % PH_PLATFORMS[archetype].length];

  const name   = PH_NAMES[archetype][nameIdx];
  const handle = '@' + name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  const photo  = `https://images.unsplash.com/${PH_PHOTOS[photoIdx]}?w=600&h=900&fit=crop&crop=top&q=90`;

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
    contractType: tier === 'tier2' ? (slotIndex % 3 === 0 ? 'Annual' : 'Project') : 'Handshake',
    photo,
    bio:      PH_BIOS[archetype][bioIdx],
    tags:     PH_TAGS[archetype][tagsIdx],
    location: PH_LOCATIONS[locIdx],
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

  // Tier I — real first, pad to target
  const tier1 = padToCount(byTier('tier1'), title.id, 'tier1', 'lifestyle', TIER1_COUNT);

  // Tier II — real first, pad to target, cycle archetypes across placeholder slots
  const tier2Real = byTier('tier2');
  const tier2 = padToCount(
    tier2Real,
    title.id,
    'tier2',
    BENCH_ARCHETYPES[titleSeed(title.id) % BENCH_ARCHETYPES.length],
    TIER2_COUNT,
  );
  tier2.forEach((c, i) => {
    if (c.placeholder) {
      c.archetype = BENCH_ARCHETYPES[(titleSeed(title.id) + i) % BENCH_ARCHETYPES.length];
    }
  });

  // Bench — all 4 archetypes × BENCH_COUNT
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
      <TierBlock label="Tier I" description={TIERS.tier1.description} creators={tier1} onCreatorClick={onCreatorClick} minCardWidth="220px" />

      {/* Tier II */}
      <TierBlock label="Tier II" description={TIERS.tier2.description} creators={tier2} onCreatorClick={onCreatorClick} minCardWidth="190px" />

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
              {archCreators.map(c => <CreatorCard key={c.id} creator={c} onClick={onCreatorClick} />)}
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
