import { createContext, useContext, useState, useEffect } from 'react';
import { creators as seedCreators } from '../data/creators';

const AppContext = createContext(null);

const DATA_VERSION = 3;

const SEED_DELIVERABLES = [
  {
    id: 'dlv-001',
    creatorId: 1,
    title: 'Summer Wellness Reel',
    type: 'reel',
    platform: 'instagram',
    dueDate: '2026-06-10',
    status: 'in-progress',
    contractType: 'contracted',
    campaignId: 'cmp-001',
    notes: 'Include #SummerWellness hashtag. 30–45s preferred.',
  },
  {
    id: 'dlv-002',
    creatorId: 2,
    title: 'Spring Edit Lookbook Post',
    type: 'post',
    platform: 'instagram',
    dueDate: '2026-05-30',
    status: 'delivered',
    contractType: 'contracted',
    campaignId: 'cmp-001',
    notes: 'Carousel format, 5–8 images.',
  },
  {
    id: 'dlv-003',
    creatorId: 4,
    title: 'Heritage Recipe YouTube Video',
    type: 'video',
    platform: 'youtube',
    dueDate: '2026-06-20',
    status: 'briefed',
    contractType: 'contracted',
    campaignId: 'cmp-002',
    notes: 'Long-form, 8–12 min. Brand integration at 2min mark.',
  },
  {
    id: 'dlv-004',
    creatorId: 7,
    title: 'TikTok Recipe Series — Ep 3',
    type: 'video',
    platform: 'tiktok',
    dueDate: '2026-05-20',
    status: 'approved',
    contractType: 'handshake',
    campaignId: 'cmp-002',
    notes: 'Third in the weekly series. Approved by brand.',
  },
];

const SEED_CAMPAIGNS = [
  {
    id: 'cmp-001',
    name: 'Summer Glow',
    brand: 'Lumière Beauty',
    status: 'active',
    startDate: '2026-05-15',
    endDate: '2026-07-31',
    creatorIds: [1, 2],
    notes: 'Multi-platform lifestyle + fashion push for summer product line.',
  },
  {
    id: 'cmp-002',
    name: 'Flavor Stories',
    brand: 'Harvest Table Co.',
    status: 'active',
    startDate: '2026-06-01',
    endDate: '2026-08-15',
    creatorIds: [4, 7],
    notes: 'Food and culinary series across YouTube + TikTok. Focus on heritage and culture.',
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem('cp_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === DATA_VERSION) {
        return {
          creators: parsed.creators ?? seedCreators,
          deliverables: parsed.deliverables ?? SEED_DELIVERABLES,
          campaigns: parsed.campaigns ?? SEED_CAMPAIGNS,
          notes: parsed.notes ?? {},
        };
      }
    }
  } catch {}
  return {
    creators: seedCreators,
    deliverables: SEED_DELIVERABLES,
    campaigns: SEED_CAMPAIGNS,
    notes: {},
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem('cp_state', JSON.stringify({ ...state, version: DATA_VERSION }));
  }, [state]);

  const setCreators = fn =>
    setState(prev => ({ ...prev, creators: typeof fn === 'function' ? fn(prev.creators) : fn }));
  const setDeliverables = fn =>
    setState(prev => ({ ...prev, deliverables: typeof fn === 'function' ? fn(prev.deliverables) : fn }));
  const setCampaigns = fn =>
    setState(prev => ({ ...prev, campaigns: typeof fn === 'function' ? fn(prev.campaigns) : fn }));
  const setNotes = fn =>
    setState(prev => ({ ...prev, notes: typeof fn === 'function' ? fn(prev.notes) : fn }));

  const addCreator = creator => setCreators(prev => [...prev, creator]);
  const updateCreator = updated =>
    setCreators(prev => prev.map(c => c.id === updated.id ? updated : c));
  const deleteCreator = id => setCreators(prev => prev.filter(c => c.id !== id));

  const addDeliverable = d => setDeliverables(prev => [...prev, d]);
  const updateDeliverable = updated =>
    setDeliverables(prev => prev.map(d => d.id === updated.id ? updated : d));
  const deleteDeliverable = id => setDeliverables(prev => prev.filter(d => d.id !== id));

  const addCampaign = c => setCampaigns(prev => [...prev, c]);
  const updateCampaign = updated =>
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  const deleteCampaign = id => setCampaigns(prev => prev.filter(c => c.id !== id));

  const addNote = (creatorId, text) => {
    const note = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
    setNotes(prev => ({
      ...prev,
      [creatorId]: [note, ...(prev[creatorId] || [])],
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addCreator, updateCreator, deleteCreator,
      addDeliverable, updateDeliverable, deleteDeliverable,
      addCampaign, updateCampaign, deleteCampaign,
      addNote,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
