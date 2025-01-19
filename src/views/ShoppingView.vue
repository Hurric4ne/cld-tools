<template>
  <div>
    <!-- Title -->
    <h1 class="section-title">Shopping-List</h1>

    <!-- Loader -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>

    <!-- Content (only shown after data is loaded) -->
    <div v-else>
      <ItemSearchList :items="items" />
      <UserTerminalList :terminals="terminals" :items="items" />
      <TerminalList :terminals="terminals" :items="items" />
    </div>
  </div>
</template>

<script>
import ItemSearchList from '@/components/ItemSearchList.vue';
import TerminalList from '@/components/TerminalList.vue';
import UserTerminalList from '@/components/UserTerminalList.vue';

export default {
  components: {
    ItemSearchList,
    UserTerminalList,
    TerminalList,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    terminals: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
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
