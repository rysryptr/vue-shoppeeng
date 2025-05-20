<script setup>
import { useCartStore } from '@/stores/cart.js';
import ProductLists from './ProductLists.vue';
import { computed, onMounted, ref } from 'vue';

const cartStore = useCartStore()
const products = ref([])
const itemsPerPage = 9
const currentPage = ref(1)

const isLoading = ref(true)

onMounted(async () => {
  products.value = await cartStore.fetchProducts()
  isLoading.value = false
})

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const nextPage = () => {
  if(currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if(currentPage.value > 1) {
    currentPage.value--
  }
}

</script>

<template>
  <!-- <div v-if="products" class="w-full max-w-[1230px] mx-auto flex flex-wrap gap-2 mt-8"> -->
  
  <div v-if="isLoading" class="w-full max-w-[1230px] mx-auto grid gap-2 mt-8 p-4 grid-cols-2 md:grid-cols-3 md:p-0">
    <div
      v-for="n in 6"
      :key="n"
      class="w-full h-[300px] bg-gray-200 animate-pulse rounded"
    >
    </div>
  </div>
  <div v-else-if="paginatedProducts.length" class="w-full max-w-[1230px] mx-auto grid gap-2 mt-8 p-4 grid-cols-2 md:grid-cols-3 md:p-0">
    <ProductLists 
      v-for="(product) in paginatedProducts"
      :key="product.id"
      :product="product"
    />
    
    <div ref="loadTrigger" class="h-8 col-span-full"></div>
  </div>
  <div v-else class="w-full max-w-[1230px] h-[460px] mx-auto text-center mt-8">
    No data Found
  </div>
  <div class="flex justify-center items-center gap-4 mt-8 mb-8">
    <button
      class="px-4 py-2 rounded"
      @click="prevPage"
      :disabled="currentPage === 1"
      :class="currentPage === 1 ? 'hover:cursor-not-allowed bg-gray-100' : 'hover:cursor-pointer bg-gray-200  hover:bg-gray-300'"
    >
      Previous
    </button>

    <span class="font-semibold text-sm">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

    <button
      class="px-4 py-2 rounded"
      @click="nextPage"
      :disabled="currentPage === totalPages"
      :class="currentPage === totalPages ? 'hover:cursor-not-allowed bg-gray-100' : 'hover:cursor-pointer bg-gray-200 hover:bg-gray-300'"
    >
      Next
    </button>
  </div>
</template>