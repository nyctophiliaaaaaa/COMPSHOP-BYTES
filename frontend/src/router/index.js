import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/Login.vue'
import SignupView from '../views/Signup.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'
import CodeEntryView from '../views/CodeEntry.vue' 
import SetNewPasswordView from '../views/SetNewPassword.vue' 
import MenuPage from '../views/MenuPage.vue'
import CartPage from '../views/CartPage.vue'
import StaffDashboard from '../views/StaffDashboard.vue'

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
    { path: '/cart', name: 'cart', component: CartPage }
  ]
})

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole'); 
  const publicPages = ['login', 'signup', 'forgot-password', 'enter-code', 'set-new-password'];
  
  if (publicPages.includes(to.name)) {
    if (userRole === 'staff') {
      return next({ name: 'staff-dashboard' });
    } else if (userRole === 'customer') {
      return next({ name: 'dashboard' }); 
    }
    return next(); 
  }

  if (!userRole) {
    return next({ name: 'login' });
  }

  if (to.name === 'dashboard' && userRole === 'staff') {
    return next({ name: 'staff-dashboard' });
  }

  if (to.name === 'staff-dashboard' && userRole !== 'staff') {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router
