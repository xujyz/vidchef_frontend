// stores/main.js
import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    map: null // 
  }),
  actions: {
     setMap(content) {
      this.map = content;
    },
  }
});