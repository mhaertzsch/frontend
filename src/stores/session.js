import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    gems: 0,
    userLevel: 'standard',
    alerts: [],
  }),
  actions: {
    alert(alert) {
      this.alerts.push(alert);
      console.log(alert);
      setTimeout(() => {
        const index = this.alerts.indexOf(alert);
        if (index !== -1) {
          this.alerts.splice(index, 1);
        }
      }, 5000);
    },
  },
});
