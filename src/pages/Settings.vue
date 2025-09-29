<script setup>
  import { useSessionStore } from '../stores/session.js';
  import { ref } from 'vue';

  function deleteLocalStorage() {
    localStorage.clear();
    useSessionStore().alert({
      message: 'Local Storage wurde erfolgreich zurückgesetzt.',
      type: 'success',
    });
  }

  const selectedTheme = ref(localStorage.getItem('theme') || 'system');

  function applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  function setTheme(theme) {
    useSessionStore().alert({
      message: 'Farb-Theme Einstellung wurde erfolgreich aktualisiert!',
      type: 'success',
    });
    selectedTheme.value = theme;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }
</script>

<template>
  <div class="mx-auto items-center w-200">
    <div class="settings-list-item">
      <form class="w-200">
        <h1>Farb Theme</h1>
        <label class="mr-4">
          Auto (Browsereinstellung):
          <input
            type="radio"
            name="radio-1"
            class="radio"
            value="system"
            v-model="selectedTheme"
            @change="setTheme($event.target.value)"
          />
        </label>
        <label class="mr-4">
          Dunkel:
          <input
            type="radio"
            name="radio-1"
            class="radio"
            value="dark"
            v-model="selectedTheme"
            @change="setTheme($event.target.value)"
          />
        </label>
        <label class="mr-4">
          Hell:
          <input
            type="radio"
            name="radio-1"
            class="radio"
            value="light"
            v-model="selectedTheme"
            @change="setTheme($event.target.value)"
          />
        </label>
      </form>
    </div>
    <div class="settings-list-item">
      <h2 class="font-bold text-sm">
        Durch das Zurücksetzen des Local Storage werden Warenkorb, Wunschliste und Auswahl des
        Farb-Themes unter Umständen gelöscht.
      </h2>
      <button @click="deleteLocalStorage()" class="btn btn-soft hover:text-red-400">
        Local Storage zurücksetzen
      </button>
    </div>
  </div>
</template>

<style scoped></style>
