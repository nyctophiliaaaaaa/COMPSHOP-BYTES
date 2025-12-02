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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/enter-code', name: 'enter-code', component: CodeEntryView }, 
    { path: '/set-new-password', name: 'set-new-password', component: SetNewPasswordView }, 
    { path: '/dashboard', name: 'dashboard', component: MenuPage },
    { path: '/staff-dashboard', name: 'staff-dashboard', component: StaffDashboard },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/payment-processing', name: 'payment-processing', component: PaymentProcessingView },
    { path: '/payment-success', name: 'payment-success', component: PaymentSuccessView }
  ]
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole'); 
  const publicPages = ['login', 'signup', 'forgot-password', 'enter-code', 'set-new-password'];
  
  // 1. If user is logged in and tries to go to a public page (Login), redirect them back
  if (publicPages.includes(to.name) && userRole) {
    if (userRole === 'Staff' || userRole === 'Admin') {
      return next({ name: 'staff-dashboard' });
    } else if (userRole === 'Customer') {
      return next({ name: 'dashboard' }); 
    }
  }

  // 2. If user is NOT logged in and tries to go to a protected page
  if (!publicPages.includes(to.name) && !userRole) {
    return next({ name: 'login' });
  }

  // 3. Role-based Security
  // If a Staff/Admin tries to go to Customer Menu
  if (to.name === 'dashboard' && (userRole === 'Staff' || userRole === 'Admin')) {
    return next({ name: 'staff-dashboard' });
  }

  // If a Customer tries to go to Staff Dashboard
  if (to.name === 'staff-dashboard' && userRole === 'Customer') {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router