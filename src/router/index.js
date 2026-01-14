import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import CatalogView from '../views/CatalogView.vue'
import CoffeeDetailView from '../views/CoffeeDetailView.vue'
import CartView from '../views/CartView.vue'
import OrdersView from '../views/OrdersView.vue'
import AdminCoffeesView from '../views/AdminCoffeesView.vue'
import AdminOrdersView from '../views/AdminOrdersView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/catalog', name: 'catalog', component: CatalogView, meta: { requiresAuth: true } },
    { path: '/catalog/:id', name: 'coffees.show', component: CoffeeDetailView, meta: { requiresAuth: true } },
    { path: '/cart', name: 'cart', component: CartView, meta: { requiresAuth: true, requiresClient: true } },
    { path: '/orders', name: 'orders', component: OrdersView, meta: { requiresAuth: true, requiresClient: true } },

    {
      path: '/admin/coffees',
      name: 'admin.coffees',
      component: AdminCoffeesView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin.orders',
      component: AdminOrdersView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user) await auth.getUser()

  if (to.meta.requiresAuth && !auth.user) return { name: 'login' }
  if ((to.name === 'login' || to.name === 'register') && auth.user) return { name: 'dashboard' }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'dashboard' }
  if (to.meta.requiresClient && (!auth.isClient || auth.isAdmin)) return { name: 'dashboard' }

  return true
})

export default router
