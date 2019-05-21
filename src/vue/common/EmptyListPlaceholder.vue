<template>
  <tbody class="empty-list-placeholder">
    <tr
      class="empty-list-placeholder__brief"
    >
      <td
        :colspan="colspan"
        class="empty-list-placeholder__cell--align-center"
      >
        {{ message }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'empty-list-placeholder',
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

.empty-list-placeholder__brief {
  background-color: $col-block-bg;

  @include box-shadow;
}

.empty-list-placeholder__cell--align-center {
  text-align: center;
}
</style>
