<template>
  <span
    class="email-getter__wrapper"
    :class="{ 'justify-end': rightSide }"
  >
    <span
      class="email-getter"
      :title="isTitled && (email || accountId || balanceId)"
    >
      <template v-if="isMasterAccount">
        {{ 'email-getter.master-account' | globalize }}
      </template>

      <template v-else-if="isLoading">
        {{ 'email-getter.loading-msg' | globalize }}
      </template>

      <template v-else-if="email">
        {{ email }}
      </template>

      <template v-else-if="accountId || balanceId">
        {{ accountId || balanceId | cropAddress }}
      </template>

      <template v-else>
        &mdash;
      </template>
    </span>

    <i
      v-if="isCopyButton && !isMasterAccount && !isLoading"
      class="mdi mdi-content-copy copy-button"
      @click="copyToClipboard(email || accountId || balanceId)"
    />
  </span>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  mixins: [IdentityGetterMixin],

  props: {
    accountId: {
      type: String,
      default: '',
    },
    balanceId: {
      type: String,
      default: '',
    },
    isTitled: {
      type: Boolean,
      default: true,
    },
    isCopyButton: {
      type: Boolean,
      default: true,
    },
    rightSide: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    email: '',
    isMasterAccount: false,
    isLoading: false,
  }),

  watch: {
    accountId: async function () {
      await this.init()
    },

    balanceId: async function () {
      await this.init()
    },
  },

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      this.isMasterAccount = false

      if (this.accountId === Sdk.networkDetails.adminAccountId) {
        this.isMasterAccount = true
        return
      }

      if (this.accountId || this.balanceId) {
        this.isLoading = true
        await this.loadEmail()
        this.isLoading = false
      }
    },

    async loadEmail () {
      try {
        const accountId = await this.getAccountId()
        this.email = await this.getEmailByAccountId(accountId)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    async getAccountId () {
      if (this.accountId) {
        return this.accountId
      } else if (this.balanceId) {
        const { data } = await Sdk.horizon.balances.getAccount(this.balanceId)
        return data.accountId
      } else {
        return ''
      }
    },

    async copyToClipboard (data) {
      try {
        await navigator.clipboard.writeText(data)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";
  .email-getter__wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .email-getter {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .copy-button {
    @include button-icon();
    color: $col-primary-inactive;
    font-size: 1.3rem;
    margin-left: .5rem;
    min-height: unset;
    min-width: unset;
    padding: .5rem .6rem;

    &::before {
      vertical-align: middle;
    }

    &:hover {
      background-color: $col-primary-flat-hover;
    }

    &:active {
      background-color: darken($col-primary-flat-hover, 30%);
    }
  }

  .justify-end {
    justify-content: flex-end;

    .copy-button {
      margin-right: -.6rem;
    }
  }
</style>
