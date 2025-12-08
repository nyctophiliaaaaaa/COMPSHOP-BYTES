<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-inventory" />

    <main class="dashboard-main-content">
        <h1 class="welcome-title">Product Inventory</h1>
        
        <div class="inventory-card">
            
            <nav class="inventory-tabs">
                <button 
                    v-for="tab in tabs"
                    :key="tab"
                    :class="['tab-btn', { 'active': activeTab === tab }]"
                    @click="activeTab = tab"
                >
                    {{ tab }}
                </button>
            </nav>

            <div class="inventory-header">
                <h2>Stock Management - {{ activeTab }} ({{ filteredProducts.length }} items)</h2>
            </div>

            <div class="inventory-table-wrapper">
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th class="text-center">Current Stock</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in filteredProducts" :key="product.id">
                            <td>
                                <div class="product-info">
                                    <img :src="product.image_url" :alt="product.name" class="product-image-sm"/>
                                    <span class="product-name-col">{{ product.name }}</span>
                                </div>
                            </td>
                            <td>{{ product.category }}</td>
                            <td class="text-center">
                                <span :class="{'low-stock': product.currentStock <= 10}">
                                    {{ product.currentStock }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="stock-controls">
                                    <button 
                                        class="control-btn minus-btn" 
                                        @click="decreaseStock(product.id)"
                                        :disabled="product.currentStock <= 0"
                                    >-</button>
                                    <span class="control-value">{{ product.currentStock }}</span>
                                    <button 
                                        class="control-btn plus-btn" 
                                        @click="increaseStock(product.id)"
                                    >+</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-footer">
                <p>Displaying {{ filteredProducts.length }} products in the {{ activeTab }} category.</p>
            </div>
        </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';

const router = useRouter();
import tapsilog from '@/assets/tapsilog.png'; 
import sisig from '@/assets/sisig.png';
import chicken from '@/assets/chicken.png';
import burgersteak from '@/assets/burgersteak.png';
import buldakCarbonara from '@/assets/buldak-carbonara.png'; 
import shinRamyun from '@/assets/shin-ramyun.png'; 
import cantonSweetnSpicy from '@/assets/canton-sweetnspicy.png'; 
import buldak2x from '@/assets/buldak-2X.png';
import buldakCheese from '@/assets/buldak-cheese.png';
import buldakRose from '@/assets/buldak-rose.png';
import cantonChilimansi from '@/assets/canton-chilimansi.png';
import cantonCalamansi from '@/assets/canton-calamansi.png';
import jinRamen from '@/assets/jin-ramen.png';
import coke from '@/assets/coke.png'; 
import water from '@/assets/water.png';
import dew from '@/assets/dew.png'; 
import royal from '@/assets/royal.png';
import nestea from '@/assets/nestea.png';

const tabs = ['Meals', 'Noodles', 'Beverages'];
const activeTab = ref('Meals'); // Default to show Meals first

const products = ref([
    { id: 101, name: 'Tapsilog', category: 'Meals', price: 150.00, currentStock: 150, image_url: tapsilog },
    { id: 102, name: 'Sisig', category: 'Meals', price: 180.00, currentStock: 75, image_url: sisig },
    { id: 103, name: 'Chicken', category: 'Meals', price: 130.00, currentStock: 120, image_url: chicken },
    { id: 104, name: 'Burgersteak', category: 'Meals', price: 95.00, currentStock: 98, image_url: burgersteak },
    { id: 201, name: 'Buldak 2x Spicy', category: 'Noodles', price: 85.00, currentStock: 15, image_url: buldak2x },
    { id: 202, name: 'Buldak Carbonara', category: 'Noodles', price: 65.00, currentStock: 25, image_url: buldakCarbonara },
    { id: 203, name: 'Buldak Cheese', category: 'Noodles', price: 70.00, currentStock: 18, image_url: buldakCheese },
    { id: 204, name: 'Buldak Rosé', category: 'Noodles', price: 72.50, currentStock: 8, image_url: buldakRose },
    { id: 205, name: 'Pancit Canton Calamansi', category: 'Noodles', price: 18.00, currentStock: 60, image_url: cantonCalamansi },
    { id: 206, name: 'Pancit Canton Chilimansi', category: 'Noodles', price: 18.00, currentStock: 3, image_url: cantonChilimansi },
    { id: 207, name: 'Pancit Canton Sweet & Spicy', category: 'Noodles', price: 18.00, currentStock: 40, image_url: cantonSweetnSpicy },
    { id: 208, name: 'Jin Ramen', category: 'Noodles', price: 55.00, currentStock: 35, image_url: jinRamen },
    { id: 209, name: 'Shin Ramyun', category: 'Noodles', price: 72.50, currentStock: 10, image_url: shinRamyun },
    { id: 301, name: 'Mountain Dew', category: 'Beverages', price: 50.00, currentStock: 120, image_url: dew },
    { id: 302, name: 'Coke', category: 'Beverages', price: 89.00, currentStock: 12, image_url: coke },
    { id: 303, name: 'Bottled Water 500ml', category: 'Beverages', price: 25.00, currentStock: 200, image_url: water },
    { id: 304, name: 'Royal', category: 'Beverages', price: 55.00, currentStock: 65, image_url: royal },
    { id: 305, name: 'Nestea', category: 'Beverages', price: 40.00, currentStock: 50, image_url: nestea },
]);
const filteredProducts = computed(() => {
    return products.value.filter(p => p.category === activeTab.value);
});


const increaseStock = (productId) => {
    const product = products.value.find(p => p.id === productId);
    if (product) {
        product.currentStock += 1;
    }
};

const decreaseStock = (productId) => {
    const product = products.value.find(p => p.id === productId);
    if (product && product.currentStock > 0) {
        product.currentStock -= 1;
    }
};
</script>

<style scoped>
.kds-container {
    --color-dashboard-bg: #f5f5f5;
    --color-brand-primary: #ff724c;
    --sidebar-width: 280px; 
    --color-text-dark: #1f2937;
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

.inventory-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

/* --- Tab Navigation Styles --- */
.inventory-tabs {
    display: flex;
    border-bottom: 2px solid #f3f4f6;
    background-color: #fafafa;
    padding: 0 1.5rem;
}

.tab-btn {
    background: none;
    border: none;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px; /* Pulls the border up to meet the bottom line */
}

.tab-btn:hover {
    color: var(--color-text-dark);
}

.tab-btn.active {
    color: var(--color-brand-primary);
    border-bottom: 3px solid var(--color-brand-primary);
}

.inventory-header {
    /* Changed from justify-content: space-between to flex-start or left align h2 */
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
}
.inventory-header h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-dark);
    margin: 0;
}

