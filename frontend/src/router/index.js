import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/Login.vue'
import SignupView from '../views/Signup.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'
import CodeEntryView from '../views/CodeEntry.vue' 
import SetNewPasswordView from '../views/SetNewPassword.vue' 
import MenuPage from '../views/MenuPage.vue'
import CartPage from '../views/CartPage.vue'
import StaffDashboard from '../views/StaffDashboard.vue'
import CheckoutView from '../views/Checkout.vue'
import PaymentProcessingView from '../views/PaymentProcessing.vue'
import PaymentSuccessView from '../views/PaymentSuccess.vue'
import QRCodesPage from '../views/QRCodesPage.vue'


import AdminDashboardProfile from '../views/AdminDashboard-Profile.vue' 
import AdminDashboardInventory from '../views/AdminDashboard-Inventory.vue' 
import AdminDashboardPurchase from '../views/AdminDashboard-Purchase.vue' 
import AdminDashboardUsers from '../views/AdminDashboard-Users.vue' 

import AdminDashboardReports from '../views/AdminDashboard-Reports.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/enter-code', name: 'enter-code', component: CodeEntryView }, 
    { path: '/set-new-password', name: 'set-new-password', component: SetNewPasswordView }, 
    
    { path: '/dashboard', name: 'dashboard', component: MenuPage },
    
    { path: '/admin-dashboard/profile', name: 'admin-dashboard-profile', component: AdminDashboardProfile },
    { path: '/admin-dashboard/inventory', name: 'admin-dashboard-inventory', component: AdminDashboardInventory }, 
    { path: '/admin-dashboard/purchase', name: 'admin-dashboard-purchase', component: AdminDashboardPurchase },
    { path: '/admin-dashboard/users', name: 'admin-dashboard-users', component: AdminDashboardUsers },

    { path: '/admin-dashboard/reports', name: 'admin-dashboard-reports', component: AdminDashboardReports },
    

    { path: '/staff-dashboard', name: 'staff-dashboard-legacy', component: StaffDashboard },

    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/qr-codes', name: 'qr-codes', component: QRCodesPage },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/payment-processing', name: 'payment-processing', component: PaymentProcessingView },
    { path: '/payment-success', name: 'payment-success', component: PaymentSuccessView }
  ]
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole'); 
  const publicPages = ['login', 'signup', 'forgot-password', 'enter-code', 'set-new-password'];

  if (publicPages.includes(to.name) && userRole) {
    const redirectName = (userRole === 'Staff' || userRole === 'Admin') ? 'admin-dashboard-profile' : 'dashboard';
    return next({ name: redirectName });
  }

  if (!publicPages.includes(to.name) && !userRole) {
    return next({ name: 'login' });
  }

  const staffPages = [
    'admin-dashboard-profile', 
    'admin-dashboard-inventory', 
    'admin-dashboard-purchase', 
    'admin-dashboard-users', 
    'admin-dashboard-reports', 
    'staff-dashboard-legacy'
  ]; 
  
  if (to.name === 'dashboard' && (userRole === 'Staff' || userRole === 'Admin')) {
    return next({ name: 'admin-dashboard-profile' });
  }

  if (staffPages.includes(to.name) && userRole === 'Customer') {
    return next({ name: 'dashboard' });
  }
  
  next();
});


export default router