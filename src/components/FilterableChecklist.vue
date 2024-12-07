<template>
  <div class="filterable-checklist">
    <h3>Item Categories</h3>
    <p v-if="!items.length">Loading items...</p>
    <ul v-else class="checklist">
      <li v-for="item in items" :key="item.id">
        {{ item.item_name }} - Price: {{ item.price_buy }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useItemStore } from '@/stores/useItemStore' // Import the store

export default {
  name: 'FilterableChecklist',
  setup() {
    const itemStore = useItemStore() // Access the store

    // Access the fetched items from the store
    const items = itemStore.items

    return {
      items,
    }
  },
}
</script>

<style scoped>
/* Styles as needed */
</style>
