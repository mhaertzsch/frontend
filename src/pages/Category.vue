<script setup>
  import Shop from './Shop.vue';
  import { useRoute } from 'vue-router';
  import { ref } from 'vue';
  import { fetchCategories, fetchProducts } from '../api.js';
  const route = useRoute();
  const idParam = route.params.id;
  const category = Array.isArray(idParam) ? idParam[0] : idParam;

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
  <div class="w-380 mx-auto flex flex-dir-row bg-primary mt-4 mb-8 p-4">
    <RouterLink :to="'/shop'">
      <button
        class="btn btn-ghost text-xl text-primary-content hover:bg-primary"
        style="text-transform: capitalize"
      >
        Alle Produkte
      </button>
      <div class="divider divider-horizontal"></div>
    </RouterLink>
    <div v-for="cat in categories">
      <RouterLink
        :to="'/shop/category/' + cat.id"
        :class="{ 'pointer-events-none': cat.id === category }"
      >
        <button
          class="btn btn-ghost text-l text-primary-content hover:bg-primary"
          :class="{ 'opacity-50': cat.id === category }"
          :disabled="cat.id === category"
          style="text-transform: capitalize"
        >
          {{ cat.name }}
        </button>
      </RouterLink>
    </div>
  </div>
  <Shop :category="categories.find((cat) => cat.id === category)" />
</template>
<style scoped></style>
