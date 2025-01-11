<template>
  <div>
    <nav>
      <button @click="currentView = 'ShoppingView'">Shopping View</button>
      <button @click="currentView = 'CargoMissionView'">Cargo Mission View</button>
    </nav>
    <section v-if="currentView === 'ShoppingView'">
      <ShoppingView />
    </section>
    <section v-if="currentView === 'CargoMissionView'">
      <CargoMissionView />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ShoppingView from '@/views/ShoppingView.vue';
import CargoMissionView from '@/views/CargoMissionView.vue';

const currentView = ref('ShoppingView');
</script>

<style lang="scss">
:root {
  --color-black: #000;
  --color-white: #fff;
  --color-darkgray: #282828;
  --color-lightgray: #f0f0f0;
  --color-red: #da2128;
}

body {
  position: relative;
  width: calc(100vw - 20px);
  max-width: 1920px;
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
</style>
