<script setup>
  import { fetchOrders } from '../api.js';
  import { parseDate } from '../utils.js';
  import { onMounted, ref } from 'vue';
  const orders = ref(null);
  const loaded = ref(false);
  onMounted(async () => {
    orders.value = await fetchOrders();
    loaded.value = true;
  });
</script>

<template>
  <h1 class="w-240 mx-auto mb-4">Meine Bestellungen</h1>
  <div class="overflow-x-auto rounded-box border border-base-content/5 w-240 mx-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Bestell Nr.</th>
          <th>Bestelldatum</th>
          <th>Bestellsumme</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orders" v-if="loaded">
          <tr class="hover:bg-primary">
            <th>{{ order.id }}</th>
            <td>{{ parseDate(order.order_date) }}</td>
            <td>{{ order.order_total }}€</td>
            <td>{{ order.status }}</td>
            <td>
              <RouterLink :to="'order/' + order.id" class="link text-blue-300">Details</RouterLink>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
