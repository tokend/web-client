<template>
  <div>
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
        v-if="
          getModule().canRenderSubmodule(CreateAssetFormSimplifiedModule)
        "
      >
        <button
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

    <!-- eslint-disable-next-line max-len -->
    <template v-if="getModule().canRenderSubmodule(CreateAssetFormSimplifiedModule)">
      <drawer :is-shown.sync="isAssetDrawerShown">
        <template slot="heading">
          {{ 'assets-page.create-asset-title' | globalize }}
        </template>

        <submodule-importer
          :submodule="getModule().getSubmodule(CreateAssetFormSimplifiedModule)"
          @submitted="closeDrawerAndUpdateList()"
        />
      </drawer>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { CreateAssetFormSimplifiedModule } from '@modules/create-asset-form-simplified/module'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    SubmoduleImporter,
  },
  mixins: [UpdateList],
  data: _ => ({
    vueRoutes,
    CreateAssetFormSimplifiedModule,
    isAssetDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
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
