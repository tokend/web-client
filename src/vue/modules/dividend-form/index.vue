<template>
  <div class="dividend">
    <template v-if="isLoaded">
      <template v-if="ownedAssets.length">
        <form
          @submit.prevent="showConfirmation()"
          id="dividend-form"
          novalidate
        >
          <div class="app__form-row dividend__form-row">
            <div class="app__form-field">
              <select-field
                name="dividend-asset"
                v-model="asset"
                :values="ownedAssets"
                key-as-value-text="code"
                :disabled="formMixin.isDisabled"
                :label="'dividend-form.asset' | globalize"
              />
            </div>
          </div>

          <div class="app__form-row dividend__form-row">
            <table class="dividend__fee-table">
              <thead class="dividend__fee-thead">
                <tr>
                  <td>
                    {{ 'dividend-form.email' | globalize }}
                  </td>
                  <td>
                    {{ 'dividend-form.token-amount' | globalize }}
                  </td>
                  <td>
                    {{ 'dividend-form.supposed-dividend-amount' | globalize }}
                  </td>
                </tr>
              </thead>
              <tbody
                class="dividend__fee-tbody"
                :class="{ 'dividend__data--loading': isSignersLoadPending }"
                v-if="tokenHolders.length && isSignersLoaded"
              >
                <tr v-for="issuance in tokenHolders" :key="issuance.accountId">
                  <td>
                    <email-getter :account-id="issuance.accountId" />
                  </td>
                  <td>
                    {{ 'dividend-form.token-amount' | globalize }}
                  </td>
                  <td>
                    {{ 'dividend-form.supposed-dividend-amount' | globalize }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="app__form-actions dividend__action">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
              form="dividend-form"
            >
              {{ 'dividend-form.dividend-btn' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
      <template v-else>
        <h2 class="app__page-heading">
          {{ 'dividend-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'dividend-form.no-assets' | globalize }}
        </p>
        <router-link
          to="/tokens"
          tag="button"
          class="app__button-raised dividend__action"
        >
          {{ 'dividend-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>
    </template>
    <template v-else-if="isFailed">
      {{ 'dividend-form.can-not-load-assets' | globalize }}
    </template>
    <template v-else>
      <loader message-id="dividend-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'
import FormConfirmation from '@/vue/common/FormConfirmation'
import Loader from '@/vue/common/Loader'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import EmailGetter from '@/vue/common/EmailGetter'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'dividend-form-module',
  components: {
    FormConfirmation,
    Loader,
    EmailGetter,
  },
  mixins: [FormMixin, OwnedAssetsLoaderMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    isLoaded: false,
    isFailed: false,
    asset: {},
    tokenHolders: [],
    signersDebouncedRequest: null,
    isSignersLoadPending: false,
    isSignersLoaded: false,
  }),
  computed: {
    ...mapGetters('dividend-form', {
      accountId: types.accountId,
      balances: types.balances,
    }),
  },
  watch: {
    'asset.code' () {
      this.tryGetSigners()
    },
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    this.isInitialized = true
    try {
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapMutations('dividend-form', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('dividend-form', {
      loadBalances: types.LOAD_BALANCES,
    }),
    async submit () {
      this.disableForm()
      try {
        if (!this.isSignersLoaded) {
          Bus.error('dividend-form.failed-load-signers')
          return false
        }
        Bus.success('dividend-form.dividend-success')
        this.$emit(EVENTS.operationSubmitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getSigners () {
      try {
        const { data } = await Sdk.horizon.balances.getPage({ 'asset': this.asset.code })
        this.tokenHolders = data
        this.isSignersLoaded = true
      } catch (e) {
        this.isSignersLoaded = false
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isSignersLoadPending = false
    },
    tryGetSigners () {
      this.isSignersLoadPending = true
      if (!this.signersDebouncedRequest) {
        this.signersDebouncedRequest = debounce(() => this.getSigners(), 300)
      }
      return this.signersDebouncedRequest()
    },
    async initAssetSelector () {
      await this.loadOwnedAssets()
      if (this.ownedAssets.length) {
        this.asset = this.ownedAssets[0]
      }
    },
    async reinitAssetSelector () {
      await this.loadOwnedAssets()
      if (this.ownedAssets.length) {
        const updatedAsset = this.ownedAssets
          .find(item => item.code === this.asset.code)
        this.asset = updatedAsset || this.assets[0]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .dividend__fees-container {
    &.loading {
      opacity: 0.7;
    }

    .dividend__fee-type {
      color: $col-info;
    }
  }

  .dividend__form-row {
    margin-bottom: 2.5rem;
  }

  .dividend__form-field-description {
    margin-top: 0.4rem;
    opacity: 0.7;
  }

  .dividend__fee-table {
    width: 100%;
    font-size: 1.2rem;

    tr {
      height: 2rem;
    }

    td:last-child {
      text-align: right;
    }
  }

  .dividend__fee-tbody {
    color: $col-text-secondary;
  }

  .dividend__total-fee-row {
    color: $col-text;
    font-weight: 600;
  }

  .dividend__action {
    margin-top: 2.5rem;
  }
  .dividend__data--loading {
    opacity: 0.4;
  }

  .dividend__table-description {
    opacity: 0.6;
    font-size: 1.2rem;
  }
</style>
