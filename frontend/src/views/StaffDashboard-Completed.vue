<template>
  <div class="staff-wrapper">
    <div class="screen-content">
        <div v-if="orders.length === 0" class="empty-state">No completed orders yet.</div>

        <div v-else class="orders-grid">
            <div v-for="order in orders" :key="order.order_id" class="order-card">
                <div class="card-header"><span class="header-title">ORDER COMPLETED</span></div>
                <div class="card-body">
                    <div class="customer-info">
                        <p><strong>Order #:</strong> {{ order.order_id }}</p>
                        <p><strong>Customer:</strong> {{ order.users?.username }}</p>
                        <p><strong>Date:</strong> {{ new Date(order.created_at).toLocaleDateString() }}</p>
                    </div>
                    
                    <div class="total-row"><span>TOTAL:</span><span>₱ {{ order.total_amount }}</span></div>
                    <hr class="divider">
                    
                    <div class="payment-details">
                        <p><strong>Method:</strong> {{ order.payment_method }}</p>
                        <p v-if="order.payment_reference"><strong>Ref:</strong> {{ order.payment_reference }}</p>
                    </div>
                    
                    <button class="print-btn" @click="openReceiptModal(order)">GENERATE RECEIPT</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        
        <div class="receipt-paper" id="receipt-content">
            <div class="receipt-header">
                <h3>CompShop Bytes</h3>
                <p>123 University Belt, Manila</p>
                <p>VAT REG TIN: 000-123-456-789</p>
                <br>
                <p><strong>OFFICIAL RECEIPT</strong></p>
            </div>
            
            <div class="receipt-meta">
                <div class="meta-row"><span>Order #:</span> <span>{{ selectedOrder.order_id }}</span></div>
                <div class="meta-row"><span>Date:</span> <span>{{ new Date(selectedOrder.created_at).toLocaleString() }}</span></div>
                <div class="meta-row"><span>Cashier:</span> <span>Staff</span></div>
                <div class="meta-row"><span>Customer:</span> <span>{{ selectedOrder.users?.username }}</span></div>
            </div>

            <hr class="dashed-line">
            
            <div class="receipt-items">
                <div v-for="(item, idx) in selectedOrder.order_items" :key="idx" class="r-item">
                    <span class="r-name">{{ item.quantity }}x {{ item.name }}</span>
                    <span class="r-price">{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
            </div>

            <hr class="dashed-line">
            
            <div class="receipt-totals">
                <div class="r-row total">
                    <span>TOTAL AMOUNT</span>
                    <span>₱ {{ selectedOrder.total_amount }}</span>
                </div>
                <div class="r-row">
                    <span>Payment Method:</span>
                    <span>{{ selectedOrder.payment_method }}</span>
                </div>
            </div>

            <div class="receipt-footer">
                <p>Thank you for dining with us!</p>
                <p>This serves as your official receipt.</p>
                <p>Powered by CompShop Bytes</p>
            </div>
        </div>

        <div class="modal-actions" data-html2canvas-ignore="true">
            <button class="cancel-btn" @click="closeModal">Close</button>
            <button class="confirm-print-btn" @click="downloadPDF">
                📥 Save as PDF & Print
            </button>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const orders = ref([]);
const showModal = ref(false);
const selectedOrder = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/staff/orders/Completed');
    orders.value = res.data;
  } catch (e) { console.error(e); }
});

const openReceiptModal = (order) => {
    selectedOrder.value = order;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedOrder.value = null;
};

const downloadPDF = () => {
    const element = document.getElementById('receipt-content');
    
    const opt = {
        margin:       0, 
        filename:     `Receipt_Order_${selectedOrder.value.order_id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'mm', format: [105, 200], orientation: 'portrait' } 
    };

    html2pdf().set(opt).from(element).save();
};
</script>

<style scoped>
.staff-wrapper { padding: 1.5rem; }
.empty-state { text-align: center; padding: 2rem; color: #666; }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.order-card { background: white; border-radius: 0.8rem; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eee; }
.card-header { background: #28a745; padding: 1rem; text-align: center; color: white; font-weight: 700; }
.card-body { padding: 1.5rem; }
.total-row { display: flex; justify-content: space-between; font-weight: 800; margin-top: 1rem; }
.divider { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
.print-btn { margin-top: 1rem; width: 100%; padding: 0.8rem; background-color: #FDBF50; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }

.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); 
    display: flex; flex-direction: column; 
    justify-content: center; 
    align-items: center;    
    z-index: 9999;
}

.receipt-paper {
    background: white; 
    width: 320px; 
    padding: 20px;
    font-family: 'Courier New', Courier, monospace; 
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    color: black;
    margin: 0 auto; 
}

.receipt-header, .receipt-footer { text-align: center; margin-bottom: 15px; }
.receipt-header h3 { margin: 0; font-weight: 900; text-transform: uppercase; }
.receipt-header p, .receipt-footer p { margin: 2px 0; font-size: 0.75rem; color: #333; }

.dashed-line { border: none; border-top: 1px dashed #333; margin: 10px 0; }

.receipt-meta .meta-row { display: flex; justify-content: space-between; font-size: 0.8rem; }

.r-item { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; }
.r-name { font-weight: bold; }

.receipt-totals .r-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; }
.receipt-totals .total { font-weight: bold; font-size: 1.1rem; border-top: 1px solid black; border-bottom: 1px solid black; padding: 5px 0; margin: 10px 0; }

.modal-actions { margin-top: 20px; display: flex; gap: 10px; }
.cancel-btn { padding: 10px 20px; background: #eee; border: none; cursor: pointer; border-radius: 5px; font-weight: bold; }
.confirm-print-btn { padding: 10px 20px; background: #2d3446; color: white; border: none; cursor: pointer; border-radius: 5px; font-weight: bold; }

@media print {
    body * { visibility: hidden; } 

    .modal-overlay, .receipt-paper, .receipt-paper * {
        visibility: visible;
    }

    .modal-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: none;
        display: flex;
        justify-content: center;
        align-items: flex-start; 
        padding-top: 20px;
    }

    .receipt-paper {
        box-shadow: none;
        border: 1px solid #ddd; 
        margin: 0 auto; 
    }

    .no-print { display: none !important; }
}
</style>