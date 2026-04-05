import React, { useMemo, useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, FileText, TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';

const Dashboard = () => {
  const { orders, currentSession } = useOrderStore();
  const { products } = useProductStore();
  const { user } = useAuthStore();
  
  const [period, setPeriod] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [responsible, setResponsible] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const stats = useMemo(() => {
    let filteredOrders = orders.filter(o => o.status === 'paid');

    if (sessionFilter === 'current' && currentSession) {
      filteredOrders = filteredOrders.filter(o => o.sessionId === currentSession.id);
    }
    if (productFilter !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.items.some(i => i.productId === productFilter));
    }
    
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
    
    let itemsSold = 0;
    filteredOrders.forEach(o => {
      o.items.forEach(i => itemsSold += i.quantity);
    });

    return { params: filteredOrders.length, revenue: totalRevenue, avg: avgOrderValue, items: itemsSold, paidOrders: filteredOrders };
  }, [orders, period, sessionFilter, responsible, productFilter, currentSession]);

  const chartData = stats.paidOrders.length > 0 ? 
    stats.paidOrders.map((o, i) => ({ name: `Order ${o.id.substring(0,6)}`, sales: o.totalAmount })) :
    [ { name: 'Mon', sales: 120 }, { name: 'Tue', sales: 250 }, { name: 'Wed', sales: 180 }, { name: 'Thu', sales: 300 } ];

  const handleExport = (type) => {
     alert(`Exporting Dashboard data as ${type.toUpperCase()}... (Mock Integration)`);
  };

  const MetricCard = ({ title, value, icon: Icon, color }) => (
     <div className="panel card-hover" style={{ padding: '1.25rem' }}>
         <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</span>
            <div style={{ padding: '0.375rem', backgroundColor: `rgba(${color}, 0.1)`, borderRadius: 'var(--radius-sm)' }}>
              <Icon size={16} style={{ color: `rgb(${color})` }} />
            </div>
         </div>
         <h3 className="mono-text" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--text-inverse)' }}>{value}</h3>
     </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
           <h2 style={{ margin: 0 }}>Analytics Overview</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monitor your real-time sales and terminal sessions.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <button className="btn btn-secondary" onClick={() => handleExport('pdf')}>
              <FileText size={16} /> Export PDF
           </button>
           <button className="btn btn-primary" onClick={() => handleExport('xls')}>
              <Download size={16} /> Export XLS
           </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="input-base" value={period} onChange={e => setPeriod(e.target.value)}>
               <option value="all">Period: All Time</option>
               <option value="today">Today</option>
               <option value="week">This Week</option>
            </select>
         </div>
         <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="input-base" value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}>
               <option value="all">Sessions: All</option>
               <option value="current">Current Active</option>
            </select>
         </div>
         <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="input-base" value={responsible} onChange={e => setResponsible(e.target.value)}>
               <option value="all">Staff: All Members</option>
               <option value="me">My Sales ({user?.name || 'Admin'})</option>
            </select>
         </div>
         <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="input-base" value={productFilter} onChange={e => setProductFilter(e.target.value)}>
               <option value="all">Product: All Items</option>
               {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
         </div>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
         <MetricCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={DollarSign} color="249, 115, 22" />
         <MetricCard title="Orders Completed" value={stats.params} icon={ShoppingCart} color="22, 163, 74" />
         <MetricCard title="Avg Order Value" value={`$${stats.avg.toFixed(2)}`} icon={TrendingUp} color="59, 130, 246" />
         <MetricCard title="Items Sold" value={stats.items} icon={Package} color="139, 92, 246" />
      </div>

      <div className="panel" style={{ padding: '1.5rem', height: '400px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Revenue Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
            <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dx={-10} />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
              contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-inverse)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', boxShadow: 'var(--shadow-float)' }}
              itemStyle={{ color: 'var(--text-inverse)', fontWeight: '600' }}
            />
            <Bar dataKey="sales" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
