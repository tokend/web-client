<template>
  <div>
    <template>
      <top-bar>
        <template slot="main">
          <router-link :to="vueRoutes.allPolls">
            <span>{{ 'polls.all' | globalize }}</span>
          </router-link>
          <router-link
            v-if="isAccountCorporate"
            :to="vueRoutes.pollRequests"
          >
            <span>{{ 'polls.requests' | globalize }}</span>
          </router-link>
        </template>

        <template
          slot="extra"
          v-if="isAccountCorporate"
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

          <create-poll-form-module
            @submitted="closeDrawerAndUpdateList"
          />
        </drawer>
      </template>
    </template>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreatePollFormModule from '@/vue/modules/create-poll-form'
import UpdateList from '@/vue/mixins/update-list.mixin'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'polls',
  components: {
    TopBar,
    Drawer,
    CreatePollFormModule,
  },

  mixins: [UpdateList],

  data: _ => ({
    isCreatePollDrawerShown: false,
    isPollsLoading: false,
    vueRoutes,
  }),
  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  beforeDestroy () {
    this.resetUpdateListEvent('polls:updateList')
  },

  methods: {
    closeDrawerAndUpdateList () {
      this.isCreatePollDrawerShown = false
      this.emitUpdateList('polls:updateList')
    },
  },
}
</script>
