<template>
  <span
    class="email-getter"
    :class="{ 'email-getter--justify-end': rightSide }"
  >
    <span
      class="email-getter__value"
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

    <button
      v-show="isCopyButton && !isMasterAccount && !isLoading"
      class="email-getter__copy-button"
      :id="`clipboard-btn-${_uid}`"
      :data-clipboard-text="email || accountId || balanceId"
      @click="changeBtnIcon"
    >
      <i
        class="mdi email-getter__icon"
        :class="isCopyBtnPressed ?
          'mdi-clipboard-check' :
          'mdi-clipboard-text'"
      />
    </button>
  </span>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { Api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import Clipboard from 'clipboard'

import safeGet from 'lodash/get'

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
    isCopyBtnPressed: false,
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

  // TODO: Add "Copied!!" tooltip when the tooltip directive ready
  mounted () {
    const btn = document.querySelector(
      `#clipboard-btn-${this._uid}`
    )
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },

  methods: {
    async init () {
      this.isMasterAccount = false

      if (this.accountId === Api.networkDetails.adminAccountId) {
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
        const { data } = await Api.get(`/v3/balances/${this.balanceId}`)
        return safeGet(data, 'owner.id')
      } else {
        return ''
      }
    },

    changeBtnIcon () {
      this.isCopyBtnPressed = true
      setTimeout(() => { this.isCopyBtnPressed = false }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";
  .email-getter {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &--justify-end {
      justify-content: flex-end;
    }

    &__value {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__copy-button {
      @include button-icon();
      color: $col-primary-inactive;
      margin-left: .5rem;
      min-height: 1rem;
      min-width: 1rem;
      transition: .1s ease-out;
      padding: 0;

      &:hover {
        color: darken($col-primary-inactive, 20%);
        background: none;
      }
    }

    &__icon {
      &::before {
        vertical-align: middle;
      }
    }
  }
</style>
