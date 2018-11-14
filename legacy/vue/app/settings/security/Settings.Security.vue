<template>
  <md-tabs
    md-card
    class="security-settings-tabs">
    <md-tab :md-label="`${ i18n.set_change_password()}`">
      <change-password class="security-settings__change-password" />
    </md-tab>
    <md-tab
      :md-label="`${ i18n.set_tfa_enable()}`"
      v-if="config.FEATURE_FLAGS.tfa">
      <tfa-settings class="security-settings__tfa-settings" />
    </md-tab>
    <md-tab :md-label="`${ i18n.set_account_id()}`">
      <account-id class="security-settings__account-id" />
    </md-tab>
    <md-tab :md-label="`${ i18n.set_secret_seed()}`">
      <seed class="security-settings__seed" />
    </md-tab>
  </md-tabs>
</template>

<script>
import ChangePassword from './Security.ChangePassword'
import TfaSettings from './Security.TfaSettings'
import AccountId from './Security.AccountId'
import Seed from './Security.Seed'
import { i18n } from 'L@/js/i18n'

import config from '@/config'

export default {
  name: 'settings-security',
  components: {
    ChangePassword,
    TfaSettings,
    AccountId,
    Seed
  },
  data: _ => ({
    i18n,
    config
  })
}
</script>

<style lang="scss">
  @import 'settings';
  @import "~L@scss/variables";
  @import "~L@scss/mixins";

  .security-settings-tabs {
    min-width: 48rem;
    .md-title,
    .md-table-cell-container {
      color: $col-text-page-heading !important;
    }

    .md-tabs-navigation {
      background-color: transparent !important;
      margin-bottom: 1rem;
    }

    .md-tab {
      padding: 0;
      background-color: transparent !important;
    }

    .md-card {
      box-shadow: none;
    }

    .md-content {
      background-color: transparent !important;
    }

    .md-tabs-content {
      height: auto !important;
      min-height: 100% !important;
      background-color: transparent !important;
    }

    @include overwrite-tabs(57);
  }

  .security-settings__change-password,
  .security-settings__tfa-settings,
  .security-settings__account-id,
  .security-settings__seed {
    margin: 3rem auto 0;
    max-width: 40rem;
  }
</style>
