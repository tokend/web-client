<template>
  <div class="funds">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
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

export default {
  name: 'history-index',
  components: {
    TopBar,
    Drawer,
    CreateFundForm,
  },
  data: _ => ({
    isCreateFundDrawerShown: false,
  }),
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
