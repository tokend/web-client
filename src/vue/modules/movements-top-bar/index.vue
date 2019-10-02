<template>
  <div>
    <top-bar>
      <template v-if="isInitialized && assets.length">
        <div
          slot="main"
          class="movements-top-bar__filters"
        >
          <span class="movements-top-bar__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            :value="assetCode"
            @input="setAssetCode"
            class="app__select app__select--no-border"
          >
            <option
              v-for="asset in assets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </template>
      <div
        v-if="isBusinessToBrowse"
        class="movements-top-bar__actions"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised movements-top-bar__actions-btn"
          @click="isTransferDrawerShown = true"
          :disabled="!(assetByCode(assetCode).isTransferable && isHaveBalance)"
          :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isTransferable) |
            globalize({ asset: assetCode })
          "
        >
          <i class="mdi mdi-send movements-top-bar__btn-icon" />
          {{ 'op-pages.send' | globalize }}
        </button>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        @operation-submitted="$emit(EVENTS.movementsUpdateRequired)"
        :asset-to-transfer="assetCode"
      />
    </drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'

import TransferForm from '@/vue/forms/TransferForm'

const EVENTS = {
  assetCodeUpdated: 'asset-code-updated',
  movementsUpdateRequired: 'movements-update-required',
}

const ASSET_POLICIES_STR = {
  isTransferable: 'isTransferable',
}

export default {
  name: 'movements-top-bar',
  components: {
    SelectField,
    TopBar,
    Drawer,
    TransferForm,
  },
  data: _ => ({
    isInitialized: false,
    isTransferDrawerShown: false,
    assetCode: '',
    EVENTS,
    ASSET_POLICIES_STR,
    isHaveBalance: true,
  }),
  computed: {
    ...mapGetters({
      balancesAssetsByOwner: vuexTypes.balancesAssetsByOwner,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      ownedAssets: vuexTypes.ownedBalancesAssets,
      isAccountUnverified: vuexTypes.isAccountUnverified,
      isBusinessToBrowse: vuexTypes.isBusinessToBrowse,
      assetByCode: vuexTypes.assetByCode,
    }),

    assets () {
      if (this.isBusinessToBrowse) {
        // eslint-disable-next-line max-len
        const accountId = this.$route && this.$route.query && this.$route.query.owner
          ? this.$route.query.owner
          : this.businessToBrowse.accountId
        return this.balancesAssetsByOwner(accountId)
      } else {
        return this.ownedAssets
      }
    },
  },
  watch: {
    async assetCode (value) {
      this.getBalance()
      // Vue-router catch hack
      await this.$router.push({
        query: { assetCode: value },
      }, () => {})
      this.$emit(EVENTS.assetCodeUpdated, value)
    },
  },
  async created () {
    await this.loadAccountBalancesDetails()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapActions({
      loadAccountBalancesDetails: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setAssetCode (code) {
      this.assetCode = code
    },
    setDefaultAsset () {
      const queryAsset = this.assets
        .find(item => item.code === this.$route.query.assetCode)

      this.assetCode = queryAsset
        ? queryAsset.code
        : this.assets[0].code
    },
    getMessageIdForPolicy (policy) {
      let messageId = ''
      const asset = this.assetByCode(this.assetCode)
      if (!asset[policy]) {
        messageId = 'op-pages.not-transferable-msg'
      }
      return messageId
    },
    getBalance () {
      const balance = +this.accountBalanceByCode(this.assetCode).balance
      this.isHaveBalance = balance > 0
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.movements-top-bar__actions {
  display: flex;
  justify-content: space-between;
}

.movements-top-bar__actions-btn {
  margin-right: 1.2rem;

  &:last-child {
    margin-right: 0;
  }
}

.movements-top-bar__actions-btn.app__button-raised {
  line-height: 1;
}

.movements-top-bar__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.movements-top-bar__filters {
  display: inline-flex;
  align-items: center;
  color: $_lightBlack;
}

.movements-top-bar__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
