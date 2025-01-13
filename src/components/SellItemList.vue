<template>
  <div class="sellitem-list">
    <h3>Sell Item List</h3>
    <div class="item-list">
      <div class="item" v-for="item in allSellableItems" :key="item.id">
        <h4><strong>{{ item.item_name }}</strong></h4>
        <p class="item-prices">Median: {{ item.price_sell.toLocaleString() }} aUEC <br/>
        Min: {{ item.min_price.toLocaleString() }} aUEC <br/>
        Max: {{ item.max_price.toLocaleString() }} aUEC</p>
      </div>
      </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'SellItemList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const allSellableItems = computed(() => {
      const groupedItems = props.items
        .filter(item => item.price_sell > 0 && item.id_category === 18 && !item.item_name.includes("'") && !item.item_name.includes("\"") && !item.item_name.includes("‘"))
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
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        return {
          item_name,
          price_sell: medianPrice,
          min_price: minPrice,
          max_price: maxPrice,
        };
      }).sort((a, b) => b.price_sell - a.price_sell);
    });

    return {
      allSellableItems,
    };
  },
}
</script>

<style scoped>
.sellitem-list {
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

.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 5px;
}
</style>
