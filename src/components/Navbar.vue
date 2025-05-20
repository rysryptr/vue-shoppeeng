<script setup>
import { useCartStore } from '@/stores/cart';
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const searchInput = ref('')
const router = useRouter()
const cartStore = useCartStore()

const handleSearch = () => { 
  if(searchInput.value.trim()) {
    router.push({ name: 'search', query: { q: searchInput.value }})
  }
}

</script>

<template>
  <nav class="bg-white w-full border border-gray-100 shadow-md">
    <div class="w-full max-w-[1230px] mx-auto h-20 flex gap-2 items-center justify-between">
      <RouterLink to="/">
        <div class="font-medium text-xl text-black sm:text-3xl sm:font-bold">
          Shoppeeng
        </div>
      </RouterLink>
      <div class="w-full max-w-[840px] max-h-[40px] h-full bg-gray-100 flex justify-between items-center">
        <input 
          type="text"
          v-model="searchInput"
          @keyup.enter="handleSearch"
          placeholder="Find your product and category"
          class="w-full text-gray-800 max-w-[800px] bg-gray-100 h-full p-2 hover:bg-gray-200 focus:outline-gray-200"
        >
        <div class="w-[40px] h-[40px] flex items-center justify-center hover:cursor-pointer">
          <Icon 
            icon="iconamoon:search" 
            @click="handleSearch"
            class="w-[24px] h-[24px] text-slate-700"
          />
        </div>
      </div>
      <RouterLink to="/cart" class="flex items-center hover:cursor-pointer">
        <Icon 
          icon="proicons:cart" 
          class="w-[24px] h-[24px] text-slate-700"
        />
        <span v-if="cartStore.countCartItems > 0" class="relative w-4 h-4 bg-red-600 rounded-full -ml-3 -mt-3 text-white text-xs text-center">{{ cartStore.countCartItems }}</span>
      </RouterLink>
    </div>
  </nav>
</template>