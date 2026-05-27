import { ARCHETYPES, TIERS } from '../data/creators';

const STATUS_OPTIONS = [
  { value: null, label: 'All' },
  { value: 'contracted', label: 'Contracted' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
];

export default function FilterBar({ filters, setFilters, searchQuery, setSearchQuery }) {
  const toggle = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', height: '44px', display: 'flex', alignItems: 'center', gap: '0' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginRight: '32px' }}>
          <svg style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '11px', height: '11px', color: 'var(--muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '18px',
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.04em',
              color: 'var(--ink)',
              background: 'transparent',
              width: '140px',
            }}
          />
        </div>

        <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginRight: '32px' }} />

        {/* Tier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '32px' }}>
          {Object.entries(TIERS).map(([key, { label }]) => (
            <button
              key={key}
              className={`filter-tab${filters.tier === key ? ' active' : ''}`}
              onClick={() => toggle('tier', key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginRight: '32px' }} />

        {/* Archetype */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '32px' }}>
          {Object.entries(ARCHETYPES).map(([key, { label }]) => (
            <button
              key={key}
              className={`filter-tab${filters.archetype === key ? ' active' : ''}`}
              onClick={() => toggle('archetype', key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginRight: '32px' }} />

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={label}
              className={`filter-tab${filters.status === value ? ' active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, status: value }))}
            >
              {label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
