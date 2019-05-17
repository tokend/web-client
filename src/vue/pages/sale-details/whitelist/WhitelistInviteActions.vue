<template>
  <div class="whitelist-invite-actions">
    <template v-if="isConfirmationShown">
      <button
        class="app__button-raised whitelist-invite-actions__btn"
        @click="removeInvite"
        :disabled="isInviteRemoving"
      >
        <template v-if="isInviteRemoving">
          {{ 'sale-whitelist.processing-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'sale-whitelist.confirm-btn' | globalize }}
        </template>
      </button>

      <button
        class="app__button-flat whitelist-invite-actions__btn"
        @click="isConfirmationShown = false"
        :disabled="isInviteRemoving"
      >
        {{ 'sale-whitelist.cancel-btn' | globalize }}
      </button>
    </template>

    <template v-else>
      <button
        class="app__button-raised whitelist-invite-actions__btn"
        @click="isConfirmationShown = true"
      >
        {{ 'sale-whitelist.remove-btn' | globalize }}
      </button>
    </template>
  </div>
</template>

<script>
import { SaleRecord } from '@/js/records/entities/sale.record'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  inviteRemoved: 'invite-removed',
}

export default {
  name: 'whitelist-invite-actions',

  props: {
    sale: { type: SaleRecord, required: true },
    invite: { type: Object, required: true },
  },

  data: _ => ({
    isConfirmationShown: false,
    isInviteRemoving: false,
    EVENTS,
  }),

  methods: {
    async removeInvite (invite) {
      this.isInviteRemoving = true
      try {
        await api.deleteWithSignature('/invites', {
          data: [{
            type: 'whitelist-invite',
            id: this.invite.id,
          }],
        })
        Bus.success('sale-whitelist.invite-removed-msg')
        this.$emit(EVENTS.inviteRemoved)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isInviteRemoving = false
      this.isConfirmationShown = false
    },
  },
}
</script>

<style lang="scss" scoped>
.whitelist-invite-actions {
  display: flex;
  justify-content: flex-end;
  margin: 0 -0.6rem;
}

.whitelist-invite-actions__btn {
  margin: 0 0.6rem;
}
</style>
