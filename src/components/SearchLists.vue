<script setup>
const props = defineProps({
  product: Object
})
</script>

<template>
  <RouterLink :to="`/product/${product.id}`">
    <div class="w-full max-w-[300px] max-h-[300px] md:max-w-[400px] md:max-h-[400px] flex flex-col hover:cursor-pointer group">
      <div 
        v-if="product.stock === 0"
        class="w-full h-[300px] bg-gray-400 opacity-60 cursor-not-allowed">
        <img 
          :src="product.image" 
          class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          alt="">
      </div>
      <div v-else class="w-full h-[300px] bg-gray-100 overflow-hidden">
        <img 
        :src="product.image" 
        class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        alt="">
      </div>
      <div class="w-full mt-[10px]">
        <p class="font-medium text-xs md:text-semibold md:text-sm group-hover:underline group-hover:underline-offset-1">{{ product.name }}</p>
      </div>
      <div class="w-full mt-[10px]">
        <p class="font-light text-md md:text-lg">Rp. {{ product.price }}.000,00</p>
      </div>
    </div>
  </RouterLink>
</template>