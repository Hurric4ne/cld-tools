<template>
  <div class="filterable-checklist">
    <h3>Select Categories</h3>

    <!-- Checklist for each section, divided into three groups -->
    <div v-for="(group, index) in sectionGroups" :key="index" class="group">
      <div
        v-for="(categories, section) in group"
        :key="section"
        class="section-group"
      >
        <h4 @click="toggleSection(section)">
          <span class="arrow" :class="{ open: expandedSections.has(section) }"
            >▶</span
          >
          {{ section }}
        </h4>

        <!-- Checklist for categories in the selected section -->
        <ul v-show="expandedSections.has(section)" class="checklist">
          <li
            v-for="category in categories"
            :key="category.id"
            class="checklist-item"
          >
            <label>
              <input
                type="checkbox"
                v-model="selectedCategories"
                :value="category"
              />
              <span>{{ category.name }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>

    <div class="button-container">
      <!-- Submit Button -->
      <ThemedButton @click="fetchItems">Show Items</ThemedButton>
      <!-- Reset Button -->
      <ThemedButton @click="resetList">Reset List</ThemedButton>
    </div>
  </div>
</template>

<script>
import itemCategories from '@/assets/itemCategories.json' // Directly import categories JSON
import itemPricesAll from '@/assets/itemPricesAll.json' // Directly import prices JSON
import { ref, reactive, computed } from 'vue'
import { useItemStore } from '@/stores/useItemStore' // Import the Pinia store
import ThemedButton from '@/components/ThemedButton.vue'

export default {
  name: 'FilterableChecklist',
  components: {
    ThemedButton,
  },
  setup() {
    const itemStore = useItemStore() // Access the store

    const selectedCategories = ref([]) // Track selected categories
    const expandedSections = reactive(new Set()) // Track expanded sections

    // Items data directly from imported JSON
    const categoriesData = ref(itemCategories.data)

    // Group categories by section
    const groupedCategories = computed(() => {
      return categoriesData.value.reduce((groups, category) => {
        const { section, name, id } = category
        if (!groups[section]) groups[section] = []
        groups[section].push({ name, id })
        return groups
      }, {})
    })

    // Split grouped categories into three sections
    const sectionGroups = computed(() => {
      const groupEntries = Object.entries(groupedCategories.value)
      const groupSize = Math.ceil(groupEntries.length / 3)

      return [
        Object.fromEntries(groupEntries.slice(0, groupSize)),
        Object.fromEntries(groupEntries.slice(groupSize, groupSize * 2)),
        Object.fromEntries(groupEntries.slice(groupSize * 2)),
      ]
    })

    const toggleSection = section => {
      if (expandedSections.has(section)) {
        expandedSections.delete(section)
      } else {
        expandedSections.add(section)
      }
    }

    // Fetch items based on selected categories
    const fetchItems = () => {
      const selectedCategoryIds = selectedCategories.value.map(cat => cat.id)

      // Filter items from itemPricesAll.json based on selected category IDs and price_buy > 0
      const newItems = itemPricesAll.data.filter(
        item =>
          selectedCategoryIds.includes(item.id_category) && item.price_buy > 0,
      )

      // Remove duplicates based on item_name
      const uniqueItems = []
      newItems.forEach(item => {
        const exists = uniqueItems.some(
          existingItem => existingItem.item_name === item.item_name,
        )
        if (!exists) {
          uniqueItems.push(item)
        }
      })

      // Update the store with the filtered items
      itemStore.setItems(uniqueItems)

      // Collapse all sections after fetching items
      expandedSections.clear() // Collapse all sections
    }

    const resetList = () => {
      selectedCategories.value = [] // Clear selected categories
      itemStore.clearItems() // Clear items in the store
      expandedSections.clear() // Collapse all sections
    }

    return {
      sectionGroups,
      selectedCategories,
      expandedSections,
      toggleSection,
      fetchItems,
      resetList,
    }
  },
}
</script>

<style scoped lang="scss">
.filterable-checklist {
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

  .group {
    display: inline-block;
    width: 30%;
    vertical-align: top;
    margin-right: 10px;
  }

  h4 {
    color: var(--color-red);
    font-weight: bold;
    margin: 0 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .arrow {
    margin-right: 8px;
    transition: transform 0.3s ease;
  }

  .arrow.open {
    transform: rotate(90deg); /* Arrow points down when section is expanded */
  }

  .section-group {
    margin: 10px 0;
  }

  .checklist {
    list-style: none;
    padding: 0;

    .checklist-item {
      padding: 5px 0;

      label {
        display: flex;
        align-items: center;
        cursor: pointer;

        input[type='checkbox'] {
          margin-right: 10px;
          cursor: pointer;
        }
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
