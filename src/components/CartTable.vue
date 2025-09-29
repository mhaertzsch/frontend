<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { TrashIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/24/solid/index.js';
  import { EnvelopeIcon } from '@heroicons/vue/24/outline/index.js';
  import { useCartStore } from '../stores/cart.js';

  const cart = useCartStore();
  onMounted(async () => await cart.loadProducts());
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Prod. ID</th>
        <th>Artikel</th>
        <th></th>
        <th>Anzahl</th>
        <th>Preis</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in cart.productsAndQuantity" :key="item.id">
        <th>{{ item.id }}</th>
        <td>{{ item.product.title }}</td>
        <td><img :src="item.product.image_url" alt="" class="h-auto max-w-15" /></td>
        <td>
          <div class="flex flex-dir-row w-26 overflow-hidden">
            <MinusCircleIcon
              class="text-slate-400 size-6 cursor-pointer hover-opacity"
              @click="cart.decreaseItem(item.product)"
              v-if="item.quantity > 1"
            />
            <MinusCircleIcon
              class="opacity-50 text-slate-400 size-6 cursor-not-allowed"
              v-if="item.quantity <= 1"
            />
            <span class="mx-1 w-4">{{ item.quantity }}</span
            ><PlusCircleIcon
              class="text-slate-400 size-6 cursor-pointer hover-opacity"
              @click="cart.addItem(item.product)"
            />
          </div>
        </td>
        <td>{{ item.product.price }}</td>
        <td>
          <div
            @click="cart.removeItem(item.product)"
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle text-slate-400 hover:text-error"
          >
            <div class="indicator">
              <TrashIcon class="size-6" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <th class="font-bold">Summe:</th>
        <td></td>
        <td></td>
        <td class="font-bold">{{ cart.size }}</td>
        <td class="font-bold underline">{{ parseFloat(cart.total).toFixed(2) }}€</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
