<template>
  <h1 class="section-title">Prices of lootable Items/Commodities</h1>
  <div class="lootables-price-view">
    <h2 @click="toggleCollapse">FPS Weapons <span class="collapse-icon" :class="{'is-collapsed': isCollapsed}">&#10148;</span></h2>
    <div class="item-list" v-show="!isCollapsed">
      <div class="item" v-for="item in allSellableItems" :key="item.id">
        <h3>{{ item.item_name }}</h3>
        <p class="item-prices">Median Price: <span>{{ Math.round(item.price_sell).toLocaleString() }} aUEC</span>
        Volume: <span>{{ item.volume.toLocaleString() }} &micro;SCU</span></p>
        <p>Price per Volume: <span>{{ item.pricePerVolume.toLocaleString() }}</span></p>
      </div>
    </div>
  </div>
  <div class="lootables-price-view">
    <h2 @click="toggleCommoditiesCollapse">Commodities <span class="collapse-icon" :class="{'is-collapsed': isCommoditiesCollapsed}">&#10148;</span></h2>
    <div class="item-list" v-show="!isCommoditiesCollapsed">
      <div class="item" v-for="commodity in allSellableCommodities" :key="commodity.commodity_name">
        <h3 :class="{ 'illegal': commodity.illegal }" :title="commodity.illegal ? 'Illegal Commodity' : ''">{{ commodity.commodity_name }}</h3>
        <p class="item-prices">Median Price: {{ Math.round(commodity.medianPrice).toLocaleString() }} aUEC</p>
        <div class="volume-display" :class="`volume-${commodity.volume}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import weaponVolumes from '@/assets/json/weapon_volumes.json';
import lootableCommodities from '@/assets/json/lootable_commodities.json';

export default {
  name: 'LootablesPricesView',
  props: {
    items: {
      type: Array,
      required: true,
    },
    commodities: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const isCollapsed = ref(true);
    const isCommoditiesCollapsed = ref(true);
    const excludedItems = [
      'Flare',
      'Pistol',
      'Knife',
      'SRT',
      'ParaMed',
      'Multi-Tool',
      'MaxLift',
      'Valor',
      'Prison'
    ];

    const allSellableItems = computed(() => {
      const groupedItems = props.items
        .filter(item =>
          item.price_sell > 0 &&
          item.id_category === 18 &&
          !item.item_name.includes("&quot;") &&
          !excludedItems.some(excluded => item.item_name.includes(excluded))
        )
        .reduce((acc, item) => {
          if (!acc[item.item_name]) {
            acc[item.item_name] = [];
          }
          acc[item.item_name].push(item.price_sell);
          return acc;
        }, {});

      return Object.keys(groupedItems).map(item_name => {
        const prices = groupedItems[item_name].sort((a, b) => a - b);
        const medianPrice = Math.round(prices.length % 2 === 0
          ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
          : prices[Math.floor(prices.length / 2)]);
        const volume = weaponVolumes.find(weapon => weapon.item_name === item_name)?.volume || 'N/A';
        const pricePerVolume = medianPrice / volume;
        return {
          item_name,
          price_sell: medianPrice,
          volume,
          pricePerVolume
        };
      }).sort((a, b) => b.price_sell - a.price_sell);
    });

    const allSellableCommodities = computed(() => {
      const lootableCommodityNames = lootableCommodities.map(commodity => commodity.commodity_name);
      const uniqueCommodities = new Set();

      return props.commodities
        .filter(commodity => commodity.price_sell_avg > 0 && lootableCommodityNames.includes(commodity.commodity_name))
        .filter(commodity => {
          if (uniqueCommodities.has(commodity.commodity_name)) {
            return false;
          } else {
            uniqueCommodities.add(commodity.commodity_name);
            return true;
          }
        })
        .map(commodity => {
          const commodityPrices = props.commodities
            .filter(c => c.commodity_name === commodity.commodity_name && c.price_sell_avg > 0)
            .map(c => c.price_sell_avg)
            .sort((a, b) => a - b);
          const medianPrice = commodityPrices.length > 0 ? Math.round(commodityPrices.length % 2 === 0
            ? (commodityPrices[commodityPrices.length / 2 - 1] + commodityPrices[commodityPrices.length / 2]) / 2
            : commodityPrices[Math.floor(commodityPrices.length / 2)]) : 0;
          return {
            commodity_name: commodity.commodity_name,
            volume: lootableCommodities.find(c => c.commodity_name === commodity.commodity_name)?.volume,
            price_sell_avg: commodity.price_sell_avg,
            illegal: lootableCommodities.find(c => c.commodity_name === commodity.commodity_name)?.illegal,
            medianPrice
          };
        })
        .sort((a, b) => b.price_sell_avg - a.price_sell_avg);
    });

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const toggleCommoditiesCollapse = () => {
      isCommoditiesCollapsed.value = !isCommoditiesCollapsed.value;
    };

    return {
      allSellableItems,
      isCollapsed,
      toggleCollapse,
      allSellableCommodities,
      isCommoditiesCollapsed,
      toggleCommoditiesCollapse
    };
  },
}
</script>

<style scoped lang="scss">
.lootables-price-view {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 1000px;
  margin: 50px auto 20px;
}

h2 {
  text-align: center;
  margin: 0 0 20px;
  cursor: pointer;
}

.collapse-icon {
  display: inline-block;
  transform: rotate(90deg);

  &.is-collapsed {
    transform: rotate(0deg);
  }
}

.item-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px 20px;
}

.item {
  position: relative;
  border: 1px solid #ccc;
  padding: 15px 15px 15px 25px;
  display: flex;
  row-gap: 15px;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    margin: 0;
  }

  p {
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 5px;
    justify-content: space-between;
  }
}

.volume-display {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 15px;
  height: 50%;

  &.volume-low {
    height: 33%;
    background-color: var(--color-red);
  }
  &.volume-high {
    height: 100%;
    background-color: var(--color-green);
  }
}

h3.illegal {
  color: var(--color-red);
}
</style>
