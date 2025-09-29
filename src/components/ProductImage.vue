<script setup>
  import { PhotoIcon } from '@heroicons/vue/24/outline/index.js';
  import { ref } from 'vue';
  defineProps({
    image_url: String,
  });
  const imageLoaded = ref(false);
  const loadingError = ref(false);
</script>

<template>
  <figure>
    <div class="w-96 h-auto overflow-hidden">
      <div class="bg-neutral-300 text-neutral-400 w-64 h-64 flex items-center" v-if="loadingError">
        <PhotoIcon class="size-24 mx-auto" />
      </div>
      <div v-if="!imageLoaded" class="skeleton size-64 shadow-2xl"></div>
      <img
        v-show="imageLoaded"
        @load="imageLoaded = true"
        @error="loadingError = true"
        :src="image_url"
        :alt="image_url"
        draggable="false"
        class="w-full h-full max-w-sm rounded-lg object-cover"
      />
    </div>
  </figure>
</template>

<style scoped></style>
