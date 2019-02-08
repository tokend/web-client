<template>
  <div class="funds">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
          v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
          class="app__button-raised"
          @click="isCreateFundDrawerShown = true"
        >
          <i class="mdi mdi-plus funds__btn-icon" />
          {{ 'funds.create-fund' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isCreateFundDrawerShown">
      <template slot="heading">
        {{ 'create-fund-form.create-fund-header' | globalize }}
      </template>
      <create-fund-form @cancel="isCreateFundDrawerShown = false" />
    </drawer>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateFundForm from '@/vue/forms/CreateFundForm'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'funds',
  components: {
    TopBar,
    Drawer,
    CreateFundForm,
  },
  data: _ => ({
    ACCOUNT_TYPES,
    isCreateFundDrawerShown: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account,
    ]),
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .funds__btn-icon {
    display: flex;
    font-size: 1.8rem;
    margin-right: 0.5rem;
  }
</style>
