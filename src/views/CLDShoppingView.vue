<template>
  <h1 class="title">Filterable Checklist</h1>
  <div>
    <FilterableChecklist />
    <ItemSearchList />
    <TerminalList />
  </div>
</template>

<script>
import FilterableChecklist from '@/components/FilterableChecklist.vue'
import ItemSearchList from '@/components/ItemSearchList.vue'
import TerminalList from '@/components/TerminalList.vue'
import { useItemStore } from '@/stores/useItemStore' // Import the item store

export default {
  components: {
    FilterableChecklist,
    ItemSearchList,
    TerminalList,
  },
  setup() {
    const itemStore = useItemStore() // Access the item store

    // Optional: if you need to watch or manipulate items in the parent component
    return {
      itemStore, // Expose store if needed for debugging or interactions
    }
  },
}
</script>

<style scoped>
.title {
  text-align: center;
  color: #fff;
}
</style>
