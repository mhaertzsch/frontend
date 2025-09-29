<script setup>
  import { StarIcon } from '@heroicons/vue/24/solid/index.js';
  import confetti from 'canvas-confetti';
  import { onMounted } from 'vue';
  import { play, resumeIfNeeded } from '../audio.js';
  //Über den Vorgänger-Schlüssel werden die daten für das nächste Upgrade geladen, da wir aus user nur das aktuelle User Level kennen.
  defineProps({ user: Object });
  const upgradeConfig = {
    //Guest wird nicht benutzt
    guest: {
      xp: 5000,
      title: 'Silber Mitgliedschaft',
      color: 'text-slate-400',
      progressColor: 'progress-slate-400',
      effect: '1% auf alle Produkte im Shop!',
    },
    standard: {
      xp: 5000,
      title: 'Silber Mitgliedschaft',
      color: 'text-slate-400',
      progressColor: 'progress-slate-400',
      effect: '1% auf alle Produkte im Shop!',
    },
    user_silver: {
      xp: 15000,
      title: 'Gold Mitgliedschaft',
      color: 'text-yellow-400',
      progressColor: 'progress-yellow-400',
      effect: '5% auf alle Produkte im Shop!',
    },
    user_gold: {
      xp: 30000,
      title: 'Platin Mitgliedschaft',
      color: 'text-indigo-300',
      progressColor: 'progress-indigo-300',
      effect: '10% auf alle Produkte im Shop!',
    },
    //Wird ignoriert
    user_platinum: {
      xp: 30000,
      title: 'Platin Mitgliedschaft',
      color: 'text-indigo-300',
      progressColor: 'progress-indigo-300',
      effect: '10% auf alle Produkte im Shop!',
    },
  };
  function getUpgradeConfig(user_level) {
    return upgradeConfig[user_level];
  }
  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }
  function celebrate() {
    play('pop');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: (getOffset(document.getElementById('happy')).left - 100) / window.screen.width,
        y: (getOffset(document.getElementById('happy')).top + 50) / window.screen.height,
      },
    });
  }
  onMounted(async () => {
    await resumeIfNeeded();
  });
</script>

<template>
  <div
    class="mb-4 cursor-pointer select-none"
    @click="celebrate()"
    v-if="user.user_level === 'user_platinum'"
  >
    <p class="font-bold">Du hast das maximale Account Upgrade erreicht!</p>
    <div class="flex inline-flex">
      <div class="w-50 h-2 holocard !mt-2 !mr-4"></div>
      <div id="happy" class="holocard !bg-clip-text !text-transparent">Ende!</div>
    </div>
  </div>
  <div class="mb-4" v-if="!(user.user_level === 'user_platinum')">
    <h2 class="mb-4 font-bold text-md">Benutzerkonto Upgrades</h2>
    <div class="mr-20">
      Fortschritt zur
      <span
        class="tooltip inline-flex items-center tooltip-bottom cursor-pointer"
        :data-tip="getUpgradeConfig(user.user_level).effect"
      >
        <span class="ml-1" :class="getUpgradeConfig(user.user_level).color">{{
          getUpgradeConfig(user.user_level).title
        }}</span>
        <StarIcon class="size-3 ml-1" :class="getUpgradeConfig(user.user_level).color"></StarIcon>:
      </span>
    </div>

    <progress
      class="progress w-50 mr-4"
      :value="user.xp"
      :max="getUpgradeConfig(user.user_level).xp"
    ></progress>
    <span
      ><span :class="getUpgradeConfig(user.user_level).color">{{ user.xp }}</span> /
      {{ getUpgradeConfig(user.user_level).xp }} XP</span
    >
  </div>
</template>

<style scoped></style>
