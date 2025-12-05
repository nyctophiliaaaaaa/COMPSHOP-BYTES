<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
  emit('add-to-cart', props.item)
}
</script>

<template>
  <div class="product-card">
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
        <button class="add-btn" @click="handleAddToCart">
          + Add
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #eee;
  border-radius: clamp(6px, 0.6vw, 10px);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
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
  height: clamp(90px, 10vw, 140px);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(6px, 0.8vw, 12px);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  object-position: center;
}

.card-details {
  padding: clamp(0.5rem, 0.8vw, 1rem);
}

.product-name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 clamp(0.3rem, 0.5vw, 0.6rem) 0;
  min-height: 2.5em;
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  color: #f59e0b;
  font-weight: var(--weight-bold);
  font-size: var(--text-base);
}

.add-btn {
  background-color: #ff6b4a;
  color: var(--color-text-inverse);
  border: none;
  padding: clamp(4px, 0.4vw, 6px) clamp(8px, 1vw, 14px);
  border-radius: 4px;
  cursor: pointer;
  font-weight: var(--weight-semibold);
  font-size: var(--text-xs);
  font-family: var(--font-primary);
  display: flex;
  align-items: center;
  gap: clamp(2px, 0.3vw, 4px);
  transition: background-color 0.15s ease;
}

.add-btn:hover {
  background-color: #e55a3a;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-container {
    height: 100px;
  }
  
  .product-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .image-container {
    height: 80px;
  }
  
  .card-details {
    padding: 0.5rem;
  }
  
  .product-name {
    font-size: 0.75rem;
    min-height: 2em;
  }
  
  .price {
    font-size: 0.8rem;
  }
  
  .add-btn {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
}
</style>
