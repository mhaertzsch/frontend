<script setup>
  import { useCartStore } from '../stores/cart.js';
  import { computed, onMounted, ref, toRaw } from 'vue';
  import router from '../router';
  import { useSessionStore } from '../stores/session.js';
  import { ChevronDownIcon } from '@heroicons/vue/24/solid/index.js';
  import { CreditCardIcon } from '@heroicons/vue/24/outline/index.js';
  import { TicketIcon } from '@heroicons/vue/24/outline/index.js';
  import Alert from '../components/Alert.vue';
  import { getUserLevelConfig, sleep } from '../utils.js';
  import CartTable from '../components/CartTable.vue';
  import API, { fetchCurrentUserData, fetchOwnedCoupons } from '../api.js';
  const cart = useCartStore();
  const session = useSessionStore();
  const processing = ref(false);
  const ownedCoupons = ref([]);
  const userData = ref(null);
  const selectedCoupon = ref('none');
  const paymentMethod = ref('');
  const userLevelDiscount = computed(() => {
    let discount = 0;
    if (userData.value) {
      switch (userData.value.user_level) {
        case 'guest':
          break;
        case 'standard':
          break;
        case 'user_silver':
          discount += cart.total * (1 / 100);
          break;
        case 'user_gold':
          discount += cart.total * (5 / 100);
          break;
        case 'user_platinum':
          discount += cart.total * (10 / 100);
          break;
        default:
          break;
      }
    }
    return discount;
  });
  const couponDiscount = computed(() => {
    let discount = 0;
    if (selectedCoupon.value !== 'none') {
      let selected = ownedCoupons.value.find((owned) => owned.coupon.id === selectedCoupon.value);
      discount =
        selected.coupon.type === 'percentage'
          ? cart.total * (selected.coupon.value / 100)
          : selected.coupon.value;
    }
    return discount;
  });
  const discount = computed(() => {
    return userLevelDiscount.value + couponDiscount.value;
  });
  onMounted(async () => {
    ownedCoupons.value = await fetchOwnedCoupons();
    userData.value = await fetchCurrentUserData();
  });
  async function finalizePurchase() {
    processing.value = true;
    const cartItems = toRaw(cart.items).map(({ id, quantity }) => ({
      productId: id,
      quantity,
    }));
    const requestJson = {
      paymentMethod: paymentMethod.value,
      items: cartItems,
      couponId: selectedCoupon.value === 'none' ? null : selectedCoupon.value,
    };
    const res = await fetch(`${API}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestJson),
    });
    const response = await res.json();

    if (response.status === 'error') {
      session.alert({
        message: 'Es ist ein Fehler aufgetreten! Fehler-Code: ' + response.code,
        type: 'error',
      });
      return router.push('/');
    }

    session.alert({
      message: 'Einkauf erfolgreich! Sie haben für ' + response.order.total + '€ eingekauft!',
      type: 'success',
    });
    session.alert({
      message:
        'Sie haben für ihren Einkauf ' +
        Math.round(response.order.total) * 10 +
        ' Sterne erhalten!',
      type: 'info',
    });
    cart.clear();
    processing.value = false;

    //Userdaten werden zum abschluss nochmal gefetcht, damit dem Frontend die Gem Anzahl aktualisiert wird
    await fetchCurrentUserData();
    router.push('/');
  }
</script>

<template>
  <div class="container mx-auto w-180 bg-base-200 p-8 rounded-lg shadow-2xl">
    <div class="" v-if="cart.total !== 0">
      <CartTable class="table mb-4"></CartTable>
      <div class="divider"></div>
      <div id="options" class="flex flex-col gap-4">
        <label class="inline-flex">
          <TicketIcon class="size-6 mr-2"></TicketIcon>
          <select class="select" v-model="selectedCoupon">
            <option disabled value="none" selected>Wähle einen Gutschein</option>
            <option disabled v-if="ownedCoupons.length === 0">Keine Gutscheine gefunden.</option>
            <option
              v-for="owned in ownedCoupons"
              :value="owned.coupon.id"
              :disabled="owned.quantity <= 0"
            >
              {{ owned.coupon.name }} (×{{ owned.quantity }})
            </option>
          </select>
        </label>
        <div v-if="discount !== 0">
          <div>Alter Preis: {{ parseFloat(cart.total).toFixed(2) }}€</div>
          <div>
            <div class="text-slate-500 text-sm ml-4">
              <p v-if="userLevelDiscount !== 0">
                -{{ userLevelDiscount.toFixed(2) }}€
                {{ getUserLevelConfig(userData.user_level).title }}
              </p>
              <p v-if="couponDiscount !== 0">-{{ couponDiscount.toFixed(2) }}€ Gutschein</p>
            </div>

            <div class="mt-2">
              <span class="font-bold mr-1t">Neuer Preis:</span>
              <span class="text-red-500"
                >{{ parseFloat(cart.total - discount).toFixed(2) }}€ ({{
                  parseFloat(discount).toFixed(2)
                }}€ Rabatt!)</span
              >
            </div>
          </div>
        </div>

        <div class="divider"></div>
        <label>
          <p class="mb-2">Bezahlmethode</p>
          <span class="label mr-8">PayPal</span>
          <input
            type="radio"
            name="radio-payment-method"
            value="PayPal"
            v-model="paymentMethod"
            class="radio"
          />
        </label>
        <label class="inline-flex">
          <CreditCardIcon class="size-6 mr-2"></CreditCardIcon>
          <span class="label mr-8">Kreditkarte</span>
          <input
            type="radio"
            name="radio-payment-method"
            value="Kreditkarte"
            v-model="paymentMethod"
            class="radio"
          />
        </label>
        <div class="divider"></div>
        <button
          class="btn btn-primary"
          :disabled="processing || !paymentMethod"
          @click="finalizePurchase()"
        >
          {{ parseFloat(cart.total - discount).toFixed(2) }}€ Bezahlen mit
          <span v-if="paymentMethod">{{ paymentMethod }}</span>
        </button>
      </div>
    </div>
    <div v-if="cart.total === 0">
      <p class="mb-8">Dein Einkaufswagen ist leer!</p>
      <RouterLink to="/"><button class="btn">Zum Shop</button></RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
