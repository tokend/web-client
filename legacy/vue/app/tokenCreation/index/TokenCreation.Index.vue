<template>
  <div class="create-token app__page-content-wrp">
    <!-- eslint-disable-next-line max-len -->
    <div v-if="accountTypeI === ACCOUNT_TYPES.notVerified || accountTypeI !== ACCOUNT_TYPES.syndicate">
      <no-data-message
        icon-name="work"
        :msg-title="i18n.lbl_not_available()"
        :msg-message="i18n.lbl_token_not_available_exp()"
      />
    </div>
    <token-creation-manager
      v-else
      :id="id"
      :code="code"
    />
  </div>
</template>

<script>
import TokenCreationManager from './TokenCreation.Manager'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'
import { vuexTypes } from '../../../../vuex/types'
import { ACCOUNT_TYPES } from '../../../../js/const/const'
import { i18n } from '../../../../js/i18n/index'
import { mapGetters } from 'vuex'
export default {
  components: { TokenCreationManager, NoDataMessage },
  props: {
    id: { type: String, default: '' },
    code: { type: String, default: '' }
  },
  data: _ => ({
    i18n,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountTypeI
    ])
  }
}
</script>
