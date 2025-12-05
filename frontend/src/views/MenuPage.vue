<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { addToCart } from '@/utils/cart.js';

// Import static UI assets (Icons only)
import categoriesIcon from '@/assets/categories-icon.jpg';
import HeaderBar from '@/components/HeaderBar.vue'
import searchMagnifyIcon from '@/assets/search.jpg';
import nextIcon from '@/assets/nextarrow.png';
import backIcon from '@/assets/backarrow.png';

// Import Order Status Popup
// OrderStatusPopup moved into HeaderBar

const router = useRouter();
const route = useRoute();

// (HeaderBar handles order status popup and logout)

const searchQuery = ref('');
const selectedCategory = ref('All Items');
const sortBy = ref('Popular');
const currentPage = ref(1);
const stationName = ref('Guest'); // Default value
const itemsPerPage = 14;

// 1. Define Categories
const categories = ['All Items', 'Instant Noodles', 'Meals', 'Beverages'];

// 2. State for Products
const products = ref([]);
const isLoading = ref(true);

// 3. Helper to Map Database ID (1,2,3) to Category Names
const categoryMap = {
  1: 'Meals',
  2: 'Instant Noodles',
  3: 'Beverages'
};

onMounted(async () => {
  // --- NEW LOGIC: GET USERNAME ---
  // We get the name saved during the Login process
  const currentUser = localStorage.getItem('username');
  
  if (currentUser) {
    stationName.value = `Hi, ${currentUser}`;
  } else {
    stationName.value = 'Guest';
  }
  // -------------------------------

  // 4. FETCH DATA FROM API
  try {
    const response = await axios.get('http://localhost:3000/api/menu');
    
    // Transform the data to match your frontend structure
    products.value = response.data.map(item => ({
      id: item.item_id,                
      name: item.name,
      price: item.price,
      image_url: item.image_url,       
      // Convert ID 1 -> 'Meals' so filters work
      category: categoryMap[item.category_id] || 'Other' 
    }));

  } catch (error) {
    console.error("Error fetching menu:", error);
    // Optional: alert("Could not load menu. Is the backend running?");
  } finally {
    isLoading.value = false;
  }
});

// 5. Logout Function
const handleLogout = () => {
  if(confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    router.push('/');
  }
};

// --- FILTERING & PAGINATION LOGIC ---

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

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const setPage = (page) => {
  currentPage.value = page;
};

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

const addToCartHandler = (item) => {
  addToCart(item);
};

const goToCart = () => {
  router.push('/cart');
};
</script>

<template>
  <div class="compshop-container">
    
    <HeaderBar />
    
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
        <div v-for="item in paginatedProducts" :key="item.id" class="product-card">
          <div class="image-container">
            <img 
              :src="`/images/${item.image_url}`" 
              :alt="item.name" 
              @error="$event.target.src = '/images/placeholder.png'" 
            />
          </div>
          <div class="card-details">
            <h3 class="product-name">{{ item.name }}</h3>
            <div class="card-footer">
              <span class="price">₱{{ item.price }}</span>
              <button class="add-btn" @click="addToCart(item)">
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button
          class="page-nav"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
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

        <button
          class="page-nav"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          <img :src="nextIcon" alt="Next" class="nav-icon" />
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.compshop-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.logo {
  display: flex;        
  align-items: center;
  gap: 8px;             
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.logo-img {
  height: 30px;
  width: auto;          
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.station-id {
  font-weight: 600;
  color: #555;
  margin-right: 5px;
  font-size: 0.9rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background-color: #f0f0f0;
}

/* Logout specific */
.logout-btn {
  color: #d9534f;
}
.logout-btn:hover {
  background-color: #ffe6e6;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  flex-shrink: 0;
}

.categories {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cat-label {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.cat-icon {
  width: 20px;
  height: 20px;
}

.cat-btn {
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  padding: 4px 8px;
}

.cat-btn.active {
  background-color: #ff6b4a;
  color: white;
  border-radius: 4px;
}

.search-wrapper {
  position: relative;
}

.search-wrapper input {
  padding: 6px 30px 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  font-size: 0.9rem;
}

.search-icon-img {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;  
  height: auto;
  cursor: pointer;
}

.content-area {
  padding: 0 1.5rem 1rem;
  flex-grow: 1;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.content-header h2 {
  font-size: 1.1rem;
  margin: 0;
}

.sort-wrapper label {
  font-size: 0.85rem;
}

.sort-wrapper select {
  padding: 3px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 5px;
  font-size: 0.85rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.product-card:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.image-container {
  width: 100%;
  height: 120px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;          
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;    
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  object-position: center;
}

.card-details {
  padding: 0.8rem;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  min-height: 2.5em;
  line-height: 1.2;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  color: #f59e0b;
  font-weight: 700;
  font-size: 1rem;
}

.add-btn {
  background-color: #ff6b4a;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 3px;
}

.add-btn:hover {
  background-color: #e55a3a;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
  margin-top: 2rem;     
}

.page-nav {
  border: none;
  background: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #777;
  font-size: 1rem;
  font-weight: bold;
}

.page-num {
  border: none;
  background: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #777;
  font-size: 1rem;
}

.page-num.active {
  font-weight: bold;
  color: #000;
}

.nav-icon {
  height: 16px;
  width: auto;
}
</style>