import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import SignupView from '../views/Signup.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'
import CodeEntryView from '../views/CodeEntry.vue' 
import SetNewPasswordView from '../views/SetNewPassword.vue' 

const Dashboard = { 
  template: '<div style="padding:50px; text-align:center;"><h1>🎉 Welcome to Dashboard</h1><p>You are logged in!</p></div>' 
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/enter-code', name: 'enter-code', component: CodeEntryView }, 
    { path: '/set-new-password', name: 'set-new-password', component: SetNewPasswordView }, 
    { path: '/dashboard', name: 'dashboard', component: Dashboard }
  ]
})

export default router