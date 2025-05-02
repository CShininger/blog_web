import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupI18n } from './locales'

const app = createApp(App)

// 国际化
await setupI18n(app, { locale: 'zh-CN' })
app.use(createPinia())

app.use(router)

app.mount('#app')
