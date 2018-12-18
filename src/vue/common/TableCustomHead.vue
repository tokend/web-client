<template>
  <th class="table-custom__head">
    <div class="table-custom__head-container" v-if="$slots.default">
      <div class="table-custom__head-label">
        <slot />
      </div>
    </div>
  </th>
</template>

<script>
export default {
  name: 'table-custom-head'
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables";

.table-custom__head {
  padding: 0;
  position: relative;
  font-size: 1.2 * $point;
  line-height: 1.6 * $point;
  text-align: left;
}

.table-custom__head-container {
  height: 4.2 * $point;
  padding-top: 1.6 * $point;
  padding-bottom: 1.1 * $point;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-custom__head-label {
  height: 1.5 * $point;
  color: $col-table-head-text;
  padding: 0 1.6 * $point;
  display: inline-block;
  position: relative;
  overflow: hidden;
  font-size: 1.2 * $point;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
