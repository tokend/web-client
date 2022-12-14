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
        {{ accountId || abbrCenter(balanceId) }}
      </template>

      <template v-else>
        &mdash;
      </template>
    </span>

    <tooltip
      :show="isCopiedTooltipShown"
      :message="'email-getter.copied' | globalize"
    >
      <button
        v-show="isCopyButton && !isMasterAccount && !isLoading"
        class="email-getter__copy-button  app__button-icon"
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
    </tooltip>
  </span>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { defineComponent } from 'vue'
import { abbrCenter } from '@/js/helpers/text-helper'
import Clipboard from 'clipboard'
import Tooltip from '@/vue/common/Tooltip'

import safeGet from 'lodash/get'

export default defineComponent({
  components: {
    Tooltip,
  },
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
    isCopiedTooltipShown: false,
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

      if (this.accountId === api.networkDetails.adminAccountId) {
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
        const { data } = await api.get(`/v3/balances/${this.balanceId}`)
        return safeGet(data, 'owner.id')
      } else {
        return ''
      }
    },

    changeBtnIcon () {
      this.isCopyBtnPressed = true
      this.showCopiedTooltip()
      setTimeout(() => { this.isCopyBtnPressed = false }, 1000)
    },

    showCopiedTooltip () {
      let hideTooltipTimeout = 2000
      this.isCopiedTooltipShown = true
      setTimeout(() => {
        this.isCopiedTooltipShown = false
      }, hideTooltipTimeout)
    },
  },
  setup () {
    return {
      abbrCenter,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.email-getter {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
}

.email-getter--justify-end {
  justify-content: flex-end;
}

.email-getter__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-getter__copy-button {
  color: $col-primary-inactive;
  margin-left: 0.5rem;
  min-height: 1rem;
  min-width: 1rem;
  transition: 0.1s ease-out;
  padding: 0;

  &:hover {
    color: $col-primary-inactive-hover-darken;
    background: none;
  }
}

.email-getter__icon {
  &:before {
    vertical-align: middle;
  }
}
</style>
