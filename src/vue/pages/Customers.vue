<template>
  <div class="customers-page">
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

        <!-- Temp. hidden -->
        <button
          v-if="false"
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

      <!-- eslint-disable-next-line max-len -->
      <mass-invitation-form @submitted="(isInviteDrawerShown = false) || emitUpdateList()" />
    </drawer>

    <drawer :is-shown.sync="isIssueDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-issuance-drawer-heading' | globalize }}
      </template>

      <mass-issuance-form
        :receivers="massIssuanceReceivers"
        @submitted="(isIssueDrawerShown = false) || emitUpdateList()"
      />
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
import { Bus } from '@/js/helpers/event-bus'

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
    massIssuanceReceivers: '',
    vueRoutes,
  }),

  watch: {
    isIssueDrawerShown (value) {
      if (value === false) {
        this.massIssuanceReceivers = ''
      }
    },
  },

  created () {
    this.listen()
  },

  methods: {
    emitUpdateList () {
      Bus.emit('customers:updateList')
    },

    listen () {
      Bus.on('customers:massIssue', payload => {
        const receivers = ((payload || {}).receivers || [])
        this.massIssuanceReceivers = receivers.map(i => i.email).join(', ')
        this.isIssueDrawerShown = true
      })
    },
  },
}
</script>
