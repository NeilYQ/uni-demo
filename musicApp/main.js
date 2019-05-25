import Vue from 'vue'
import App from './App'
import store from "./store/vuex.js"

Vue.config.productionTip = false

App.mpType = 'app'
// app使用Vuex的准备
Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
