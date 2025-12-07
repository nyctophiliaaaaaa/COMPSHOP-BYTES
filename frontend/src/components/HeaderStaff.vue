<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import appLogo from '@/assets/logo.png' 
import { confirm } from '@/utils/toast.js'

const router = useRouter()


const goToStaffSettings = () => {
  console.log("Redirecting to Staff Settings...");
}

const handleLogout = async () => {
  const confirmed = await confirm('Are you sure you want to log out?', {
    title: 'Logout',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    type: 'warning'
  })
  
  if (confirmed) {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
  }
}

const stationName = (() => {
  const currentUser = localStorage.getItem('username')
  return currentUser ? `Hi, ${currentUser}` : 'Staff' 
})()
</script>

<template>
  <div>
    <header class="top-bar">
      <div class="logo">
        <img :src="appLogo" alt="CompShop Bytes Logo" class="logo-img" />
        CompShop Bytes
      </div>
      
      <div class="user-actions">
        <span class="station-id">{{ stationName }}</span>

        <button class="icon-btn" @click="goToStaffSettings" title="Staff Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>

        <button class="icon-btn logout-btn" @click="handleLogout" title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm, clamp(0.4rem, 0.6vw, 0.6rem)) var(--space-lg, clamp(1rem, 1.5vw, 1.5rem));
  border-bottom: 1px solid var(--color-border, #eee);
  flex-shrink: 0;
  background-color: var(--color-bg-primary, #fff);
}

.logo {
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.8vw, 12px);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
}

.logo-img { 
  height: clamp(28px, 3vw, 42px); 
  width: auto; 
}

.user-actions { 
  display: flex; 
  align-items: center; 
  gap: clamp(8px, 1vw, 14px); 
}

.station-id { 
  font-weight: var(--weight-bold); 
  color: var(--color-text-secondary); 
  margin-right: clamp(4px, 0.5vw, 8px); 
  font-size: var(--text-sm);
}

.icon-btn { 
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: var(--space-xs, clamp(4px, 0.5vw, 8px)); 
  border-radius: var(--radius-sm, 6px); 
  transition: background var(--transition-fast, 0.15s ease);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn svg {
  width: clamp(18px, 1.5vw, 24px);
  height: clamp(18px, 1.5vw, 24px);
}

.icon-btn:hover { 
  background-color: var(--color-bg-secondary, #f0f0f0); 
}

.logout-btn { 
  color: var(--color-danger, #d9534f); 
}

.logout-btn:hover { 
  background-color: #ffe6e6; 
}

@media (max-width: 768px) {
  .station-id {
  }
  
  .logo {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 0.5rem 1rem;
  }
  
  .logo-img {
    height: 24px;
  }
  
  .icon-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>