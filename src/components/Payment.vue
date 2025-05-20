<script setup>

</script>

<template>
  <div class="flex flex-col items-center mx-auto mt-8">
    <div class="w-96 h-96">
      <img 
        src="/images/payment.png" 
        class="w-full h-full"
        alt=""
      >
    </div>
    <p>Your Payment is Successful!</p>
    <RouterLink to="/" class="w-[240px] h-[32px] bg-black hover:cursor-pointer hover:bg-zinc-800 border border-black mt-6 flex items-center justify-center">
      <p class="font-light text-sm text-center text-white">Back to Home</p>
    </RouterLink>
  </div>
</template>