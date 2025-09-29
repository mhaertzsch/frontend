<script setup>
  import { CheckIcon, StarIcon } from '@heroicons/vue/24/solid/index.js';
  import { computed, onMounted, ref } from 'vue';
  import {
    claimAchievement,
    fetchAchievements,
    fetchAllBadges,
    fetchCurrentUserData,
    fetchLockedBadges,
    fetchUnlockedBadges,
  } from '../api.js';
  import { useSessionStore } from '../stores/session.js';
  import UpgradeProgress from '../components/upgradeProgress.vue';
  import AchievementCardProgress from '../components/AchievementCardProgress.vue';
  import Badges from '../components/Badges.vue';
  import { getUserLevelConfig, parseDate } from '../utils.js';
  import { resumeIfNeeded } from '../audio.js';
  const userData = ref(null);
  const achievementsAvailable = ref(null);
  const achievementsUnlocked = ref(null);
  const achievementsClaimed = ref(null);
  const badgesUnlocked = ref(null);
  const badgesLocked = ref(null);
  const badgesAll = ref(null);
  const loaded = ref(false);
  const claiming = ref(false);
  const session = useSessionStore();
  onMounted(async () => {
    userData.value = await fetchCurrentUserData();
    badgesUnlocked.value = await fetchUnlockedBadges();
    badgesLocked.value = await fetchLockedBadges();
    badgesAll.value = await fetchAllBadges();
    await refreshAchievements();
    console.log(achievementsUnlocked.value);
    loaded.value = true;
    await resumeIfNeeded();
  });
  async function refreshAchievements() {
    achievementsAvailable.value = await fetchAchievements('available');
    achievementsUnlocked.value = await fetchAchievements('unlocked');
    achievementsClaimed.value = await fetchAchievements('claimed');
    userData.value = await fetchCurrentUserData();
    badgesUnlocked.value = await fetchUnlockedBadges();
    badgesLocked.value = await fetchLockedBadges();
  }
  async function claim(id) {
    claiming.value = true;
    const result = await claimAchievement(id);
    if ((result.status === 'ok')) {
      for (const [key, value] of Object.entries(result.rewards)) {
        //Badges sollen auch kommen
        if (value !== null && (key === 'xp' || key === 'gems')) {
          if (key === 'gems') {
            session.alert({ message: `${value}★ erhalten.`, type: 'success' });
            continue;
          }
          session.alert({ message: `${value} ${key} erhalten.`, type: 'success' });
        }
      }
      await refreshAchievements();
      claiming.value = false;
      return;
    }
    claiming.value = false;
    session.alert({ message: result.error, type: 'error' });
  }
</script>

<template>
  <div v-if="!loaded" class="fixed inset-0 flex items-center justify-center z-50">
    <span class="loading loading-dots loading-xl"></span>
  </div>
  <div class="flex mx-auto w-fit" v-if="loaded">
    <div id="section-left" class="place-items-center mx-auto w-96">
      <div class="card bg-base-200 card-m shadow-sm mb-8" v-if="userData !== null">
        <div class="card-body">
          <div class="btn-circle avatar" v-if="userData">
            <div v-if="userData.avatar_url" class="w-24 rounded-full">
              <img :src="userData.avatar_url" />
            </div>

            <div v-if="!userData.avatar_url" class="avatar avatar-placeholder">
              <div class="bg-neutral text-neutral-content w-24 rounded-full">
                <span class="text-4xl">{{ userData.username.charAt(0) }}</span>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-4">
              <span class="text-xl mr-2">{{ userData.username }}</span>
              <span
                class="tooltip inline-flex items-center tooltip-bottom cursor-pointer text-md"
                :class="getUserLevelConfig(userData.user_level).color"
                :data-tip="getUserLevelConfig(userData.user_level).effect"
                >{{ getUserLevelConfig(userData.user_level).title }}</span
              >
            </p>

            <h2 class="font-bold text-lg">Level {{ Math.floor(userData.xp / 1000) }}</h2>
            <div class="mr-20">Fortschritt zu Level {{ Math.floor(userData.xp / 1000) + 1 }}:</div>

            <progress
              class="progress progress-error w-50 mr-4"
              :value="userData.xp"
              :max="(Math.floor(userData.xp / 1000) + 1) * 1000"
            ></progress>
            <span
              ><span class="text-error">{{ userData.xp }}</span> /
              {{ (Math.floor(userData.xp / 1000) + 1) * 1000 }} XP</span
            >
          </div>
          <UpgradeProgress :user="userData"></UpgradeProgress>
        </div>
      </div>
      <div id="achievement-cards" class="overflow-y-scroll h-[60vh] scrollbar-thin">
        <h1 style="margin-bottom: 1em">Errungenschaften</h1>
        <div
          class="achievement-card bg-base-500"
          v-if="achievementsAvailable.length === 0 && achievementsUnlocked.length === 0"
        >
          <div class="card-body">
            <h2 class="card-title">Glückwunsch!</h2>
            <p>Du hast alle zurzeit verfügbaren Errungenschaften abgeschlossen!</p>
          </div>
        </div>

        <div class="mb-4">
          <div v-for="achievement in achievementsUnlocked" class="achievement-card bg-primary">
            <div class="card-body">
              <h2 class="card-title">{{ achievement.title }}</h2>
              <p>
                {{ achievement.description }}
              </p>
              <p class="font-bold">Belohnung: {{ achievement.reward_info }}</p>
              <p v-if="achievement.award_badge_id" class="font-bold">
                Abzeichen: {{ achievement.award_badge_id }}
              </p>
              <AchievementCardProgress :achievement="achievement" />
              <button
                class="btn btn-neutral"
                @click="claim(achievement.achievement_id)"
                :disabled="claiming"
              >
                Abschließen
              </button>
            </div>
          </div>
          <div v-for="achievement in achievementsAvailable" class="achievement-card bg-base-200">
            <div class="card-body">
              <h2 class="card-title">{{ achievement.title }}</h2>
              <p>
                {{ achievement.description }}
              </p>
              <p class="font-bold">Belohnung: {{ achievement.reward_info }}</p>
              <p v-if="achievement.award_badge_id" class="font-bold">
                Abzeichen: {{ achievement.award_badge_id }}
              </p>
              <AchievementCardProgress :achievement="achievement" />
            </div>
          </div>
        </div>

        <h1 style="margin-bottom: 1em">Abgeschlossen</h1>
        <div class="achievement-card bg-base-200" v-if="achievementsClaimed.length === 0">
          <div class="card-body">
            <h2 class="card-title">Noch keine Challenges abgeschlossen</h2>
            <p>Schließe deine erste Challege ab!</p>
          </div>
        </div>

        <div
          v-for="achievement in achievementsClaimed"
          class="achievement-card bg-base-200 opacity-40 hover:opacity-80"
        >
          <div class="card-body">
            <h2 class="card-title">{{ achievement.title }} <CheckIcon class="text-primary size-5" /></h2>
            <p>{{ achievement.description }}</p>
            <p class="font-bold">Erhaltene Belohnung: {{ achievement.reward_info }}</p>
            <p><p v-if="achievement.award_badge_id" class="font-bold">
              Abzeichen: {{ achievement.award_badge_id }}
            </p>
              Abgeschlossen am:
              {{ parseDate(achievement.claimed_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="place-items-center">
      <Badges :badges-unlocked="badgesUnlocked" :badges-locked="badgesLocked"></Badges>
    </div>
  </div>
</template>

<style scoped>
  .card-body {
    padding: 16px;
  }
  .scrollbar-thin {
    scrollbar-width: thin;
  }
</style>
