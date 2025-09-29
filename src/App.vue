<script setup>
  import { useSessionStore } from './stores/session.js';
  import { CogIcon, StarIcon, HeartIcon } from '@heroicons/vue/24/solid/index.js';
  import { ShoppingCartIcon, EnvelopeIcon } from '@heroicons/vue/24/outline/index.js';
  import { useCartStore } from './stores/cart.js';
  import { computed, onMounted, ref } from 'vue';
  import ChatPreview from './components/ChatPreview.vue';
  import Alert from './components/Alert.vue';
  import CartTable from './components/CartTable.vue';
  import { fetchCurrentUserData } from './api.js';

  import Seasonal from './components/Seasonal.vue';
  import { getUserLevelConfig } from './utils.js';
  import { useWishlistStore } from './stores/wishlist.js';
  import Footer from './components/Footer.vue';
  const session = useSessionStore();
  const wishlist = useWishlistStore();
  const cart = useCartStore();
  const user = ref(null);
  onMounted(async () => {
    user.value = await fetchCurrentUserData();
  });
</script>

<template>
  <div class="navbar shadow-sm bg-base-200" style="margin-bottom: 1em">
    <div class="flex-1">
      <div class="w-28 h-12">
        <RouterLink to="/">
          <img alt="Logo" src="/logo.png" class="w-28 h-12" style="object-fit: contain" />
        </RouterLink>
      </div>
    </div>

    <ul class="menu menu-horizontal px-1">
      <li><RouterLink to="/shop">Zum Shop</RouterLink></li>
      <li v-if="user">
        <RouterLink to="/gacha"
          ><div>Gacha</div>
          <div v-if="session.gems > 0" class="badge badge-sm badge-primary">
            <span class="inline-flex items-center -m-1">
              <StarIcon class="size-3" />
            </span>
            {{ session.gems }}
          </div></RouterLink
        >
      </li>
      <li>
        <RouterLink to="/me"><div>Mein Fortschritt</div></RouterLink>
      </li>
    </ul>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <ShoppingCartIcon class="size-6 text"></ShoppingCartIcon>
            <span
              v-if="cart.size > 0"
              class="badge badge-sm indicator-item bg-primary text-primary-content"
              >{{ cart.size }}</span
            >
          </div>
        </div>
        <div
          v-show="cart.size === 0"
          tabindex="0"
          class="card card-compact dropdown-content bg-base-200 z-1 mt-3 w-56 shadow"
        >
          Der Einkaufswagen ist leer!
        </div>
        <div
          v-show="cart.size > 0"
          tabindex="0"
          class="card card-compact dropdown-content bg-base-200 z-1 mt-3 w-152 shadow"
        >
          <div class="card-body shadow-2xl">
            <div>
              <CartTable :cart="cart"></CartTable>

              <span class="text-lg font-bold mt-4">{{ cart.size }} Artikel</span>
              <div class="mt-4">
                <RouterLink to="/checkout"
                  ><button class="btn btn-primary btn-block">Zum Checkout</button></RouterLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dropdown dropdown-end ml-2">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar" v-if="user">
          <div v-if="user.avatar_url" class="w-8 rounded-full">
            <img :src="user.avatar_url" />
          </div>

          <div v-if="!user.avatar_url" class="avatar avatar-placeholder">
            <div class="bg-neutral text-neutral-content w-8 rounded-full">
              <span class="text-xl">{{ user.username.charAt(0) }}</span>
            </div>
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li v-if="user">
            <RouterLink to="/me" class="justify-between">
              <span class="font-bold underline">{{ user.username }}</span>
              <span
                class="inline-flex items-center space-x-1 font-bold"
                :class="getUserLevelConfig(session.userLevel).color"
              >
                {{ getUserLevelConfig(session.userLevel).title }}
              </span>
            </RouterLink>
          </li>
          <li><RouterLink to="/orders">Bestellungen</RouterLink></li>
          <li>
            <RouterLink to="/coupons" class="justify-between">Gutscheine</RouterLink>
          </li>
          <li>
            <RouterLink to="/wishlist" class="justify-between"
              >Wunschliste
              <div v-if="wishlist.wishlist.length > 0" class="badge badge-sm badge-primary">
                <span class="inline-flex items-center -m-1">
                  <HeartIcon class="size-3" />
                </span>
                {{ wishlist.wishlist.length }}
              </div></RouterLink
            >
          </li>

          <li><RouterLink to="/settings">Einstellungen</RouterLink></li>
        </ul>
      </div>
    </div>
  </div>
  <Seasonal></Seasonal>

  <Alert class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" />
  <RouterView :key="$route.fullPath" />
</template>

<style scoped></style>
