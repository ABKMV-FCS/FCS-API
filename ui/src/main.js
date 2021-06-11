import Vue from 'vue'
import axios from 'axios';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false
Vue.config.silent=true

Vue.prototype.$http = axios.create({
	baseURL: 'https://abkmv-fcs.herokuapp.com'
});
Vue.prototype.$http.interceptors.response.use(config => config, error => {
	if (error.response) {
		if(typeof(error.response.data.message) == "object") store.dispatch('Notify', JSON.stringify(error.response.data.message));
		else store.dispatch('Notify', String(error.response.data.message));
	}
	else
		store.dispatch('Notify', 'Couldn\'t reach Server!');
	return Promise.reject(error);
});

Vue.prototype.$http.interceptors.request.use((config) => {
	if (config.url !== "/api/auth/login")
		config.headers['Authorization'] = `Bearer ${store.getters.Token}`;
	return config;
}, (error) => {
	return Promise.reject(error);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
