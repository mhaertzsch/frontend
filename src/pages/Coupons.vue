<script setup>
  import { useSessionStore } from '../stores/session.js';
  import { computed, onMounted, ref } from 'vue';
  import GachaCard from '../components/GachaCard.vue';
  import { fetchOwnedCoupons } from '../api.js';

  const couponsOwned = ref([]);
  onMounted(async () => (couponsOwned.value = await fetchOwnedCoupons()));

  const ultra_rare = computed(() =>
    couponsOwned.value.filter((owned) => owned.coupon.rarity === 'ultra_rare')
  );
  const super_rare = computed(() =>
    couponsOwned.value.filter((owned) => owned.coupon.rarity === 'super_rare')
  );
  const rare = computed(() => couponsOwned.value.filter((owned) => owned.coupon.rarity === 'rare'));
  const common = computed(() =>
    couponsOwned.value.filter((owned) => owned.coupon.rarity === 'common')
  );

  const sortedUnits = computed(() =>
    [...ultra_rare.value, ...super_rare.value, ...rare.value, ...common.value].filter(
      (item) => item.quantity !== 0
    )
  );
</script>

<template>
  <div class="m-4 w-400 mx-auto">
    <h1>Verfügbare Gutscheine:</h1>
    <div
      class="container mx-auto mt-4 grid gap-4 select-none grid-cols-[repeat(auto-fill,minmax(224px,1fr))] px-4 mb-10"
    >
      <div v-for="owned in sortedUnits">
        <div
          class="absolute z-5 pointer-events-none text-white text-2xl ml-2 mt-2 mix-blend-overlay"
        >
          ×{{ owned.quantity }}
        </div>
        <GachaCard class="absolute" :unit="owned.coupon"></GachaCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
