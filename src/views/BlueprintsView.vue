<template>
  <div>
    <!-- Title -->
    <h1 class="section-title">Blueprints</h1>

    <!-- Loader -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>

    <!-- Content (only shown after data is loaded) -->
    <div v-else class="blueprints-container">
      <div class="search-panel">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search blueprints by name..."
          class="search-bar"
        />
        <div class="controls">
          <button :disabled="!filtered.length" @click="selectAll">Select All</button>
          <button :disabled="!selectedNames.length" @click="clearSelection">Clear</button>
          <button :disabled="!selectedNames.length" @click="submitList">Submit List</button>
        </div>
      </div>

      <ul class="blueprint-list">
        <li v-for="bp in filtered" :key="bpIndex(bp)" class="blueprint-item">
          <label>
            <input type="checkbox" :value="bp.entityName" v-model="selectedNames" />
            <span class="name">{{ bp.entityName }}</span>
            <small class="meta"> — {{ bp.itemType || 'Unknown' }} • {{ bp.variant || '—' }}</small>
          </label>
        </li>
        <li v-if="!filtered.length" class="no-results">No blueprints found.</li>
      </ul>

      <div class="results" v-if="hasResults">
        <h2>Aggregated Materials for</h2>
        <ul>
          <li v-for="name in selectedNames" :key="name">{{ name }}</li>
        </ul>
        <p><strong>Total Crafting Time:</strong> {{ formattedTotalTime }}</p>

        <table class="materials-table">
          <thead>
            <tr>
              <th>Material</th>
              <th class="right">Amount (SCU)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(amount, mat) in aggregatedMaterials" :key="mat">
              <td>{{ mat }}</td>
              <td class="right">{{ amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import blueprints from '@/assets/json/blueprints.json'

export default {
  name: 'BlueprintsView',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const searchQuery = ref('')
    const selectedNames = ref([])

    // Deduplicate blueprints by entityName + variant (keep first occurrence)
    const validBlueprints = computed(() => {
      const seen = new Set()
      const out = []
      for (const bp of blueprints) {
      // defensive: skip falsy entries
      if (!bp) continue
      const key = `${bp.entityName}__${bp.variant || ''}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(bp)
      }
      return out
    })

    const filtered = computed(() => {
      const q = (searchQuery.value || '').trim().toLowerCase()
      if (!q) return validBlueprints.value
      return validBlueprints.value.filter(bp =>
        bp.entityName.toLowerCase().includes(q)
      )
    })

    // Utility to get stable key if duplicates exist
    const bpIndex = bp => `${bp.entityName}__${bp.variant || ''}`

    // Materials exclusion list
    const excludeKeys = new Set([
      'entityName',
      'itemType',
      'variant',
      'craftingTime',
      'craftingTimeSeconds',
      'componentCount',
      'totalSCU',
    ])

    const aggregatedMaterials = ref({})
    const totalTimeSeconds = ref(0)
    const hasResults = computed(() => Object.keys(aggregatedMaterials.value).length > 0)

    const resetResults = () => {
      aggregatedMaterials.value = {}
      totalTimeSeconds.value = 0
    }

    const submitList = () => {
      resetResults()
      const picked = validBlueprints.value.filter(bp => selectedNames.value.includes(bp.entityName))

      // Sum crafting time seconds
      totalTimeSeconds.value = picked.reduce((sum, bp) => {
        const v = Number(bp.craftingTimeSeconds)
        return sum + (isNaN(v) ? 0 : v)
      }, 0)

      // Aggregate numeric material fields (keys not in excludeKeys)
      const DECIMALS = 8 // internal rounding precision
      const DISPLAY_DECIMALS = 6 // precision for UI display

      const toNumber = v => {
        if (v === null || v === undefined) return 0
        const n = typeof v === 'number' ? v : Number(v)
        return isNaN(n) ? 0 : n
      }
      const safeAdd = (a, b) => Number((a + b).toFixed(DECIMALS))

      const totals = {}
      for (const bp of picked) {
        Object.entries(bp).forEach(([key, value]) => {
          if (excludeKeys.has(key)) return
          const num = toNumber(value)
          if (num !== 0) {
            totals[key] = safeAdd(totals[key] || 0, num)
          }
        })
      }

      // Format totals for display: trim insignificant trailing zeros
      const formattedTotals = Object.keys(totals)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, k) => {
          const v = totals[k]
          acc[k] = Number.isInteger(v) ? v : parseFloat(v.toFixed(DISPLAY_DECIMALS))
          return acc
        }, {})

      aggregatedMaterials.value = formattedTotals
    }

    const formattedTotalTime = computed(() => {
      const s = totalTimeSeconds.value || 0
      const hours = Math.floor(s / 3600)
      const minutes = Math.floor((s % 3600) / 60)
      const seconds = s % 60
      const parts = []
      if (hours) parts.push(`${hours}h`)
      if (minutes) parts.push(`${minutes}m`)
      if (seconds || !parts.length) parts.push(`${seconds}s`)
      return parts.join(' ')
    })

    const selectAll = () => {
      selectedNames.value = filtered.value.map(bp => bp.entityName)
    }

    const clearSelection = () => {
      selectedNames.value = []
      resetResults()
      searchQuery.value = ''
    }

    return {
      searchQuery,
      filtered,
      selectedNames,
      submitList,
      aggregatedMaterials,
      totalTimeSeconds,
      formattedTotalTime,
      hasResults,
      bpIndex,
      selectAll,
      clearSelection,
    }
  },
}
</script>

<style scoped>
.blueprints-container {
  max-width: var(--max-width);
  margin: 20px auto;
  padding: 10px 20px;
  background: #1f1f1f;
  border-radius: 8px;
  border: 1px solid #333;
}

.search-panel {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1 1 360px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #fff;
  color: #000;
}

.controls {
  display: flex;
  gap: 8px;
}

.controls button {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: var(--color-lightgray);
  color: var(--color-black);
}

.blueprint-list {
  max-height: 420px;
  overflow-y: auto;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}

.blueprint-item {
  padding: 6px 0;
  border-bottom: 1px dashed #2b2b2b;
}

.name {
  margin-left: 8px;
  font-weight: 600;
}

.meta {
  color: #aaa;
  margin-left: 6px;
}

.results {
  margin-top: 16px;
  background: #151515;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #2a2a2a;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.materials-table th,
.materials-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #272727;
}

.materials-table .right {
  text-align: right;
}

.no-results {
  padding: 12px;
  color: #bbb;
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
