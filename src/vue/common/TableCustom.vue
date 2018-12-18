<template>
  <div class="table-custom">
    <div class="table-custom__content">
      <table>
        <thead>
          <slot name="header" />
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-custom'
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables";

.table-custom {
  display: flex;
  flex-flow: column wrap;
  overflow-x: auto;
  box-shadow: 0 0.6 * $point $point 0 $col-table-shadow;

  .table-custom__content {
    flex: 1;
    overflow-x: auto;
    transition: height .3s;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    overflow: hidden;
    background-color: $col-table-background;

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: $col-table-alt-row-background;;
        }

        &:hover {
          background-color: $col-table-row-selected;
        }
      }
    }
  }
}
</style>
