<template>
  <div class="kds-container">
    
    <AdminSidebar active-route-name="admin-dashboard-reports" />

    <main class="dashboard-main-content">
        <h1 class="page-title">Reporting</h1>
        
        <div class="reports-header-grid">
            
            <div class="report-card operations-card">
                <h2 class="card-title">Operations Report</h2>
                <div class="report-list">
                    <div class="report-item">Reports in January <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></a></div>
                    <div class="report-item">Reports in February <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></a></div>
                    <div class="report-item">Reports in March <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></a></div>
                    <div class="report-item">Reports in April <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></a></div>
                    <div class="report-item">Reports in May <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></a></div>
                </div>
                <button class="add-report-button">ADD REPORT</button>
            </div>
            
            <div class="report-card customer-review-card">
                <h2 class="card-title">Customer Review</h2>
                <div class="review-box">
                    <p class="review-text">Great coffee, fast WiFi, and helpful staff. My new go-to for remote work! 🇵🇭</p>
                    <p class="reviewer-name">⭐⭐⭐⭐⭐ <strong>Sarah M.</strong></p>
                </div>
                <div class="review-box">
                    <p class="review-text">Amazing PC setups and delicious food. Stayed for hours! 🔥🎮</p>
                    <p class="reviewer-name">⭐⭐⭐⭐⭐ <strong>Jake T.</strong> "Gamer's paradise!"</p>
                </div>
                <div class="review-box">
                    <p class="review-text">Modern space, quality food, and tech-savvy staff. Highly recommend! 🧑‍💻</p>
                    <p class="reviewer-name">⭐⭐⭐⭐ <strong>Marcus L.</strong> "Love the vibe!"</p>
                </div>
            </div>
            
        </div>

        <div class="sales-report-panel">
            <h2 class="sales-report-title">Semi Annual Sales Performance</h2>
            
            <div class="sales-controls">
                <span>Month: 
                    <select class="control-select"><option>June</option></select>
                </span>
                <span>Year: 
                    <select class="control-select"><option>2025</option></select>
                </span>
                <button class="download-button">
                    Download Report 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
            </div>
            
            <div class="table-display">
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Revenue (PHP)</th>
                            <th>Orders Completed</th>
                            <th>Growth vs. Previous</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>January</td><td>₱ 55,200</td><td>152</td><td class="negative">-2.1%</td></tr>
                        <tr><td>February</td><td>₱ 57,800</td><td>161</td><td class="positive">+4.7%</td></tr>
                        <tr><td>March</td><td>₱ 68,900</td><td>198</td><td class="positive">+19.2%</td></tr>
                        <tr><td>April</td><td>₱ 75,500</td><td>215</td><td class="positive">+9.6%</td></tr>
                        <tr><td>May</td><td>₱ 80,100</td><td>230</td><td class="positive">+6.1%</td></tr>
                        <tr class="highlight"><td><strong>June</strong></td><td><strong>₱ 87,400</strong></td><td><strong>255</strong></td><td class="positive"><strong>+9.1%</strong></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue'; 
</script>

<style scoped>
/* ======================================= */
/* LAYOUT AND GLOBAL STYLES (MATCHING ADMIN THEME) */
/* ======================================= */
.kds-container {
    --color-dashboard-bg: #f5f5f5;
    --color-brand-primary: #ff724c;
    --color-text-dark: #1f2937;
    --color-border: #e5e7eb;
    --color-gray-light: #f9fafb;
    --color-gray-medium: #6b7280;
    --color-positive: #10b981; /* Tailwind green-500 */
    --color-negative: #ef4444; /* Tailwind red-500 */


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

/* ======================================= */
/* REPORTS LAYOUT */
/* ======================================= */
.reports-header-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr; /* Operations on left, Reviews on right */
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.report-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    min-height: 350px;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-dark);
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
}

/* --- Operations Card --- */
.operations-card {
    display: flex;
    flex-direction: column;
}
.report-list {
    margin-bottom: 1.5rem;
    flex-grow: 1; /* Pushes the button to the bottom */
}
.report-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-gray-light);
    font-weight: 500;
}
.report-item a {
    color: var(--color-gray-medium);
    text-decoration: none;
    padding: 0.25rem;
}
.report-item a svg {
    stroke: var(--color-gray-medium);
    transition: stroke 0.1s;
}
.report-item a:hover svg {
    stroke: var(--color-brand-primary);
}
.add-report-button {
    background-color: var(--color-brand-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: opacity 0.1s;
}
.add-report-button:hover { opacity: 0.9; }

/* --- Customer Review Card --- */
.customer-review-card .card-title {
    border-bottom: none;
    padding-bottom: 0;
}
.review-box {
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-gray-light);
}
.review-box:last-of-type {
    border-bottom: none;
}
.review-text {
    font-style: italic;
    color: var(--color-text-dark);
    margin-bottom: 0.25rem;
    margin-top: 0;
}
.reviewer-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-gray-medium);
    margin: 0;
}

/* ======================================= */
/* SALES REPORT PANEL (TABLE) */
/* ======================================= */
.sales-report-panel {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
}
.sales-report-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-dark);
    margin-top: 0;
    margin-bottom: 1rem;
}

.sales-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
}
.control-select {
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    background-color: var(--color-gray-light);
}

.download-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #d1fae5; 
    color: #065f46; 
    border: 1px solid #10b981;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
}
.download-button svg {
    stroke: #065f46;
}

/* --- Sales Table Styles --- */
.sales-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    text-align: left;
}
.sales-table th {
    background-color: var(--color-gray-light);
    color: var(--color-text-dark);
    padding: 1rem;
    border-bottom: 2px solid var(--color-border);
}
.sales-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
}
.sales-table tbody tr:hover {
    background-color: #fff7f7;
}

.highlight {
    background-color: #fef3c7; /* Light yellow background */
    font-weight: 600;
    color: var(--color-text-dark);
}
.positive {
    color: var(--color-positive);
    font-weight: 700;
}
.negative {
    color: var(--color-negative);
    font-weight: 700;
}
</style>