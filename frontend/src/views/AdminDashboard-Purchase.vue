<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-purchase" />

    <main class="dashboard-main-content">
        <h1 class="welcome-title">Purchased</h1>
        
        <div class="purchase-card">
            <div class="receipt-header">
                <span class="date-label">Date: December 10, 2025</span>
            </div>

            <div class="receipt-table-wrapper">
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th class="item-col">ITEMS</th>
                            <th class="qty-col">QUANTITY</th>
                            <th class="total-col text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in purchasedItems" :key="index">
                            <td class="item-col">{{ item.name }}</td>
                            <td class="qty-col">{{ item.quantity }}</td>
                            <td class="total-col text-right">₱ {{ item.total.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="receipt-footer">
                <span class="total-label">Total:</span>
                <span class="final-total">₱ {{ grandTotal.toFixed(2) }}</span>
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const purchasedItems = ref([
    { name: 'Tapa', quantity: '3 KG', total: 1440.00 },
    { name: 'Egg', quantity: '2 TRAYS', total: 640.10 },
    { name: 'Rice', quantity: '15 KG', total: 630.00 },
    { name: 'Onion', quantity: '2 KG', total: 220.10 },
    { name: 'Garlic', quantity: '2 KG', total: 240.00 },
    { name: 'Pancit Canton - Calamansi', quantity: '25 PCS', total: 400.10 },
    { name: 'Buldak Ramen Carbonara', quantity: '50 PCS', total: 3000.00 },
    { name: 'Buldak Ramen 2x', quantity: '15 PCS', total: 975.10 },
]);

const grandTotal = computed(() => {
    return purchasedItems.value.reduce((sum, item) => sum + item.total, 0);
});
</script>

<style scoped>
.kds-container {
    --color-dashboard-bg: #f5f5f5;
    --color-brand-primary: #ff724c;
    --sidebar-width: 280px; 
    --color-text-dark: #1f2937;
    --color-text-secondary: #6b7280;
    --color-border: #e5e7eb;

    display: flex;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden; 
    background-color: var(--color-dashboard-bg);
    font-family: Arial, sans-serif;
}

.dashboard-main-content {
    flex-grow: 1;
    padding: 2rem; 
    overflow-y: auto; 
}
.welcome-title {
    color: var(--color-text-dark);
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.purchase-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    max-width: 700px; 
    margin: 0 auto;
}


.receipt-header {
    display: flex;
    justify-content: flex-end; /* ⭐ CHANGE: Aligns date to the right side ⭐ */
    align-items: center;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 1.5rem;
}

.date-label {
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    font-weight: 500;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat right center;
    padding-right: 20px; 
    background-size: 16px;
}

.receipt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;
    color: var(--color-text-dark);
}

.receipt-table thead th {
    font-weight: 700;
    text-align: left;
    padding: 0.5rem 0;
    color: #1f2937;
    font-size: 1.1rem;
}

.receipt-table tbody tr {
    border-top: 1px dashed #f3f4f6;
}
.receipt-table tbody tr:first-child {
    border-top: none; 
}

.receipt-table tbody td {
    padding: 0.75rem 0;
    font-weight: 500;
    line-height: 1.2;
}

.item-col { width: 50%; }
.qty-col { width: 30%; text-align: left; }
.total-col { width: 20%; }
.text-right { text-align: right; }

.receipt-footer {
    display: flex;
    justify-content: flex-end; 
    gap: 1.5rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #1f2937; 
}

.total-label {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-text-dark);
}

.final-total {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--color-brand-primary);
}

</style>
