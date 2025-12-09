<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-purchase" />

    <main class="dashboard-main-content">
        <h1 class="welcome-title">Completed Order History</h1>
        
        <div class="purchase-card">
            <div class="receipt-header">
                <span class="date-label">As of: {{ todayDate }}</span>
            </div>

            <div class="receipt-table-wrapper">
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th class="item-col">ORDER ID</th>
                            <th class="qty-col">STATUS</th>
                            <th class="total-col text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in completedOrders" :key="order.order_id">
                            <td class="item-col">#{{ order.order_id }}</td>
                            <td class="qty-col">{{ order.status.toUpperCase() }}</td>
                            <td class="total-col text-right">₱ {{ parseFloat(order.total_amount).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
                 <p v-if="completedOrders.length === 0" style="text-align: center; padding: 20px; color: #888">No completed transactions yet.</p>
            </div>

            <div class="receipt-footer">
                <span class="total-label">Total Revenue:</span>
                <span class="final-total">₱ {{ grandTotal.toFixed(2) }}</span>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const completedOrders = ref([]);

const todayDate = computed(() => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const grandTotal = computed(() => {
    return completedOrders.value.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
});

const fetchTransactions = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/orders');
        completedOrders.value = res.data.filter(o => 
            ['completed', 'served'].includes(o.status.toLowerCase())
        );
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};

onMounted(() => {
    fetchTransactions();
});
</script>

<style scoped>
.kds-container { --color-dashboard-bg: #f5f5f5; --color-brand-primary: #ff724c; --sidebar-width: 280px; --color-text-dark: #1f2937; --color-text-secondary: #6b7280; --color-border: #e5e7eb; display: flex; min-height: 100vh; max-height: 100vh; overflow: hidden; background-color: var(--color-dashboard-bg); font-family: Arial, sans-serif; }
.dashboard-main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; }
.welcome-title { color: var(--color-text-dark); font-size: 2rem; margin-top: 0; margin-bottom: 1.5rem; }
.purchase-card { background-color: white; border-radius: 0.75rem; box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.08); padding: 2rem; max-width: 700px; margin: 0 auto; }
.receipt-header { display: flex; justify-content: flex-end; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.5rem; }
.date-label { color: var(--color-text-secondary); font-size: 0.95rem; font-weight: 500; padding-right: 10px; }
.receipt-table { width: 100%; border-collapse: collapse; font-size: 1rem; color: var(--color-text-dark); }
.receipt-table thead th { font-weight: 700; text-align: left; padding: 0.5rem 0; color: #1f2937; font-size: 1.1rem; }
.receipt-table tbody tr { border-top: 1px dashed #f3f4f6; }
.receipt-table tbody tr:first-child { border-top: none; }
.receipt-table tbody td { padding: 0.75rem 0; font-weight: 500; line-height: 1.2; }
.item-col { width: 50%; }
.qty-col { width: 30%; text-align: left; }
.total-col { width: 20%; }
.text-right { text-align: right; }
.receipt-footer { display: flex; justify-content: flex-end; gap: 1.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #1f2937; }
.total-label { font-size: 1.4rem; font-weight: 700; color: var(--color-text-dark); }
.final-total { font-size: 1.4rem; font-weight: 800; color: var(--color-brand-primary); }
</style>