<script setup>
  import { InformationCircleIcon } from '@heroicons/vue/24/outline';
  import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import { CheckCircleIcon } from '@heroicons/vue/24/outline';
  import { computed } from 'vue';
  import { useSessionStore } from '../stores/session.js';

  const session = useSessionStore();

  // Mappt Alert Typ zur entsprechenden Konfiguration
  const typeConfig = {
    warning: {
      type: 'alert-warning',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-warning',
    },
    error: {
      type: 'alert-error',
      icon: XCircleIcon,
      iconColor: 'text-error',
    },
    success: {
      type: 'alert-success',
      icon: CheckCircleIcon,
      iconColor: 'text-success',
    },
    info: {
      type: 'alert-info',
      icon: InformationCircleIcon,
      iconColor: 'text-info',
    },
  };

  function getTypeConfig(type) {
    return typeConfig[type] || typeConfig.info;
  }
</script>

<template>
  <div
    class="h-[100vh] w-110 flex flex-col-reverse overflow-y-auto gap-2 pb-4 no-scrollbar pointer-events-none fade-top-to-bottom"
    :class="{ 'fade-top-to-bottom': session.alerts.length >= 6 }"
  >
    <transition-group name="fade" tag="div" class="space-y-2">
      <div
        :key="alert"
        v-for="alert in session.alerts"
        role="alert"
        class="alert alert-outline !bg-base-200"
        :class="[getTypeConfig(alert.type).type]"
      >
        <component
          :is="getTypeConfig(alert.type).icon"
          class="size-6 shrink-0"
          :class="getTypeConfig(alert.type).iconColor"
        />
        <span class="w-90">{{ alert.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
  .alert {
    display: flex;
    z-index: 10;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }

  .fade-top-to-bottom {
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 1) 70%,
      rgba(0, 0, 0, 1) 100%
    );
    mask-size: 100% 100%;
  }
</style>
