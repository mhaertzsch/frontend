import { defineStore } from 'pinia';
import { useSessionStore } from './session.js';
import { flagFirstWishlist } from '../api.js';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  }),

  actions: {
    addWishlist(product) {
      this.wishlist.push(product);
      this.saveWishlist();

      //Damit nicht bei JEDEM hinzufügen zu der Wishlist eine Request an das Backend gesendet wird,
      //wird in localStorage festgehalten, dass dies schon übermittelt wurde.
      if (localStorage.getItem('first_wishlist') === null) {
        console.log('transmitting');
        //diese Funktion übermittelt, dass in der Datenbank added_wishlist auf true gesetzt wird.
        flagFirstWishlist();
      }
      localStorage.setItem('first_wishlist', 'true');

      useSessionStore().alert({
        message: product.title + ' wurde zur Wunschliste hinzugefügt.',
        type: 'success',
      });
    },

    removeWishlist(product) {
      this.wishlist = this.wishlist.filter((p) => p.id !== product.id);
      this.saveWishlist();

      useSessionStore().alert({
        message: product.title + ' wurde aus der Wunschliste entfernt.',
        type: 'info',
      });
    },

    saveWishlist() {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    },
  },
});
