import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// --- FLOORS & TABLES ---
app.get('/api/floors', async (req, res) => {
  const floors = await prisma.floor.findMany();
  res.json(floors);
});

app.post('/api/floors', async (req, res) => {
  const { name } = req.body;
  const floor = await prisma.floor.create({ data: { name } });
  res.json(floor);
});

app.get('/api/tables', async (req, res) => {
  const tables = await prisma.table.findMany();
  res.json(tables);
});

app.post('/api/tables', async (req, res) => {
  const { floorId, name, seats } = req.body;
  const table = await prisma.table.create({
    data: { floorId, name, seats, active: true },
  });
  res.json(table);
});

app.put('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const table = await prisma.table.update({ where: { id }, data });
  res.json(table);
});

app.delete('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.table.delete({ where: { id } });
  res.json({ success: true });
});

// --- PRODUCTS & CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories.map(c => c.name));
});

app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  const category = await prisma.category.create({ data: { name } });
  res.json(category);
});

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.json(product);
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.update({ where: { id }, data: req.body });
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.json({ success: true });
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true } });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const { tableId, sessionId } = req.body;
  const order = await prisma.order.create({
    data: { tableId, sessionId, status: 'draft' },
    include: { items: true },
  });
  res.json(order);
});

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  
  if (data.paidAt) data.paidAt = new Date(data.paidAt);
  if (data.createdAt) data.createdAt = new Date(data.createdAt);
  
  const order = await prisma.order.update({
    where: { id },
    data,
    include: { items: true },
  });
  res.json(order);
});

// Full replace items helper
app.put('/api/orders/:id/items', async (req, res) => {
  const { id } = req.params;
  const { items, totalAmount } = req.body;
  
  // Wipe and recreate
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  
  const order = await prisma.order.update({
    where: { id },
    data: {
      totalAmount,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });
  res.json(order);
});

// --- CONFIG ---
app.get('/api/config', async (req, res) => {
  const configs = await prisma.config.findMany();
  res.json(configs);
});

app.post('/api/config/:key', async (req, res) => {
  const { key } = req.params;
  const config = await prisma.config.upsert({
    where: { key },
    update: { value: JSON.stringify(req.body) },
    create: { key, value: JSON.stringify(req.body) },
  });
  res.json(config);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
