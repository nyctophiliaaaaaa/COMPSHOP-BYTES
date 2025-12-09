<script setup>
import OrderStatus from '@/components/OrderStatus.vue';
import { onMounted as onVueMounted, ref as vueRef } from 'vue';
const showOrderStatusPopup = vueRef(false);
onVueMounted(() => {
  if (localStorage.getItem('showOrderStatusPopup') === 'true') {
    showOrderStatusPopup.value = true;
    localStorage.removeItem('showOrderStatusPopup');
  }
});
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { addToCart } from '@/utils/cart.js';

import HeaderBar from '@/components/HeaderBar.vue';
import ProductCard from '@/components/ProductCard.vue';

import categoriesIcon from '@/assets/categories-icon.jpg';
import searchMagnifyIcon from '@/assets/search.jpg';
import nextIcon from '@/assets/nextarrow.png';
import backIcon from '@/assets/backarrow.png';

const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const selectedCategory = ref('All Items');
const sortBy = ref('Popular');
const currentPage = ref(1);
const itemsPerPage = 14;

const categories = ['All Items', 'Instant Noodles', 'Meals', 'Beverages'];

const products = ref([]);
const isLoading = ref(true);

const categoryMap = {
  1: 'Meals',
  2: 'Instant Noodles',
  3: 'Beverages'
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/menu');
    
    products.value = response.data.map(item => ({
      id: item.item_id,                
      name: item.name,
      price: item.price,
      image_url: item.image_url,       
      category: categoryMap[item.category_id] || 'Other' 
    }));

  } catch (error) {
    console.error("Error fetching menu:", error);
  } finally {
    isLoading.value = false;
  }
});

const filteredProducts = computed(() => {
  let items = products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'All Items' || p.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });

  if (sortBy.value === 'PriceLow') {
    items.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'PriceHigh') {
    items.sort((a, b) => b.price - a.price);
  }

  return items;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const setPage = (page) => {
  currentPage.value = page;
};

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

const handleAddToCart = (item) => {
  addToCart(item);
};
</script>

<template>
  <div class="menu-container">
    <HeaderBar />
    <OrderStatus v-if="showOrderStatusPopup" :isOpen="true" :autoMinimize="true" @close="showOrderStatusPopup = false" />
    
    <nav class="filter-bar">
      <div class="categories">
        <span class="cat-label">
          <img :src="categoriesIcon" alt="Categories" class="cat-icon" />
          Categories:
        </span>
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['cat-btn', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      
      <div class="search-wrapper">
        <input type="text" placeholder="Search..." v-model="searchQuery" />
        <img :src="searchMagnifyIcon" alt="Search" class="search-icon-img" />
      </div>
    </nav>
    
    <main class="content-area">
      <div class="content-header">
        <h2>{{ selectedCategory }}</h2>
        <div class="sort-wrapper">
          <label>Sort by:</label>
          <select v-model="sortBy">
            <option value="Popular">Popular</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        Loading Menu...
      </div>

      <div v-else class="product-grid">
        <ProductCard 
          v-for="item in paginatedProducts" 
          :key="item.id" 
          :item="item"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button class="page-nav" @click="prevPage" :disabled="currentPage === 1">
          <img :src="backIcon" alt="Prev" class="nav-icon" />
        </button>
        
        <button
          v-for="page in totalPages"
          :key="page"
          :class="['page-num', { active: currentPage === page }]"
          @click="setPage(page)"
        >
          {{ page }}
        </button>

        <button class="page-nav" @click="nextPage" :disabled="currentPage === totalPages">
          <img :src="nextIcon" alt="Next" class="nav-icon" />
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.menu-container {
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: var(--text-base);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(0.6rem, 1vw, 1rem) clamp(1rem, 1.5vw, 1.5rem);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: clamp(0.6rem, 1vw, 1rem);
  border-bottom: 1px solid #eee;
}

.categories {
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1vw, 1rem);
  flex-wrap: wrap;
}

