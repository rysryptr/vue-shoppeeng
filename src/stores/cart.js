import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";


export const useCartStore = defineStore('cart', () => {
  const API_URL = 'http://localhost:3000/products'
  const router = useRouter()

  const products = ref([])
  const product = ref({})

  const savedItems = localStorage.getItem('cartItems')
  const cartItems = ref([])
  
  const checked = ref(false)
  const toast = useToast()

  if(savedItems) {
    cartItems.value = JSON.parse(savedItems)
  }

  const amount = ref(1)
  const buttonAmount = ref(false)
  const buttonAddAmount = ref(false)
  const buttonAddAmountMap = reactive({})

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL)
      products.value = response.data
      return products.value
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const detailProduct = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/${productId}`)
      return product.value = response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const fetchSearchResults = async (query) => {
    if(!query) {
      return fetchProducts()
    }

    try {
      const response = await axios.get(`http://localhost:3000/products?q=${query.value}`)
      const result = response.data

      products.value = result.filter(product => 
        product.name.toLowerCase().includes(query.value.toLowerCase())
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addItemToCart = (product) => {
    const existingProduct = cartItems.value.find(item => item.id === product.id && item.color === product.color)
    const productStock = products.value.find(p => p.id === product.id)

    const stockRemaining = productStock.stock - product.amount

    if(stockRemaining < 1) {
      const key = `${product.id}-${product.color}`
      buttonAddAmountMap[key] = true

      localStorage.setItem('buttonAddAmountMap', JSON.stringify(buttonAddAmountMap))
    }

    if(existingProduct) {
      existingProduct.amount += product.amount

      toast.success("Your item has been updated", {
        timeout: 2000
      });
    } else {
      cartItems.value.push({ ...product })

      toast.success("Your item has been added", {
        timeout: 2000
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
  }

  const countCartItems = computed(() => {
    return cartItems.value.length
  })

  const handleReduceAmount = computed(() => {
    if(amount.value > 1) {
      amount.value -= 1
      buttonAmount.value = false
      buttonAddAmount.value = false
    } else {
      buttonAmount.value = true
    }
  })
  
  const handleAddAmount = (product) => {
    amount.value += 1
    buttonAmount.value = false

    const stockRemaining = product.stock - amount.value

    if (stockRemaining === 0) {
      buttonAddAmount.value = true
    }
  }

  const checkedListItems = computed(() => {
    return cartItems.value.filter(item => item.isChecked)
  })
  
  const handleSubtotal = computed(() => {
    const subtotal = cartItems.value.filter(total => total.isChecked)
                      .reduce((acc, total) => acc += total.price * total.amount, 0)
    return subtotal.toLocaleString('id-ID')
  })

  const incrementItem = (item) => {
    const index = cartItems.value.findIndex(product => product.id === item.id && product.color === item.color)

    if(index !== -1) {
      const updatedAmount = cartItems.value[index].amount += 1
      const stockRemaining = item.stock - updatedAmount

      if (stockRemaining === 0) {
        const key = `${item.id}-${item.color}`
        buttonAddAmountMap[key] = true
        
        localStorage.setItem('buttonAddAmountMap', JSON.stringify(buttonAddAmountMap))
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    }
  }

  const decrementItem = (item) => {
    const index = cartItems.value.findIndex(product => product.id === item.id && product.color === item.color)
    const productStock = products.value.find(p => p.id === item.id)

    if(index !== -1) {
      cartItems.value[index].amount -= 1

      const key = `${item.id}-${item.color}`
      const itemAmount = productStock.stock - cartItems.value[index].amount
      
      if(itemAmount > 0) {
        buttonAddAmountMap[key] = false
        localStorage.setItem('buttonAddAmountMap', JSON.stringify(buttonAddAmountMap))
      } 

      if(cartItems.value[index].amount < 1) {
        deleteItem(item)
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    }
  }

  const deleteItem = (item) => {
    cartItems.value = cartItems.value.filter(product => {
      return !(product.id === item.id && product.color === item.color)
    })

    const key = `${item.id}-${item.color}`

    buttonAddAmountMap[key] = false

    localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    localStorage.setItem('buttonAddAmountMap', JSON.stringify(buttonAddAmountMap))
  }

  const checkItem = (item) => {
    const index = cartItems.value.findIndex(product => product.id === item.id && product.color === item.color)

    if(index !== -1) {
      cartItems.value[index].isChecked = !cartItems.value[index].isChecked
    } 
  }

  const selectAll = () => {
    checked.value = !checked.value
    cartItems.value.forEach(item => {
      item.isChecked = checked.value
    })
  }

  const checkoutItems = async () => {
    const itemIsChecked = cartItems.value.filter(item => item.isChecked)
    // console.log(itemIsChecked)
    if(itemIsChecked.length < 1) {
      return alert('Select your item to checkout')
    } 

    try {
      for( const item of itemIsChecked) {
        const response = await axios.get(`${API_URL}/${item.id}`)
        const productData = response.data

        const updatedStock = productData.stock - item.amount

        if(updatedStock < 0) {
          return alert(`Stock of ${item.name} is not enough`)
        }

        await axios.patch(`${API_URL}/${item.id}`, {
          stock: updatedStock
        })

        deleteItem(item)

        router.push('/payment')

      }
    } catch (error) {
      console.log(error)
    }

  }

  const directCheckout = async (item) => {
    try {
      console.log(item.id)
      const response = await axios.get(`${API_URL}/${item.id}`)
      const product = response.data

      if(product.stock < 1) {
        return alert(`This product ${product.name} is not enough`)
      }

      const updatedStock = product.stock - item.amount
      console.log('product:' + product.stock)
      console.log('item:' + item.amount)
      await axios.patch(`${API_URL}/${item.id}`, {
        stock: updatedStock
      })

      router.push('/payment')
    } catch (error) {
      console.error(error)
    }
  }

  watch(cartItems, (newVal) => {
    localStorage.setItem('cartItems', JSON.stringify(newVal))
    checked.value = newVal.length > 0 && newVal.every(item => item.isChecked)
  }, { deep: true })

  return { fetchProducts, 
            detailProduct, 
            fetchSearchResults, 
            addItemToCart, 
            handleReduceAmount, 
            handleAddAmount, 
            handleSubtotal, 
            products, 
            countCartItems,
            amount,
            cartItems,
            buttonAmount,
            buttonAddAmount,
            incrementItem,
            decrementItem,
            deleteItem,
            checkItem,
            selectAll,
            checked,
            checkoutItems,
            buttonAddAmountMap,
            checkedListItems,
            directCheckout
        }
})