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

.empty-tbody-placeholder__brief {
  background-color: $col-block-bg;

  @include box-shadow;
}

.empty-tbody-placeholder__cell--align-center {
  text-align: center;
}
</style>
