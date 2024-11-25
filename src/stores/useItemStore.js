// stores/useItemStore.js
import { defineStore } from 'pinia'

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    items: [], // State to hold filtered items
    selectedItems: [],
  }),
  actions: {
    setItems(newItems) {
      this.items = newItems
    },
    clearItems() {
      this.items = []
      this.selectedItems = []
    },
    setSelectedItems(newItems) {
      this.selectedItems = newItems
    },
    clearSelectedItems() {
      this.selectedItems = []
    },
  },
})
