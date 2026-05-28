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
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
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

      {/* Title cards — full-bleed editorial grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2px',
      }}>
        {titles.map(title => (
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
      {/* Background image */}
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

      {/* Gradient overlay — always present, deepens on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0) 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Accent bar — top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: title.accent,
      }} />

      {/* Text — bottom left */}
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
          transition: 'opacity 0.3s ease',
          opacity: hovered ? 1 : 0.8,
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
