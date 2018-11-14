<template>
  <div class="crowdfund-token">
    <div class="crowdfund-token-header">
      <div class="crowdfund-token__icon-wrapper">
        <img
          class="crowdfund-token__icon"
          v-if="token.logoUrl"
          :src="token.logoUrl"
          :alt="documentTypes.tokenIcon">
        <div
          class="crowdfund-token__icon crowdfund-token__icon--letter"
          v-else>
          {{ token.name.substr(0, 1).toUpperCase() }}
        </div>
      </div>
      <div class="crowdfund-token__name-wrapper">
        <h2 class="crowdfund-token__name">{{ token.name }}</h2>
        <h2 class="crowdfund-token__code">({{ token.code }})</h2>
      </div>
    </div>
    <div class="crowdfund-token-main">
      <div class="details-column md-layout-item">
        <detail-row
          :prop="i18n.lbl_token_max_issuance_amount()"
          :value="`${i18n.c(token.max)}`" />
        <detail-row
          :prop="i18n.lbl_token_initial_preissued_amount()"
          :value="`${i18n.c(token.issued)}`" />
        <detail-row
          :prop="i18n.lbl_avalilable_for_iss()"
          :value="`${i18n.c(token.available)}`" />
        <detail-row
          :prop="i18n.lbl_token_preissued_asset_signer()"
          :value="`${ token.signer }`" />
        <detail-row
          :prop="i18n.lbl_terms()"
          v-if="token.termsUrl"
          :value="''">
          <a href="${token.termsUrl}" target="_blank">Open file</a>
        </detail-row>
        <detail-row
          :prop="i18n.lbl_offering_memorandum()"
          v-else />
        <detail-row
          :prop="i18n.lbl_policies()"
          :value="`${getPolicies(token.policies)}`" />
      </div>
    </div>
  </div>
</template>

<script>
import DetailRow from 'L@/vue/app/common/Detail.Row'
import { i18n } from 'L@/js/i18n'
import { ASSET_POLICIES } from 'L@/js/const/xdr.const'
import { documentTypes } from 'L@/js/const/documents.const'
export default {
  components: {
    DetailRow
  },
  props: {
    token: { type: Object, default: () => {} }
  },
  data: _ => ({
    i18n,
    documentTypes,
    ASSET_POLICIES
  }),
  methods: {
    getPolicies (item) {
      const policies = []
      item.forEach(element => {
        policies.push(Object.keys(ASSET_POLICIES)
          .filter(policy => ASSET_POLICIES[policy] === element))
      })
      return policies.join(', ').replace(/([a-z])([A-Z])/g, '$1 $2')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .crowdfund-token-header {
    display: flex;
    align-items: center;
    margin-bottom: 2.3rem;
  }

  .crowdfund-token__name-wrapper {
    color: $col-token-code;
  }

  .crowdfund-token__icon {
    width: 6rem;
    height: 6rem;
    margin-right: 2rem;
    border-radius: 50%;
    border: 1px solid $col-token-code-border;
  }

  .crowdfund-token__icon--letter {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: $col-text;
  }

  .crowdfund-token__name {
    padding-bottom: 0.5rem;
  }
</style>