.inventory-table-wrapper {
    overflow-x: auto;
}
.inventory-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}
.inventory-table thead th {
    background-color: #f9fafb;
    color: #6b7280;
    font-weight: 600;
    text-align: left;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
}
.inventory-table tbody tr {
    border-bottom: 1px solid var(--color-border);
}
.inventory-table tbody tr:last-child {
    border-bottom: none;
}
.inventory-table tbody td {
    padding: 1rem 1.5rem;
    color: var(--color-text-dark);
}

/* Product Info Column */
.product-info {
    display: flex;
    align-items: center;
}
.product-image-sm {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 1rem;
}
.product-name-col {
    font-weight: 500;
}

/* Stock Status */
.text-center {
    text-align: center;
}
.low-stock {
    font-weight: 700;
    color: #dc3545; /* Red color for low stock */
    padding: 0.2rem 0.5rem;
    background-color: #fce8e2;
    border-radius: 4px;
}

/* Stock Controls */
.stock-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
}
.control-btn {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1;
    transition: background-color 0.2s;
}
.control-btn:hover:not(:disabled) {
    background-color: #e5e7eb;
}
.control-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.plus-btn { color: var(--color-brand-primary); }
.minus-btn { color: var(--color-text-dark); }

.control-value {
    font-weight: 600;
    width: 30px;
    text-align: center;
}

.table-footer {
    padding: 0.75rem 1.5rem;
    color: #6b7280;
    font-size: 0.9rem;
}

</style>
