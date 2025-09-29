<script setup>
  import { onMounted, ref } from 'vue';
  import { fetchOrderItems } from '../api.js';
  import { useRoute } from 'vue-router';
  import { load } from '../audio.js';
  const orderItems = ref(null);
  const loaded = ref(false);
  const route = useRoute();
  const idParam = route.params.id;
  onMounted(async () => {
    orderItems.value = await fetchOrderItems(idParam);
    loaded.value = true;
  });

  //order_id	product_id	quantity	id	title	brand	price	description	category_id	image_url	rating_score	rating_count	status	stock
</script>

<template>
  <div class="w-120 mx-auto">
    <h1 class="mb-4">Artikel zu Bestell Nr. {{ idParam }}</h1>
    <div
      class="overflow-x-auto rounded-box border border-base-content/5 w-120 mx-auto mb-4"
      v-if="loaded"
    >
      <table class="table">
        <thead>
          <tr>
            <th>Produkt ID</th>
            <th>Produktname</th>
            <th></th>
            <th>Stück</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in orderItems" v-if="loaded">
            <tr class="">
              <td>{{ item.product_id }}</td>
              <td>
                <RouterLink :to="'/shop/product/' + item.product_id">{{ item.title }}</RouterLink>
              </td>
              <td>
                <RouterLink :to="'/shop/product/' + item.product_id"
                  ><img class="h-16 w-auto" :src="item.image_url"
                /></RouterLink>
              </td>
              <td>{{ item.quantity }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <RouterLink to="/orders"><button class="btn">Zurück zur Bestellübersicht</button></RouterLink>
  </div>
</template>

<style scoped></style>
