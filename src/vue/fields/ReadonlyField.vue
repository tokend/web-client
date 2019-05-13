<template>
  <div
    class="readonly-field"
  >
    <span class="readonly-field__label">
      {{ label }}
    </span>
    <span class="readonly-field__value">
      {{ value }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'readonly-field',
  props: {
    label: { type: String, default: 'Label' },
    value: { type: String, default: undefined },
  },
}
</script>

<style scoped lang="scss">
.readonly-field {
  width: 100%;
  font-size: 1.4rem;
  display: flex;
  justify-content: space-between;
}
</style>
