import { ARCHETYPES, TIERS } from '../data/creators';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'contracted', label: 'Contracted' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
];

export default function FilterBar({ filters, setFilters, searchQuery, setSearchQuery }) {
  const toggle = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));
  };

  return (
    <div
      className="bg-white sticky top-0 z-10"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="max-w-screen-xl mx-auto px-8 py-4">
        <div className="flex items-center gap-6 flex-wrap">

          {/* Search */}
          <div className="relative flex-shrink-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: 'var(--color-muted)' }}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search creators…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm rounded-sm"
              style={{
                border: '1px solid var(--color-border)',
                background: 'transparent',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--color-ink)',
                outline: 'none',
                width: '180px',
              }}
            />
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />

          {/* Tier filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}>Tier</span>
            <div className="flex gap-1.5">
              {Object.entries(TIERS).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`filter-pill text-xs px-3 py-1.5 rounded-sm ${filters.tier === key ? 'active' : ''}`}
                  onClick={() => toggle('tier', key)}
                  style={{ color: filters.tier === key ? 'white' : 'var(--color-ink)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />

          {/* Archetype filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}>Focus</span>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(ARCHETYPES).map(([key, { label, color }]) => (
                <button
                  key={key}
                  className={`filter-pill text-xs px-3 py-1.5 rounded-sm ${filters.archetype === key ? 'active' : ''}`}
                  onClick={() => toggle('archetype', key)}
                  style={{ color: filters.archetype === key ? 'white' : 'var(--color-ink)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}>Status</span>
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`filter-pill text-xs px-3 py-1.5 rounded-sm ${
                    (value === 'all' && !filters.status) || filters.status === value ? 'active' : ''
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, status: value === 'all' ? null : value }))}
                  style={{
                    color:
                      (value === 'all' && !filters.status) || filters.status === value
                        ? 'white'
                        : 'var(--color-ink)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
