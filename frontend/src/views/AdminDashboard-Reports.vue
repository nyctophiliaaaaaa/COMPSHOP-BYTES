<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const monthlySales = ref({});
const reviews = ref([]);
let reviewPolling = null; 

const fetchSalesData = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/orders');
        const orders = res.data.filter(o => ['completed', 'served'].includes(o.status.toLowerCase()));
        const sales = {};
        orders.forEach(order => {
            const date = new Date(order.created_at);
            const monthName = date.toLocaleString('default', { month: 'long' });
            if (!sales[monthName]) sales[monthName] = { revenue: 0, count: 0 };
            sales[monthName].revenue += parseFloat(order.total_amount);
            sales[monthName].count += 1;
        });
        monthlySales.value = sales;
    } catch (error) { console.error("Error fetching sales:", error); }
};

const fetchReviews = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/reviews');
        reviews.value = res.data;
    } catch (error) { console.error("Error fetching reviews:", error); }
};

onMounted(() => {
    fetchSalesData();
    fetchReviews();
    reviewPolling = setInterval(fetchReviews, 10000); 
});

onUnmounted(() => {
    if (reviewPolling) {
        clearInterval(reviewPolling);
    }
});
</script>

<template>
  <div class="kds-container">
    <AdminSidebar active-route-name="admin-dashboard-reports" />

    <main class="dashboard-main-content">
        <h1 class="page-title">Reporting</h1>
        
        <div class="reporting-grid">
            
            <div class="report-card sales-report-panel">
                <h2 class="sales-report-title">Sales Performance</h2>
                
                <div class="table-display">
                    <table class="sales-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Revenue</th>
                                <th>Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(data, month) in monthlySales" :key="month">
                                <td style="text-transform: capitalize;">{{ month }}</td>
                                <td>₱ {{ data.revenue.toFixed(2) }}</td>
                                <td>{{ data.count }}</td>
                            </tr>
                            <tr v-if="Object.keys(monthlySales).length === 0">
                                <td colspan="3" style="text-align:center; color:#888;">No sales data yet.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="report-card customer-review-card">
                <h2 class="card-title">Customer Reviews</h2>
                
                <div class="review-scroll-area">
                    <div v-if="reviews.length === 0" class="no-reviews">No reviews yet.</div>

                    <div v-else v-for="review in reviews" :key="review.review_id" class="review-box">
                        <div class="review-header">
                            <span class="reviewer-name">{{ review.username || 'Anonymous' }}</span>
                            <span class="review-stars">{{ '★'.repeat(review.rating) }}</span> 
                        </div>
                        <p class="review-text">"{{ review.comment }}"</p>
                    </div>
                </div>
            </div>

        </div>
        
    </main>
  </div>
</template>

<style scoped>
.kds-container { 
    --color-dashboard-bg: #f5f5f5; 
    --color-text-dark: #1f2937; 
    --color-border: #e5e7eb; 
    --color-gray-light: #f9fafb; 
    display: flex; min-height: 100vh; max-height: 100vh; overflow: hidden; 
    background-color: var(--color-dashboard-bg); font-family: Arial, sans-serif; 
}

.dashboard-main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; }
.page-title { color: var(--color-text-dark); font-size: 2rem; margin-top: 0; margin-bottom: 1.5rem; }

.reporting-grid {
    display: grid;
    grid-template-columns: 1fr 350px; 
    gap: 1.5rem;
    align-items: start;
    height: calc(100vh - 150px);
}

.report-card { 
    background-color: white; 
    border-radius: 0.75rem; 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); 
    padding: 1.5rem; 
    height: 100%; 
    max-height: 100%; 
    display: flex;
    flex-direction: column;
    overflow: hidden; 
}

.card-title, .sales-report-title { 
    font-size: 1.1rem; font-weight: 700; color: #1f2937;
    margin: 0 0 1rem 0; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; 
}

.review-scroll-area, .table-display {
    overflow-y: auto; 
    flex-grow: 1;
    padding-right: 5px;
}

.review-box { 
    background-color: #fafafa; 
    border: 1px solid #eee;
    border-radius: 8px; 
    padding: 12px;
    margin-bottom: 10px;
    transition: transform 0.2s;
}
.review-box:hover {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}
.reviewer-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: #374151;
}
.review-stars {
    color: #ffb400;
    font-size: 0.85rem;
    letter-spacing: 1px;
}
.review-text { 
    font-style: italic;
    color: #555; 
    font-size: 0.9rem; 
    margin: 0; 
    line-height: 1.4;
}

.no-reviews { text-align: center; color: #888; padding: 20px; font-size: 0.9rem; }
.sales-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: left; }
.sales-table th { background-color: var(--color-gray-light); color: var(--color-text-dark); padding: 0.75rem 1rem; border-bottom: 2px solid var(--color-border); position: sticky; top: 0; }
.sales-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); }
.sales-table tbody tr:hover { background-color: #fff7f7; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

@media (max-width: 900px) {
    .reporting-grid { grid-template-columns: 1fr; height: auto; }
    .report-card { height: 400px; }
}
</style>