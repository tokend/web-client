<template>
  <div class="sales">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
          v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
          class="app__button-raised"
          @click="isCreateSaleDrawerShown = true"
        >
          <i class="mdi mdi-plus sales__btn-icon" />
          {{ 'sales.create-sale' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isCreateSaleDrawerShown">
      <template slot="heading">
        {{ 'create-sale-form.create-sale-header' | globalize }}
      </template>
      <create-sale-form @close="isCreateSaleDrawerShown = false" />
    </drawer>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateSaleForm from '@/vue/forms/CreateSaleForm'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'sales',
  components: {
    TopBar,
    Drawer,
    CreateSaleForm,
  },
  data: _ => ({
    ACCOUNT_TYPES,
    isCreateSaleDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .sales__btn-icon {
    display: flex;
    font-size: 1.8rem;
    margin-right: 0.5rem;
  }
</style>
