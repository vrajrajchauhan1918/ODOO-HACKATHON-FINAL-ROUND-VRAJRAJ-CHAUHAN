import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Settings, Search, Edit2, Trash2 } from 'lucide-react';

const ProductManagement = () => {
  const { categories, products, deleteProduct } = useProductStore();
  const [activeTab, setActiveTab] = useState('Categories');

  const handleAdd = () => {
    if (activeTab === 'Categories') {
       const name = window.prompt("Enter new Category name:");
       if (name) useProductStore.getState().addCategory(name);
    } else {
       const name = window.prompt("Enter Product form Name:");
       if (!name) return;
       const price = parseFloat(window.prompt("Enter Price (e.g. 5.99):", "0.00"));
       if (isNaN(price)) return;
       const category = window.prompt("Enter exact Category Name:", categories[0] || 'Food');
       
       useProductStore.getState().addProduct({ name, price, category, unit: 'pc', description: '' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
           <h2 style={{ margin: 0 }}>Settings</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Configure core inventory and operational parameters.</p>
        </div>
      </div>

      <div className="tab-list">
         <button className={`tab-btn ${activeTab === 'Categories' ? 'active' : ''}`} onClick={() => setActiveTab('Categories')}>Categories</button>
         <button className={`tab-btn ${activeTab === 'Products' ? 'active' : ''}`} onClick={() => setActiveTab('Products')}>Products</button>
      </div>

      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
         <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-base" placeholder={`Search ${activeTab.toLowerCase()}...`} style={{ paddingLeft: '2.25rem' }} />
         </div>
         <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={16} /> Add {activeTab.slice(0, -1)}
         </button>
      </div>

      <div className="panel" style={{ overflow: 'hidden' }}>
        <table className="app-table">
          <thead>
            <tr>
              {activeTab === 'Categories' ? (
                <><th>Category Name</th><th>Description</th><th style={{ textAlign: 'right' }}>Actions</th></>
              ) : (
                <><th>Name</th><th>Category</th><th>Price / Unit</th><th style={{ textAlign: 'right' }}>Actions</th></>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'Categories' && categories.map(cat => (
               <tr key={cat}>
                  <td>{cat}</td>
                  <td style={{ color: 'var(--text-muted)' }}>System generated category</td>
                  <td style={{ textAlign: 'right' }}>
                     <button className="btn-ghost" style={{ padding: '0.25rem' }}><Edit2 size={14} /></button>
                  </td>
               </tr>
            ))}
            
            {activeTab === 'Products' && products.map(product => (
               <tr key={product.id}>
                  <td>
                     {product.name}
                     {product.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{product.description}</div>}
                  </td>
                  <td><span className="badge">{product.category}</span></td>
                  <td className="mono-text">${product.price.toFixed(2)} / {product.unit || 'pc'}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                     <button className="btn-ghost" style={{ padding: '0.25rem' }}><Edit2 size={14} /></button>
                     <button className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--accent-danger)' }} onClick={() => deleteProduct(product.id)}><Trash2 size={14} /></button>
                  </td>
               </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
