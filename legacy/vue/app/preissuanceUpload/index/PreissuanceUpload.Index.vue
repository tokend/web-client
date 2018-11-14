<template>
  <div>
    <template v-if="accountTypeI !== ACCOUNT_TYPES.syndicate">
      <h2 class="app__page-heading">
        {{ i18n.preis_not_available_heading() }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.preis_not_available() }}
      </p>
      <router-link
        to="/verification"
        tag="button"
        class="app__button-raised">
        {{ i18n.preis_kyc_btn() }}
      </router-link>
    </template>

    <template v-else-if="!accountOwnedTokenCodes.length">
      <h2 class="app__page-heading">{{ i18n.preis_no_assets_heading() }}</h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.preis_no_assets() }}
      </p>
      <router-link
        to="/token-creation"
        tag="button"
        class="app__button-raised">
        {{ i18n.preis_create_assets_btn() }}
      </router-link>
    </template>

    <template v-else>
      <preissuance-upload-manager />
    </template>
  </div>
</template>

<script>
import PreissuanceUploadManager from './PreissuanceUpload.Manager'

import { vuexTypes } from 'L@/vuex/types'
import { mapGetters } from 'vuex'
import { i18n } from 'L@/js/i18n'

import { ACCOUNT_TYPES } from 'L@/js/const/const'

export default {
  components: {
    PreissuanceUploadManager
  },
  data: _ => ({
    i18n,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountTypeI,
      vuexTypes.accountOwnedTokenCodes
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
