<script setup>
  import { LockClosedIcon } from '@heroicons/vue/24/solid/index.js';
  import { parseDate } from '../utils.js';

  defineProps({
    badgesUnlocked: Object,
    badgesLocked: Object,
  });

  const badgeConfig = {
    common: {
      borderColor: 'border-common',
    },
    rare: {
      borderColor: 'border-rare',
    },
    super_rare: {
      borderColor: 'border-super_rare',
    },
    ultra_rare: {
      borderColor: 'border-ultra_rare',
    },
    super_ultra_rare: {
      borderColor: 'border-super_ultra_rare',
    },
  };
  function getBadgeConfig(rarity) {
    return badgeConfig[rarity];
  }
</script>

<template>
  <h1>Abzeichen</h1>
  <div
    class="container mx-auto w-96 grid gap-4 grid-cols-[repeat(auto-fit,minmax(96px,1fr))] px-8 py-4 select-none"
  >
    <div class="tooltip" v-for="badge in badgesUnlocked">
      <div class="tooltip-content">
        <p>{{ badge.title }}-Abzeichen</p>
        <p>Erhalten durch: {{ badge.description }}</p>
        <p>Erhalten am: {{ parseDate(badge.date_received) }}</p>
      </div>
      <div
        class="text-primary w-24 rounded-box border-4 isolate"
        :class="getBadgeConfig(badge.rarity).borderColor"
      >
        <img class="rounded-sm" draggable="false" :src="badge.image_url" />
      </div>
    </div>

    <div class="tooltip size-24" v-for="badge in badgesLocked">
      <div class="tooltip-content">
        <p>{{ badge.title }}-Abzeichen</p>
      </div>
      <LockClosedIcon class="z-5 absolute opacity-50 text-red-700 w-12"></LockClosedIcon>
      <div class="grayscale isolate">
        <div
          class="absolute text-primary w-24 rounded-box border-4"
          :class="getBadgeConfig(badge.rarity).borderColor"
        >
          <img class="rounded-sm" draggable="false" :src="badge.image_url" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
