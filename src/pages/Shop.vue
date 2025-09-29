<script setup>
  import { computed, ref } from 'vue';

  import ShopProductCard from '../components/ShopProductCard.vue';
  import {
    ArrowsRightLeftIcon as SwitchIcon,
    MagnifyingGlassIcon,
    AdjustmentsVerticalIcon as FilterIcon,
  } from '@heroicons/vue/24/solid/index.js';
  import { fetchCategories, fetchProducts } from '../api.js';

  const props = defineProps({
    category: Object,
  });

  const products = ref([]);
  const loaded = ref(false);
  const searchInput = ref('');
  const minPriceInput = ref('');
  const maxPriceInput = ref('');
  const sortSetting = ref('none');
  const isDescending = ref(false);
  const hideSoldOut = ref(false);
  const filteredProducts = computed(() => {
    let filteredProducts = products.value;

    filteredProducts = filteredProducts.sort((a, b) => {
      if (isDescending.value === true) {
        return a.id > b.id ? -1 : 1;
      }
      return a.id < b.id ? -1 : 1;
    });

    if (props.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id === props.category.id
      );
    }

    if (minPriceInput.value !== '') {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(minPriceInput.value)
      );
    }
    if (maxPriceInput.value !== '') {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(maxPriceInput.value)
      );
    }
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    if (sortSetting.value === 'alphabetical') {
      filteredProducts = filteredProducts.sort((a, b) => {
        if (isDescending.value === true) {
          return a.title > b.title ? -1 : 1;
        }
        return a.title < b.title ? -1 : 1;
      });
    }
    if (sortSetting.value === 'price') {
      filteredProducts = filteredProducts.sort((a, b) => {
        if (isDescending.value === true) {
          return a.price > b.price ? -1 : 1;
        }
        return a.price < b.price ? -1 : 1;
      });
    }
    if (sortSetting.value === 'rating') {
      filteredProducts = filteredProducts.sort((a, b) => {
        if (isDescending.value === true) {
          return a.rating_score < b.rating_score ? -1 : 1;
        }
        return a.rating_score > b.rating_score ? -1 : 1;
      });
    }

    if (hideSoldOut.value) {
      filteredProducts = filteredProducts.filter((product) => product.status !== 'sold-out');
    }

    return filteredProducts;
  });

  const currentMaxPrice = computed(() => {
    const products = filteredProducts.value.slice();
    if (products.length === 0) return null;

    products.sort((a, b) => b.price - a.price);
    return products[0].price;
  });

  fetchProducts().then((data) => {
    products.value = data;
    loaded.value = true;
  });
</script>

<template>
  <div class="mx-auto max-w-400">
    <h2 class="font-bold text-5xl mb-8" style="text-transform: capitalize">
      <span v-if="!category?.name">Alle Produkte</span
      ><span v-if="category?.name">{{ category.name }} ({{ filteredProducts.length }})</span>
    </h2>
  </div>
  <div class="mx-auto bg-primary grid grid-cols-2 gap-2 max-w-360 p-4 rounded-sm">
    <div class="mx-auto flex flex-dir-row">
      <label class="input">
        <MagnifyingGlassIcon class="size-6" />
        <input type="search" class="grow" placeholder="Search" v-model="searchInput" />
      </label>

      <div class="dropdown dropdown-end ml-2">
        <div tabindex="0" role="button" class="btn-special">
          <div class="indicator">
            <FilterIcon class="size-6 text"></FilterIcon>
          </div>
        </div>
        <div
          tabindex="0"
          class="card card-compact dropdown-content bg-base-200 z-1 mt-3 w-86 shadow"
        >
          <div class="card-body">
            <p class="text-xl">Suchfilter:</p>
            <label class="label">
              <input type="checkbox" class="checkbox" v-model="hideSoldOut" />
              Ausverkaufte Arikel verstecken
            </label>
            Preisspanne:
            <div class="items-center flex flex-dir-row">
              <input
                type="text"
                class="input w-30"
                placeholder="min. Preis"
                v-model="minPriceInput"
              /><span class="mx-2">—</span>
              <input
                type="text"
                class="input w-30"
                placeholder="max. Preis"
                v-model="maxPriceInput"
              />
            </div>
            <div>
              <span v-if="!minPriceInput">0 €</span>
              <span v-if="minPriceInput">{{ parseFloat(minPriceInput) }}€</span> bis
              <span v-if="!maxPriceInput">{{ currentMaxPrice }}€</span>
              <span v-if="maxPriceInput">{{ parseFloat(maxPriceInput) }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto flex flex-dir-row">
      <select class="select" v-model="sortSetting">
        <option selected value="none">
          <span v-if="!isDescending">Neuste zuerst</span
          ><span v-if="isDescending">Älteste zuerst</span>
        </option>
        <option value="alphabetical">
          <span v-if="!isDescending">Titel (A bis Z)</span
          ><span v-if="isDescending">Titel (Z bis A)</span>
        </option>
        <option value="price">
          <span v-if="!isDescending">Preis (Niedrig bis Hoch)</span
          ><span v-if="isDescending">Preis (Hoch bis Niedrig)</span>
        </option>
        <option value="rating">
          <span v-if="!isDescending">Bewertungen (Hoch zuerst)</span
          ><span v-if="isDescending">Bewertungen (Niedrig zuerst)</span>
        </option>
      </select>
      <label class="ml-2">
        <input type="checkbox" v-model="isDescending" class="sr-only" />
        <div class="btn-special" tabindex="0" role="button">
          <SwitchIcon class="size-6" />
        </div>
      </label>
    </div>
  </div>

  <div v-if="!loaded" class="fixed inset-0 flex items-center justify-center z-50">
    <span class="loading loading-dots loading-xl"></span>
  </div>

  <div v-if="loaded" class="max-w-400 mx-auto">
    <div v-if="searchInput" class="italic">Ergebnisse für "{{ searchInput }}:"</div>
    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id">
        <ShopProductCard :product="product"></ShopProductCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
