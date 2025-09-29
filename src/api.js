import { useSessionStore } from './stores/session.js';
const API = import.meta.env.VITE_API;
export default API;

export async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data;
}
export async function fetchCategories() {
  const res = await fetch(`${API}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');

  const data = await res.json();
  return data;
}
export async function fetchOrders() {
  const res = await fetch(`${API}/orders/my-orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');

  const data = await res.json();
  return data;
}
export async function fetchOrderItems(id) {
  const res = await fetch(`${API}/orders/order-items/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order items');

  const data = await res.json();
  return data;
}

export async function fetchProduct(id) {
  const res = await fetch(`${API}/products/product/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');

  const data = await res.json();
  return data;
}
export async function fetchProductsInCategory(category_id) {
  const res = await fetch(`${API}/products?category_id=${category_id}`);
  if (!res.ok) throw new Error('Failed to fetch product');

  const data = await res.json();
  return data;
}
export async function fetchCurrentUserData() {
  const res = await fetch(`${API}/users/me`);
  if (!res.ok) throw new Error('Failed to fetch currentUserData');
  const data = await res.json();
  useSessionStore().gems = data.gems;
  useSessionStore().userLevel = data.user_level;
  return data;
}
export async function gachaSinglePull() {
  const res = await fetch(`${API}/gacha/single`);
  if (!res.ok) throw new Error('Failed to pull on the gacha');
  const data = await res.json();
  return data;
}
export async function gachaTenPull() {
  const res = await fetch(`${API}/gacha/ten`);
  if (!res.ok) throw new Error('Failed to pull on the gacha');
  const data = await res.json();
  return data;
}

export async function fetchOwnedCoupons() {
  const res = await fetch(`${API}/coupons/owned`);
  if (!res.ok) throw new Error('Failed to fetch owned coupons');
  const data = await res.json();
  return data;
}
export async function fetchUnlockedBadges() {
  const res = await fetch(`${API}/badges/unlocked`);
  if (!res.ok) throw new Error('Failed to fetch unlocked badges');
  const data = await res.json();
  return data;
}
export async function fetchLockedBadges() {
  const res = await fetch(`${API}/badges/locked`);
  if (!res.ok) throw new Error('Failed to fetch locked badges');
  const data = await res.json();
  return data;
}
export async function fetchAllBadges() {
  const res = await fetch(`${API}/badges`);
  if (!res.ok) throw new Error('Failed to fetch locked badges');
  const data = await res.json();
  return data;
}
export async function fetchAchievements(state) {
  const res = await fetch(`${API}/achievements/${state}`);
  if (!res.ok) throw new Error('Failed to fetch achievements of state' + state);
  const data = await res.json();
  return data;
}
export async function claimAchievement(id) {
  const res = await fetch(`${API}/achievements/claim/${id}`);
  if (!res.ok) throw new Error('Failed to claim achievement');
  const data = await res.json();
  return data;
}
export async function flagFirstWishlist() {
  const res = await fetch(`${API}/flags/flag-first-wishlist`);
  if (!res.ok) throw new Error('Failed to transmit first wishlist flag');
  const data = await res.json();
  return data;
}
