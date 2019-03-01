<template>
  <span :title="fee.scope | feeScopeTranslationId | globalize">
    {{ fee.scope | feeScopeTranslationId | globalize }}
  </span>
</template>

<script>
import { Fee } from '../wrappers/fee'

import { FEE_SCOPES } from '../const/fee-scopes'

const FEE_SCOPE_TRANSLATION_IDS = {
  [FEE_SCOPES.account]: 'fees.scopes.account',
  [FEE_SCOPES.accountRole]: 'fees.scopes.account-role',
  [FEE_SCOPES.general]: 'fees.scopes.global',
}

export default {
  name: 'fee-scope-viewer',

  filters: {
    feeScopeTranslationId (feeScope) {
      return FEE_SCOPE_TRANSLATION_IDS[feeScope]
    },
  },

  props: {
    fee: {
      type: Fee,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
