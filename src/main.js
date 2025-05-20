import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routers/index.js'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)

app.mount('#app')
