// stores/useUserStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    selectedItems: [],
  }),
  actions: {
    setSelectedItems(newItems) {
      this.selectedItems = newItems
    },
    clearSelectedItems() {
      this.selectedItems = []
    }
  },
})
