<template>
  <tr class="table-custom__row">
    <slot />
  </tr>
</template>

<script>
export default {
  name: 'table-custom-row'
}
</script>

<style lang="scss" scoped>
.table-custom__row {
  transition: .3s;
  transition-property: background-color;
  will-change: background-color;
}
</style>
