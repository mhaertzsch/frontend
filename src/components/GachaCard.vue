<script setup>
  import { onMounted, ref } from 'vue';
  import { playExclusive, resumeIfNeeded } from '../audio.js';

  defineProps({
    unit: Object,
  });
  const hovered = ref(false);
  const imageLoaded = ref(true);
  onMounted(async () => {
    await resumeIfNeeded();
  });
</script>

<template>
  <div class="relative isolate select-none">
    <div
      v-if="!imageLoaded"
      class="loading loading-ring loading-xl my-34"
      :class="{
        'text-slate-500': unit.rarity === 'ultra_rare',
        'text-super_rare': unit.rarity === 'super_rare',
        'text-rare': unit.rarity === 'rare',
        'text-common': unit.rarity === 'common',
      }"
    ></div>
    <div
      @mouseenter="
        hovered = true;
        playExclusive('card_flip', { volume: 0.5, rate: 1.2 });
      "
      @mouseleave="
        hovered = false;
        playExclusive('card_flip', { volume: 0.4, rate: 0.8 });
      "
      v-show="imageLoaded"
      class="flex w-56 h-82 text-center"
    >
      <div v-if="unit.rarity === 'ultra_rare' || unit.rarity === 'super_rare'">
        <div
          v-if="unit.rarity === 'ultra_rare'"
          class="w-56 h-82 holocard absolute rounded-lg z-4 mix-blend-color opacity-90"
        ></div>
        <div
          v-if="unit.rarity === 'super_rare'"
          class="w-56 h-82 srholo absolute rounded-lg z-4 mix-blend-color opacity-90"
        ></div>
        <div
          class="w-56 h-82 glitter absolute rounded-lg z-3 mix-blend-color-dodge opacity-15"
        ></div>
        <div
          class="w-56 h-82 pattern absolute rounded-lg z-2 mix-blend-color-dodge opacity-30"
        ></div>
      </div>
      <div
        class="w-56 h-82 bg-slate-200 border-4 rounded-lg absolute mix-blend-color-mix z-1"
        :class="{
          'border-slate-500 text-slate-500 drop-shadow-xl shadow-slate-500':
            unit.rarity === 'ultra_rare',
          'outline-super_rare text-super_rare': unit.rarity === 'super_rare',
          'outline-rare text-rare': unit.rarity === 'rare',
          'outline-common text-common': unit.rarity === 'common',
          'bg-slate-900': hovered,
        }"
      >
        <figure v-show="!hovered">
          <div class="w-54 h-54 rounded-t-sm overflow-hidden">
            <img
              :src="unit.image_url"
              :alt="unit.name"
              @load="imageLoaded = true"
              draggable="false"
              class="drop-shadow-xl w-full h-full object-cover"
            />
          </div>
        </figure>
        <div :class="' card-body rarity__color__' + unit.rarity">
          <p
            v-if="!hovered"
            class="text-xs"
            :class="{
              'animate-bounce font-bold': unit.rarity === 'ultra_rare',
            }"
          >
            {{ unit.name }}
          </p>

          <div v-if="hovered" class="text-m h-66 content-center">
            {{ unit.description }}
          </div>

          <div class="card-actions"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .glitter {
    background-image: url('https://i.pinimg.com/originals/3c/5c/b6/3c5cb68acccf4eca8b821c80eca85309.gif');
  }
  .pattern {
    background-image: url('https://poke-holo.simey.me/img/cosmos-bottom.png');
  }
</style>
