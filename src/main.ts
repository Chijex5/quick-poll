import { createApp } from 'vue'
import App from './App.vue'
import { HeartIcon, ArrowRightCircleIcon, TrophyIcon, CheckCircleIcon, BarChartIcon } from 'lucide-vue-next'

const app = createApp(App)

// Register Lucide icons
app.component('HeartIcon', HeartIcon)
app.component('ArrowRightCircleIcon', ArrowRightCircleIcon)
app.component('TrophyIcon', TrophyIcon)
app.component('CheckCircleIcon', CheckCircleIcon)
app.component('BarChartIcon', BarChartIcon)

app.mount('#app')