.cat-label {
  font-weight: var(--weight-bold);
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.4vw, 0.4rem);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.cat-icon {
  width: clamp(16px, 1.5vw, 22px);
  height: clamp(16px, 1.5vw, 22px);
}

.cat-btn {
  border: none;
  background: none;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-family: var(--font-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: clamp(0.25rem, 0.4vw, 0.4rem) clamp(0.4rem, 0.6vw, 0.6rem);
  border-radius: clamp(4px, 0.4vw, 6px);
  transition: all 0.15s ease;
}

.cat-btn:hover {
  background-color: var(--color-bg-secondary, #f5f5f5);
}

.cat-btn.active {
  background-color: var(--color-primary, #ff6b4a);
  color: white;
}

.search-wrapper {
  position: relative;
}

.search-wrapper input {
  padding: clamp(0.4rem, 0.6vw, 0.6rem) clamp(1.5rem, 2.5vw, 2.5rem) clamp(0.4rem, 0.6vw, 0.6rem) clamp(0.6rem, 1vw, 1rem);
  border: 1px solid #ddd;
  border-radius: clamp(4px, 0.4vw, 6px);
  width: clamp(150px, 15vw, 250px);
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  outline: none;
  transition: border-color 0.15s ease;
}

.search-wrapper input:focus {
  border-color: #ff6b4a;
}

.search-icon-img {
  position: absolute;
  right: clamp(0.4rem, 0.6vw, 0.6rem);
  top: 50%;
  transform: translateY(-50%);
  width: clamp(14px, 1.2vw, 18px);
  height: auto;
  cursor: pointer;
  opacity: 0.6;
}

.content-area {
  padding: clamp(0.6rem, 1vw, 1rem) clamp(1rem, 1.5vw, 1.5rem);
  flex-grow: 1;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(0.6rem, 1vw, 1rem);
}

.content-header h2 {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.4vw, 0.4rem);
}

.sort-wrapper label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.sort-wrapper select {
  padding: clamp(0.25rem, 0.4vw, 0.4rem);
  border: 1px solid #ddd;
  border-radius: clamp(4px, 0.4vw, 6px);
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  outline: none;
  cursor: pointer;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 12vw, 200px), 1fr));
  gap: clamp(0.6rem, 1vw, 1rem);
  margin-bottom: clamp(0.6rem, 1vw, 1rem);
}


.loading-state {
  text-align: center;
  padding: clamp(2rem, 3.5vw, 3.5rem);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: clamp(0.6rem, 1vw, 1rem);
  align-items: center;
  margin-top: clamp(1.5rem, 2.5vw, 2.5rem);
  padding-bottom: clamp(1rem, 1.5vw, 1.5rem);
}

.page-nav {
  border: none;
  background: none;
  padding: clamp(0.25rem, 0.4vw, 0.4rem) clamp(0.4rem, 0.6vw, 0.6rem);
  cursor: pointer;
  color: var(--color-text-muted);
  font-weight: var(--weight-bold);
  transition: opacity 0.15s ease;
}

.page-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num {
  border: none;
  background: none;
  padding: clamp(0.25rem, 0.4vw, 0.4rem) clamp(0.4rem, 0.6vw, 0.6rem);
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  border-radius: clamp(4px, 0.4vw, 6px);
  transition: all 0.15s ease;
}

.page-num:hover {
  background-color: #f5f5f5;
}

.page-num.active {
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  background-color: #f0f0f0;
}

.nav-icon {
  height: clamp(12px, 1.3vw, 18px);
  width: auto;
}


@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-wrapper {
    width: 100%;
  }
  
  .search-wrapper input {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.6rem;
  }
  
  .cat-btn {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (min-width: 1440px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (min-width: 1920px) {
  .menu-container {
    max-width: 1920px;
    margin: 0 auto;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
