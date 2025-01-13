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
      <ItemSearchList :stations="stations" :cities="cities" :items="items" />
      <UserTerminalList :terminals="terminals" :items="items" />
      <TerminalList :terminals="terminals" :items="items" />
    </div>
  </div>
  <p class="uex-api-badge">Powered by <img class="uex-logo" src="/uex-logo.svg" alt="UEX" draggable="false" /></p>
</template>

<script>
import ItemSearchList from '@/components/ItemSearchList.vue';
import TerminalList from '@/components/TerminalList.vue';
import UserTerminalList from '@/components/UserTerminalList.vue';
import { ref, onMounted } from 'vue';

export default {
  components: {
    ItemSearchList,
    TerminalList,
    UserTerminalList
  },
  setup() {
    // Reactive data states
    const items = ref([]);
    const terminals = ref([]);
    const stations = ref([]);
    const cities = ref([]);
    const isLoading = ref(true);

    const fetchAllData = async () => {
      const endpoints = {
        items: 'https://api.uexcorp.space/2.0/items_prices_all',
        terminals: 'https://api.uexcorp.space/2.0/terminals?type=item',
        stations: 'https://api.uexcorp.space/2.0/space_stations?id_star_system=68',
        cities: 'https://api.uexcorp.space/2.0/cities?id_star_system=68'
      };

      try {
        const fetchData = async (url) => {
          const response = await fetch(url);
          const result = await response.json();
          return result.data;
        };

        const [fetchedItems, fetchedTerminals, fetchedStations, fetchedCities] = await Promise.all([
          fetchData(endpoints.items),
          fetchData(endpoints.terminals),
          fetchData(endpoints.stations),
          fetchData(endpoints.cities)
        ]);

        // Update reactive states
        items.value = fetchedItems;
        terminals.value = fetchedTerminals;
        stations.value = fetchedStations;
        cities.value = fetchedCities;

        // Remove data from localStorage
        localStorage.removeItem('items');
        localStorage.removeItem('terminals');
        localStorage.removeItem('stations');
        localStorage.removeItem('cities');

        // Cache the data in localStorage
        localStorage.setItem('items', JSON.stringify(fetchedItems));
        localStorage.setItem('terminals', JSON.stringify(fetchedTerminals));
        localStorage.setItem('stations', JSON.stringify(fetchedStations));
        localStorage.setItem('cities', JSON.stringify(fetchedCities));
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
        items.value = JSON.parse(localStorage.getItem('items')) || [];
        terminals.value = JSON.parse(localStorage.getItem('terminals')) || [];
        stations.value = JSON.parse(localStorage.getItem('stations')) || [];
        cities.value = JSON.parse(localStorage.getItem('cities')) || [];
        isLoading.value = false;
        console.log('Data loaded from localStorage');
      }
    });

    return {
      isLoading,
      items,
      terminals,
      stations,
      cities
    };
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  color: #fff;
}

.uex-api-badge {
  position: fixed;
  right: 10px;
  bottom: 0;
  width: 100px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
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
