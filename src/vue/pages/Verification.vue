<template>
  <div class="verification">
    <div
      v-if="isAccountRoleReset"
      class="verification__state-message
             verification__state-message--rejected"
    >
      <p class="verification__state-message-content">
        {{
          'verification-page.account-role-reset-msg' | globalize({
            reason: kycResetReason
          })
        }}
      </p>
    </div>
    <div
      v-else-if="kycState === REQUEST_STATES_STR.approved"
      class="verification__state-message
             verification__state-message--approved"
    >
      <p class="verification__state-message-content">
        {{ 'verification-page.approved-request-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="kycState === REQUEST_STATES_STR.pending"
      class="verification__state-message
             verification__state-message--pending"
    >
      <p class="verification__state-message-content">
        {{ 'verification-page.pending-request-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="kycState === REQUEST_STATES_STR.rejected"
      class="verification__state-message
             verification__state-message--rejected"
    >
      <p class="verification__state-message-content">
        {{
          'verification-page.rejected-request-msg'
            | globalize({ reason: kycRejectReason })
        }}
      </p>
    </div>
    <p class="verification__subtitle">
      {{ 'verification-page.account-type-lbl' | globalize }}
    </p>
    <div class="account-type-selector">
      <router-link
        :to="vueRoutes.verificationGeneral"
        class="account-type-selector__item"
        :disabled="kycAccountRole &&
          kycAccountRole !== kvEntryGeneralRoleId"
      >
        <p class="account-type-selector__item-title">
          {{ 'verification-page.account-type-general-title' | globalize }}
        </p>
        <p class="account-type-selector__item-description">
          {{ 'verification-page.account-type-general-description'
            | globalize }}
        </p>
        <div class="account-type-selector__selected-icon">
          <i class="mdi mdi-check" />
        </div>
      </router-link>
      <router-link
        :to="vueRoutes.verificationCorporate"
        class="account-type-selector__item"
        :disabled="kycAccountRole &&
          kycAccountRole !== kvEntryCorporateRoleId"
      >
        <p class="account-type-selector__item-title">
          {{ 'verification-page.account-type-corporate-title' | globalize }}
        </p>
        <p class="account-type-selector__item-description">
          {{ 'verification-page.account-type-corporate-description'
            | globalize }}
        </p>
        <div class="account-type-selector__selected-icon">
          <i class="mdi mdi-check" />
        </div>
      </router-link>
    </div>
    <div class="verification__form">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { store, vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import config from '@/config'

// The guard doesn't allow the user to visit a verification page
// if he/she has already sent the verification request. It redirects
// him/her to the verification page for the account type specified
// in the latest KYC data the user sent.
//
// Placed in the component hooks because Vue router doesn't call
// the guard when routing from the child's path to the parent's one.
// Details: https://forum.vuejs.org/t/vue-router-beforeenter-doesnt-work-properly-for-children-path/20019
function verificationGuard (to, from, next) {
  const kycAccountRole = store.getters[vuexTypes.kycAccountRoleToSet]
  const kvEntryCorporateRoleId = store.getters[vuexTypes.kvEntryCorporateRoleId]
  const kvEntryGeneralRoleId = store.getters[vuexTypes.kvEntryGeneralRoleId]

  switch (kycAccountRole) {
    case kvEntryCorporateRoleId:
      to.name === vueRoutes.verificationCorporate.name
        ? next()
        : next(vueRoutes.verificationCorporate)
      break
    case kvEntryGeneralRoleId:
      to.name === vueRoutes.verificationGeneral.name
        ? next()
        : next(vueRoutes.verificationGeneral)
      break
    default:
      next()
      break
  }
}

export default {
  name: 'verification',
  data: _ => ({
    vueRoutes,
    REQUEST_STATES_STR,
    config,
  }),
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
      kycRejectReason: vuexTypes.kycRequestRejectReason,
      kycResetReason: vuexTypes.kycRequestResetReason,
      isAccountRoleReset: vuexTypes.isAccountRoleReset,
      kycAccountRole: vuexTypes.kycAccountRoleToSet,
      kvEntryCorporateRoleId: vuexTypes.kvEntryCorporateRoleId,
      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
    }),
  },
  async beforeRouteEnter (to, from, next) {
    verificationGuard(to, from, next)
  },
  async beforeRouteUpdate (to, from, next) {
    verificationGuard(to, from, next)
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.verification__state-message {
  min-height: 6.4rem;
  width: 100%;
  display: none;

  @mixin apply-theme ($col-msg-background) {
    background-color: $col-msg-background;
    display: block;
  }

  &--approved { @include apply-theme($col-request-approved) }
  &--pending { @include apply-theme($col-request-pending) }
  &--rejected { @include apply-theme($col-request-rejected) }
}

.verification__state-message-content {
  padding: 2.4rem;
  font-size: 1.3rem;
  font-weight: normal;
  color: $col-primary-txt;
}

.verification__subtitle {
  color: $col-primary;
  font-size: 1.3rem;
  margin-top: 4rem;
}

.account-type-selector {
  margin-top: 1rem;
  display: flex;

  & > :not(:first-child) {
    margin-left: 1.6rem;
  }
}

.account-type-selector__item {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25.4rem;
  height: 14.7rem;
  padding: 3.2rem;
  background-color: $col-block-bg;
  text-decoration: none;

  @include box-shadow();

  &[disabled] {
    opacity: 0.7;
    cursor: default;
    box-shadow: none;
    filter: grayscale(100%);
  }
}

.router-link-exact-active {
  border: .2rem solid $col-primary-lighten;

  .account-type-selector__selected-icon {
    visibility: visible;
  }
}

.account-type-selector__item-title {
  color: $col-primary;
  font-size: 1.8rem;
}

.account-type-selector__item-description {
  margin-top: .8rem;
  color: $col-secondary;
  font-size: 1.2rem;
  text-align: center;
}

.account-type-selector__selected-icon {
  width: 2.4rem;
  height: 2.4rem;
  padding: .2rem;
  background-color: $col-block-bg;
  border: .2rem solid $col-primary-lighten;
  border-radius: 2rem;
  top: -1.2rem;
  right: -1.2rem;
  position: absolute;
  visibility: hidden;

  i {
    font-size: 1.6rem;
    color: $col-primary-lighten;
  }
}

.verification__form-label {
  margin-top: 4rem;
  margin-bottom: 1rem;
}
</style>
