<script setup>
import { useCartStore } from '@/stores/cart';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const cartStore = useCartStore()
const product = ref(null)
const isLoading = ref(true)

const selectedColor = ref('')

const handleDirectCheckout = () => {
  const checkoutedProduct = {
    ...product.value,
    amount: cartStore.amount,
    color: selectedColor.value
  }

  cartStore.directCheckout(checkoutedProduct)
}

const handleAddtoCart = () => {
  if(!selectedColor.value) {
    alert('Please select a color!')
    return
  }

  const selectedProduct = {
    ...product.value,
    amount: cartStore.amount,
    color: selectedColor.value
  }
  cartStore.addItemToCart(selectedProduct)
  cartStore.amount = 1
}

const colors = [
  { color: '#FFFFFF' },
  { color: '#494949' },
  { color: '#BCA17A' },
  { color: '#9C9886' },
]

onMounted(async () => {
  const productId = route.params.id
  product.value = await cartStore.detailProduct(productId)
  selectedColor.value = product.value.colors?.[0] || '#FFFFFF'
  cartStore.amount = 1

  cartStore.fetchProducts()
  isLoading.value = false
})

</script>

<template>
  <div v-if="isLoading" class="w-full max-w-[1230px] min-h-[460px] mx-auto grid grid-cols-1 sm:p-2 md:flex md:p-0 gap-4 mt-8 animate-pulse">
    <!-- Gambar Skeleton -->
    <div class="w-full max-w-[400px] max-h-[400px] bg-gray-300 rounded-md mx-auto"></div>

    <!-- Text Skeleton -->
    <div class="w-full sm:max-w-[560px] min-h-full space-y-4">
      <div class="h-6 bg-gray-300 rounded w-3/4"></div>
      <div class="h-8 bg-gray-300 rounded w-1/2 mt-5"></div>
      <div class="space-y-2 mt-5">
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Right Section Skeleton -->
    <div class="w-full md:max-w-[240px] min-h-full space-y-3">
      <div class="h-4 bg-gray-300 rounded w-1/3"></div>
      <div class="flex gap-2 mt-3">
        <div class="w-6 h-6 rounded-full bg-gray-300"></div>
        <div class="w-6 h-6 rounded-full bg-gray-300"></div>
        <div class="w-6 h-6 rounded-full bg-gray-300"></div>
      </div>
      <div class="h-4 bg-gray-300 rounded w-1/4 mt-5"></div>
      <div class="h-8 bg-gray-300 rounded w-full"></div>
      <div class="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
  <div v-else class="w-full max-w-[1230px] min-h-[460px] mx-auto grid grid-cols-1 sm:p-2 md:flex md:p-0 gap-4 mt-8">
    <div class="w-full max-w-[400px] max-h-[400px] bg-gray-100 overflow-hidden mx-auto">
      <img 
        :src="product.image" 
        class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        alt="product image">
    </div>
    <div class="w-full sm:max-w-[560px] min-h-full p-2 sm:p-0">
      <p class="font-bold text-lg">{{ product.name }}</p>
      <p class="font-light text-2xl mt-5">Rp. {{ product.price }}.000,00</p>
      <p class="text-sm text-gray-600 leading-6 mt-5">
        {{ product.description }}
        <br>
        <br>
        Dominate your game with the PlayEdge Gaming Controller, featuring responsive analog sticks, vibration feedback, and wireless connectivity. Compatible with multiple platforms for a seamless gaming experience.
        Dominate your game with the PlayEdge Gaming Controller, featuring responsive analog sticks, vibration feedback, and wireless connectivity. Compatible with multiple platforms for a seamless gaming experience.
      </p>
    </div>
    <!-- End Left Section -->

    <!-- Start Right Section -->
    <div v-if="product.stock !== 0" class="w-full max-w-[768px] min-h-full md:max-w-[240px] p-2 md:p-0 sm:mx-auto">
      <p class="font-light text-sm">Color:</p>
      <div class="flex gap-4 mt-3">
        <div
          v-for="(item, index) in colors"
          :key="index"
          :class="'w-6 h-6 rounded-full shadow-inner hover:cursor-pointer'"
          :style="{ backgroundColor: item.color, border: selectedColor === item.color ? '2px solid #09f' : '1px solid gray' }"
          @click="selectedColor = item.color"
        >
        </div>
      </div>
      <p class="font-light text-sm mt-3">Amount:</p>
      <div class="flex items-center justify-between mt-3">
        <div 
          class="w-[100px] h-[28px] flex items-center justify-between pl-3 pr-3 border"
          :class="cartStore.buttonAddAmount === true ? 'border-gray-200 hover:cursor-not-allowed': 'border-gray-700 hover:cursor-pointer'"
          >
          <button 
            class="hover:cursor-pointer"
            @click="cartStore.handleReduceAmount"
            :disabled="cartStore.buttonAmount"
          >
            -
          </button>
          <span>{{ cartStore.amount }}</span>
          <button 
            :class="cartStore.buttonAddAmount === true ? 'text-gray-200 hover:cursor-not-allowed': 'text-gray-700 hover:cursor-pointer'"
            @click="cartStore.handleAddAmount(product)"
            :disabled="cartStore.buttonAddAmount"
          >
            +
          </button>
        </div>
        <p class="text-sm text-gray-700">Stock: {{ product.stock }} Remaining</p>
      </div>
      <div class="flex items-center justify-between mt-3">
        <p class="font-light text-sm mt-3">Subtotal:</p>
        <p class="font-normal text-lg mt-3">Rp. {{ (cartStore.amount * product.price).toLocaleString('id-ID') }}.000,00</p>
      </div>
      <button 
        class="w-full h-[32px] md:max-w-[240px] mt-3 border border-black flex items-center justify-center hover:bg-black hover:text-white hover:cursor-pointer"
        @click="handleAddtoCart"
      >
        
        <p 
          class="font-light text-sm text-center"
          @click="handleAddtoCart"
        >
          Add to Cart
        </p>
      </button>
      <div 
        @click="handleDirectCheckout"
        class="w-full h-[32px] md:max-w-[240px] bg-black hover:cursor-pointer hover:bg-zinc-800 border border-black mt-3 flex items-center justify-center">
        <p class="font-light text-sm text-center text-white">Checkout</p>
      </div>
    </div>
    <!-- if product stock is 0  -->
    <div v-else class="w-full p-2 md:p-0 md:max-w-[240px] min-h-full">
      <p class="text-red-500 font-semibold">Out of stock!</p>
      <div class="flex items-center justify-between mt-3">
        <div class="w-[100px] h-[28px] flex items-center justify-between pl-3 pr-3 border border-gray-400 text-gray-400 hover:cursor-not-allowed">
          <div>
            -
          </div>
          <span>0</span>
          <div>
            +
          </div>
        </div>
        <p class="text-sm text-gray-700">Stock: {{ product.stock }} Remaining</p>
      </div>
    </div>
  </div>
</template>