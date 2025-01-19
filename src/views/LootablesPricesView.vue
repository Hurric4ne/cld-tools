<template>
  <h1 class="section-title">Prices of lootables Items</h1>
  <div class="lootables-price-view">
    <h2 @click="toggleCollapse">FPS Weapons</h2>
    <div class="item-list" v-show="!isCollapsed">
      <div class="item" v-for="item in allSellableItems" :key="item.id">
        <h3>{{ item.item_name }}</h3>
        <p class="item-prices">Median Price: {{ item.price_sell.toLocaleString() }} aUEC<br/>
        Volume: {{ item.volume.toLocaleString() }} &micro;SCU</p>
        <p>Price per Volume: {{ item.pricePerVolume.toLocaleString() }}</p>
      </div>
    </div>
  </div>
  <div class="lootables-price-view">
    <h2 @click="toggleCommoditiesCollapse">Commodities</h2>
    <div class="item-list" v-show="!isCommoditiesCollapsed">
      <div class="item" v-for="commodity in allSellableCommodities" :key="commodity.commodity_name">
        <h3 :class="{ 'illegal': commodity.illegal }" :title="commodity.illegal ? 'Illegal Commodity' : ''">{{ commodity.commodity_name }}</h3>
        <p class="item-prices">Price: {{ commodity.price_sell.toLocaleString() }} aUEC</p>
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
          !item.item_name.includes("'") &&
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
        const medianPrice = prices.length % 2 === 0
          ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
          : prices[Math.floor(prices.length / 2)];
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
      const lootableCommodityNames = lootableCommodities.map(commodity => commodity.item_name);
      const uniqueCommodities = new Set();
      return props.commodities
        .filter(commodity => commodity.price_sell > 0 && lootableCommodityNames.includes(commodity.commodity_name))
        .filter(commodity => {
          if (uniqueCommodities.has(commodity.commodity_name)) {
            return false;
          } else {
            uniqueCommodities.add(commodity.commodity_name);
            return true;
          }
        })
        .map(commodity => ({
          commodity_name: commodity.commodity_name,
          price_sell: commodity.price_sell,
          illegal: lootableCommodities.find(c => c.item_name === commodity.commodity_name)?.illegal
        }))
        .sort((a, b) => b.price_sell - a.price_sell);
    });

    console.log(allSellableCommodities.value);


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

<style scoped>
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

.item-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
}

h3.illegal {
  color: var(--color-red);
}
</style>
