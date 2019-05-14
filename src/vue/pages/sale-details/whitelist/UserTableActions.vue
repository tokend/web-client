<template>
  <div class="user-table-actions">
    <template v-if="isConfirmationShown">
      <button
        class="app__button-raised user-table-actions__btn"
        @click="$emit(EVENTS.removeClick)"
      >
        Confirm
      </button>

      <button
        class="app__button-flat user-table-actions__btn"
        @click="isConfirmationShown = false"
      >
        Cancel
      </button>
    </template>

    <template v-else>
      <button
        class="app__button-raised user-table-actions__btn"
        @click="isConfirmationShown = true"
      >
        Remove
      </button>
    </template>
  </div>
</template>

<script>
const EVENTS = {
  removeClick: 'remove-click',
}

export default {
  name: 'user-table-actions',

  data: _ => ({
    isConfirmationShown: false,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.user-table-actions {
  display: flex;
  justify-content: flex-end;
  margin: 0 -0.6rem;
}

.user-table-actions__btn {
  margin: 0 0.6rem;
}
</style>
