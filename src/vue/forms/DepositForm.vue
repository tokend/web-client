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
              v-if="assetCode.value === selectedBalance.asset"
              :asset-code="selectedBalance.asset"
              :external-system-type="selectedBalance.assetDetails
                .details.externalSystemType"
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
          class="app__button-raised deposit__action-margin">
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
      balances: [],
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
      return this.balances.map(item => {
        return {
          label: `${item.assetDetails.details.name} (${item.asset})`,
          value: item.asset,
        }
      })
    },
    selectedBalance () {
      return this.balances
        .find(item => item.asset === this.form.assetCode) || null
    },
  },
  watch: {
    'form.assetCode' () {
      this.disableForm()
    },
  },
  async created () {
    try {
      const { data: balances } = await Sdk.horizon.account
        .getDetails(this.accountId)
      this.balances = balances.filter(item => {
        return !!item.assetDetails.details.externalSystemType
      })
      this.form.assetCode = this.balances[0] ? this.balances[0].asset : null
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

  .deposit__action-margin {
    margin-top: 2.5rem;
  }

  .deposit__margin {
    margin-bottom: 2.5rem;
  }
</style>
