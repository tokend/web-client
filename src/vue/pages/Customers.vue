<template>
  <div class="users">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.customersList">
          <span>
            {{ 'customers-page.customers-list-page' | globalize }}
          </span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isInviteDrawerShown = true"
        >
          {{ 'customers-page.invite-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised"
          @click="isIssueDrawerShown = true"
        >
          {{ 'customers-page.issue-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isInviteDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-invitation-drawer-heading' | globalize }}
      </template>

      <mass-invitation-form />
    </drawer>

    <drawer :is-shown.sync="isIssueDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-issuance-drawer-heading' | globalize }}
      </template>

      <mass-issuance-form />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import { vueRoutes } from '@/vue-router/routes'

import MassIssuanceForm from '@/vue/forms/MassIssuanceForm'
import MassInvitationForm from '@/vue/forms/MassInvitationForm'

export default {
  name: 'customers-page',

  components: {
    TopBar,
    Drawer,
    MassIssuanceForm,
    MassInvitationForm,
  },

  data: _ => ({
    isInviteDrawerShown: false,
    isIssueDrawerShown: false,
    vueRoutes,
  }),
}
</script>
