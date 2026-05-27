export default function Header({ creatorCount }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Wordmark */}
        <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink)' }}>
          Creator Platform
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Roster', true], ['Deliverables', false], ['Campaigns', false], ['Reports', false]].map(([label, active]) => (
            <button
              key={label}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: active ? 'var(--ink)' : 'var(--muted)',
                borderBottom: active ? '1px solid var(--ink)' : '1px solid transparent',
                paddingBottom: '2px',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.04em' }}>
            {creatorCount} talent
          </span>
          <button
            style={{
              background: 'var(--ink)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '8px 16px',
            }}
          >
            + Add
          </button>
        </div>

      </div>
    </header>
  );
}
