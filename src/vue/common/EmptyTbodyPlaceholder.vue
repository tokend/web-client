<template>
  <tbody class="empty-tbody-placeholder">
    <tr
      class="empty-tbody-placeholder__brief"
    >
      <td
        :colspan="colspan"
        class="empty-tbody-placeholder__cell--align-center"
      >
        {{ message }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'empty-tbody-placeholder',
  props: {
    message: {
      type: String,
      default: '',
    },
    colspan: {
      type: Number,
      default: 3,
    },
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.app__table table tbody tr:nth-child(odd).empty-tbody-placeholder__brief,
.app__table table tbody tr:nth-child(odd).empty-tbody-placeholder__brief:hover,
.empty-tbody-placeholder__brief,
.empty-tbody-placeholder__brief:hover {
  background-color: $col-table-alt-row-background;
}

.empty-tbody-placeholder__cell--align-center {
  text-align: center;
}
</style>
