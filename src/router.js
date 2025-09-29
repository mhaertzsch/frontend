import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Gacha from './pages/Gacha.vue';
import User from './pages/User.vue';
import Checkout from './pages/Checkout.vue';
import Product from './pages/Product.vue';
import Settings from './pages/Settings.vue';
import Wishlist from './pages/Wishlist.vue';
import Category from './pages/Category.vue';
import Shop from './pages/Shop.vue';
import Orders from './pages/Orders.vue';
import Order from './pages/Order.vue';
import Coupons from './pages/Coupons.vue';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/shop',
    component: Shop,
  },
  {
    path: '/shop/category/:id',
    component: Category,
  },
  {
    path: '/gacha',
    component: Gacha,
  },
  {
    path: '/orders',
    component: Orders,
  },
  {
    path: '/order/:id',
    component: Order,
  },
  {
    path: '/me',
    component: User,
  },
  {
    path: '/coupons',
    component: Coupons,
  },
  {
    path: '/checkout',
    component: Checkout,
  },
  {
    path: '/wishlist',
    component: Wishlist,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/shop/product/:id',
    component: Product,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
