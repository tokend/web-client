<template>
  <tbody class="user-movements-empty-list-placeholder">
    <tr
      class="user-movements-empty-list-placeholder__brief
             user-movements-empty-list-placeholder__no-data"
    >
      <td
        colspan="5"
        class="user-movements-empty-list-placeholder__cell--align-center"
      >
        {{ 'user-movements-history.no-movements-msg' | globalize }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'user-movements-empty-list-placeholder',
}
</script>

<style scoped lang="scss">
  @import '~@scss/mixins';
  @import '~@scss/variables';
  @import '../scss/variables';

  .user-movements-empty-list-placeholder__brief {
    background-color: $col-block-bg;
  }

  .user-movements-empty-list-placeholder__no-data {
    height: 5.1rem;
  }

  .user-movements-empty-list-placeholder__cell--align-center {
    text-align: center;
  }
</style>
