<script setup>
  import { ShieldCheckIcon } from '@heroicons/vue/24/solid/index.js';
  const props = defineProps({
    message: String,
    user: {
      image: String,
      name: String,
    },
    isSystemUser: Boolean,
  });
</script>

<template>
  <div style="margin-bottom: 0.5em" class="card w-74 h-18 bg-base-500 card-xs shadow-sm">
    <div class="card-body flex flex-row gap-4">
      <div class="avatar">
        <div class="size-14 rounded-full">
          <img :src="props.user.image" />
        </div>
      </div>

      <div class="flex flex-col h-14 overflow-hidden">
        <h2 class="card-title m-0 leading-tight">
          {{ props.user.name }}
          <ShieldCheckIcon class="size-5 text-green-600" v-if="isSystemUser"></ShieldCheckIcon>
        </h2>
        <p class="text-sm text-gray-600">{{ props.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
