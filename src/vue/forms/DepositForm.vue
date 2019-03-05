<template>
  <div class="deposit">
    <template v-if="isLoaded">
      <template v-if="selectedAsset.code">
        <div class="deposit__help-message-wrp">
          <p class="deposit__help-message">
            {{ 'deposit-form.how-to' | globalize }}
          </p>
        </div>

        <div class="deposit__asset-select-wrp">
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                v-model="selectedAsset"
                :values="assets"
                key-as-value-text="nameAndCode"
                :label="'deposit-form.asset' | globalize"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>
        </div>

        <template v-for="item in assets">
          <coinpayments
            v-if="item === selectedAsset && item.isCoinpayments"
            :asset="item"
            :balance-details="balanceDetails"
            :wallet="wallet"
            :account-id="accountId"
            :config="config"
            :key="item.code"
          />
          <address-loader
            @ready="enableForm()"
            :key="item.code"
            v-if="item === selectedAsset && !item.isCoinpayments"
            :asset-code="selectedAsset.code"
            :external-system-type="selectedAsset.externalSystemType"
          />
        </template>
      </template>

      <template v-else>
        <h2 class="app__page-heading">
          {{ 'deposit-form.no-assets-heading' | globalize }}
        </h2>
        <p>
          {{ 'deposit-form.deposit-no-assets' | globalize }}
        </p>
        <router-link
          to="/tokens"
          tag="button"
          class="app__button-raised deposit__discover-asset-btn">
          {{ 'deposit-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>
    </template>

    <template v-else-if="isLoadingFailed">
      {{ 'deposit-form.can-not-load-assets' | globalize }}
    </template>

    <template v-else>
      <loader message-id="deposit-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import AddressLoader from './DepositForm/AddressLoader'
import Coinpayments from '@modules/coinpayments'

import FormMixin from '@/vue/mixins/form.mixin'

import config from '@/config'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
export default {
  name: 'deposit-form',
  components: {
    Loader,
    AddressLoader,
    Coinpayments,
  },
  mixins: [FormMixin],
  props: {
  },
  data () {
    return {
      config: {
        horizonURL: config.HORIZON_SERVER,
      },
      isLoaded: false,
      isLoadingFailed: false,
      assets: [],
      selectedAsset: {},
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.account,
      vuexTypes.wallet,
    ]),
    balanceDetails () {
      return this.account.balances.find(item => {
        return item.asset.id === this.selectedAsset.code
      })
    },
  },
  watch: {
    'selectedAsset.code' () {
      this.disableForm()
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.account
        .getDetails(this.accountId)
      this.assets = assets
        .map(item => new AssetRecord(item.assetDetails))
        .filter(item => item.isDepositable)
      if (this.assets.length) {
        this.selectedAsset = this.assets[0]
      }
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
      this.isLoadingFailed = true
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .deposit__help-message {
    font-size: 1.2rem;
    opacity: 0.7;
    line-height: 1.25;
  }

  .deposit__discover-asset-btn {
    margin-top: 2.5rem;
  }

  .deposit__help-message-wrp,
  .deposit__asset-select-wrp {
    margin-bottom: 2.5rem;
  }
</style>
