<script setup>
  import { BeakerIcon } from '@heroicons/vue/24/outline/index.js';
  import { InformationCircleIcon } from '@heroicons/vue/24/outline/index.js';
  import { StarIcon as GemIcon } from '@heroicons/vue/24/solid/index.js';
  import { useSessionStore } from '../stores/session.js';
  import { onMounted, ref } from 'vue';
  import { sleep } from '../utils.js';
  import confetti from 'canvas-confetti';
  import { fetchCurrentUserData, gachaSinglePull, gachaTenPull } from '../api.js';
  import GachaCard from '../components/GachaCard.vue';
  import { loadAll, resumeIfNeeded, play } from '../audio.js';

  function celebrate() {
    play('pop');
    play('yay');
    play('horn');
    confetti({
      particleCount: 200,
      spread: 150,
      origin: { y: 0.6 },
    });
  }
  const session = useSessionStore();
  const animationPercentage = ref(0);
  const resultUnit = ref(null);
  const user = ref(null);
  const resultUnits = ref([]);
  const pulling = ref(false);
  const duration = 0.2;
  async function refreshUserStats() {
    user.value = await fetchCurrentUserData();
  }

  onMounted(async () => {
    await loadAll({
      card_flip: '/audio/page-flip.mp3',
      pop: '/audio/confetti-pop.mp3',
      horn: '/audio/horn.mp3',
      yay: '/audio/yay.mp3',
      loading: '/audio/transition.m4a',
      shine: '/audio/shine.mp3',
    });
    await resumeIfNeeded();
  });

  async function singlePull() {
    await refreshUserStats();
    if (pulling.value === true || user.value.gems < 50) {
      return;
    }

    resultUnit.value = null;
    resultUnits.value = [];
    pulling.value = true;

    const pullResult = await gachaSinglePull();

    document.getElementById('progress').classList.add('a__color__' + pullResult.rarity);
    await progressAnimation(duration);
    await sleep(500);
    animationPercentage.value = 0;
    document.getElementById('progress').classList.remove('a__color__' + pullResult.rarity);
    resultUnit.value = pullResult;
    await refreshUserStats();
    session.alert({ message: '100 XP erhalten.' });
    pulling.value = false;
    if (resultUnit.value.rarity === 'super_rare' || resultUnit.value.rarity === 'ultra_rare') {
      celebrate();
    }
  }

  async function tenPull() {
    await refreshUserStats();
    if (pulling.value === true || user.value.gems < 500) {
      return;
    }
    resultUnits.value = [];
    resultUnit.value = null;
    pulling.value = true;

    const pulls = await gachaTenPull();

    const rarity = ref('common');
    if (pulls.some((pull) => pull.rarity === 'rare')) {
      rarity.value = 'rare';
    }
    if (pulls.some((pull) => pull.rarity === 'super_rare')) {
      rarity.value = 'super_rare';
    }
    if (pulls.some((pull) => pull.rarity === 'ultra_rare')) {
      rarity.value = 'ultra_rare';
    }
    document.getElementById('progress').classList.add('a__color__' + rarity.value);
    await progressAnimation(duration);
    await sleep(500);
    animationPercentage.value = 0;
    resultUnits.value = pulls;
    document.getElementById('progress').classList.remove('a__color__' + rarity.value);
    await refreshUserStats();
    session.alert({ message: 'Erhaltene Gutscheine wurden deinem Inventar hinzugefügt.' });
    session.alert({ message: '1000 XP erhalten.' });
    pulling.value = false;
    if (rarity.value === 'ultra_rare' || rarity.value === 'super_rare') {
      celebrate();
    }
  }

  async function progressAnimation(duration) {
    play('loading', { volume: 0.6, rate: 0.4 });
    play('shine');
    return new Promise((resolve) => {
      const totalSteps = 100;
      const intervalTime = (duration * 1000) / totalSteps;

      const interval = setInterval(() => {
        animationPercentage.value++;
        if (animationPercentage.value >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, intervalTime);
    });
  }

  onMounted(async () => {
    await refreshUserStats();
  });
</script>

<template>
  <div
    class="mx-auto bg-gradient-to-b from-sky-200 to-slate-800 w-80 h-160 sm:w-120 sm:h-180 md:w-180 md:h-120 xl:w-270 xl:h-180 2xl:w-360 2xl:h-240 drop-shadow-xl"
    v-if="user"
  >
    <div class="navbar bg-transparent">
      <div class="navbar-start"></div>
      <div class="navbar-center hidden lg:flex">
        <div
          class="tooltip tooltip-bottom"
          data-tip="Verdiene dir für jeden Euro den du im Shop ausgibst 10 Sterne!"
        >
          <button class="btn"><GemIcon class="size-6 text-primary" />{{ user.gems }}</button>
        </div>
      </div>
      <div class="navbar-end">
        <div class="tooltip tooltip-bottom">
          <div class="tooltip-content">
            <h3 class="text-lg font-bold">Wahrscheinlichkeiten:</h3>
            <p class="text-ultra_rare">Ultra Selten: 1%</p>
            <p class="text-super_rare">Super Selten: 9%</p>
            <p class="text-rare">Selten: 20%</p>
            <p class="text-common">Common 70%</p>
            <p>Du hast bereits {{ user.pulls_count }} Versuche durchgeführt!</p>
          </div>
          <button class="btn"><InformationCircleIcon class="size-6 text" /> Info</button>
        </div>
      </div>
    </div>
    <div class="subwindow">
      <div v-if="resultUnit" class="drop-shadow-xl">
        <GachaCard :unit="resultUnit"></GachaCard>
      </div>

      <div v-if="resultUnits.length >= 0" class="grid grid-cols-5 gap-4">
        <div v-for="unit in resultUnits">
          <GachaCard :unit="unit"></GachaCard>
        </div>
      </div>

      <div
        v-if="!resultUnit && resultUnits.length === 0"
        id="progress"
        class="radial-progress bg-slate-700 text-primary-content border-primary border-4 a__color shadow-md"
        :style="'--value:' + animationPercentage + ';'"
        role="progressbar"
      >
        <span v-if="animationPercentage !== 0">{{ animationPercentage }}%</span>
        <span v-if="animationPercentage === 0">Ready!</span>
      </div>
    </div>
    <div class="w-fit mx-auto mt-6">
      <button class="btn gacha__button" @click="singlePull()" :disabled="user.gems < 50 || pulling">
        1✕ (<GemIcon class="size-6 text-primary" />50)
      </button>
      <button class="btn gacha__button" @click="tenPull()" :disabled="user.gems < 500 || pulling">
        10✕ (<GemIcon class="size-6 text-primary" />500)
      </button>
    </div>
  </div>
</template>

<style scoped>
  .a__color {
    border-color: white;
    transition: border-color 1s ease-in;
  }
  .a__color__ultra_rare {
    border-color: var(--color-ultra_rare);
  }
  .a__color__super_rare {
    border-color: var(--color-super_rare);
  }
  .a__color__rare {
    border-color: var(--color-rare);
  }
  .a__color__common {
    border-color: var(--color-common);
  }
  .subwindow {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 80%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 64px;
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%);
  }

  .gacha__button {
    margin: 0 0.2em;
  }
</style>
