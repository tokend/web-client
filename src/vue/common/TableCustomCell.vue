<template>
  <td class="table-custom__cell">
    <div class="table-custom__cell-container">
      <slot />
    </div>
  </td>
</template>

<script>
export default {
  name: 'table-custom-cell'
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables";

.table-custom__cell {
  height: 4 * $point;
  position: relative;
  transition: .3s;
  font-size: 1.4 * $point;
  line-height: 1.8 * $point;
  color: $col-table-cell-text;
}

.table-custom__cell-container {
  padding: .6 * $point 1.6 * $point;
}
</style>
