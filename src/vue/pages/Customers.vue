<template>
  <div class="users">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isInviteDrawerShown = true"
        >
          {{ 'users-page.invite-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised"
          @click="isIssueDrawerShown = true"
        >
          {{ 'users-page.issue-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isInviteDrawerShown">
      <template slot="heading">
        {{ 'users-page.invite-drawer-heading' | globalize }}
      </template>
      TODO
      <!-- <document-upload-form-module
        @submit="(isDrawerShown = false) || (isDocumentUploaded = true)"
      /> -->
    </drawer>

    <drawer :is-shown.sync="isIssueDrawerShown">
      <template slot="heading">
        {{ 'users-page.issue-drawer-heading' | globalize }}
      </template>

      <mass-issuance-form
        @submit="(isDrawerShown = false) || (isDocumentUploaded = true)"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import MassIssuanceForm from '@/vue/forms/MassIssuanceForm'

export default {
  name: 'users-page',

  components: {
    TopBar,
    Drawer,
    MassIssuanceForm,
  },

  data: _ => ({
    isInviteDrawerShown: false,
    isIssueDrawerShown: false,
  }),
}
</script>
