import CartView from '@/views/CartView.vue'
import HomeView from '@/views/HomeView.vue' 
import PaymentView from '@/views/PaymentView.vue'
import ProductView from '@/views/ProductView.vue'
import SearchView from '@/views/SearchView.vue'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router