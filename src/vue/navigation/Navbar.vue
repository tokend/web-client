<template>
  <nav class="navbar">
    <div class="navbar__title-wrapper">
      <template v-if="$route.meta.pageSubnameTranslationId">
        <h3 class="navbar__sub-title">
          {{ $route.meta.pageSubnameTranslationId | globalize }}
        </h3>
      </template>
      <h2 class="navbar__title">
        {{ $route.meta.pageNameTranslationId | globalize }}
      </h2>
    </div>
    <div class="navbar__user">
      <button
        class="navbar__user-picture"
        @click="isUserCardOpen = true"
      >
        {{ walletEmail.substr(0, 1).toUpperCase() }}
      </button>
      <div class="navbar__user-info">
        <button
          class="navbar__user-name"
          @click="isUserCardOpen = true"
        >
          {{ walletEmail }}
          <i
            class="navbar__user-name-icon mdi mdi-chevron-down"
            :class="{ 'navbar__user-name-icon--active': isUserCardOpen }"
          />
        </button>
        <div class="navbar__account-type">
          {{ getVerboseAccountType(accountTypeI) }}
        </div>
      </div>

      <div
        class="navbar__user-card"
        :class="{ 'navbar__user-card--active': isUserCardOpen }"
      >
        <div class="navbar__user-card-ctn">
          <div class="navbar__user-card-content">
            <div class="navbar__user-avatar">
              {{ walletEmail.substr(0, 1).toUpperCase() }}
            </div>
            <div class="navbar__user-card-info">
              <p class="navbar__user-card-name">
                {{ walletEmail }}
              </p>
              <div class="navbar__user-card-status">
                {{ getVerboseAccountType(accountTypeI) }}
              </div>
              <button
                v-ripple="'rgba(255, 255, 255, .2)'"
                @click="goKyc"
                class="navbar__user-card-account-btn"
              >
                {{ 'navbar.my-account' | globalize }}
              </button>
            </div>
          </div>
          <div class="navbar__user-actions">
            <button
              v-ripple
              class="navbar__user-action"
              @click="goSettings"
            >
              {{ 'navbar.settings' | globalize }}
            </button>
            <button
              v-ripple
              class="navbar__user-action"
              @click="logOut"
            >
              {{ 'navbar.signout' | globalize }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapMutations } from 'vuex'
import { vueRoutes } from '@/vue-router'
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { handleClickOutside } from '@/js/helpers/handle-click-outside'
import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'navbar',

  data: () => ({
    isUserCardOpen: false,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.walletEmail,
      vuexTypes.accountType,
      vuexTypes.accountTypeI
    ])
  },
  watch: {
    isUserCardOpen (value) {
      if (value) {
        handleClickOutside(
          '.navbar__user-card',
          this.toggleUserCardVisibility
        )
      }
    }
  },
  methods: {
    globalize,
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE
    }),
    logOut () {
      this.clearState()
      location.reload()
    },
    getVerboseAccountType (accountTypeI) {
      switch (accountTypeI) {
        case ACCOUNT_TYPES.notVerified:
          return globalize('navbar.account-unverified')
        case ACCOUNT_TYPES.individual:
          return globalize('navbar.account-general')
        case ACCOUNT_TYPES.syndicate:
          return globalize('navbar.account-corporate')
      }
    },
    toggleUserCardVisibility () {
      this.isUserCardOpen = !this.isUserCardOpen
    },
    goSettings () {
      this.isUserCardOpen = false
      this.$router.push(vueRoutes.settings)
    },
    goKyc () {
      this.isUserCardOpen = false
      this.$router.push(vueRoutes.verification)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

// NOTE: we use the $point variable here because the `rem`s values passed to
// media queries don't rely on html's font-size and taking the default browser's
// value. See https://drafts.csswg.org/mediaqueries/#units
$custom-breakpoint: 80 * $point;

.navbar {
  width: 100%;
  min-height: 12rem;
  background-color: $col-navbar-background;
  padding: 0 $content-side-paddings;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding: 0 $content-side-paddings-sm 0 $content-side-paddings-sm + 5.2rem;
  }
}

.navbar__user-info {
  @include respond-to-custom($custom-breakpoint) {
    display: none;
  }
}

