<template>
  <div class="verification">
    <template v-if="isLoaded">
      <verification-state-message />

      <template v-if="!isAccountBlocked">
        <p class="verification__subtitle">
          {{ 'verification-page.account-type-lbl' | globalize }}
        </p>
        <div class="account-type-selector">
          <router-link
            tag="button"
            :to="vueRoutes.verificationGeneral"
            class="account-type-selector__item"
            :disabled="kycState && kycAccountRole &&
              !isKycTypeGeneral &&
              kycState !== REQUEST_STATES_STR.permanentlyRejected"
          >
            <p class="account-type-selector__item-title">
              {{ 'verification-page.account-type-general-title' | globalize }}
            </p>
            <p class="account-type-selector__item-description">
              <!-- eslint-disable-next-line max-len -->
              {{ 'verification-page.account-type-general-description' | globalize }}
            </p>
            <div class="account-type-selector__selected-icon">
              <!-- eslint-disable-next-line max-len -->
              <i class="mdi mdi-check account-type-selector__selected-icon-tag" />
            </div>
          </router-link>

          <router-link
            tag="button"
            :to="vueRoutes.verificationCorporate"
            class="account-type-selector__item"
            :disabled="kycState && kycAccountRole &&
              kycAccountRole !== $kv.corporateRoleId &&
              kycState !== REQUEST_STATES_STR.permanentlyRejected"
          >
            <p class="account-type-selector__item-title">
              {{ 'verification-page.account-type-corporate-title' | globalize }}
            </p>
            <p class="account-type-selector__item-description">
              <!-- eslint-disable-next-line max-len -->
              {{ 'verification-page.account-type-corporate-description' | globalize }}
            </p>
            <div class="account-type-selector__selected-icon">
              <i class="mdi mdi-check" />
            </div>
          </router-link>
        </div>

        <div class="verification__form">
          <router-view />
        </div>
      </template>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>{{ 'verification-page.loading-error-msg' | globalize }}</p>
    </template>

    <template v-else>
      <loader :message-id="'verification-page.loading-msg'" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import VerificationStateMessage from '@/vue/pages/verification/VerificationStateMessage'

import { mapGetters, mapActions } from 'vuex'
import { store, vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import config from '@/config'
import { keyValues } from '../../key-values'

// The guard doesn't allow the user to visit a verification page
// if he/she has already sent the verification request, and the admin
// hasn't reset or blocked the user's account. It redirects
// the user to the verification page for the account type specified
// in the latest KYC data the user sent.
//
// Placed in the component hooks because Vue router doesn't call
// the guard when routing from the child's path to the parent's one.
// Details: https://forum.vuejs.org/t/vue-router-beforeenter-doesnt-work-properly-for-children-path/20019
function verificationGuard (to, from, next) {
  const kycState = store.getters[vuexTypes.kycState]
  const kycAccountRole = store.getters[vuexTypes.kycAccountRoleToSet]

  if (!kycState || kycState === REQUEST_STATES_STR.permanentlyRejected) {
    next()
  } else {
    switch (kycAccountRole) {
      case keyValues.corporateRoleId:
        to.name === vueRoutes.verificationCorporate.name
          ? next()
          : next(vueRoutes.verificationCorporate)
        break
      case keyValues.generalRoleId:
      case keyValues.usVerifiedRoleId:
      case keyValues.usAccreditedRoleId:
        to.name === vueRoutes.verificationGeneral.name
          ? next()
          : next(vueRoutes.verificationGeneral)
        break
      default:
        next()
        break
    }
  }
}

export default {
  name: 'verification',
  components: {
    Loader,
    VerificationStateMessage,
  },

  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    vueRoutes,
    REQUEST_STATES_STR,
    config,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isAccountBlocked: vuexTypes.isAccountBlocked,

      kycState: vuexTypes.kycState,
      kycAccountRole: vuexTypes.kycAccountRoleToSet,
    }),

    isKycTypeGeneral () {
      const generalTypeRoles = [
        keyValues.generalRoleId,
        keyValues.usVerifiedRoleId,
        keyValues.usAccreditedRoleId,
      ]

      return generalTypeRoles.includes(this.kycAccountRole)
    },
  },

  async beforeRouteEnter (to, from, next) {
    verificationGuard(to, from, next)
  },

  async beforeRouteUpdate (to, from, next) {
    verificationGuard(to, from, next)
  },

  async created () {
    try {
      await this.loadAccount(this.accountId)
      await this.loadKyc()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.verification__subtitle {
  color: $col-primary;
  font-size: 1.3rem;
  margin-top: 4rem;
}

.account-type-selector {
  margin-top: 1rem;
  display: flex;
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

  @media (max-width: $sidebar-hide-bp) {
    padding: 1.2rem;
  }

  @include box-shadow();

  &[disabled] {
    opacity: 0.7;
    cursor: default;
    box-shadow: none;
    filter: grayscale(100%);
  }

  &:not(:first-child) {
    margin-left: 1.6rem;
  }
}

.router-link-exact-active {
  border: 0.2rem solid $col-btn;
}

.account-type-selector__item-title {
  color: $col-primary;
  font-size: 1.8rem;
}

.account-type-selector__item-description {
  margin-top: 0.8rem;
  color: $col-secondary;
  font-size: 1.2rem;
  text-align: center;
}

.account-type-selector__selected-icon {
  width: 2.4rem;
  height: 2.4rem;
  padding: 0.2rem;
  background-color: $col-block-bg;
  border: 0.2rem solid $col-btn;
  border-radius: 2rem;
  top: -1.2rem;
  right: -1.2rem;
  position: absolute;
  visibility: hidden;

  .router-link-exact-active & {
    visibility: visible;
  }
}

.account-type-selector__selected-icon-tag {
  font-size: 1.6rem;
  color: $col-btn;
}

.verification__form-label {
  margin-top: 4rem;
  margin-bottom: 1rem;
}
</style>
