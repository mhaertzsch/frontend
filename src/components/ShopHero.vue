<script setup>
  import { PhotoIcon } from '@heroicons/vue/24/outline/index.js';
  import { ref } from 'vue';

  defineProps({
    product: Object,
  });

  const imageLoaded = ref(false);
</script>

<template>
  <div class="max-w-380 mx-auto">
    <RouterLink :to="'shop/product/' + product.id">
      <div
        class="hero bg-primary text-primary-content hover-opacity shadow-2xl h-auto"
        style="margin-bottom: 1em"
      >
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="w-50 h-50 overflow-hidden">
            <div
              class="bg-neutral-300 text-neutral-400 w-50 h-50 flex items-center rounded-lg shadow-2xl"
              v-if="!imageLoaded"
            >
              <PhotoIcon class="size-16 mx-auto" />
            </div>
            <img
              v-show="imageLoaded"
              :src="product.image_url"
              :alt="product.title"
              @load="imageLoaded = true"
              draggable="false"
              class="w-50 rounded-lg shadow-2xl w-full h-full object-cover"
            />
          </div>

          <div class="mr-8">
            <h2 class="text-5xl font-bold">{{ product.title }}</h2>
            <p class="py-6">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped></style>
