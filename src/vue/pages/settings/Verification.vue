<template>
  <div class="verification">
    <div
      class="request-message"
      :class="`request-message--${kycState}`"
    >
      <p class="request-message__content">
        {{
          kycRequestMessageId | globalize({
            reason: kycRejectReason
          })
        }}
      </p>
    </div>
    <p class="verification__subtitle">
      {{ 'verification-page.account-type-lbl' | globalize }}
    </p>
    <div class="account-type-selector">
      <router-link
        :to="vueRoutes.verification.general"
        class="account-type-selector__item"
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
        :to="vueRoutes.verification.corporate"
        class="account-type-selector__item"
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
    <div
      v-if="$route.name !== 'app.verification'"
      class="verification__form"
    >
      <p class="verification__subtitle verification__form-label">
        {{ 'verification-page.account-information-lbl' | globalize }}
      </p>
      <router-view />
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { vueRoutes } from '@/vue-router/routes'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

export default {
  name: 'verification',
  data: _ => ({
    vueRoutes,
  }),
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
      kycLatestData: vuexTypes.kycLatestData,
      kycRejectReason: vuexTypes.kycRequestRejectReason,
    }),
    kycRequestMessageId () {
      switch (this.kycState) {
        case REQUEST_STATES_STR.pending:
          return 'verification-page.pending-request-msg'
        case REQUEST_STATES_STR.approved:
          return 'verification-page.approved-request-msg'
        case REQUEST_STATES_STR.rejected:
          return 'verification-page.rejected-request-msg'
        default:
          return ''
      }
    },
  },
  beforeRouteUpdate (to, from, next) {
    if (this.kycState && to.name === vueRoutes.verification.name) {
      if (this.kycLatestData.name) {
        next(vueRoutes.verification.corporate)
      } else if (this.kycLatestData.first_name) {
        next(vueRoutes.verification.corporate)
      }
    } else {
      next()
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.request-message {
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

.request-message__content {
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
  box-shadow: 0 .6rem 1rem 0 $col-block-shadow;
  background-color: $col-block-bg;
  text-decoration: none;
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
