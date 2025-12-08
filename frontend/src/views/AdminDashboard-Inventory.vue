<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-inventory" />

    <main class="dashboard-main-content">
        <h1 class="welcome-title">Product Inventory</h1>
        
        <div class="inventory-card">
            
            <nav class="inventory-tabs">
                <button 
                    v-for="category in categories"
                    :key="category.category_id"
                    :class="['tab-btn', { 'active': activeTab === category.name }]"
                    @click="activeTab = category.name"
                >
                    {{ category.name }}
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
                                    <img 
                                        :src="`/images/${product.image_url}`" 
                                        :alt="product.name" 
                                        class="product-image-sm"
                                        @error="$event.target.src = '/images/placeholder.png'"
                                    />
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
                                        @click="updateStock(product, -1)"
                                        :disabled="product.currentStock <= 0 || isUpdating"
                                    >-</button>
                                    
                                    <span class="control-value">{{ product.currentStock }}</span>
                                    
                                    <button 
                                        class="control-btn plus-btn" 
                                        @click="updateStock(product, 1)"
                                        :disabled="isUpdating"
                                    >+</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-footer">
                <p v-if="loading">Loading inventory...</p>
                <p v-else>Displaying {{ filteredProducts.length }} products in the {{ activeTab }} category.</p>
            </div>
        </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '@/components/AdminSidebar.vue';

// STATE
const categories = ref([]); // fetched from DB
const products = ref([]);   // fetched from DB
const activeTab = ref('');  // will default to first category
const loading = ref(true);
const isUpdating = ref(false);

// MAPPER: Database ID -> Category Name
const categoryMap = ref({});

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        loading.value = true;

        // 1. Fetch Categories
        const catRes = await axios.get('http://localhost:3000/api/categories');
        categories.value = catRes.data;
        
        // Build the map (e.g. {1: 'Meals', 2: 'Noodles'})
        categories.value.forEach(cat => {
            categoryMap.value[cat.category_id] = cat.name;
        });

        // Set default tab
        if (categories.value.length > 0) {
            activeTab.value = categories.value[0].name;
        }

        // 2. Fetch Menu Items
        const menuRes = await axios.get('http://localhost:3000/api/menu');
        
        // Transform DB data to UI data
        products.value = menuRes.data.map(item => ({
            id: item.item_id,
            name: item.name,
            // Map the ID to the Name string using our map
            category: categoryMap.value[item.category_id] || 'Uncategorized', 
            price: item.price,
            currentStock: item.stock, // from the new column we added
            image_url: item.image_url // filename only (e.g. 'coke.png')
        }));

    } catch (error) {
        console.error("Error loading inventory:", error);
        alert("Failed to connect to backend.");
    } finally {
        loading.value = false;
    }
};

const filteredProducts = computed(() => {
    return products.value.filter(p => p.category === activeTab.value);
});

// REAL-TIME STOCK UPDATE
const updateStock = async (product, change) => {
    // Optimistic UI Update (Update screen instantly)
    const oldStock = product.currentStock;
    product.currentStock += change;
    isUpdating.value = true;

    try {
        // Send to Backend
        await axios.patch(`http://localhost:3000/api/menu/${product.id}/stock`, {
            quantity: change
        });
        // Success!
    } catch (error) {
        console.error("Stock update failed", error);
        // Revert on failure
        product.currentStock = oldStock; 
        alert("Failed to save stock update.");
    } finally {
        isUpdating.value = false;
    }
};
</script>

<style scoped>
/* Keeping your exact styles, they were good! */
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
    margin-bottom: -2px; 
}

.tab-btn:hover {
    color: var(--color-text-dark);
}

.tab-btn.active {
    color: var(--color-brand-primary);
    border-bottom: 3px solid var(--color-brand-primary);
}

.inventory-header {
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