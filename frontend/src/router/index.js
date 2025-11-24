import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'
import SignUpView from '../views/Signup.vue' // Added import

const Dashboard = { template: '<div style="padding:50px; text-align:center;"><h1>Dashboard</h1></div>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/sign-up', name: 'sign-up', component: SignUpView }, // Added route
    { path: '/dashboard', name: 'dashboard', component: Dashboard }
  ]
})
export default router