<template>
  <aside class="sidebar-nav">
    <div class="logo-area">
      <span class="logo-text">CompShop Bytes</span>
    </div>
    <div class="sidebar-profile">
      
      <div class="initials-avatar">JD</div>
      
      <div class="user-info">
        <p class="user-name">Juan Dela Cruz</p>
        <p class="user-role">{{ staffData.role }}</p>
      </div>
    </div>
    
    <nav class="main-menu">
      
      <router-link 
        :to="{ name: 'admin-dashboard-profile' }" 
        class="nav-item"
        :class="{ 'router-link-active': activeRouteName === 'admin-dashboard-profile' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M18 18l-6-6-4 4"/></svg>
        Dashboard
      </router-link>

      <router-link 
        :to="{ name: 'admin-dashboard-inventory' }" 
        class="nav-item"
        :class="{ 'router-link-active': activeRouteName === 'admin-dashboard-inventory' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 2H3.5a.5.5 0 00-.5.5v17a.5.5 0 00.5.5h17a.5.5 0 00.5-.5V2.5a.5.5 0 00-.5-.5zM12 10.5V17m-3.5-3.5h7"/></svg>
        Inventory
      </router-link>

      <router-link 
        :to="{ name: 'admin-dashboard-purchase' }" 
        class="nav-item"
        :class="{ 'router-link-active': activeRouteName === 'admin-dashboard-purchase' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
        Completed Orders
      </router-link>
      
      <router-link 
        :to="{ name: 'admin-dashboard-users' }" 
        class="nav-item"
        :class="{ 'router-link-active': activeRouteName === 'admin-dashboard-users' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17V9.5a2.5 2.5 0 10-5 0v7.5m5 0h-5m-5 0V9.5a2.5 2.5 0 10-5 0v7.5m5 0H2M12 5.5a2.5 2.5 0 10-5 0v1.5h5V5.5zM7 17a2 2 0 100-4 2 2 0 000 4zM17 17a2 2 0 100-4 2 2 0 000 4z"/></svg>
        Users
      </router-link>
      
      <router-link 
        :to="{ name: 'admin-dashboard-reports' }" 
        class="nav-item"
        :class="{ 'router-link-active': activeRouteName === 'admin-dashboard-reports' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34M18 10l-4-4-4 4"/></svg>
        Reporting
      </router-link>
    </nav>
    
    <div class="bottom-controls">
      <button class="logout-button" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Log out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  activeRouteName: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const staffData = ref({ role: 'Admin' });

const handleLogout = () => {
    localStorage.removeItem('userRole'); 
    router.push('/');
};
</script>

<style scoped>
.sidebar-nav {
  --color-brand-primary: #ff724c; 
  --color-text-dark: #1f2937; 
  --color-sidebar-bg: #ff724c;
  --color-active-bg: white;
  --color-active-text: var(--color-brand-primary);
  --color-icon-bg-light: #fce8e2; 
  --color-danger: #dc3545;
  --sidebar-width: 280px;

  width: var(--sidebar-width);
  background-color: var(--color-sidebar-bg);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 3px 0 8px rgba(0, 0, 0, 0.2); 
  height: 100vh;
}
.logo-area { padding: 0 1.5rem; margin-bottom: 0.5rem; }
.logo-text { font-size: 1.5rem; font-weight: 800; display: block; color: var(--color-text-dark); }
.sidebar-profile {
  padding: 1rem 1.5rem; margin-bottom: 2rem; display: flex;
  flex-direction: column; align-items: center; text-align: center;
}

.initials-avatar {
  width: 90px; 
  height: 90px; 
  border-radius: 50%;
  background-color: var(--color-text-dark);
  font-size: 2.25rem; 
  font-weight: 700;
  margin-bottom: 0.75rem; 
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 2px var(--color-brand-primary); 
}

.user-name { font-size: 1.1rem; font-weight: 700; margin: 0; color: var(--color-text-dark); }
.user-role { font-size: 0.9rem; opacity: 0.9; margin: 0; color: var(--color-text-dark); }

.main-menu { flex-grow: 1; padding: 0 0 1.5rem 0; }
.nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1.5rem; color: var(--color-text-dark);
  text-decoration: none; font-size: 1rem; font-weight: 500;
  transition: background-color 0.15s;
}
.nav-item:hover { background-color: var(--color-sidebar-hover, #fa6038); }
.nav-item svg { stroke: var(--color-text-dark); }

.router-link-active {
  background-color: var(--color-active-bg);
  color: var(--color-active-text) !important;
  font-weight: 700 !important;
  border-radius: 0 30px 30px 0;
  position: relative;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}
.router-link-active svg { stroke: var(--color-brand-primary) !important; }

.bottom-controls { display: flex; flex-direction: column; padding: 0 1.5rem 1.5rem 0; margin-top: auto; }
.logout-button {
  display: flex; align-items: center; justify-content: flex-start;
  gap: 0.75rem; background-color: transparent; border: none;
  padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 700;
  width: 100%; cursor: pointer; color: var(--color-danger);
}
.logout-button:hover {
  background-color: #fa6038;
  border-radius: 0 30px 30px 0;
}
.logout-button svg { stroke: var(--color-danger); }
</style>