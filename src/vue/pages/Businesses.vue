<template>
  <div class="businesses-page">
    <template>
      <top-bar>
        <template slot="main">
          <!-- eslint-disable-next-line max-len -->
          <router-link :to="vueRoutes.myBusinesses">
            <span>{{ 'businesses.my-tab' | globalize }}</span>
          </router-link>
          <!-- eslint-disable-next-line max-len -->
          <router-link :to="vueRoutes.allBusinesses">
            <span>{{ 'businesses.all-tab' | globalize }}</span>
          </router-link>
        </template>
      </top-bar>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import { mapMutations, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'businesses',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
  created () {
    this.CLEAR_BUSINESS_TO_BROWSE()
    this.LOAD_BUSINESS_STATS_QUOTE_ASSET()
  },
  methods: {
    ...mapMutations([
      vuexTypes.CLEAR_BUSINESS_TO_BROWSE,
    ]),
    ...mapActions([
      vuexTypes.LOAD_BUSINESS_STATS_QUOTE_ASSET,
    ]),
  }
}
</script>

<style scoped lang="scss"/>
