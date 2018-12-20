<template>
  <nav class="navbar">
    <div class="navbar__title-wrapper">
      <template v-if="$route.meta.pageSubname">
        <h3 class="navbar__sub-title">
          {{ $route.meta.pageSubname | globalize }}
        </h3>
      </template>
      <h2 class="navbar__title">
        {{ $route.meta.pageName | globalize }}
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
          <md-icon
            class="navbar__user-name-icon"
            :class="{ 'navbar__user-name-icon--active': isUserCardOpen }"
          >
            keyboard_arrow_down
          </md-icon>
        </button>
        <div class="navbar__account-type">
          <template v-if="accountTypeI === ACCOUNT_TYPES.notVerified">
            {{ 'navbar.account-type-unverified' | globalize }}
          </template>
          <template v-else-if="accountTypeI === ACCOUNT_TYPES.individual">
            {{ 'navbar.account-type-general' | globalize }}
          </template>
          <template v-else-if="accountTypeI === ACCOUNT_TYPES.syndicate">
            {{ 'navbar.account-type-corporate' | globalize }}
          </template>
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
                <template v-if="accountTypeI === ACCOUNT_TYPES.notVerified">
                  {{ 'navbar.account-type-unverified' | globalize }}
                </template>
                <template v-else-if="accountTypeI === ACCOUNT_TYPES.individual">
                  {{ 'navbar.account-type-general' | globalize }}
                </template>
                <template v-else-if="accountTypeI === ACCOUNT_TYPES.syndicate">
                  {{ 'navbar.account-type-corporate' | globalize }}
                </template>
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
              @click="signOut"
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
import { mapActions, mapGetters } from 'vuex'
import { vueRoutes } from '@/vue-router'
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { handleClickOutside } from '@/js/helpers/handle-click-outside'

export default {
  name: 'root-navbar',

  data: () => ({
    isUserCardOpen: false,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters({
      walletEmail: `new-wallet/${vuexTypes.walletEmail}`,
      accountType: `new-account/${vuexTypes.accountType}`,
      accountTypeI: `new-account/${vuexTypes.accountTypeI}`
    })
  },
  watch: {
    isUserCardOpen (value) {
      if (value) {
        handleClickOutside(
          'navbar__user-card',
          this.toggleUserCardVisibility
        )
      }
    }
  },
  methods: {
    ...mapActions([
      vuexTypes.LOG_OUT
    ]),
    toggleUserCardVisibility () {
      this.isUserCardOpen = !this.isUserCardOpen
    },
    signOut () {
      this.LOG_OUT()
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

$custom-breakpoint: 80 * $point;

.navbar {
  width: 100%;
  min-height: 12 * $point;
  background-color: $col-navbar-background;
  padding: 0 $content-side-paddings;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding: 0 $content-side-paddings-sm 0 $content-side-paddings-sm + 5.2 *
      $point;
  }
}

.navbar__user-info {
  @include respond-to-custom($custom-breakpoint) {
    display: none;
  }
}

.navbar__title {
  color: $col-text-page-heading;
  font-size: 4 * $point;
  line-height: 1.5;
  font-weight: 400;
}

.navbar__sub-title {
  margin-bottom: 0.8 * $point;
  font-size: 1.4 * $point;
  font-weight: 400;
}

.navbar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__user-picture {
  width: 5.5 * $point;
  height: 5.5 * $point;
  font-size: 2.4 * $point;
  box-shadow: 0 .4 * $point 1 * $point 0 $col-avatar-instead-bg;
  margin-right: 1.6 * $point;
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
  font-size: 1.8 * $point;
  cursor: pointer;
  // TODO: remove important rule when possible
  color: $col-text-field-hint !important;
}

.navbar__user-name:hover > .navbar__user-email {
  text-decoration: underline;
}

.navbar__account-type {
  color: $col-text-field-hint;
  font-size: 1.2 * $point;
}

.navbar__user-name-icon {
  transition: 0.3s ease-out;
  will-change: transform;

  &.navbar__user-name-icon--active {
    transform: rotate(-180deg);
  }
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
  top: calc(100% + (1.4 * #{$point}));
  overflow: visible;
  visibility: hidden;
  opacity: 0;
  margin-top: -1.5 * $point;
  transition: 0.3s ease-out;
  padding: 2.4 * $point 2.4 * $point 0 2.4 * $point;
  background: $col-block-bg;
  @include box-shadow();

  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 .8 * $point .8 * $point .8 * $point;
    border-color: transparent transparent $col-block-bg transparent;
    top: -.8 * $point;
    right: .4 * $point;

    @include respond-to-custom($custom-breakpoint) {
      right: 1.9 * $point;
    }
  }

  @include respond-to-custom($custom-breakpoint) {
    width: calc(100vw - #{$sidebar-width} - 4 * #{$point});
  }

  @include respond-to(small) {
    padding: 1.6 * $point 1.6 * $point 0 1.6 * $point;
    width: calc(100vw - 1.6 * #{$point});
    max-width: 40.4 * $point;
  }

  @include respond-to(xsmall) {
    width: calc(100vw - 4 * #{$point});
  }
}

.navbar__user-card--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.navbar__user-card-content {
  display: flex;
  padding-bottom: 2.1 * $point;
  position: relative;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
  }
}

.navbar__user-actions {
  position: relative;
  padding: .8 * $point 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:after {
    content: "";
    position: absolute;
    height: .1 * $point;
    width: calc(100% + (4.8 * #{$point}));
    background-color: $col-navbar-background;
    left: -2.4 * $point;
    top: 0;
  }
}

.navbar__user-avatar {
  width: 10.2 * $point;
  height: 10.2 * $point;
  border-radius: 50%;
  font-size: 4.8 * $point;
  color: $col-navbar-avatar-color;
  background-color: $col-navbar-avatar-background;
  margin-right: 2.7 * $point;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  @include respond-to(small) {
    margin-right: 0;
    margin-bottom: 1.2 * $point;
  }
}

.navbar__user-card-name {
  font-size: 1.6 * $point;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;
  margin-top: .4 * $point;
  margin-bottom: .4 * $point;
  white-space: nowrap;

  @include respond-to-custom($custom-breakpoint) {
    word-break: break-word;
  }
}

.navbar__user-card-status {
  font-size: 1.2 * $point;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;

  @include respond-to(small) {
    text-align: center;
  }
}

.navbar__user-card-account-btn {
  margin: 2.6 * $point 0 0 0;
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
