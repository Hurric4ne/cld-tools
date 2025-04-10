<template>
  <div class="terminal-list">
    <h3>Automatic Shopping List</h3>
    <ul v-if="sortedTerminals.length">
      <li class="terminal" v-for="(terminal, index) in sortedTerminals" :key="index">
        <strong>
          {{ getTerminalStarSystem(terminal.id_terminal) }} | {{ getTerminalName(terminal.id_terminal) }} ({{
            terminal.items.length
          }}
          item{{ terminal.items.length > 1 ? 's' : '' }})
        </strong>
        <ul>
          <li class="item" v-for="item in terminal.items" :key="item.item_name">
            {{ item.item_name }}
          </li>
        </ul>
      </li>
    </ul>
    <p class="no-items" v-else>No Items selected.</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore';

export default {
  name: 'TerminalList',
  props: {
    terminals: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const userStore = useUserStore() // Access the store

    // Create a complete list of items based on the original Data and the store's selectedItems
    const detailedSelectedItems = computed(() => {
      const selectedNames = userStore.selectedItems.map(item => item.item_name)
      return props.items.filter(item =>
        selectedNames.includes(item.item_name)
      )
    })

    // Group detailed selected items by id_terminal
    const groupedItems = computed(() => {
      const terminalsMap = {}

      detailedSelectedItems.value.forEach(item => {
        if (!terminalsMap[item.id_terminal]) {
          terminalsMap[item.id_terminal] = []
        }
        terminalsMap[item.id_terminal].push(item)
      })

      // Convert the terminalsMap to an array format
      return Object.keys(terminalsMap).map(id_terminal => ({
        id_terminal,
        items: terminalsMap[id_terminal],
      }))
    })

    // Sort terminals by the logic specified
    const sortedTerminals = computed(() => {
      const remainingItems = new Set(
        detailedSelectedItems.value.map(item => item.item_name),
      );
      const result = [];
      const processedTerminals = new Set();

      while (remainingItems.size > 0) {
        let bestTerminal = null;
        let maxUniqueItems = 0;

        groupedItems.value.forEach(terminal => {
          if (!processedTerminals.has(terminal.id_terminal)) {
            const uniqueItems = terminal.items.filter(item =>
              remainingItems.has(item.item_name),
            ).length;
            if (uniqueItems > maxUniqueItems) {
              maxUniqueItems = uniqueItems;
              bestTerminal = terminal;
            }
          }
        });

        if (bestTerminal) {
          // Filter items for this terminal based on remainingItems
          const filteredItems = bestTerminal.items.filter(item =>
            remainingItems.has(item.item_name),
          );

          // Add terminal with filtered items to result
          result.push({
            id_terminal: bestTerminal.id_terminal,
            items: filteredItems,
          });

          // Mark items as processed
          filteredItems.forEach(item => remainingItems.delete(item.item_name));
          processedTerminals.add(bestTerminal.id_terminal);
        } else {
          break; // Break the loop if no suitable terminal is found
        }
      }

      return result;
    });

    // Get the terminal name based on the ID
    const getTerminalName = id_terminal => {
      const terminal = props.terminals.find(
        term => term.id === parseInt(id_terminal),
      )
      return terminal ? terminal.name : 'Unknown Terminal'
    }

    // Get the terminal's star system based on the ID
    const getTerminalStarSystem = id_terminal => {
      const terminal = props.terminals.find(
        term => term.id === parseInt(id_terminal),
      )
      return terminal ? terminal.star_system_name : 'Unknown Star System'
    }

    return {
      sortedTerminals,
      getTerminalName,
      getTerminalStarSystem
    }
  },
}
</script>

<style scoped>
.terminal-list {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: var(--max-width);
  margin: 50px auto 20px;
}

h3 {
  text-align: center;
  margin: 0 0 20px;
}

ul {
  list-style-type: none;
  padding: 0 15px;
  margin: 10px 0 20px;
}

.terminal {
  list-style-type: none;
  margin-bottom: 20px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-lightgray);
  }
}

.item {
  margin-left: 10px;
  margin-bottom: 5px;
  list-style-type: disc;
}

.no-items {
  font-weight: bold;
  color: var(--color-red);
}
</style>
