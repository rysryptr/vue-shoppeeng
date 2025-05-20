<script setup>
import { useCartStore } from '@/stores/cart';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';

const cartStore = useCartStore()

onMounted(() => {
  const storedCart = localStorage.getItem('cartItems')
  if(storedCart) {
    const cartItems = JSON.parse(storedCart)

    cartStore.checked = cartStore.cartItems.length > 0 && cartItems.every(item => item.isChecked)
  }

  const storedMap = localStorage.getItem('buttonAddAmountMap')
  if(storedMap) {
    Object.assign(cartStore.buttonAddAmountMap, JSON.parse(storedMap))
  }

  cartStore.fetchProducts()
})

</script>

<template>
  <div class="max-w-[1230px] min-h-[460px] p-2 md:p-0 mt-8 mx-auto">
    <p class="font-semibold text-lg">Cart Page</p>
    <div class="grid grid-cols-1 md:flex gap-2">
      <div v-if="cartStore.cartItems.length" class="w-full md:w-3/4 min-h-[460px] mt-4 mx-auto rounded-xl border border-gray-200 p-4">
        <div class="w-full max-h-[120px] flex gap-4 items-center mb-2">
          <input 
            type="checkbox" 
            class="w-4 h-4 mr-2" 
            v-model="cartStore.checked"
            @click="cartStore.selectAll"
          />
          <span>Select All</span>
        </div>
        <div 
          v-for="(item, index) in cartStore.cartItems"
          :key="index"
          class="w-full max-h-[120px] flex gap-4 items-center mt-8">
          <div>
            <input 
              type="checkbox" 
              class="w-4 h-4 mr-2" 
              v-model="item.isChecked"
              @click="cartStore.checkItem(item)"
            />
          </div>
          <RouterLink :to="`/product/${item.id}`" class="max-w-[120px] max-h-[120px] bg-gray-100 overflow-hidden hover:cursor-pointer">
            <img 
              :src="item.image" 
              class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              alt="">
          </RouterLink>
          <div class="w-[620px] h-[120px] flex flex-col gap-4">
            <RouterLink :to="`/product/${item.id}`" class="font-semibold text-sm hover:underline">{{ item.name }}</RouterLink>
            <div class="flex items-center gap-2">
              <p class="font-light text-sm">Color: </p>
              <div 
                class="w-6 h-6 rounded-full shadow-inner"
                :style="{ backgroundColor: item.color }"
                ></div>
            </div>
          </div>
          <div class="w-[200px] h-[120px] flex flex-col items-end gap-2">
            <p class="font-extralight text-xl">Rp. {{ (item.price * item.amount).toLocaleString('id-ID') }}.000,00</p>
            <div class="flex items-center justify-between mt-3 gap-2">
              <div 
                class="w-6 h-6 hover:cursor-pointer"
                @click="cartStore.deleteItem(item)"
              >
                <Icon 
                  icon="line-md:trash"
                  class="w-6 h-6 text-slate-400"
                />
              </div>
              <div 
                class="w-[100px] h-[24px] flex items-center justify-between pl-3 pr-3 border"
                :class="cartStore.buttonAddAmountMap[item.id+'-'+item.color] === true ? 'border-gray-200': 'border-gray-700'"
                >
                <button 
                  class="hover:cursor-pointer"
                  @click="cartStore.decrementItem(item)"
                >
                  -
                </button>
                <span>{{ item.amount }}</span>
                <button 
                  :class="cartStore.buttonAddAmountMap[item.id+'-'+item.color] === true ? 'text-gray-200 hover:cursor-not-allowed': 'text-gray-700 hover:cursor-pointer'"
                  @click="cartStore.incrementItem(item)"
                  :disabled="cartStore.buttonAddAmountMap[item.id+'-'+item.color] === true"
                >
                  +
                </button>
              </div>
            </div>
            <p v-if="cartStore.buttonAddAmountMap[item.id+'-'+item.color] === true" class="text-red-500 text-sm">Reaching the stock limit!</p>
          </div>
        </div>
      </div>
      <div v-else class="w-full md:w-3/4 text-center mt-4 p-2 mx-auto md:flex flex-col items-center justify-center border border-gray-200 rounded-lg">
        <p>Let's find what you need!</p>
        
        <RouterLink to="/" class="max-w-[240px] md:w-full h-[32px] mx-auto bg-black hover:cursor-pointer hover:bg-zinc-800 border border-black mt-6 flex items-center justify-center">
          <p class="font-light text-sm text-center text-white">Explore our products</p>
        </RouterLink>
      </div>
      <div class="w-full md:w-1/4 min-h-[120px] mt-4 mx-auto rounded-xl border border-gray-200 p-4">
        <!-- w-full md:w-3/4 min-h-[460px] mt-4 mx-auto rounded-xl border border-gray-200 p-4 -->
        <!-- v2 -->
        <!-- <div
          v-for="(itemChecked, index) in cartStore.checkedListItems"
          :key="index"
          class="flex"
        >
          <div class="w-12 h-12 bg-gray-200">
            <img :src="itemChecked.image" alt="">
          </div>
          <div class="flex flex-col">
            <div class="w-full">
              {{ itemChecked.name }}
            </div>
            <div class="w-full flex items-center justify-between">
              <div>
                <p class="font-light text-sm">Color: </p>
                <div 
                  class="w-6 h-6 rounded-full shadow-inner"
                  :style="{ backgroundColor: item.color }"
                  >
                </div>
              </div>
              <div>
                {{ itemChecked.price }}
              </div>
            </div>
          </div>
        </div> -->

        <!-- v1 -->
        <div class="flex items-center justify-between">
          <p>Total :</p>
          <p v-if="cartStore.handleSubtotal != 0" class="text-right text-xl">Rp. {{ cartStore.handleSubtotal }}.000,00</p>
          <p v-else>-</p>
        </div>
        <div  
          @click="cartStore.checkoutItems"
          class="w-full h-[32px] bg-black hover:cursor-pointer hover:bg-zinc-800 border border-black mt-6 flex items-center justify-center">
          <p class="font-light text-sm text-center text-white">Checkout</p>
        </div>
      </div>
    </div>
  </div>
</template>