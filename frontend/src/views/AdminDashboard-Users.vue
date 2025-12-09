<template>
  <div class="kds-container">
    <AdminSidebar active-route-name="admin-dashboard-users" />

    <main class="dashboard-main-content">
      <h1 class="page-title">User Management</h1>
        
      <div class="user-management-actions">
        <div class="search-and-filters">
          <input type="text" placeholder="Search..." class="search-input" v-model="searchQuery">
          <select class="filter-select" v-model="filterRole">
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
          <button class="export-button" @click="fetchUsers">Refresh</button>
        </div>
      </div>
        
      <div class="user-table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.user_id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['status-tag', user.roleName.toLowerCase()]">{{ user.roleName }}</span>
              </td>
              <td class="action-buttons">
                <button class="action-icon-button delete-icon" @click="openDeleteModal(user.user_id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="filteredUsers.length === 0" style="padding: 20px; color: #666; text-align: center;">No users found.</p>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button class="btn-delete" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>

    <transition name="fade">
        <div v-if="showToast" class="toast-notification">
            ✅ {{ toastMessage }}
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const users = ref([]);
const searchQuery = ref('');
const filterRole = ref('');
const showModal = ref(false);
const userIdToDelete = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/admin/users');
        users.value = response.data.map(u => ({
            ...u,
            roleName: u.user_roles?.role_name || 'Unknown' 
        }));
    } catch (error) {
        console.error("Error loading users:", error);
    }
};

const openDeleteModal = (userId) => {
    userIdToDelete.value = userId;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    userIdToDelete.value = null;
};

const confirmDelete = async () => {
    if (!userIdToDelete.value) return;

    try {
        await axios.delete(`http://localhost:3000/api/admin/users/${userIdToDelete.value}`);
        users.value = users.value.filter(u => u.user_id !== userIdToDelete.value);
        closeModal();
        triggerToast("User deleted successfully.");

    } catch (error) {
        console.error("Delete failed:", error);
        closeModal();
        alert("Failed to delete user.");
    }
};

const triggerToast = (msg) => {
    toastMessage.value = msg;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const filteredUsers = computed(() => {
    let list = users.value;
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(u => 
            u.username.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query)
        );
    }
    
    if (filterRole.value) {
        list = list.filter(u => u.roleName === filterRole.value);
    }
    
    return list;
});

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.kds-container { 
    display: flex; 
    min-height: 100vh; 
    background-color: #f5f5f5; 
    font-family: Arial, sans-serif; 
}

.dashboard-main-content { 
    flex-grow: 1; 
    padding: 2rem; 
    overflow-y: auto; 
    position: relative; 
} 

.page-title { 
    color: #1f2937; 
    font-size: 2rem; 
    margin: 0 0 1.5rem 0; 
}

.user-management-actions { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 1.5rem; 
}

.search-and-filters { 
    display: flex; 
    gap: 1rem; 
    align-items: center; 
}

.search-input { 
    padding: 0.5rem; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.5rem; 
    width: 250px; 
}

.filter-select { 
    padding: 0.5rem; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.5rem; 
}

.export-button { 
    background: white; 
    border: 1px solid #e5e7eb; 
    padding: 0.5rem 1rem; 
    border-radius: 0.5rem; 
    cursor: pointer; 
}

.user-table-wrapper { 
    background: white; 
    border-radius: 0.75rem; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
    overflow-x: auto; 
}

.user-table { 
    width: 100%; 
    border-collapse: collapse; 
}

.user-table th { 
    text-align: left; 
    padding: 1rem; 
    background: #f7f7f7; 
    font-weight: 700; 
    color: #1f2937; 
}

.user-table td { 
    padding: 0.75rem; 
    border-top: 1px solid #e5e7eb; 
}

.status-tag { 
    padding: 0.25rem 0.5rem; 
    border-radius: 0.5rem; 
    font-size: 0.85rem; 
    font-weight: 600; 
}

.status-tag.admin { 
    background: #fee2e2; 
    color: #991b1b; 
}

.status-tag.staff { 
    background: #d1fae5; 
    color: #065f46; 
}

.status-tag.customer { 
    background: #e0f2fe; 
    color: #0c4a6e; 
}

.action-buttons { 
    display: flex; 
    gap: 0.5rem; 
}

.action-icon-button { 
    background: none; 
    border: none; 
    cursor: pointer; 
    font-size: 1.2rem; 
}

.modal-overlay {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    text-align: center;
    animation: fadeIn 0.2s ease-out;
}

.modal-header h3 { 
    margin-top: 0; 
    color: #1f2937; 
    margin-bottom: 1rem; 
}

.modal-body p { 
    color: #4b5563; 
    margin-bottom: 2rem; 
    line-height: 1.5; 
}

.modal-actions { 
    display: flex; 
    gap: 1rem; 
    justify-content: center; 
}

.btn-cancel {
    padding: 0.75rem 1.5rem;
    background: #e5e7eb;
    border: none; 
    border-radius: 6px;
    cursor: pointer; 
    font-weight: 600; 
    color: #374151;
}

.btn-delete {
    padding: 0.75rem 1.5rem;
    background: #dc2626;
    border: none; 
    border-radius: 6px;
    cursor: pointer; 
    font-weight: 600; 
    color: white;
}

.btn-delete:hover { 
    background: #b91c1c; 
}

.btn-cancel:hover { 
    background: #d1d5db; 
}

.toast-notification {
    position: fixed; 
    bottom: 2rem; 
    right: 2rem;
    background-color: #10b981; 
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 600;
    z-index: 2000;
}

.fade-enter-active, .fade-leave-active { 
    transition: opacity 0.3s; 
}

.fade-enter-from, .fade-leave-to { 
    opacity: 0; 
}

@keyframes fadeIn {
    from { 
        opacity: 0; 
        transform: translateY(-10px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

</style>