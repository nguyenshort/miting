import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import dayjs from "./plugins/dayjs"
import animejs from "./plugins/animejs"
import {createPinia} from "pinia"
import rtc from "./plugins/rtc"
import firebase from "./plugins/firebase"
import VueLottie from '@nguyenshort/vue-lottie'
import {router} from "./plugins/routes"
import axios from "./plugins/axios";

const app = createApp(App)

app.use(axios)
app.use(router)

app.use(firebase)
app.use(rtc)
app.use(createPinia())
app.use(dayjs)
app.use(animejs)
app.use(VueLottie)

app.mount('#app')

window._VUE = app
