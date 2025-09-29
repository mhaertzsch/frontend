import { defineStore } from 'pinia';
import { useSessionStore } from './session.js';
import { fetchProducts } from '../api.js';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    products: [],
  }),

  getters: {
    size: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    productsAndQuantity: (state) => {
      return state.items.map((cartItem) => {
        const product = state.products.find((p) => p.id === cartItem.id);
        return {
          ...cartItem,
          product,
        };
      });
    },

    total() {
      return this.productsAndQuantity.reduce((total, item) => {
        if (!item.product) return total;
        return total + item.product.price * item.quantity;
      }, 0);
    },
  },
  actions: {
    async loadProducts() {
      this.products = await fetchProducts();
      this.items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    },

    addItem(product) {
      const existingItem = this.items.find((item) => item.id === product.id);
      let message = product.title + ' wurde zum Einkaufswagen hinzugefügt.';
      if (!existingItem) {
        this.items.push({ id: product.id, quantity: 1 });
      } else {
        existingItem.quantity += 1;
        message += ` [${existingItem.quantity}]`;
      }
      this.saveCartItems();
      useSessionStore().alert({
        message: message,
        type: 'success',
      });
    },
    decreaseItem(product) {
      const item = this.items.find((item) => item.id === product.id);
      if (item) {
        item.quantity -= 1;
        this.saveCartItems();
        if (item.quantity <= 0) {
          this.removeItem(product);
        } else {
          useSessionStore().alert({
            message: 'Ein ' + product.title + ' wurde aus dem Einkaufswagen entfernt.',
            type: 'info',
          });
        }
      }
    },
    removeItem(product) {
      this.items = this.items.filter((item) => item.id !== product.id);
      this.saveCartItems();
      useSessionStore().alert({
        message: product.title + ' wurde aus dem Einkaufswagen entfernt.',
        type: 'info',
      });
    },

    saveCartItems() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    clear() {
      this.items = [];
      this.saveCartItems();
    },
  },
});
