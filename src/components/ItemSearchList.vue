<template>
  <div class="item-search-list" :class="{ 'is-disabled': !$props.items.length }">
    <h3>Search through all available Items</h3>
    <input type="text" v-model="searchQuery" @input="handleInput" placeholder="Search items..." class="search-bar"
      :disabled="!$props.items.length" />

    <ul class="item-list">
      <li v-for="item in filteredItems" :key="item.id" class="item">
        <label>
          <input type="checkbox" v-model="selectedItems" :value="item.item_name" />
          {{ item.item_name }}
        </label>
      </li>
      <p v-if="!filteredItems.length">No items found.</p>
    </ul>

    <div class="button-container">
      <!-- Submit Button -->
      <ThemedButton :disabled="!$props.items.length || !selectedItems.length" @click="updateStoredItems">
        Submit List
      </ThemedButton>
      <!-- Reset Button -->
      <ThemedButton :disabled="!$props.items.length || !selectedItems.length" @click="resetStoredItems">
        Reset List
      </ThemedButton>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore' // Import the item store
import ThemedButton from './ThemedButton.vue'

export default {
  name: 'ItemSearchList',
  components: {
    ThemedButton,
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const userStore = useUserStore(); // Access the store

    const searchQuery = ref('');
    const debouncedQuery = ref('');
    const selectedItems = ref([]); // To hold full item details
    let debounceTimeout = null;

    // Filter props.items to ensure only unique items are used
    const uniqueItems = computed(() => {
      const seen = new Set();
      return props.items.filter((item) => {
        // Ensure uniqueness by item_name
        if (seen.has(item.item_name)) {
          return false;
        }
        seen.add(item.item_name);
        return true;
      });
    });


    const handleInput = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        debouncedQuery.value = searchQuery.value; // Update the debounced value after 1 second
      }, 1000);
    };

    const filteredItems = computed(() => {
      if (debouncedQuery.value.trim() === '') {
        return uniqueItems.value.filter((item) =>
          selectedItems.value.some(
            (selected) => selected.item_name === item.item_name,
          ),
        );
      }
      return uniqueItems.value.filter((item) => {
        if (item.item_name !== null) {
          return item.item_name
          .toLowerCase()
          .includes(debouncedQuery.value.toLowerCase());
        } else {
          console.log(`${item} does not have an item_name`);
        }
      });
    });

    const updateStoredItems = () => {
      // Update the store with full item objects based on selected item names
      const selectedFullItems = uniqueItems.value.filter((item) =>
        selectedItems.value.includes(item.item_name),
      );
      userStore.setSelectedItems(selectedFullItems);
    };

    const resetStoredItems = () => {
      selectedItems.value = []; // Clear selected items
      searchQuery.value = ''; // Clear the search bar
      debouncedQuery.value = ''; // Clear the debounced value
      userStore.clearSelectedItems(); // Clear the selected items in the store
    };

    return {
      userStore, // Expose the store to the template
      searchQuery,
      selectedItems,
      filteredItems,
      handleInput,
      updateStoredItems,
      resetStoredItems,
    };
  }
}
</script>

<style scoped lang="scss">
.item-search-list {
  max-width: 1000px;
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
    max-height: 300px;
    overflow-y: auto;
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

    label.disabled {
      color: darkgray;

      input[type='checkbox'] {
        visibility: hidden;
        opacity: 0;
      }
    }
  }

  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    column-gap: 50px;
  }

  .starting-location {
    min-width: 300px;
  }
}
</style>
