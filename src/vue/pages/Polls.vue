<template>
  <div>
    <template>
      <top-bar>
        <template slot="main">
          <router-link
            v-if="getModule().canRenderSubmodule(PollsAllPageModule)"
            :to="vueRoutes.allPolls"
          >
            <span>{{ 'polls.all' | globalize }}</span>
          </router-link>
          <router-link
            v-if="getModule().canRenderSubmodule(PollRequestsPageModule)"
            :to="vueRoutes.pollRequests"
          >
            <span>{{ 'polls.requests' | globalize }}</span>
          </router-link>
        </template>

        <template
          slot="extra"
          v-if="getModule().canRenderSubmodule(CreatePollFormModule)"
        >
          <button
            v-ripple
            class="app__button-raised"
            @click="isCreatePollDrawerShown = true"
          >
            <i class="mdi mdi-plus sales__btn-icon" />
            {{ 'polls.create-poll' | globalize }}
          </button>
        </template>
      </top-bar>

      <template>
        <drawer
          :is-shown.sync="isCreatePollDrawerShown"
          :close-by-click-outside="false"
        >
          <template slot="heading">
            {{ 'polls.new-poll' | globalize }}
          </template>

          <submodule-importer
            :submodule="getModule().getSubmodule(CreatePollFormModule)"
            @submitted="closeDrawerAndUpdateList()"
          />
        </drawer>
      </template>
    </template>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { PollRequestsPageModule } from '@/vue/pages/polls/poll-requests-page'
import { vueRoutes } from '@/vue-router/routes'
import { PollsAllPageModule } from '@/vue/pages/polls-all-page-module'
import Drawer from '@/vue/common/Drawer'
import { CreatePollFormModule } from '@/vue/modules/create-poll-form/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'polls',
  components: {
    TopBar,
    Drawer,
    SubmoduleImporter,
  },

  mixins: [UpdateList],

  data: _ => ({
    isCreatePollDrawerShown: false,
    isPollsLoading: false,
    vueRoutes,
    PollRequestsPageModule,
    PollsAllPageModule,
    CreatePollFormModule,
  }),

  methods: {
    closeDrawerAndUpdateList () {
      this.isCreatePollDrawerShown = false
      this.updateList()
    },
  },
}
</script>

<style scoped lang="scss"/>
