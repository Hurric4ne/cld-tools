<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
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
  font-family: 'Orbitron', serif;
  font-optical-sizing: auto;
  letter-spacing: 1px;
  font-weight: 400;
  font-style: normal;
  background-color: var(--color-darkgray);
  color: var(--color-white);
}
</style>
