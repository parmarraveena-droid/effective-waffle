import { useState, useRef, useEffect } from 'react';
import { titles } from '../data/titles';
import { ARCHETYPES } from '../data/creators';
import { useApp } from '../context/AppContext';
import TitleDetailView from './TitleDetailView';

function BrowseDropdown({ filter, onFilter }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const activeLabel =
    filter.type === 'title'
      ? titles.find(t => t.id === filter.value)?.name
      : filter.type === 'archetype'
      ? ARCHETYPES[filter.value]?.label
      : null;

  function select(type, value) {
    // toggle off if already active
    if (filter.type === type && filter.value === value) {
      onFilter({ type: null, value: null });
    } else {
      onFilter({ type, value });
    }
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: '10px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: activeLabel ? 'var(--ink)' : 'var(--muted)',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: 0,
        }}
      >
        Browse by
        {activeLabel && (
          <>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{activeLabel}</span>
          </>
        )}
        <span style={{
          fontSize: '8px', color: 'var(--muted)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s ease',
          display: 'inline-block',
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          background: '#fff', border: '1px solid var(--border)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          minWidth: '220px', zIndex: 100,
        }}>
          {/* By Title section */}
          <div style={{ padding: '12px 0 4px' }}>
            <div style={{
              padding: '0 16px 8px',
              fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>
              By Title
            </div>
            {titles.map(t => {
              const active = filter.type === 'title' && filter.value === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => select('title', t.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: active ? 'var(--cream)' : 'none',
                    border: 'none', cursor: 'pointer',
                    padding: '6px 16px',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: active ? 'var(--ink)' : 'var(--muted)',
                    borderLeft: active ? '2px solid var(--ink)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--cream)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none'; }}
                >
                  {t.name}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

          {/* By Archetype section */}
          <div style={{ padding: '4px 0 12px' }}>
            <div style={{
              padding: '8px 16px 8px',
              fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>
              By Archetype
            </div>
            {Object.entries(ARCHETYPES).map(([key, { label, color }]) => {
              const active = filter.type === 'archetype' && filter.value === key;
              return (
                <button
                  key={key}
                  onClick={() => select('archetype', key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', textAlign: 'left',
                    background: active ? 'var(--cream)' : 'none',
                    border: 'none', cursor: 'pointer',
                    padding: '6px 16px',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: active ? 'var(--ink)' : 'var(--muted)',
                    borderLeft: active ? '2px solid var(--ink)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--cream)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none'; }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TitlesView({ onCreatorClick }) {
  const { creators } = useApp();
  const [activeTitle, setActiveTitle] = useState(null);
  const [filter, setFilter] = useState({ type: null, value: null });

  if (activeTitle) {
    return (
      <TitleDetailView
        title={activeTitle}
        onBack={() => setActiveTitle(null)}
        onCreatorClick={onCreatorClick}
      />
    );
  }

  const filteredTitles =
    filter.type === 'title'
      ? titles.filter(t => t.id === filter.value)
      : filter.type === 'archetype'
      ? titles.filter(t =>
          creators.some(c =>
            c.archetype === filter.value &&
            c.titleAssignments?.some(a => a.titleId === t.id)
          )
        )
      : titles;

  const filteredCreatorCount =
    filter.type === 'archetype'
      ? creators.filter(c => c.archetype === filter.value).length
      : filter.type === 'title'
      ? creators.filter(c => c.titleAssignments?.some(a => a.titleId === filter.value)).length
      : creators.length;

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <BrowseDropdown filter={filter} onFilter={setFilter} />
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.06em' }}>
          {filteredTitles.length} {filteredTitles.length === 1 ? 'title' : 'titles'} · {filteredCreatorCount} creators
        </span>
      </div>

      {/* Title cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2px',
      }}>
        {filteredTitles.map(title => (
          <TitleCard
            key={title.id}
            title={title}
            onClick={() => setActiveTitle(title)}
          />
        ))}
      </div>
    </div>
  );
}

function TitleCard({ title, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '3 / 4',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#111',
      }}
    >
      <img
        src={title.image}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0) 100%)',
        transition: 'background 0.4s ease',
      }} />

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: title.accent,
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '24px 20px 20px',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '6px',
          opacity: hovered ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
        }}>
          {title.tagline}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: '#fff',
          lineHeight: 1.1,
        }}>
          {title.name}
        </div>
      </div>
    </div>
  );
}
