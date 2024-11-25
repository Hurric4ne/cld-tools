<template>
  <div
    class="item-search-list"
    :class="{ 'is-disabled': !itemStore.items.length }"
  >
    <h3>Search Items from filtered Categories</h3>
    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      placeholder="Search items..."
      class="search-bar"
      :disabled="!itemStore.items.length"
    />

    <ul class="item-list">
      <li v-for="item in filteredItems" :key="item.id" class="item">
        <label>
          <input
            type="checkbox"
            v-model="selectedItems"
            :value="item.item_name"
          />
          {{ item.item_name }}
        </label>
      </li>
      <p v-if="!filteredItems.length">No items found.</p>
    </ul>

    <div class="button-container">
      <!-- Submit Button -->
      <ThemedButton
        :disabled="!itemStore.items.length || !selectedItems.length"
        @click="updateStoredItems"
      >
        Submit List
      </ThemedButton>
      <!-- Reset Button -->
      <ThemedButton
        :disabled="!itemStore.items.length || !selectedItems.length"
        @click="resetStoredItems"
      >
        Reset List
      </ThemedButton>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useItemStore } from '@/stores/useItemStore' // Import the item store
import ThemedButton from './ThemedButton.vue'

export default {
  name: 'ItemSearchList',
  components: {
    ThemedButton,
  },
  setup() {
    const itemStore = useItemStore() // Access the store

    const searchQuery = ref('')
    const debouncedQuery = ref('')
    const selectedItems = ref([]) // To hold full item details
    let debounceTimeout = null

    const handleInput = () => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        debouncedQuery.value = searchQuery.value // Update the debounced value after 1 second
      }, 1000)
    }

    const filteredItems = computed(() => {
      if (debouncedQuery.value.trim() === '') {
        return itemStore.items.filter(item =>
          selectedItems.value.some(
            selected => selected.item_name === item.item_name,
          ),
        )
      }
      return itemStore.items.filter(item => {
        return item.item_name
          .toLowerCase()
          .includes(debouncedQuery.value.toLowerCase())
      })
    })

    const updateStoredItems = () => {
      // Update the store with full item objects based on selected item names
      const selectedFullItems = itemStore.items.filter(item =>
        selectedItems.value.includes(item.item_name),
      )
      itemStore.setSelectedItems(selectedFullItems)
    }

    const resetStoredItems = () => {
      selectedItems.value = [] // Clear selected items
      searchQuery.value = '' // Clear the search bar
      debouncedQuery.value = '' // Clear the debounced value
      itemStore.clearSelectedItems() // Clear the selected items in the store
    }

    return {
      itemStore, // Expose the store to the template
      searchQuery,
      selectedItems,
      filteredItems,
      handleInput,
      updateStoredItems,
      resetStoredItems,
    }
  },
}
</script>

<style scoped lang="scss">
.item-search-list {
  width: 100%;
  max-width: 840px;
  margin: 40px auto;
  border: 1px solid var(--color-red);
  padding: 20px;

  h3 {
    color: var(--color-red);
    font-weight: bold;
    text-align: center;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .search-bar {
    width: calc(100% - 20px);
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid var(--color-lightgray);
    border-radius: 4px;
  }

  .item-list {
    list-style: none;
    padding: 5px 0;
    max-height: 300px; /* Set the max height for scrolling */
    overflow-y: auto; /* Enable vertical scrolling */
    border-top: 1px solid var(--color-lightgray);
    border-bottom: 1px solid var(--color-lightgray);
  }

  .item {
    padding: 8px 0;

    label {
      display: flex;
      align-items: center;

      input[type='checkbox'] {
        margin-right: 10px;
      }
    }
  }

  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    column-gap: 100px;
  }
}
</style>
