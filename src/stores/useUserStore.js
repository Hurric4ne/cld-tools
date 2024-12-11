// stores/useUserStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    selectedItems: [],
    startingLocation: '',
  }),
  actions: {
    setSelectedItems(newItems) {
      this.selectedItems = newItems
    },
    clearSelectedItems() {
      this.selectedItems = []
    },
    setStartingLocation(location) {
      this.startingLocation = location
    },
    clearStartingLocation() {
      this.startingLocation = ''
    },
  },
})
