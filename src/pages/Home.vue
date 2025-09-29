<script setup>
  import ShopHero from '../components/ShopHero.vue';
  import { ref } from 'vue';
  import ShopProductCard from '../components/ShopProductCard.vue';
  import { fetchCategories, fetchProducts } from '../api.js';
  import Footer from '../components/Footer.vue';

  const products = ref([]);
  const categories = ref([]);
  const loaded = ref(false);
  fetchCategories().then((data) => {
    categories.value = data;
  });
  fetchProducts().then((data) => {
    products.value = data;
    loaded.value = true;
  });
</script>

<template>
  <!--Ladeanimation-->
  <div v-if="!loaded" class="fixed inset-0 flex items-center justify-center z-50">
    <span class="loading loading-dots loading-xl"></span>
  </div>
  <div v-if="loaded">
    <!--Kategorien Navigation-->
    <div class="max-w-[100vw] w-380 mx-auto md:flex bg-primary mt-4 p-4">
      <RouterLink :to="'/shop'">
        <button class="btn btn-ghost text-xl text-primary-content hover:bg-primary">
          Alle Produkte
        </button>
        <div class="divider divider-horizontal"></div>
      </RouterLink>
      <div v-for="category in categories">
        <RouterLink :to="'/shop/category/' + category.id">
          <button class="btn btn-ghost text-l text-primary-content hover:bg-primary">
            {{ category.name }}
          </button>
        </RouterLink>
      </div>
    </div>

    <!--Banner-->
    <ShopHero :product="products[Math.floor(Math.random() * products.length)]"></ShopHero>

    <!--Produkte Grid-->
    <div class="max-w-380 mx-auto">
      <h1>Neue Produkte</h1>
      <div class="product-grid">
        <div v-for="product in products.slice(0, 16)" :key="product.id">
          <ShopProductCard :product="product"></ShopProductCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
