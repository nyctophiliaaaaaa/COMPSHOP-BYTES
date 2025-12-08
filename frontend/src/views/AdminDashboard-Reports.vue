<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const monthlySales = ref({});
const reviews = ref([]);
let reviewPolling = null; 

// 1. Fetch Sales (Runs on mount and populates the table)
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

// 2. Fetch Real Reviews (Runs periodically)
const fetchReviews = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/reviews');
        reviews.value = res.data;
    } catch (error) { console.error("Error fetching reviews:", error); }
};

onMounted(() => {
    fetchSalesData();
    // Start polling reviews every 10 seconds
    fetchReviews();
    reviewPolling = setInterval(fetchReviews, 10000); 
});

// CRITICAL: Stop the polling when the admin leaves the page
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
        
        <div class="reports-header-grid-simplified">
            
            <div class="report-card customer-review-card">
                <h2 class="card-title">Customer Reviews (Latest)</h2>
                
                <div v-if="reviews.length === 0" style="padding: 20px; color: #888;">No reviews yet.</div>

                <div v-else v-for="review in reviews" :key="review.review_id" class="review-box">
                    <p class="review-text">"{{ review.comment }}"</p>
                    <p class="reviewer-name">
                        <span style="color: #ffb400; margin-right: 5px;">{{ '★'.repeat(review.rating) }}</span> 
                        <strong>{{ review.username || 'Anonymous' }}</strong>
                    </p>
                </div>
            </div>
            
        </div>

        <div class="sales-report-panel">
            <h2 class="sales-report-title">Sales Performance (Real-Time)</h2>
            <div class="table-display">
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Revenue (PHP)</th>
                            <th>Orders Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, month) in monthlySales" :key="month">
                            <td style="text-transform: capitalize;">{{ month }}</td>
                            <td>₱ {{ data.revenue.toFixed(2) }}</td>
                            <td>{{ data.count }}</td>
                        </tr>
                        <tr v-if="Object.keys(monthlySales).length === 0">
                            <td colspan="3">No sales data recorded yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </main>
  </div>
</template>

<style scoped>
/* Keeping original styles and adjusting grid to fit two main sections */
.kds-container { --color-dashboard-bg: #f5f5f5; --color-brand-primary: #ff724c; --color-text-dark: #1f2937; --color-border: #e5e7eb; --color-gray-light: #f9fafb; --color-gray-medium: #6b7280; --color-positive: #10b981; --color-negative: #ef4444; display: flex; min-height: 100vh; max-height: 100vh; overflow: hidden; background-color: var(--color-dashboard-bg); font-family: Arial, sans-serif; }
.dashboard-main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; }
.page-title { color: var(--color-text-dark); font-size: 2rem; margin-top: 0; margin-bottom: 1.5rem; }

/* ADJUSTED: reports-header-grid-simplified now spans full width for reviews */
.reports-header-grid-simplified { 
    display: grid; 
    grid-template-columns: 1fr; /* Single column */
    gap: 1.5rem; 
    margin-bottom: 2rem;
}

.report-card { background-color: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); padding: 1.5rem; min-height: 350px; }
.card-title { font-size: 1.25rem; font-weight: 600; color: var(--color-text-dark); margin-top: 0; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--color-border); }

/* Removed .operations-card styles */

.customer-review-card .card-title { border-bottom: none; padding-bottom: 0; }
.review-box { padding: 1rem 0; border-bottom: 1px solid var(--color-gray-light); }
.review-box:last-of-type { border-bottom: none; }
.review-text { font-style: italic; color: var(--color-text-dark); margin-bottom: 0.25rem; margin-top: 0; }
.reviewer-name { font-size: 0.85rem; font-weight: 500; color: var(--color-gray-medium); margin: 0; }
.sales-report-panel { background-color: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); padding: 1.5rem; }
.sales-report-title { font-size: 1.5rem; font-weight: 600; color: var(--color-text-dark); margin-top: 0; margin-bottom: 1rem; }
.sales-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: left; }
.sales-table th { background-color: var(--color-gray-light); color: var(--color-text-dark); padding: 1rem; border-bottom: 2px solid var(--color-border); }
.sales-table td { padding: 1rem; border-bottom: 1px solid var(--color-border); }
.sales-table tbody tr:hover { background-color: #fff7f7; }
</style>