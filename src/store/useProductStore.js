import { create } from 'zustand';

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  
  fetchData: async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      set({ products, categories });
    } catch (e) { console.error('Failed to fetch product data', e); }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, price: parseFloat(product.price) })
      }).then(r => r.json());
      set(state => ({ products: [...state.products, newProduct] }));
      localStorage.setItem('pos-product-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  updateProduct: async (id, updatedProduct) => {
    try {
      const product = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedProduct, price: parseFloat(updatedProduct.price) })
      }).then(r => r.json());
      set(state => ({ products: state.products.map(p => p.id === id ? { ...p, ...product } : p) }));
      localStorage.setItem('pos-product-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  deleteProduct: async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      set(state => ({ products: state.products.filter(p => p.id !== id) }));
      localStorage.setItem('pos-product-sync', Date.now());
    } catch (e) { console.error(e); }
  },
  
  addCategory: async (category) => {
    try {
      const newCategory = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: category })
      }).then(r => r.json());
      set(state => ({ categories: [...state.categories, newCategory.name] }));
      localStorage.setItem('pos-product-sync', Date.now());
    } catch (e) { console.error(e); }
  }
}));

useProductStore.getState().fetchData();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'pos-product-sync') {
      useProductStore.getState().fetchData();
    }
  });
}
