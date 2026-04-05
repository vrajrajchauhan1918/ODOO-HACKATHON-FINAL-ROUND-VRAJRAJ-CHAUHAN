import { create } from 'zustand';

export const useFloorStore = create((set, get) => ({
  floors: [],
  tables: [],
  
  fetchData: async () => {
    try {
      const [floorsRes, tablesRes] = await Promise.all([
        fetch('/api/floors'),
        fetch('/api/tables')
      ]);
      const floors = await floorsRes.json();
      const tables = await tablesRes.json();
      set({ floors, tables });
    } catch (e) { console.error('Failed to fetch floors data', e); }
  },

  addFloor: async (name) => {
    try {
      const floor = await fetch('/api/floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }).then(r => r.json());
      set(state => ({ floors: [...state.floors, floor] }));
      localStorage.setItem('pos-floor-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  addTable: async (floorId, name, seats) => {
    try {
      const table = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floorId, name, seats })
      }).then(r => r.json());
      set(state => ({ tables: [...state.tables, table] }));
      localStorage.setItem('pos-floor-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  updateTable: async (id, data) => {
    try {
      const table = await fetch(`/api/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json());
      set(state => ({ tables: state.tables.map(t => t.id === id ? { ...t, ...table } : t) }));
      localStorage.setItem('pos-floor-sync', Date.now());
    } catch (e) { console.error(e); }
  },

  removeTable: async (id) => {
    try {
      await fetch(`/api/tables/${id}`, { method: 'DELETE' });
      set(state => ({ tables: state.tables.filter(t => t.id !== id) }));
      localStorage.setItem('pos-floor-sync', Date.now());
    } catch (e) { console.error(e); }
  }
}));

// Bootstrapper: Load data asynchronously alongside component mount
useFloorStore.getState().fetchData();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'pos-floor-sync') {
      useFloorStore.getState().fetchData();
    }
  });
}
