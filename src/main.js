import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router.js';
import { createPinia } from 'pinia';

const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');

//Lädt Farb-Theme aus dem localStorage falls vorhanden
const saved = localStorage.getItem('theme') || 'system';
let theme = saved;
if (saved === 'system') {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
document.documentElement.setAttribute('data-theme', theme);
