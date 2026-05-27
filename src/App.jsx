import { useState, useMemo } from 'react';
import { creators, TIERS } from './data/creators';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TierSection from './components/TierSection';
import CreatorModal from './components/CreatorModal';

export default function App() {
  const [filters, setFilters] = useState({ tier: null, archetype: null, status: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);

  const filtered = useMemo(() => {
    return creators.filter(c => {
      if (filters.tier && c.tier !== filters.tier) return false;
      if (filters.archetype && c.archetype !== filters.archetype) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.tags.some(t => t.includes(q))
        );
      }
      return true;
    });
  }, [filters, searchQuery]);

  const byTier = tierKey => filtered.filter(c => c.tier === tierKey);

  const hasResults = filtered.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Header creatorCount={creators.length} />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
        {!hasResults ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl mb-2" style={{ color: 'var(--color-ink)' }}>
              No creators found
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Try adjusting your filters or search query
            </p>
            <button
              className="mt-6 text-sm px-4 py-2"
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--color-ink)',
                borderRadius: '2px',
              }}
              onClick={() => {
                setFilters({ tier: null, archetype: null, status: null });
                setSearchQuery('');
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          Object.entries(TIERS).map(([tierKey, tier]) => (
            <TierSection
              key={tierKey}
              tier={tier}
              tierKey={tierKey}
              creators={byTier(tierKey)}
              onCreatorClick={setSelectedCreator}
            />
          ))
        )}
      </main>

      <footer style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px 24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>Creator Platform © 2025</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>Talent Roster — Demo</span>
      </footer>

      {selectedCreator && (
        <CreatorModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
}
