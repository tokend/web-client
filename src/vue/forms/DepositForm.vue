<template>
  <div class="deposit">
    <template v-if="isLoaded">
      <template v-if="form.assetCode">
        <div class="deposit__margin">
          <p class="deposit__help-message">
            {{ 'deposit-form.how-to' | globalize }}
          </p>
        </div>
        <form>
          <div class="app__form-row deposit__margin">
            <div class="app__form-field">
              <select-field
                :values="assetCodes"
                v-model="form.assetCode"
                :label="'deposit-form.asset' | globalize"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>
          <template v-for="assetCode in assetCodes">
            <address-loader
              @ready="enableForm()"
              :key="assetCode.value"
              v-if="assetCode.value === selectedAsset.code"
              :asset-code="selectedAsset.code"
              :external-system-type="selectedAsset.externalSystemType"
            />
          </template>
        </form>
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
          class="app__button-raised deposit__action">
          {{ 'deposit-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>
    </template>
    <loader v-else />
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import AddressLoader from './DepositForm/AddressLoader'

import FormMixin from '@/vue/mixins/form.mixin'

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
  },
  mixins: [FormMixin],
  props: {
  },
  data () {
    return {
      isLoaded: false,
      assets: [],
      form: {
        assetCode: null,
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    assetCodes () {
      return this.assets.map(item => {
        return {
          label: `${item.name} (${item.code})`,
          value: item.code,
        }
      })
    },
    selectedAsset () {
      return this.assets
        .find(item => item.code === this.form.assetCode) || null
    },
  },
  watch: {
    'form.assetCode' () {
      this.disableForm()
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.account
        .getDetails(this.accountId)
      this.assets = assets
        .map(item => new AssetRecord(item.assetDetails))
        .filter(item => {
          return item.isDepositable
        })
      this.form.assetCode = this.assets[0] ? this.assets[0].code : null
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.process(e)
      this.isLoaded = true
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .deposit__help-message {
    font-size: 1.2rem;
    opacity: 0.7;
  }

  .deposit__action {
      margin-top: 2.5rem;
  }

  .deposit__margin {
    margin-bottom: 2.5rem;
  }
</style>
