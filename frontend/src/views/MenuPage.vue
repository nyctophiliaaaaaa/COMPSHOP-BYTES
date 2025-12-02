<script setup>

import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import categoriesIcon from '@/assets/categories-icon.jpg';
import appLogo from '@/assets/logo.png';
import searchMagnifyIcon from '@/assets/search.jpg';

import nextIcon from '@/assets/nextarrow.png';
import backIcon from '@/assets/backarrow.png';

import pancitCantonImage from '@/assets/canton-chilimansi.png';
import cantonCalamansiImage from '@/assets/canton-calamansi.png';
import cantonSweetSpicyImage from '@/assets/canton-sweetnspicy.png';
import buldakCarbonaraImage from '@/assets/buldak-carbonara.png';
import buldak2xImage from '@/assets/buldak-2X.png';
import buldakCheeseImage from '@/assets/buldak-cheese.png';
import shinRamyunImage from '@/assets/shin-ramyun.png';
import jinRamenImage from '@/assets/jin-ramen.png';
import buldakRoseImage from '@/assets/buldak-rose.png';

import tapsilogImage from '@/assets/tapsilog.png';
import chickenImage from '@/assets/chicken.png';
import sisigImage from '@/assets/sisig.png';
import burgersteakImage from '@/assets/burgersteak.png';

import cokeImage from '@/assets/coke.png';
import dewImage from '@/assets/dew.png';
import royalImage from '@/assets/royal.png';
import waterImage from '@/assets/water.png';
import nesteaImage from '@/assets/nestea.png';

const router = useRouter();
const searchQuery = ref('');
const selectedCategory = ref('All Items');
const sortBy = ref('Popular');
const currentPage = ref(1);
const stationName = ref('Station --');
const itemsPerPage = 14;

const categories = ['All Items', 'Instant Noodles', 'Meals', 'Beverages'];

onMounted(() => {
  const randomStation = Math.floor(Math.random() * 50) + 1;
  stationName.value = `Station ${randomStation}`;
});

const products = ref([
  { id: 1, name: 'Tapsilog', price: 60, category: 'Meals', image: tapsilogImage },
  { id: 11, name: 'Fried Chicken w/ Rice', price: 85, category: 'Meals', image: chickenImage },
  { id: 12, name: 'Pork Sisig w/ Rice', price: 90, category: 'Meals', image: sisigImage },  
  { id: 13, name: 'Burger Steak', price: 75, category: 'Meals', image: burgersteakImage },         

  { id: 2, name: 'Pancit Canton - Chilimansi', price: 25, category: 'Instant Noodles', image: pancitCantonImage },
  { id: 3, name: 'Pancit Canton - Calamansi', price: 25, category: 'Instant Noodles', image: cantonCalamansiImage },
  { id: 4, name: 'Pancit Canton - Sweet & Spicy', price: 25, category: 'Instant Noodles', image: cantonSweetSpicyImage },
  { id: 5, name: 'Buldak Carbonara', price: 65, category: 'Instant Noodles', image: buldakCarbonaraImage },
  { id: 6, name: 'Buldak 2X Spicy', price: 65, category: 'Instant Noodles', image: buldak2xImage },
  { id: 7, name: 'Buldak Cheese', price: 65, category: 'Instant Noodles', image: buldakCheeseImage },
  { id: 8, name: 'Shin Ramyun', price: 55, category: 'Instant Noodles', image: shinRamyunImage },
  { id: 9, name: 'Jin Ramen', price: 50, category: 'Instant Noodles', image: jinRamenImage },
  { id: 10, name: 'Buldak Rose', price: 65, category: 'Instant Noodles', image: buldakRoseImage },

  { id: 14, name: 'Coke', price: 25, category: 'Beverages', image: cokeImage },    
  { id: 15, name: 'Mountain Dew', price: 25, category: 'Beverages', image: dewImage },    
  { id: 16, name: 'Royal', price: 25, category: 'Beverages', image: royalImage },            
  { id: 17, name: 'Bottled Water', price: 20, category: 'Beverages', image: waterImage },    
  { id: 18, name: 'Nestea', price: 25, category: 'Beverages', image: nesteaImage },        
]);

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

const addToCart = (item) => {
  let cart = JSON.parse(localStorage.getItem('myCart')) || [];
  const existingItem = cart.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem('myCart', JSON.stringify(cart));
  alert(`${item.name} added to cart!`);
};

const goToCart = () => {
  router.push('/cart');
};

</script>
<template>
  <div class="compshop-container">
    <header class="top-bar">
      <div class="logo">
        <img :src="appLogo" alt="Logo" class="logo-img" />
          CompShop Bytes
      </div>
      <div class="user-actions">
        <span class="station-id">{{ stationName }}</span>
        <button class="icon-btn" @click="goToCart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>

        <button class="icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
      </div>
    </header>
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
        <h2>All Items</h2>
        <div class="sort-wrapper">
          <label>Sort by:</label>
          <select v-model="sortBy">
            <option value="Popular">Popular</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div class="product-grid">
        <div v-for="item in paginatedProducts" :key="item.id" class="product-card">
          <div class="image-container">
            <img :src="item.image" :alt="item.name" />
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
  padding: 2px;
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