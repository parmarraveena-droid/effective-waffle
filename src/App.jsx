import { useState, useMemo } from 'react';
import { TIERS } from './data/creators';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TierSection from './components/TierSection';
import CreatorModal from './components/CreatorModal';
import CreatorForm from './components/CreatorForm';
import DeliverablesView from './views/DeliverablesView';
import CampaignsView from './views/CampaignsView';
import TitlesView from './views/TitlesView';

function RosterView({ onCreatorClick }) {
  const { creators } = useApp();
  const [filters, setFilters] = useState({ tier: null, archetype: null, status: null });
  const [searchQuery, setSearchQuery] = useState('');

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
          (c.tags || []).some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [creators, filters, searchQuery]);

  const byTier = tierKey => filtered.filter(c => c.tier === tierKey);
  const hasResults = filtered.length > 0;

  return (
    <>
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
              onCreatorClick={onCreatorClick}
            />
          ))
        )}
      </main>
    </>
  );
}

function ReportsView() {
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
          Reports
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: '8px' }}>
          Coming Soon
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>
          Analytics, performance summaries, and campaign reporting will appear here.
        </p>
      </div>
    </div>
  );
}

function AppInner() {
  const { creators } = useApp();
  const [activeView, setActiveView] = useState('titles');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creatorFormMode, setCreatorFormMode] = useState(null);
  const [creatorFormTarget, setCreatorFormTarget] = useState(null);

  const openAdd = () => { setCreatorFormTarget(null); setCreatorFormMode('add'); };
  const openEdit = (creator) => { setCreatorFormTarget(creator); setCreatorFormMode('edit'); };
  const closeForm = () => { setCreatorFormMode(null); setCreatorFormTarget(null); };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Header
        creatorCount={creators.length}
        activeView={activeView}
        onViewChange={setActiveView}
        onAddCreator={openAdd}
      />

      {activeView === 'titles' && <TitlesView onCreatorClick={setSelectedCreator} />}
      {activeView === 'roster' && <RosterView onCreatorClick={setSelectedCreator} />}
      {activeView === 'deliverables' && <DeliverablesView />}
      {activeView === 'campaigns' && <CampaignsView />}
      {activeView === 'reports' && <ReportsView />}

      <footer style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px 24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>Creator Platform © 2025</span>
        <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>Talent Roster — Demo</span>
      </footer>

      {selectedCreator && (
        <CreatorModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
          onEdit={(creator) => { setSelectedCreator(null); openEdit(creator); }}
        />
      )}

      {creatorFormMode && (
        <CreatorForm
          mode={creatorFormMode}
          creator={creatorFormTarget}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
