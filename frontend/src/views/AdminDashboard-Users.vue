<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-users" />

    <main class="dashboard-main-content">
        <h1 class="page-title">User Management</h1>
        
        <div class="user-management-actions">
            <div class="search-and-filters">
                <div class="search-input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input 
                      type="text" 
                      placeholder="Search" 
                      class="search-input"
                      v-model="searchQuery" 
                    >
                </div>
                
                <select class="filter-select" v-model="filterRole">
                    <option value="">Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="User">User</option>
                    <option value="Guest">Guest</option>
                </select>
                <select class="filter-select" v-model="filterStatus">
                    <option value="">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Banned">Banned</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                </select>
                <select class="filter-select" v-model="sortDate">
                    <option value="recent">Date (Recent)</option>
                    <option value="oldest">Date (Oldest)</option>
                </select>
                <button class="export-button" @click="handleExport">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899L7.96 11.05a1 1 0 011.41 0L12 13.5l3.63-3.91a1 1 0 011.41 0L20 14.898V5a2 2 0 00-2-2H6a2 2 0 00-2 2v9.899zM20 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3"/></svg>
                    Export
                </button>
            </div>
            
            <button class="add-user-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add User
            </button>
        </div>
        
        <div class="user-table-wrapper">
            <table class="user-table">
                <thead>
                    <tr>
                        <th></th> <th>Full Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.username">
                        <td><input type="checkbox" :checked="user.status === 'Active'"></td>
                        <td>{{ user.fullName }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.password }}</td>
                        <td>
                            <span :class="['status-tag', user.status.toLowerCase()]">{{ user.status }}</span>
                        </td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.joinedDate }}</td>
                        <td>{{ user.lastActive }}</td>
                        <td class="action-buttons">
                            <button class="action-icon-button edit-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="action-icon-button delete-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../components/AdminSidebar.vue'; 

const rawUsers = [
    { fullName: 'John Smith', username: 'jonny77', password: 'jons123', status: 'Inactive', role: 'Admin', joinedDate: 'March 12, 2023', lastActive: '1 minute ago' },
    { fullName: 'Olivia Bennett', username: 'olly69', password: 'olly123', status: 'Active', role: 'User', joinedDate: 'June 27, 2022', lastActive: '1 month ago' },
    { fullName: 'Daniel Warren', username: 'dwarrenn3', password: 'dwarren3', status: 'Banned', role: 'User', joinedDate: 'January 8, 2024', lastActive: '4 days ago' },
    { fullName: 'Chloe Hayes', username: 'chloehh', password: 'chloehh', status: 'Pending', role: 'User', joinedDate: 'October 5, 2021', lastActive: '10 days ago' },
    { fullName: 'Marcus Reed', username: 'reeds7', password: 'reeds7', status: 'Suspended', role: 'User', joinedDate: 'February 19, 2023', lastActive: '3 months ago' },
    { fullName: 'Isabelle Clark', username: 'bellecl', password: 'bellecl', status: 'Active', role: 'Staff', joinedDate: 'August 30, 2022', lastActive: '1 week ago' },
    { fullName: 'Lucas Mitchell', username: 'lucamich', password: 'lucamich', status: 'Active', role: 'Guest', joinedDate: 'April 23, 2024', lastActive: '4 hours ago' },
    { fullName: 'Mark Wilburg', username: 'markwill32', password: 'markwill32', status: 'Banned', role: 'User', joinedDate: 'November 14, 2020', lastActive: '2 months ago' },
    { fullName: 'Nicholas Agenin', username: 'nicolass009', password: 'nicolass009', status: 'Suspended', role: 'User', joinedDate: 'July 6, 2023', lastActive: '3 hours ago' },
    { fullName: 'Mia Nadinn', username: 'mianaddin', password: 'mianaddin', status: 'Inactive', role: 'Admin', joinedDate: 'December 31, 2021', lastActive: '4 months ago' },
    { fullName: 'Noemi Villan', username: 'noemi', password: 'noemi', status: 'Active', role: 'Admin', joinedDate: 'August 10, 2024', lastActive: '15 minutes ago' },
];

const users = ref(rawUsers);

const searchQuery = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const sortDate = ref('recent'); // Default sort: recent

const filteredUsers = computed(() => {
    let list = users.value;
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(user => 
            user.fullName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );
    }
    if (filterRole.value) {
        list = list.filter(user => user.role === filterRole.value);
    }

    // 3. STATUS FILTER
    if (filterStatus.value) {
        list = list.filter(user => user.status === filterStatus.value);
    }
    list.sort((a, b) => {
        const dateA = Date.parse(a.joinedDate);
        const dateB = Date.parse(b.joinedDate);
        
        if (sortDate.value === 'recent') {
            // Newest (largest timestamp) first
            return dateB - dateA;
        } else if (sortDate.value === 'oldest') {
            // Oldest (smallest timestamp) first
            return dateA - dateB;
        }
        return 0; // No change
    });

    return list;
});

const handleExport = () => {
    alert(`Exporting ${filteredUsers.value.length} users with current filters...`);
}
</script>

<style scoped>
.kds-container {
    --color-dashboard-bg: #f5f5f5;
    --color-brand-primary: #ff724c;
    --color-brand-secondary: #dc3545; /* Used for Delete/Banned */
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
.page-title {
    color: var(--color-text-dark);
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
}
.user-management-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.search-and-filters {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}
.search-input-wrapper svg {
    position: absolute;
    left: 10px;
}
.search-input {
    padding: 0.5rem 0.75rem 0.5rem 35px; /* Added padding for icon */
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    width: 250px;
}

.filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background-color: white;
}

.export-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    color: var(--color-text-dark);
    border: 1px solid var(--color-border);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.1s;
}
.export-button:hover {
    background-color: #f0f0f0;
}

.add-user-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--color-brand-primary);
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.1s;
}
.add-user-button:hover {
    opacity: 0.9;
}

.user-table-wrapper {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.08);
    overflow-x: auto; /* Allows horizontal scrolling if table is too wide */
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.user-table thead th {
    text-align: left;
    padding: 1rem 0.75rem;
    background-color: #f7f7f7;
    color: var(--color-text-dark);
    font-weight: 700;
}
.user-table tbody td {
    padding: 0.75rem 0.75rem;
    border-top: 1px solid var(--color-border);
}

.user-table tbody tr:hover {
    background-color: #fcfcfc;
}

/* Status Tags */
.status-tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-tag.active {
    background-color: #d1fae5; /* Light Green */
    color: #065f46; /* Dark Green */
}
.status-tag.inactive {
    background-color: #f3f4f6; /* Light Gray */
    color: #4b5563; /* Gray */
}
.status-tag.banned {
    background-color: #fee2e2; /* Light Red */
    color: #991b1b; /* Dark Red */
}
.status-tag.pending {
    background-color: #ffedd5; /* Light Yellow/Orange */
    color: #9a3412; /* Dark Orange */
}
.status-tag.suspended {
    background-color: #e0f2fe; /* Light Blue */
    color: #0c4a6e; /* Dark Blue */
}

/* Actions */
.action-buttons {
    display: flex;
    gap: 0.5rem;
}
.action-icon-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.1s;
}
.action-icon-button svg {
    width: 18px;
    height: 18px;
}
.edit-icon svg { stroke: #3b82f6; /* Blue */ }
.delete-icon svg { stroke: var(--color-brand-secondary); /* Red */ }

.action-icon-button:hover {
    background-color: #e5e7eb;
}

</style>
