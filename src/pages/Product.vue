<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/vue/24/solid/index.js';
  import {
    ShoppingCartIcon,
    HeartIcon as HeartOutline,
    StarIcon as StarOutline,
    PhotoIcon,
  } from '@heroicons/vue/24/outline/index.js';
  import { useCartStore } from '../stores/cart.js';
  import ProductCard from '../components/ShopProductCard.vue';
  import { useSessionStore } from '../stores/session.js';
  import {
    fetchCategories,
    fetchCurrentUserData,
    fetchProduct,
    fetchProductsInCategory,
  } from '../api.js';
  import { useWishlistStore } from '../stores/wishlist.js';
  import ProductImage from '../components/ProductImage.vue';
  import { getUserLevelConfig } from '../utils.js';

  const product = ref(null);
  const categories = ref([]);
  const categoryName = ref('');
  const recommendations = ref(null);
  const recommendationText = ref('Was dir auch gefallen könnte...');
  const loaded = ref(false);

  const cart = useCartStore();
  const session = useSessionStore();
  const wishlistStore = useWishlistStore();
  const route = useRoute();

  async function loadProduct(id) {
    loaded.value = false;
    product.value = await fetchProduct(id);
    categories.value = await fetchCategories();
    categoryName.value = categories.value.find(
      (category) => category.id === product.value.category_id
    ).name;
    recommendations.value = await fetchProductsInCategory(product.value.category_id);

    if (product.value.category_id === 'games') {
      recommendationText.value = 'Spiele die dir auch gefallen könnten...';
    } else if (product.value.category_id === 'accessories') {
      recommendationText.value = 'Weiteres Gaming Zubehör...';
    } else {
      recommendationText.value =
        'Weitere Produkte in der Kategorie \"' + categoryName.value + '\"...';
    }

    loaded.value = true;
  }

  onMounted(async () => {
    await loadProduct(route.params.id);
  });

  watch(
    () => route.params.id,
    (newId) => {
      loadProduct(newId);
    }
  );
</script>

<template>
  <div v-if="loaded">
    <div class="max-w-400 mx-auto">
      <div class="breadcrumbs text-sm text-primary font-semibold">
        <ul>
          <li><RouterLink to="/shop">Produkte</RouterLink></li>
          <li>
            <RouterLink
              :to="'/shop/category/' + product.category_id"
              style="text-transform: capitalize"
              >{{ categoryName }}</RouterLink
            >
          </li>
          <li class="font-medium">{{ product.title }}</li>
        </ul>
      </div>
      <div class="hero max-w-384 mx-auto">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <figure class="hover-gallery max-w-96">
            <ProductImage :image_url="product.image_url"></ProductImage>
            <img
              v-if="product.id <= 8"
              class="rounded-lg"
              :src="product.image_url.replaceAll('.png', '_side.png')"
            />
            <img
              v-if="product.id <= 8"
              class="rounded-lg"
              :src="product.image_url.replaceAll('.png', '_back.png')"
            />
          </figure>
          <div class="bg-base-200 p-8 rounded-xl shadow-2xl mr-8 max-w-180">
            <h2 class="text-2xl font-bold">{{ product.title }}</h2>
            <p class="text font-bold mb-2">
              <span class="inline-flex items-center space-x-1">
                <span>{{ product.rating_score }}</span>
                <span v-for="n in parseInt(product.rating_score)">
                  <StarSolid class="size-4 text-yellow-500" v-if="product.rating_score >= 4" />
                  <StarSolid class="size-4 text-gray-500" v-if="product.rating_score < 4" />
                </span>
                <span v-for="n in 5 - parseInt(product.rating_score)">
                  <StarOutline class="size-4 text-yellow-500" v-if="product.rating_score >= 4" />
                  <StarOutline class="size-4 text-gray-500" v-if="product.rating_score < 4" />
                </span>
                <span>(Bei {{ product.rating_count }} Bewertungen)</span>
              </span>
            </p>
            <div class="flex flex-dir-row">
              <div class="mb-2 mr-2">
                <div v-if="product.status === 'in-stock'" class="badge badge-outline badge-success">
                  Vorrätig
                </div>
                <div
                  v-else-if="product.status === 'pre-order'"
                  class="badge badge-outline badge-info"
                >
                  Vorbestellbar
                </div>
                <div
                  v-else-if="product.status === 'sold-out'"
                  class="badge badge-outline badge-error"
                >
                  Ausverkauft
                </div>
                <div v-else class="badge badge-outline badge-error">{{ product.status }}</div>
              </div>

              <div
                v-if="product.status === 'in-stock' && product.stock <= 4"
                class="tooltip"
                data-tip="Weniger als 5 Artikel verfügbar!"
              >
                <div class="badge badge-primary">Letzte Chance!</div>
              </div>
            </div>

            <h1 :class="{ 'line-through opacity-50': session.userLevel !== 'standard' }">
              {{ product.price }}€
            </h1>
            <h1 v-if="session.userLevel !== 'standard'">
              {{
                (
                  product.price -
                  product.price * (getUserLevelConfig(session.userLevel).percentage / 100)
                ).toFixed(2)
              }}€
              <span
                class="tooltip tooltip-top"
                :data-tip="getUserLevelConfig(session.userLevel).effect"
              >
                <span class="text-sm" :class="getUserLevelConfig(session.userLevel).color"
                  >({{ getUserLevelConfig(session.userLevel).title }})</span
                >
              </span>
            </h1>

            <p class="py-6">
              {{ product.description }}
            </p>
            <div>
              <button
                class="btn btn-primary xl:text-base-100 mr-2"
                @click="cart.addItem(product)"
                :disabled="product.status === 'sold-out'"
              >
                <ShoppingCartIcon class="size-5 text"></ShoppingCartIcon>In den Einkaufswagen
              </button>
              <button
                class="btn xl"
                @click="wishlistStore.addWishlist(product)"
                v-if="!wishlistStore.wishlist.some((p) => p.id === product.id)"
              >
                <HeartOutline class="size-5 text"></HeartOutline>Auf die Wunschliste
              </button>

              <button
                class="btn xl group relative"
                @click="wishlistStore.removeWishlist(product)"
                v-if="wishlistStore.wishlist.some((p) => p.id === product.id)"
              >
                <span class="flex items-center gap-2 group-hover:hidden">
                  <HeartSolid class="size-5 text-primary" />
                  Bereits auf der Wunschliste
                </span>
                <span class="flex items-center gap-2 hidden group-hover:flex">
                  <HeartOutline class="size-5 text-primary" />
                  Von Wunschliste entfernen
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="recommendations.length > 1">
        <p class="text-xl font-bold m-10">{{ recommendationText }}</p>
        <div class="product-grid">
          <div v-for="item in recommendations" :key="item.id">
            <ProductCard :product="item"></ProductCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
