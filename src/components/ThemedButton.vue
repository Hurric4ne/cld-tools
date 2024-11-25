<template>
  <button
    :class="['themed-button', { 'is-full-width': fullWidth }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ThemedButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    },
  },
}
</script>

<style lang="scss">
.themed-button {
  background-color: var(--color-red);
  color: var(--color-white);
  letter-spacing: 1px;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;

  &:not(:disabled):hover,
  &:not(:disabled):active {
    color: var(--color-darkgray);
  }

  &:disabled {
    filter: grayscale(50%);
    cursor: not-allowed;
  }

  &.is-full-width {
    width: 100%;
  }
}
</style>
