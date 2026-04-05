import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useOrderStore = create(
  persist(
    (set, get) => ({
      currentSession: null,
      orders: [], 

      fetchData: async () => {
        try {
          const res = await fetch('/api/orders');
          const orders = await res.json();
          set({ orders });
        } catch (e) { console.error('Failed to fetch orders', e); }
      },

      openSession: (startAmount) => {
        set({ currentSession: { id: generateId(), startTime: new Date().toISOString(), startAmount, status: 'open' } });
        localStorage.setItem('pos-order-sync', Date.now());
      },
      
      closeSession: () => {
        set({ currentSession: null });
        localStorage.setItem('pos-order-sync', Date.now());
      },
      
      createDraftOrder: async (tableId) => {
        try {
          const sessionId = get().currentSession?.id;
          const order = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId, sessionId })
          }).then(r => r.json());
          set(state => ({ orders: [...state.orders, order] }));
          localStorage.setItem('pos-order-sync', Date.now());
        } catch (e) { console.error(e); }
      },
      
      updateOrderItems: async (orderId, items, totalAmount) => {
        try {
          // Optimistic local update
          set(state => ({ orders: state.orders.map(o => o.id === orderId ? { ...o, items, totalAmount } : o) }));
          await fetch(`/api/orders/${orderId}/items`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, totalAmount })
          });
          localStorage.setItem('pos-order-sync', Date.now());
        } catch (e) { console.error(e); }
      },
      
      sendOrderToKitchen: async (orderId) => {
        try {
          const updates = { status: 'sent', kitchenStatus: 'To Cook' };
          set(state => ({ orders: state.orders.map(o => o.id === orderId ? { ...o, ...updates } : o) }));
          await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          localStorage.setItem('pos-order-sync', Date.now());
        } catch (e) { console.error(e); }
      },
      
      updateKitchenStatus: async (orderId, kitchenStatus) => {
        try {
          set(state => ({ orders: state.orders.map(o => o.id === orderId ? { ...o, kitchenStatus } : o) }));
          await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kitchenStatus })
          });
          localStorage.setItem('pos-order-sync', Date.now());
        } catch (e) { console.error(e); }
      },
      
      payOrder: async (orderId, paymentMethod) => {
        try {
          const updates = { status: 'paid', paymentMethod, paidAt: new Date().toISOString() };
          set(state => ({ orders: state.orders.map(o => o.id === orderId ? { ...o, ...updates } : o) }));
          await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          localStorage.setItem('pos-order-sync', Date.now());
        } catch (e) { console.error(e); }
      }
    }),
    {
      name: 'pos-session-v2',
      partialize: (state) => ({ currentSession: state.currentSession })
    }
  )
);

useOrderStore.getState().fetchData();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'pos-order-sync') {
      useOrderStore.getState().fetchData();
    }
  });
}
