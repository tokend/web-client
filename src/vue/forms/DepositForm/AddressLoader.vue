<template>
  <div class="address-loader">
    <template v-if="isPending">
      <load-spinner :message-id="'deposit-form.binding-address'" />
    </template>
    <template v-else>
      <template v-if="address">
        <p class="address-loader__help-message">
          {{ 'deposit-form.where-to' | globalize({ asset: assetCode }) }}
        </p>
        <div class="app__form-row">
          <div class="address-loader__key-viewer-wrp">
            <key-viewer :value="address" />
          </div>
          <p>
            <strong>
              {{ 'deposit-form.asset-only-prefix' | globalize }}
            </strong>
            <!-- eslint-disable-next-line max-len -->
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

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'

const EVENTS = {
  ready: 'ready',
}

export default {
  name: 'address-loader',
  components: {
    LoadSpinner,
    KeyViewer,
  },
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
      vuexTypes.account,
      vuexTypes.accountDepositAddresses,
    ]),
    address () {
      const externalSystemAccount = Object
        .values(this[vuexTypes.accountDepositAddresses])
        .find(
          item => +item.externalSystemType === +this.externalSystemType
        ) || {}

      return externalSystemAccount.data
    },
  },
  async created () {
    this.isPending = true
    await this.tryBindAddress()
    this.isPending = false
    this.$emit(EVENTS.ready)
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async tryBindAddress () {
      try {
        const operation = Sdk.base.BindExternalSystemAccountIdBuilder
          .createBindExternalSystemAccountIdOp({
            externalSystemType: +this.externalSystemType,
          })
        await Sdk.horizon.transactions
          .submitOperations(operation)
        await this.loadAccount()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .address-loader__key-viewer-wrp {
    border: solid 0.1rem $col-form-stepper-tab-border;
    border-radius: 0.2rem;
    margin: 0.5rem 0 1rem 0;
    padding: 1.5rem 1rem 1rem 1rem;
  }

  .address-loader__help-message {
    font-size: 1.2rem;
    opacity: 0.7;
  }
</style>
