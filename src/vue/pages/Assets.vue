<template>
  <div>
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
      >
        <button
          v-if="isAccountCorporate && !isCustomerUiShown"
          v-ripple
          class="assets-page__create-btn app__button-raised"
          @click="isAssetDrawerShown = true"
        >
          <i class="mdi mdi-plus assets-page__btn-icon" />
          <span>
            {{ 'assets-page.create-btn' | globalize }}
          </span>
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isAssetDrawerShown">
      <template slot="heading">
        {{ 'assets-page.create-asset-title' | globalize }}
      </template>

      <create-asset-form
        @submitted="closeDrawerAndUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import CreateAssetForm from '@modules/create-asset-form-simplified'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    CreateAssetForm,
  },
  mixins: [UpdateList],
  data: _ => ({
    vueRoutes,
    isAssetDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      isCustomerUiShown: vuexTypes.isCustomerUiShown,
    }),
  },
  methods: {
    closeDrawerAndUpdateList () {
      this.isAssetDrawerShown = false
      this.emitUpdateList('assets:updateList')
    },
  },
}
</script>

<style lang="scss">
.assets-page__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
  margin-top: -0.4rem;
}
</style>
