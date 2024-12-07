<template>
  <div>
    <!-- Title -->
    <h1 class="title">Shopping-List</h1>

    <!-- Loader -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>

    <!-- Content (only shown after data is loaded) -->
    <div v-else>
      <FilterableChecklist :categories="categories" :items="items" />
      <ItemSearchList />
      <TerminalList :terminals="terminals" :items="items" />
    </div>
  </div>
</template>

<script>
import FilterableChecklist from '@/components/FilterableChecklist.vue';
import ItemSearchList from '@/components/ItemSearchList.vue';
import TerminalList from '@/components/TerminalList.vue';
import { ref, onMounted } from 'vue';

export default {
  components: {
    FilterableChecklist,
    ItemSearchList,
    TerminalList,
  },
  setup() {
    // Reactive data states
    const categories = ref([]);
    const items = ref([]);
    const terminals = ref([]);
    const orbitDistances = ref([]);
    const isLoading = ref(true);

    const fetchAllData = async () => {
      const endpoints = {
        categories: 'https://uexcorp.space/api/2.0/categories?type=item',
        items: 'https://uexcorp.space/api/2.0/items_prices_all',
        terminals: 'https://uexcorp.space/api/2.0/terminals?type=item',
        orbit_distances: 'https://uexcorp.space/api/2.0/orbits_distances?id_star_system=68',
      };

      try {
        const fetchData = async (url) => {
          const response = await fetch(url);
          const result = await response.json();
          return result.data;
        };

        const [fetchedCategories, fetchedItems, fetchedTerminals, fetchedOrbitDistances] = await Promise.all([
          fetchData(endpoints.categories),
          fetchData(endpoints.items),
          fetchData(endpoints.terminals),
          fetchData(endpoints.orbit_distances),
        ]);

        // Update reactive states
        categories.value = fetchedCategories;
        items.value = fetchedItems;
        terminals.value = fetchedTerminals;
        orbitDistances.value = fetchedOrbitDistances;

        // Cache the data in localStorage
        localStorage.setItem('categories', JSON.stringify(fetchedCategories));
        localStorage.setItem('items', JSON.stringify(fetchedItems));
        localStorage.setItem('terminals', JSON.stringify(fetchedTerminals));
        localStorage.setItem('orbit_distances', JSON.stringify(fetchedOrbitDistances));
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem('dataExpiration', expirationTime.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        isLoading.value = false; // Hide loader
      }
    };

    onMounted(async () => {
      // Check if data is expired
      const expiration = localStorage.getItem('dataExpiration');
      if (!expiration || Date.now() > Number(expiration)) {
        await fetchAllData();
      } else {
        // Load cached data from localStorage
        categories.value = JSON.parse(localStorage.getItem('categories')) || [];
        items.value = JSON.parse(localStorage.getItem('items')) || [];
        terminals.value = JSON.parse(localStorage.getItem('terminals')) || [];
        orbitDistances.value = JSON.parse(localStorage.getItem('orbit_distances')) || [];
        isLoading.value = false;
        console.log('Data loaded from localStorage');
      }
    });

    return {
      isLoading,
      categories,
      items,
      terminals,
    };
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  color: #fff;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  border: 6px solid #f0f0f0;
  border-top: 6px solid #da2128;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
