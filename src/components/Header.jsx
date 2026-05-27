export default function Header({ creatorCount }) {
  return (
    <header style={{ borderBottom: '1px solid var(--color-border)' }} className="bg-white">
      <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="font-display text-xl tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
              Hurst Creator Studios
            </div>
            <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--color-muted)', letterSpacing: '0.14em' }}>
              Center of Excellence
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {['Roster', 'Deliverables', 'Campaigns', 'Reports'].map((item, i) => (
            <button
              key={item}
              className="text-sm font-medium"
              style={{
                color: i === 0 ? 'var(--color-ink)' : 'var(--color-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                borderBottom: i === 0 ? '1px solid var(--color-ink)' : 'none',
                paddingBottom: '2px',
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="text-xs px-3 py-1.5 rounded-sm"
            style={{ background: '#F0EDE8', color: 'var(--color-muted)' }}
          >
            {creatorCount} creators
          </div>
          <button
            className="text-xs font-medium px-4 py-2 rounded-sm"
            style={{
              background: 'var(--color-ink)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            + Add Creator
          </button>
        </div>
      </div>
    </header>
  );
}
