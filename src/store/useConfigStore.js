import { create } from 'zustand';

export const useConfigStore = create((set, get) => ({
  paymentMethods: {
    cash: { enabled: true, name: 'Cash' },
    digital: { enabled: true, name: 'Digital (Card/Bank)' },
    upi: { enabled: true, name: 'UPI QR', upiId: '123@ybl.com' },
  },
  posSettings: {
    companyName: 'Odoo POS Cafe',
    taxRate: 5,
    currency: '$'
  },
  
  fetchData: async () => {
    try {
      const res = await fetch('/api/config');
      const configs = await res.json();
      const pmMap = configs.find(c => c.key === 'paymentMethods');
      const psMap = configs.find(c => c.key === 'posSettings');
      
      if (pmMap) set({ paymentMethods: JSON.parse(pmMap.value) });
      if (psMap) set({ posSettings: JSON.parse(psMap.value) });
    } catch (e) { console.error('Failed to load configs', e); }
  },

  updatePaymentMethod: async (methodId, data) => {
    const newPaymentMethods = {
      ...get().paymentMethods,
      [methodId]: { ...get().paymentMethods[methodId], ...data }
    };
    set({ paymentMethods: newPaymentMethods });
    
    try {
      await fetch('/api/config/paymentMethods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaymentMethods)
      });
      localStorage.setItem('pos-config-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  updatePOSSettings: async (data) => {
    const newPosSettings = { ...get().posSettings, ...data };
    set({ posSettings: newPosSettings });
    
    try {
      await fetch('/api/config/posSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPosSettings)
      });
      localStorage.setItem('pos-config-sync', Date.now());
    } catch (e) { console.error(e); }
  }
}));

useConfigStore.getState().fetchData();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'pos-config-sync') {
      useConfigStore.getState().fetchData();
    }
  });
}
