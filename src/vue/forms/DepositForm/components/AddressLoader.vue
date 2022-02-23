<template>
  <div class="address-loader">
    <template v-if="isPending">
      <load-spinner :message-id="'deposit-form.binding-address'" />
    </template>
    <template v-else>
      <template v-if="address && !isExpiredAddress">
        <p class="address-loader__help-message">
          {{ 'deposit-form.where-to' | globalize({ asset: assetCode }) }}
        </p>
        <div class="app__form-field">
          <div class="address-loader__key-viewer-wrp">
            <key-viewer
              :value="address"
              :label="'deposit-form.address-lbl' | globalize"
            />
            <key-viewer
              v-if="payload"
              :value="payload"
              :label="'deposit-form.payload-lbl' | globalize"
              :is-qr-code-shown="false"
            />
          </div>
          <div class="address-loader__address-info-wrp">
            <timeout-ticker
              :end-time="endTime"
              v-if="!formMixin.isConfirmationShown" />
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
              @click="showConfirmation()"
            >
              {{ 'deposit-form.generate-new-address-btn' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || tryBindAddress()"
              @cancel="hideConfirmation()"
            />
          </div>
          <p>
            <strong>
              {{ 'deposit-form.asset-only-prefix' | globalize }}
            </strong>
            {{ 'deposit-form.asset-only' | globalize({ asset: assetCode }) }}
          </p>
        </div>
      </template>
      <template v-else>
        <p>{{ 'deposit-form.no-address' | globalize }}</p>
      </template>
    </template>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import KeyViewer from '@/vue/common/KeyViewer'
import TimeoutTicker from '@/vue/common/TimeoutTicker'
import FormMixin from '@/vue/mixins/form.mixin'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import moment from 'moment'
import _isEmpty from 'lodash/isEmpty'

const EVENTS = {
  ready: 'ready',
}

const DEPOSIT_TYPES = {
  address: 'address',
  addressWithPayload: 'address_with_payload',
}

const TRANSACTION_TIME_MARGIN = 600 // seconds

export default {
  name: 'address-loader',
  components: {
    LoadSpinner,
    KeyViewer,
    TimeoutTicker,
  },
  mixins: [FormMixin],
  props: {
    externalSystemType: { type: [String, Number], required: true },
    assetCode: { type: String, required: true },
  },
  data () {
    return {
      isPending: false,
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountDepositAddresses,
      vuexTypes.accountId,
    ]),
    externalSystemAccount () {
      return Object
        .values(this[vuexTypes.accountDepositAddresses])
        .find(
          item => +item.externalSystemType === +this.externalSystemType,
        ) || {}
    },
    address () {
      if (!_isEmpty(this.externalSystemAccount)) {
        return (typeof this.externalSystemAccount.data === 'string')
          ? this.externalSystemAccount.data
          : this.externalSystemAccount.data.data.address
      } else {
        return ''
      }
    },
    payload () {
      // eslint-disable-next-line max-len
      return (this.externalSystemAccount.data.type === DEPOSIT_TYPES.addressWithPayload)
        ? this.externalSystemAccount.data.data.payload
        : ''
    },
    endTime () {
      const externalSystemId = Object
        .values(this[vuexTypes.accountDepositAddresses])
        .find(
          item => +item.externalSystemType === +this.externalSystemType,
        ) || {}
      return moment(externalSystemId.expiresAt).unix() - TRANSACTION_TIME_MARGIN
    },

    isExpiredAddress () {
      return (this.endTime - moment().unix()) <= 0
    },
  },
  async created () {
    if (!this.address || this.isExpiredAddress) {
      await this.tryBindAddress()
      this.$emit(EVENTS.ready)
    }
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async tryBindAddress () {
      this.isPending = true
      try {
        const operation = base.BindExternalSystemAccountIdBuilder
          .createBindExternalSystemAccountIdOp({
            externalSystemType: +this.externalSystemType,
          })
        await api.postOperations(operation)
        await this.loadAccount(this.accountId)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.address-loader__key-viewer-wrp {
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0 1rem;
  padding: 1.5rem 1rem 1rem;
}

.address-loader__help-message {
  font-size: 1.2rem;
  opacity: 0.7;
}

.address-loader__address-info-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
  height: 4rem;
}
</style>
