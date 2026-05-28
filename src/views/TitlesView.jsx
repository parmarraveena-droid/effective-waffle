import { useState } from 'react';
import { titles } from '../data/titles';
import { ARCHETYPES } from '../data/creators';
import { useApp } from '../context/AppContext';
import CreatorCard from '../components/CreatorCard';
import TitleDetailView from './TitleDetailView';

function ArchetypeGrid({ creators, archetype, onCreatorClick, onBack }) {
  const arch = ARCHETYPES[archetype];
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
        >
          ← All Titles
        </button>
        <span style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>
          {arch.label}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>— {creators.length} creators across all titles</span>
      </div>
      <div style={{ display: 'grid', gap: '2px', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {creators.map(c => <CreatorCard key={c.id} creator={c} onClick={onCreatorClick} />)}
      </div>
    </div>
  );
}

export default function TitlesView({ onCreatorClick }) {
  const { creators } = useApp();
  const [activeTitle, setActiveTitle] = useState(null);
  const [archetypeFilter, setArchetypeFilter] = useState(null);

  if (archetypeFilter) {
    const filtered = creators.filter(c => c.archetype === archetypeFilter);
    return (
      <ArchetypeGrid
        creators={filtered}
        archetype={archetypeFilter}
        onCreatorClick={onCreatorClick}
        onBack={() => setArchetypeFilter(null)}
      />
    );
  }

  if (activeTitle) {
    return (
      <TitleDetailView
        title={activeTitle}
        onBack={() => setActiveTitle(null)}
        onCreatorClick={onCreatorClick}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Archetype filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0 }}>
          Browse by archetype
        </span>
        {Object.entries(ARCHETYPES).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setArchetypeFilter(key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: '11px',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px',
              paddingBottom: '2px', borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>
          {titles.length} titles · {creators.length} creators
        </span>
      </div>

      {/* Title cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)' }}>
        {titles.map(title => {
          const assigned = creators.filter(c =>
            c.titleAssignments?.some(a => a.titleId === title.id)
          );
          const byTier = tier => assigned.filter(c =>
            c.titleAssignments.find(a => a.titleId === title.id)?.tier === tier
          );
          const tier1 = byTier('tier1');
          const tier2 = byTier('tier2');
          const bench = byTier('bench');
          const previews = assigned.slice(0, 4);

          return (
            <div
              key={title.id}
              onClick={() => setActiveTitle(title)}
              style={{ background: '#fff', cursor: 'pointer', padding: '28px 24px 24px', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: title.accent }} />

              <div style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: '4px' }}>
                {title.name}
              </div>
              <div style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '24px' }}>
                {title.tagline}
              </div>

              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                  {previews.map((creator, i) => (
                    <div key={i} style={{ width: '44px', height: '56px', overflow: 'hidden', background: '#F0EDED', flexShrink: 0 }}>
                      <img
                        src={creator.photo}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                {[['I', tier1.length], ['II', tier2.length], ['Bench', bench.length]].map(([label, count]) => (
                  <div key={label}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: count > 0 ? 'var(--ink)' : 'var(--border)' }}>{count}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '1px' }}>Tier {label}</div>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                    {assigned.length} talent →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
