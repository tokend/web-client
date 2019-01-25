<template>
  <div class="deposit">
    <template v-if="isLoaded && !isError">
      <template v-if="form.tokenCode">
        <div class="app__form-row deposit__form-row">
          <p class="deposit__help">
            {{ 'deposit-form.how-to' | globalize }}
          </p>
        </div>
        <form
          @submit.prevent="isConfirmationShown = true"
        >
          <div class="app__form-row deposit__form-row">
            <div class="app__form-field">
              <select-field
                :values="tokenCodes"
                v-model="form.tokenCode"
                :label="'withdrawal-form.asset' | globalize"
              />
            </div>
          </div>
          <template v-if="address">
            <p class="deposit__help">
              <!-- eslint-disable-next-line max-len -->
              {{ 'deposit-form.where-to' | globalize({ asset: form.tokenCode }) }}
            </p>
            <div class="app__form-row deposit__form-row">
              <div class="deposit__address-info">
                <vue-q-r-code-component
                  class="deposit__qr-code"
                  :text="address"
                  :size="130"
                  color="#3f4244"
                />
                <clipboard-field
                  :id="address"
                  :value="address"
                  :monospaced="true"
                />
              </div>
              <p>
                <strong>
                  {{ 'deposit-form.asset-only-prefix' | globalize }}
                </strong>
                <!-- eslint-disable-next-line max-len -->
                {{ 'deposit-form.asset-only' | globalize({ asset: form.tokenCode }) }}
              </p>
            </div>
          </template>
          <template v-else-if="isPending">
            <div class="deposit__address-loader">
              <loader />
              <p>
                {{ 'deposit-form.binding-address' | globalize }}
              </p>
            </div>
          </template>
          <template v-else>
            <p>{{ 'deposit-form.no-address' | globalize }}</p>
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
    <loader v-if="!isLoaded" />
    <template v-if="isError">
      Error
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import ClipboardField from '@/vue/fields/ClipboardField'

import FormMixin from '@/vue/mixins/form.mixin'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
// import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import VueQRCodeComponent from 'vue-qrcode-component'
export default {
  name: 'trade-orders-buy',
  components: {
    Loader,
    VueQRCodeComponent,
    ClipboardField,
  },
  mixins: [FormMixin],
  props: {
  },
  data () {
    return {
      isLoaded: false,
      isError: false,
      balances: [],
      form: {
        tokenCode: null,
      },
      isPending: false,
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
    ]),
    tokenCodes () {
      return this.balances.map(item => {
        return {
          label: `${item.assetDetails.details.name} (${item.asset})`,
          value: item.asset,
        }
      })
    },
    selectedToken () {
      return this.balances
        .find(item => item.asset === this.form.tokenCode) || null
    },
    address () {
      if (!this.selectedToken) return ''
      const externalSystemType = this.selectedToken
        .assetDetails.details.externalSystemType
      const externalSystemAccount = this.account.externalSystemAccounts
        .find(item => +item.type.value === +externalSystemType) || {}
      return externalSystemAccount.data
    },
  },
  watch: {
    'form.tokenCode' () {
      if (!this.address && this.selectedToken) {
        this.tryBindAddress(this.selectedToken)
      }
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.account
        .getDetails(this.accountId)
      this.balances = assets.filter(item => {
        return !!item.assetDetails.details.externalSystemType
      })
      this.form.tokenCode = this.tokenCodes[0].value || null
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.process(e)
      this.isError = true
      this.isLoaded = true
    }
  },
  destroyed () {
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async tryBindAddress (token) {
      if (!token || !token.assetDetails.details.externalSystemType) return
      if (!token) return
      this.isPending = true
      try {
        const operation = Sdk.base.BindExternalSystemAccountIdBuilder
          .createBindExternalSystemAccountIdOp({
            externalSystemType: +token.assetDetails.details.externalSystemType,
          })
        await Sdk.horizon.transactions
          .submitOperations(operation)
        await this.loadAccount()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .deposit__help {
    font-size: 1.2rem;
    opacity: 0.7;
  }

  .deposit__action-margin {
    margin-top: 2.5rem;
  }

  .deposit__form-row {
    margin-bottom: 2.5rem;
  }

  .deposit__address-loader {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .deposit__address-info {
    border: solid 1px $col-form-stepper-tab-border;
    border-radius: 2px;
    margin: 0.5rem 0 1rem 0;
    padding: 1.5rem 1rem 1rem 1rem;
  }

  .deposit__qr-code {
    width: 130px;
    overflow: visible;
    margin: 0 auto;
  }
</style>
