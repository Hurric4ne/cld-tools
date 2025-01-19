<template>
  <div class="manual-shopping-list">
    <h3>Manual Shopping List</h3>
    <table v-if="selectedItems.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Terminal</th>
          <th>Price (aUEC)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in selectedItems" :key="index">
          <td>{{ item.item_name }}</td>
          <td>
            <select v-model="selectedLocations[index]">
              <option value="">All Locations</option>
              <option v-for="(location, locIndex) in getLocationsForItem(item.item_name)" :key="locIndex"
                :value="location">
                {{ location }}
              </option>
            </select>
          </td>
          <td>
            <select v-model="selectedTerminals[index]">
              <option v-for="(terminal, termIndex) in getTerminalsForItem(item.item_name, selectedLocations[index])"
                :key="termIndex" :value="terminal">
                {{ terminal }}
              </option>
            </select>
          </td>
          <td>
            {{ formatNumber(getPriceForItem(item.item_name, selectedTerminals[index])) }}
          </td>
        </tr>
        <tr class="total-row">
          <td colspan="3" class="total-label">Total</td>
          <td class="total-value">{{ formatNumber(getTotalCost()) }} aUEC</td>
        </tr>
      </tbody>
    </table>
    <p class="no-items" v-else>No Items selected.</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";

export default {
  name: "UserTerminalList",
  props: {
    items: {
      type: Array,
      required: true,
    },
    terminals: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const userStore = useUserStore();

    // Access the selected items from the user store
    const selectedItems = computed(() => userStore.selectedItems);

    // Reactive state for selected locations and terminals
    const selectedLocations = ref(selectedItems.value.map(() => ""));
    const selectedTerminals = ref(selectedItems.value.map(() => ""));

    // Function to find all terminals where an item can be bought and sort them by name
    const getTerminalsForItem = (itemName, selectedLocation) => {
      const terminals = props.items
        .filter((item) =>
          item.item_name === itemName && parseFloat(item.price_buy) > 0 // Exclude items with buy_price <= 0
        )
        .map((item) => {
          const terminal = props.terminals.find((term) => term.id === parseInt(item.id_terminal));
          return terminal && (!selectedLocation || terminal.planet_name === selectedLocation) ? terminal.name : null;
        })
        .filter((terminal) => terminal !== null);

      return [...new Set(terminals)].sort((a, b) => a.localeCompare(b)); // Remove duplicates and sort alphabetically
    };

    // Function to find all unique locations (planet_name) for terminals where the item can be bought
    const getLocationsForItem = (itemName) => {
      const locations = props.items
        .filter((item) => item.item_name === itemName)
        .map((item) => {
          const terminal = props.terminals.find((term) => term.id === parseInt(item.id_terminal));
          return terminal ? terminal.planet_name : null;
        })
        .filter((location) => location !== null && location !== "");

      // Filter out locations that don't have terminals with available items
      const validLocations = locations.filter((location) => {
        const terminals = getTerminalsForItem(itemName, location);
        return terminals.length > 0;
      });

      return [...new Set(validLocations)].sort((a, b) => a.localeCompare(b)); // Remove duplicates and sort alphabetically
    };

    // Function to get the price of an item for a selected terminal
    const getPriceForItem = (itemName, selectedTerminal) => {
      if (!selectedTerminal || selectedTerminal === "Select Terminal") return 0;

      // Find the terminal ID from the terminal name
      const terminal = props.terminals.find((term) => term.name === selectedTerminal);
      if (!terminal) return 0;

      // Match the item and terminal in props.items
      const itemData = props.items.find(
        (item) => item.item_name === itemName && parseInt(item.id_terminal) === terminal.id
      );
      return itemData ? parseInt(itemData.price_buy, 10) : 0; // Ensure the price is an integer
    };

    // Function to calculate the total cost of selected items
    const getTotalCost = () => {
      return selectedItems.value.reduce((total, item, index) => {
        return total + getPriceForItem(item.item_name, selectedTerminals.value[index]);
      }, 0);
    };

    // Function to format numbers with thousand separators
    const formatNumber = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return {
      selectedItems,
      selectedLocations,
      selectedTerminals,
      getTerminalsForItem,
      getLocationsForItem,
      getPriceForItem,
      getTotalCost,
      formatNumber,
    };
  },
};
</script>

<style scoped>
.manual-shopping-list {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 1000px;
  margin: 50px auto 20px;
}

h3 {
  text-align: center;
  margin: 0 0 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.no-items {
  font-weight: bold;
  color: var(--color-red);
}

.total-row {
  font-weight: bold;
}

.total-label {
  text-align: right;
}

.total-value {
  text-align: left;
}
</style>
