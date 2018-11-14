<template>
  <div class="app__page-content-wrp">
    <template v-if="form.tokenCode">
      <h2 class="app__page-heading">
        {{ i18n.dep_heading() }}
      </h2>

      <p class="app__page-explanations">
        {{ i18n.dep_how_to({ asset: form.tokenCode }) }}<br>
      </p>

      <div class="app__form-row">
        <select-field-unchained
          :values="tokenCodes"
          v-model="form.tokenCode"
          :label="i18n.lbl_asset()" />
      </div>

      <template v-if="address">
        <p class="app__page-explanations deposit__warn-msg">
          <strong>{{ i18n.dep_asset_only_prefix() }}</strong>
          {{ i18n.dep_asset_only({ asset: form.tokenCode }) }}
        </p>

        <div class="app__form-row">
          <clipboard-field
            :value="address"
            :label="i18n.dep_where_to({ asset: form.tokenCode })"
            :monospaced="true"
          />
        </div>

        <div class="deposit__qr-outer">
          <span class="deposit__qr-code-hint">
            {{ i18n.deposit_qr_code_hint() }}
          </span>
          <!--TODO: use vue-qr instead for consistency-->
          <qrcode
            class="deposit__qr-code"
            :text="address"
            :size="225"
            color="#3f4244"
          />
        </div>
      </template>

      <template v-else-if="isPending">
        <!-- TODO: add a spinner -->
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.dep_binding_address() }}
        </p>
      </template>

      <template v-else>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.dep_no_address() }}
        </p>
      </template>
    </template>

    <template v-else>
      <h2 class="app__page-heading">{{ i18n.deposit_no_assets_heading() }}</h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.deposit_no_assets() }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised">
        {{ i18n.deposit_discover_assets_btn() }}
      </router-link>
    </template>
  </div>
</template>

<script>
import SelectFieldUnchained from 'L@/vue/common/fields/SelectFieldUnchained'
import Qrcode from 'vue-qrcode-component'
import ClipboardField from 'L@/vue/common/fields/ClipboardField'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'
import { ACCOUNT_TYPES } from 'L@/js/const/xdr.const'

import { issuanceService } from 'L@/js/services/issuances.service'

export default {
  name: 'deposit-make',
  components: {
    SelectFieldUnchained,
    Qrcode,
    ClipboardField
  },
  data: _ => ({
    form: {
      tokenCode: null
    },
    isPending: false,
    ACCOUNT_TYPES,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userAcquiredTokens,
      vuexTypes.accountDepositAddresses
    ]),
    tokenCodes () {
      return this.userAcquiredTokens
        .filter(token => token.isDepositable)
        .map(token => token.code)
    },
    selectedToken () {
      return this.userAcquiredTokens
        .find(token => token.code === this.form.tokenCode) || null
    },
    address () {
      if (!this.selectedToken) return ''
      const externalSystemType = this.selectedToken.externalSystemType
      return this.accountDepositAddresses[externalSystemType]
    }
  },
  watch: {
    tokenCodes: {
      handler: 'setTokenCode',
      immediate: true
    },
    selectedToken: {
      handler: 'tryBindAddress',
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS
    }),
    setTokenCode () {
      this.form.tokenCode = this.tokenCodes[0] || null
    },
    async tryBindAddress (token) {
      if (!token || !token.externalSystemType) {
        return
      }
      this.isPending = true
      try {
        await issuanceService.bindExternalAccount({
          externalSystemType: +token.externalSystemType
        })
        await this.loadAccount()
      } catch (e) {
        console.error(e)
      }
      this.isPending = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~L@/scss/variables';

.deposit__qr-outer {
  margin: 4 * $point auto 0;
  text-align: center;
}

.deposit__progress-wrp {
  text-align: center;
}

.deposit__warn-msg {
  margin: 4 * $point 0 0 0 !important;
}

.deposit__qr-code {
  width: 225px;
  overflow: visible;
  margin: 0 auto;
}

.deposit__qr-code-hint {
  color: rgba($col-text-field-hint, .7);
  text-align: center;
  font-size: 1.4 * $point;
  margin-bottom: 1 * $point;
  display: inline-block;
}
</style>
