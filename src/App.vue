<template>
  <div>
    <nav>
      <button @click="currentView = 'ShoppingView'">Shopping-List</button>
      <!-- <button @click="currentView = 'CargoMissionView'">Cargo-Missions</button> -->
      <button @click="currentView = 'ProfitCalculatorView'">Profit Calculator</button>
      <button @click="currentView = 'LootablePricesView'">Lootable Item Prices</button>
    </nav>
    <section v-if="currentView === 'ShoppingView'">
      <ShoppingView :items="items" :terminals="terminals" :isLoading="isLoading" />
    </section>
    <!-- <section v-if="currentView === 'CargoMissionView'">
      <CargoMissionView />
    </section> -->
    <section v-if="currentView === 'LootablePricesView'">
      <LootablesPricesView :items="farmItems" :commodities="commodities" />
    </section>
    <section v-if="currentView === 'ProfitCalculatorView'">
      <ProfitCalculatorView />
    </section>
  </div>
  <a class="uex-api-badge" href="https://uexcorp.space/" target="_blank" rel="noopener noreferrer">
    Powered by <img class="uex-logo" src="/uex-logo.svg" alt="UEX" draggable="false" />
  </a>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ShoppingView from '@/views/ShoppingView.vue';
// import CargoMissionView from '@/views/CargoMissionView.vue';
import LootablesPricesView from '@/views/LootablesPricesView.vue';
import ProfitCalculatorView from '@/views/ProfitCalculatorView.vue'; // Import the new view

const currentView = ref('ShoppingView');

// Reactive data states
const items = ref([]);
const farmItems = ref([]);
const terminals = ref([]);
const commodities = ref([]);
const isLoading = ref(true);

const fetchAllData = async () => {
  const endpoints = {
    items: 'https://api.uexcorp.space/2.0/items_prices_all',
    terminals: 'https://api.uexcorp.space/2.0/terminals?type=item',
    commodities: 'https://api.uexcorp.space/2.0/commodities_prices_all',
  };

  try {
    const fetchData = async (url) => {
      const response = await fetch(url);
      const result = await response.json();
      return result.data;
    };

    const [fetchedItems, fetchedTerminals, fetchedCommodities] = await Promise.all([
      fetchData(endpoints.items),
      fetchData(endpoints.terminals),
      fetchData(endpoints.commodities),
    ]);

    // Only save needed properties
    const reducedItems = fetchedItems.map(item => {
      return {
        id_terminal: item.id_terminal,
        id_category: item.id_category,
        price_buy: item.price_buy,
        price_sell: item.price_sell,
        item_name: item.item_name,
        terminal_name: item.terminal_name
      };
    });
    const cleanedItems = reducedItems.filter(item => item.price_buy !== 0);
    const cleanedFarmItems = reducedItems.filter(item => item.price_buy === 0 && item.id_category === 18);

    const cleanedCommodities = fetchedCommodities.map(commodity => {
      return {
        price_sell_avg: commodity.price_sell_avg,
        commodity_name: commodity.commodity_name
      };
    });

    // Update reactive states
    items.value = cleanedItems;
    farmItems.value = cleanedFarmItems;
    terminals.value = fetchedTerminals;
    commodities.value = cleanedCommodities;

    // Remove data from localStorage
    localStorage.removeItem('items');
    localStorage.removeItem('farmItems');
    localStorage.removeItem('terminals');
    localStorage.removeItem('commodities');
    // older data not used anymore
    localStorage.removeItem('stations');
    localStorage.removeItem('cities');
    localStorage.removeItem('orbit_distances');

    // Cache the data in localStorage
    localStorage.setItem('items', JSON.stringify(cleanedItems));
    localStorage.setItem('farmItems', JSON.stringify(cleanedFarmItems));
    localStorage.setItem('terminals', JSON.stringify(fetchedTerminals));
    localStorage.setItem('commodities', JSON.stringify(cleanedCommodities));
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
    farmItems.value = JSON.parse(localStorage.getItem('farmItems')) || [];
    terminals.value = JSON.parse(localStorage.getItem('terminals')) || [];
    commodities.value = JSON.parse(localStorage.getItem('commodities')) || [];
    isLoading.value = false;
    console.log('Data loaded from localStorage');
  }
});
</script>

<style lang="scss">
:root {
  --color-black: #000;
  --color-white: #fff;
  --color-darkgray: #282828;
  --color-lightgray: #f0f0f0;
  --color-red: #da2128;
  --color-yellow: #c9a700;
  --color-green: #006400;
  --max-width: 1200px;
}

body {
  position: relative;
  width: calc(100vw - 20px);
  max-width: 1242px;
  margin: 0 auto;
  font-family: 'Orbitron', serif;
  font-optical-sizing: auto;
  letter-spacing: 1px;
  font-weight: 400;
  font-style: normal;
  background-color: var(--color-darkgray);
  color: var(--color-white);
}

nav {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  button {
    background-color: var(--color-lightgray);
    color: var(--color-black);
    border: none;
    padding: 10px 20px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: var(--color-red);
      color: var(--color-white);
    }
  }
}

.section-title {
  text-align: center;
  color: var(--color-white);
}

.uex-api-badge {
  position: relative;
  margin-bottom: 10px;
  left: calc(100% - 105px);
  width: 105px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
  color: var(--color-white);
  text-decoration: none;
}
</style>
