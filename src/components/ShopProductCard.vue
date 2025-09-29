<script setup>
  import { StarIcon as StarSolid } from '@heroicons/vue/24/solid/index.js';
  import { StarIcon as StarOutline } from '@heroicons/vue/24/outline/index.js';
  import { PhotoIcon } from '@heroicons/vue/24/outline/index.js';
  import { useCartStore } from '../stores/cart.js';
  import { ref } from 'vue';

  defineProps({
    product: Object,
  });
  const cart = useCartStore();

  const imageLoaded = ref(false);
  const loadingError = ref(false);
</script>

<template>
  <RouterLink :to="'/shop/product/' + product.id">
    <div class="w-44 hover-opacity">
      <figure>
        <div class="w-44 h-44 overflow-hidden">
          <div
            class="bg-neutral-300 text-neutral-400 w-44 h-44 flex items-center"
            v-if="loadingError"
          >
            <PhotoIcon class="size-16 mx-auto" />
          </div>
          <div v-if="!imageLoaded" class="skeleton size-44"></div>
          <img
            v-show="imageLoaded"
            @load="imageLoaded = true"
            @error="loadingError = true"
            :src="product.image_url"
            :alt="product.title"
            draggable="false"
            class="drop-shadow-xl w-full h-full object-cover"
          />
        </div>
      </figure>
      <div class="card-body">
        <div class="line-clamp-2 h-10">
          <p class="text-l">{{ product.title }}</p>
        </div>
        <div class="line-clamp-1 h-5 text-slate-500">
          <p class="text-l">{{ product.brand }}</p>
        </div>

        <p class="text-l">
          <span class="inline-flex items-center space-x-1">
            <span>{{ product.rating_score }}</span>
            <span v-for="n in parseInt(product.rating_score)">
              <StarSolid class="size-3 text-yellow-500" v-if="product.rating_score >= 4" />
              <StarSolid class="size-3 text-gray-500" v-if="product.rating_score < 4" />
            </span>
            <span v-for="n in 5 - parseInt(product.rating_score)">
              <StarOutline class="size-3 text-yellow-500" v-if="product.rating_score >= 4" />
              <StarOutline class="size-3 text-gray-500" v-if="product.rating_score < 4" />
            </span>
          </span>
        </p>
        <div class="flex flex-dir-row items-center">
          <div class="mr-2">
            <div
              v-if="product.status === 'in-stock'"
              class="badge badge-outline badge-xs badge-success"
            >
              Vorrätig
            </div>
            <div
              v-else-if="product.status === 'pre-order'"
              class="badge badge-outline badge-xs badge-info"
            >
              Vorbestellbar
            </div>
            <div
              v-else-if="product.status === 'sold-out'"
              class="badge badge-outline badge-xs badge-error"
            >
              Ausverkauft
            </div>
            <div v-else class="badge badge-outline badge-error">{{ product.status }}</div>
          </div>

          <div v-if="product.status === 'in-stock' && product.stock <= 4" class="tooltip">
            <div class="tooltip-content">
              <div class="w-24">Nur noch weniger als 5 Artikel verfügbar!</div>
            </div>
            <div class="text-red-700 font-bold text-xs animate-bounce hover:animate-none">
              Letzte Chance!
            </div>
          </div>
        </div>

        <p class="text-xl">{{ product.price }}€</p>

        <div class="card-actions"></div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
