<template>
  <div class="whitelist-table-actions">
    <template v-if="isConfirmationShown">
      <button
        class="app__button-raised whitelist-table-actions__btn"
        @click="$emit(EVENTS.removeClick)"
      >
        {{ 'sale-whitelist.confirm-btn' | globalize }}
      </button>

      <button
        class="app__button-flat whitelist-table-actions__btn"
        @click="isConfirmationShown = false"
      >
        {{ 'sale-whitelist.cancel-btn' | globalize }}
      </button>
    </template>

    <template v-else>
      <button
        class="app__button-raised whitelist-table-actions__btn"
        @click="isConfirmationShown = true"
      >
        {{ 'sale-whitelist.remove-btn' | globalize }}
      </button>
    </template>
  </div>
</template>

<script>
const EVENTS = {
  removeClick: 'remove-click',
}

export default {
  name: 'whitelist-table-actions',

  data: _ => ({
    isConfirmationShown: false,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.whitelist-table-actions {
  display: flex;
  justify-content: flex-end;
  margin: 0 -0.6rem;
}

.whitelist-table-actions__btn {
  margin: 0 0.6rem;
}
</style>
