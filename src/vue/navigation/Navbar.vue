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
      <div
        class="navbar__user-picture"
        @click="isUserCardOpen = true"
      >
        {{ walletEmail.substr(0, 1).toUpperCase() }}
      </div>
      <div class="navbar__user-info">
        <div
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
        </div>
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
import { handleClickOutsideHelper } from '@/js/helpers/handle-click-outside'

export default {
  name: 'root-navbar',

  data: () => ({
    isUserCardOpen: false,
    isNotificationCardOpen: false,
    hasSeenNotif: null,
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
        handleClickOutsideHelper(
          'navbar__user-card',
          value,
          this.toggleUserCardVisibility
        )
      }
    },
    isNotificationCardOpen (value) {
      if (value) {
        handleClickOutsideHelper(
          'navbar__user-notif',
          value,
          this.toggleNotificationCardVisibility
        )
      }
    }
  },
  created () {
    this.hasSeenNotif = localStorage.hasOwnProperty('seen')
  },
  methods: {
    ...mapActions([
      vuexTypes.LOG_OUT
    ]),
    toggleUserCardVisibility () {
      this.isUserCardOpen = !this.isUserCardOpen
      this.isNotificationCardOpen = false
    },

    toggleNotificationCardVisibility () {
      this.isNotificationCardOpen = !this.isNotificationCardOpen
      this.isUserCardOpen = false
      if (!this.hasSeenNotif) {
        localStorage.setItem('seen', 'User saw it')
        this.hasSeenNotif = true
      }
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
      this.isNotificationCardOpen = false
      this.$router.push(vueRoutes.verification)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~L@scss/mixins";
@import "~L@scss/variables";

$custom-breakpoint: 800px;

.navbar {
  width: 100%;
  min-height: 121px;
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
  font-size: 40px;
  line-height: 1.5;
  font-weight: 400;
}

.navbar__sub-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
}

.navbar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__user-picture {
  width: 55px;
  height: 55px;
  font-size: 24px;
  box-shadow: 0 4px 10px 0 $col-avatar-instead-bg;
  margin-right: 16px;
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
  font-size: 18px;
  cursor: pointer;
  // TODO: remove important rule when possible
  color: $col-text-field-hint !important;
}

.navbar__user-name:hover > .navbar__user-email {
  text-decoration: underline;
}

.navbar__account-type {
  color: $col-text-field-hint;
  font-size: 12px;
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

.navbar__notif,
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
  top: calc(100% + 14px);
  overflow: visible;
  visibility: hidden;
  opacity: 0;
  margin-top: -15px;
  transition: 0.3s ease-out;
  padding: 24px 24px 0 24px;
  background: $col-block-bg;
  @include box-shadow();

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent $col-block-bg transparent;
    top: -8px;
    right: 4px;

    @include respond-to-custom($custom-breakpoint) {
      right: 19px;
    }
  }

  @include respond-to-custom($custom-breakpoint) {
    width: calc(100vw - #{$sidebar-width} - 40px);
  }

  @include respond-to(small) {
    padding: 16px 16px 0 16px;
    width: calc(100vw - 16px);
    max-width: 404px;
  }

  @include respond-to(xsmall) {
    width: calc(100vw - 40px);
  }
}

.navbar__user-card--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.navbar__user-card-content {
  display: flex;
  padding-bottom: 21px;
  position: relative;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
  }
}

.navbar__user-actions {
  position: relative;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:after {
    content: "";
    position: absolute;
    height: 1px;
    width: calc(100% + 48px);
    background-color: $col-navbar-background;
    left: -24px;
    top: 0;
  }
}

.navbar__user-avatar {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  font-size: 48px;
  color: $col-navbar-avatar-color;
  background-color: $col-navbar-avatar-background;
  margin-right: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;

  @include respond-to(small) {
    margin-right: 0;
    margin-bottom: 12px;
  }
}

.navbar__user-card-name {
  font-size: 16px;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;
  margin-top: 4px;
  margin-bottom: 4px;
  white-space: nowrap;

  @include respond-to-custom($custom-breakpoint) {
    word-break: break-word;
  }
}

.navbar__user-card-status {
  font-size: 12px;
  line-height: 1;
  text-align: left;
  color: $col-text-field-hint;

  @include respond-to(small) {
    text-align: center;
  }
}

.navbar__user-card-account-btn {
  margin: 26px 0 0 0;
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
