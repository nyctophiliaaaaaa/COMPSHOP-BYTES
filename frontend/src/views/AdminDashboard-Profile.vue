<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-profile" />

    <main class="dashboard-main-content">
        
        <div class="main-header">
            <h1 class="welcome-title">Welcome, Admin!</h1>
             <div class="top-nav-icons">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
           </div>
        </div>

        <div class="dashboard-grid">
          
          <div class="overview-card card row-full">
            <h3>Overview</h3>
            <div class="overview-metrics-grid">
              <div class="metric-box-sm">
                <div class="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7.5l-9-5.5-9 5.5v9l9 5.5 9-5.5z"/><path d="M2 13.5l10 6 10-6M12 2l10 6M12 12v10"/></svg>
                </div>
                <span class="metric-value-sm">{{ stats.totalProducts }}</span>
                <span class="metric-label-sm">Total Products</span>
              </div>

              <div class="metric-box-sm">
                <div class="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                </div>
                <span class="metric-value-sm">{{ stats.activeOrders }}</span>
                <span class="metric-label-sm">Active Orders</span>
              </div>

              <div class="metric-box-sm">
                <div class="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="4" rx="1"/><path d="M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M12 10V2"/></svg>
                </div>
                <span class="metric-value-sm">{{ stats.totalStock }}</span>
                <span class="metric-label-sm">Total Items Stock</span>
              </div>

              <div class="metric-box-sm">
                <div class="icon-circle" style="color: #dc3545; background-color: #fde8e8;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17h11A2.5 2.5 0 0121 19.5V20H4v-.5zM15 13H9V5h6V13z"/></svg>
                </div>
                <span class="metric-value-sm" style="color: #dc3545">{{ stats.lowStock }}</span>
                <span class="metric-label-sm">Low Stock Items</span>
              </div>
            </div>
          </div>

          <div class="row-two-column-grid">
              
              <div class="user-count-card card">
                <h3>No. of Users</h3>
                <div class="user-count-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 14c-3.14 0-6.26-.75-9-2M18 8a3 3 0 110-6 3 3 0 010 6z"/></svg>
                  <div class="count-text-group">
                    <span class="total-customers-value">{{ stats.totalUsers }}</span>
                    <span class="total-customers-label">Total Registered</span>
                  </div>
                </div>
              </div>

              <div class="best-sellers-card card">
                <h3>Best Sellers (Top 4)</h3>
                <p v-if="bestSellers.length === 0" class="text-gray-500">No sales data yet.</p>
                <ol v-else class="best-sellers-list-portrait">
                  <li v-for="(item, index) in bestSellers" :key="item.name">
                    <span class="item-name">{{ index + 1 }}. {{ item.name }}</span>
                    <span style="font-weight:bold; color: #ff724c">{{ item.count ? item.count + ' sold' : 'Popular' }}</span>
                  </li>
                </ol>
              </div>
          </div>
          
          </div>
    </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '@/components/AdminSidebar.vue';

// --- STATE ---
const stats = ref({
    totalProducts: 0,
    activeOrders: 0,
    lowStock: 0,
    totalStock: 0,
    totalUsers: 0
});

const bestSellers = ref([]);

// --- FETCH DATA (Logic remains the same as all data is still required) ---
const fetchDashboardData = async () => {
    try {
        // 1. Get Menu for Product Count & Stock
        const menuRes = await axios.get('http://localhost:3000/api/menu');
        const products = menuRes.data;
        stats.value.totalProducts = products.length;
        stats.value.totalStock = products.reduce((sum, item) => sum + item.stock, 0);
        stats.value.lowStock = products.filter(item => item.stock <= 10).length;

        // 2. Get Users Count
        const userRes = await axios.get('http://localhost:3000/api/admin/users');
        stats.value.totalUsers = userRes.data.length;

        // 3. Get Active Orders (Includes completed for sales/best sellers logic)
        const activeRes = await axios.get('http://localhost:3000/api/orders');
        stats.value.activeOrders = activeRes.data.filter(o => 
            ['pending', 'preparing', 'ready'].includes(o.status.toLowerCase())
        ).length;

        // 4. Calculate Best Sellers (Simulated from Products list for now)
        bestSellers.value = products.slice(0, 4).map(p => ({
            name: p.name,
            count: Math.floor(Math.random() * 50) + 10 
        })).sort((a,b) => b.count - a.count);

    } catch (e) {
        console.error("Dashboard fetch error:", e);
    }
};

onMounted(() => {
    fetchDashboardData();
});
</script>

<style scoped>
/* CORRECTED CSS VARIABLES SCOPE */
.kds-container {
    --color-text-dark: #1f2937;
    --color-text-secondary: #6b7280;
    --color-brand-primary: #ff724c;
    --color-dashboard-bg: #f5f5f5;
    --color-card-bg: white;
    --color-icon-bg-light: #fce8e2;
    --sidebar-width: 280px;
    
    display: flex;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    background-color: var(--color-dashboard-bg);
    font-family: Arial, sans-serif;
}

.dashboard-main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; }
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-shrink: 0; }
.top-nav-icons { display: flex; gap: 1.5rem; }
.header-icon { stroke: var(--color-text-dark); cursor: pointer; }
.welcome-title { font-size: 2rem; font-weight: 700; color: var(--color-text-dark); margin: 0; }

.card { background-color: white; border-radius: 0.75rem; box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.08); padding: 1.5rem; }
.card h3 { font-size: 1.2rem; font-weight: 600; color: var(--color-text-dark); margin-top: 0; margin-bottom: 1.5rem; }

.dashboard-grid { 
    display: flex; 
    flex-direction: column; 
    gap: 20px; 
    /* Ensures grid handles remaining two rows correctly */
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.row-full { grid-column: 1 / -1; }
.row-two-column-grid { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Overview Metrics */
.overview-metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
.metric-box-sm { text-align: center; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; display: flex; flex-direction: column; align-items: center; }

.icon-circle { 
    background-color: var(--color-icon-bg-light); 
    color: var(--color-brand-primary); 
    width: 50px; 
    height: 50px; 
    border-radius: 50%; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-bottom: 0.5rem; 
}
.icon-circle svg { stroke: var(--color-brand-primary); stroke-width: 1.5; }

.metric-value-sm { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.metric-label-sm { font-size: 0.85rem; color: var(--color-text-secondary); }

/* User Count */
.user-count-content { display: flex; align-items: center; justify-content: center; flex-grow: 1; padding-bottom: 1rem; }
.total-customers-value { font-size: 3.5rem; font-weight: 800; color: var(--color-brand-primary); line-height: 1; }
.total-customers-label { font-size: 1rem; color: #6b7280; font-weight: 500; margin-top: 5px; }

/* Best Sellers */
.best-sellers-list-portrait { list-style-type: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr; gap: 10px; }
.best-sellers-list-portrait li { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; font-size: 1rem; font-weight: 500; color: var(--color-text-dark); border-bottom: 1px solid #e5e7eb; }
.item-name { flex-grow: 1; margin-right: 10px; font-size: 0.95rem; }

/* Removed Expense vs Profit styles */

@media (min-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
@media (min-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr 1fr; gap: 20px; } .row-full { grid-column: 1 / 3; } .row-two-column-grid { grid-column: 1 / 3; grid-template-columns: 1fr 1fr; } }
</style>