<script setup>
import { useCartStore } from '@/stores/cart';
import { computed, defineProps } from 'vue';

const props = defineProps({
  item: Object
})

const cartStore = useCartStore()

const calculatedPrice = computed(() => {
  // return item.price * item.amount
})
</script>

<template>
  <div class="w-full max-h-[150px] flex gap-4 items-center mt-8">
    <div>
      <input type="checkbox" class="w-4 h-4 mr-2" />
    </div>
    <div class="w-[150px] h-[150px] bg-gray-100 overflow-hidden">
      <img 
        :src="item.image" 
        class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        alt="">
    </div>
    <div class="w-[900px] h-[150px] flex flex-col gap-2">
      <p class="font-semibold text-sm">{{ item.name }}</p>
      <div class="flex items-center gap-2">
        <p class="font-light text-sm">Color: </p>
        <div class="w-6 h-6 rounded-full bg-[#BCA17A] shadow-inner hover:cursor-pointer"></div>
      </div>
    </div>
    <div class="w-[200px] h-[150px] flex flex-col gap-2">
      <p class="font-extralight text-2xl">Rp. {{ item.price }}.000,00</p>
      <div class="flex items-end gap-2">
        <div class="mt-3 w-[100px] h-[28px] flex items-center justify-between pl-3 pr-3 border border-gray-700">
          <button 
            class="hover:cursor-pointer"
            @click="cartStore.decrementItem(item)"
            :disabled="buttonAmount"
          >
            -
          </button>
          <span>{{ item.amount }}</span>
          <button 
            class="hover:cursor-pointer"
            @click="cartStore.incrementItem(item)"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>