import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import api from './plugins/axios';

const app = createApp(App);

app.use(createPinia());
app.use(router);

//  inyectamos axios como $api
app.config.globalProperties.$api = api;

app.mount('#app');


