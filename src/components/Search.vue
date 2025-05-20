<script setup>
import { useCartStore } from '@/stores/cart';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductLists from './ProductLists.vue'
// import SearchLists from './SearchLists.vue';


const route = useRoute()
const query = ref(route.query.q || '')
const cartStore = useCartStore()

const fetchProducts= async () => {
  if(query.value) {
    cartStore.fetchSearchResults(query)
  } else {
    cartStore.products = cartStore.fetchProducts()
  }
}

onMounted(fetchProducts)

watch(() => route.query.q, (newVal) => {
  query.value = newVal
  fetchProducts()
})

</script>

<template>
  <div 
    v-if="cartStore.products.length" 
    class="w-full max-w-[1230px] mx-auto grid gap-2 mt-8 p-4 grid-cols-2 md:grid-cols-3 md:p-0">
    <ProductLists 
      v-for="(product) in cartStore.products"
      :key="product.id"
      :product="product"
    />
  </div>
  <div v-else class="w-full max-w-[1230px] h-[460px] mx-auto text-center mt-8">
    No data Found
  </div>
</template>