.navbar__title {
  color: $col-text-page-heading;
  font-size: 4rem;
  line-height: 1.5;
  font-weight: 400;
}

.navbar__sub-title {
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 400;
}

.navbar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__user-picture {
  width: 5.5rem;
  height: 5.5rem;
  font-size: 2.4rem;
  box-shadow: 0 .4rem 1rem 0 $col-avatar-instead-bg;
  margin-right: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: $col-avatar-instead-bg;
  color: $col-avatar-instead-text;

  @include respond-to-custom($custom-breakpoint) {
    margin-right: 0;
  }
}

.navbar__user-action {
  @include button-flat();
}

.navbar__user-name,
.navbar__user-name-icon {
  font-size: 1.8rem;
  cursor: pointer;
  color: $col-text-field-hint;
}

.navbar__user-name:hover > .navbar__user-email {
  text-decoration: underline;
}

.navbar__account-type {
  color: $col-text-field-hint;
  font-size: 1.2rem;
}

.navbar__user-name-icon:before {
  transition: 0.3s ease-out;
  will-change: transform;

}
.navbar__user-name-icon--active:before {
  transform: rotate(-180deg);
}

.navbar__root-links {
  display: flex;
  flex-wrap: nowrap;
}

.navbar__user {
  position: relative;
}

.navbar__open-info-btn {
  text-transform: none;
  margin-left: 0;
}

.navbar__user-card {
  position: absolute;
  right: 0;
  top: calc(100% + 1.4rem);
  overflow: visible;
  visibility: hidden;
  opacity: 0;
  margin-top: -1.5rem;
  transition: 0.3s ease-out;
  padding: 2.4rem 2.4rem 0 2.4rem;
  background: $col-block-bg;
  @include box-shadow();

  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 .8rem .8rem .8rem;
    border-color: transparent transparent $col-block-bg transparent;
    top: -.8rem;
    right: .4rem;

    @include respond-to-custom($custom-breakpoint) {
      right: 1.9rem;
    }
  }

  @include respond-to-custom($custom-breakpoint) {
    width: calc(100vw - #{$sidebar-width} - 4rem);
  }

  @include respond-to(small) {
    padding: 1.6rem 1.6rem 0 1.6rem;
    width: calc(100vw - 1.6rem);
    max-width: 40.4rem;
  }

  @include respond-to(xsmall) {
    width: calc(100vw - 4rem);
  }
}

.navbar__user-card--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.navbar__user-card-content {
  display: flex;
  padding-bottom: 2.1rem;
  position: relative;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
  }
}

.navbar__user-actions {
  position: relative;
  padding: .8rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:after {
    content: "";
    position: absolute;
    height: .1rem;
    width: calc(100% + 4.8rem);
    background-color: $col-navbar-background;
    left: -2.4rem;
    top: 0;
  }
}

.navbar__user-avatar {
  width: 10.2rem;
  height: 10.2rem;
  border-radius: 50%;
  font-size: 4.8rem;
  color: $col-navbar-avatar-color;
  background-color: $col-navbar-avatar-background;
  margin-right: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  @include respond-to(small) {
    margin-right: 0;
    margin-bottom: 1.2rem;
  }
}

.navbar__user-card-name {
  font-size: 1.6rem;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;
  margin-top: .4rem;
  margin-bottom: .4rem;
  white-space: nowrap;

  @include respond-to-custom($custom-breakpoint) {
    word-break: break-word;
  }
}

.navbar__user-card-status {
  font-size: 1.2rem;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;

  @include respond-to(small) {
    text-align: center;
  }
}

.navbar__user-card-account-btn {
  margin: 2.6rem 0 0 0;
  white-space: nowrap;

  @include button-raised();

  @include respond-to(small) {
    display: block;
    margin-right: auto;
    margin-left: auto;

    &:last-child {
      margin-right: auto;
      margin-left: auto;
    }
  }
}

.navbar__user-action-btn {
  color: rgba(0, 0, 0, 0.75) !important;
}

.navbar__user-card-ctn {
  padding: 0 !important;
}

.navbar__user-card-status--blocked {
  color: red;
}
</style>
