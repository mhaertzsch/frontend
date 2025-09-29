<script setup>
  import ShopProductCard from '../components/ShopProductCard.vue';
  import { useSessionStore } from '../stores/session.js';
  import { ref } from 'vue';
  import { TrashIcon } from '@heroicons/vue/24/solid/index.js';
  import { useWishlistStore } from '../stores/wishlist.js';

  const wishlistStore = useWishlistStore();
  const products = ref([]);
  const loaded = ref(false);
  fetch('/products/products.json')
    .then((response) => response.json())
    .then((data) => {
      products.value = data;
      loaded.value = true;
    });
</script>

<template>
  <div v-if="!loaded" class="fixed inset-0 flex items-center justify-center z-50">
    <span class="loading loading-dots loading-xl"></span>
  </div>

  <div v-if="loaded" class="max-w-400 mx-auto">
    <h1 class="">Meine Wunschliste</h1>
    <div class="mx-auto" v-if="wishlistStore.wishlist.length === 0">
      Deine Wunschliste ist leer.
    </div>
    <div class="product-grid">
      <div v-for="product in wishlistStore.wishlist" :key="product.id" class="items-center">
        <ShopProductCard :product="product"></ShopProductCard>
        <button
          @click="wishlistStore.removeWishlist(product)"
          class="btn btn-soft hover:text-error w-44"
        >
          Entfernen <TrashIcon class="size-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
