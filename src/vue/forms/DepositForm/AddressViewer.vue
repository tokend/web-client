<template>
  <div class="address-viewer">
    <template v-if="isPending">
      <div class="address-viewer__address-loader">
        <loader />
        <p>
          {{ 'deposit-form.binding-address' | globalize }}
        </p>
      </div>
    </template>
    <template v-else>
      <template v-if="address">
        <p class="address-viewer__help">
          {{ 'deposit-form.where-to' | globalize({ asset: balance.asset }) }}
        </p>
        <div class="app__form-row">
          <div class="address-viewer__address-info">
            <key-viewer :value="address" />
          </div>
          <p>
            <strong>
              {{ 'deposit-form.asset-only-prefix' | globalize }}
            </strong>
            <!-- eslint-disable-next-line max-len -->
            {{ 'deposit-form.asset-only' | globalize({ asset: balance.asset }) }}
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
import Loader from '@/vue/common/Loader'
import KeyViewer from '@/vue/common/KeyViewer'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  loaded: 'data-loaded',
}

export default {
  name: 'address-viewer',
  components: {
    Loader,
    KeyViewer,
  },
  props: {
    balance: { type: Object, required: true },
  },
  data () {
    return {
      isPending: false,
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.account,
    ]),
    address () {
      const externalSystemType = this.balance
        .assetDetails.details.externalSystemType
      const externalSystemAccount = this.account.externalSystemAccounts
        .find(item => +item.type.value === +externalSystemType) || {}
      return externalSystemAccount.data
    },
  },
  async created () {
    this.isPending = true
    await this.tryBindAddress(this.balance)
    this.isPending = false
    this.$emit(EVENTS.loaded)
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async tryBindAddress (balance) {
      if (!balance.assetDetails.details.externalSystemType) return
      try {
        const operation = Sdk.base.BindExternalSystemAccountIdBuilder
          .createBindExternalSystemAccountIdOp({
            externalSystemType: +balance.assetDetails.details
              .externalSystemType,
          })
        await Sdk.horizon.transactions
          .submitOperations(operation)
        await this.loadAccount()
      } catch (e) {
        Bus.error('deposit-form.no-address')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .address-viewer__address-loader {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .address-viewer__address-info {
    border: solid 0.1rem $col-form-stepper-tab-border;
    border-radius: 0.2rem;
    margin: 0.5rem 0 1rem 0;
    padding: 1.5rem 1rem 1rem 1rem;
  }

  .address-viewer__help {
    font-size: 1.2rem;
    opacity: 0.7;
  }
</style>
