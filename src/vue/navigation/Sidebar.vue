<template>
  <div class="sidebar">
    <div
      class="sidebar__backdrop"
      :class="{ 'sidebar__backdrop--active': isOpened }"
      @click="closeSidebar"
    />

    <button
      @click="openSidebar"
      class="sidebar__burger-btn"
      :class="{ 'sidebar__burger-btn--sidebar-active': isOpened }"
    >
      <i class="mdi mdi-menu" />
    </button>

    <div
      class="sidebar__lists"
      :class="{ 'sidebar__lists--closed': !isOpened }"
    >
      <section class="sidebar__logotype">
        <router-link
          @click.native="closeSidebar"
          :to="vueRoutes.dashboard"
        >
          <logo class="sidebar__logotype-icon" />
        </router-link>
      </section>

      <section class="sidebar__list">
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.dashboard"
            tag="li"
            v-if="config.FEATURE_FLAGS.dashboard"
          >
            <i class="sidebar__list-item-icon mdi mdi-view-dashboard" />
            <span>
              {{ 'pages-names.dashboard' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.deposit"
            tag="li"
            v-if="config.FEATURE_FLAGS.deposit"
          >
            <i class="sidebar__list-item-icon mdi mdi-download" />
            <span>
              {{ 'pages-names.deposit' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.withdrawal"
            tag="li"
            v-if="config.FEATURE_FLAGS.withdrawal"
          >
            <i class="sidebar__list-item-icon mdi mdi-upload" />
            <span>
              {{ 'pages-names.withdraw' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.transfers"
            tag="li"
            v-if="config.FEATURE_FLAGS.transfers"
          >
            <i class="sidebar__list-item-icon mdi mdi-send" />
            <span>
              {{ 'pages-names.send' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.history"
            tag="li"
            v-if="config.FEATURE_FLAGS.history"
          >
            <i class="sidebar__list-item-icon mdi mdi-view-sequential" />
            <span>
              {{ 'pages-names.history' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.limits"
            tag="li"
            v-if="config.FEATURE_FLAGS.limits"
          >
            <i class="sidebar__list-item-icon mdi mdi-poll-box" />
            <span>
              {{ 'pages-names.limits' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.massTransfers"
            tag="li"
            v-if="config.FEATURE_FLAGS.massTransfers"
          >
            <i class="sidebar__list-item-icon mdi mdi-account-multiple" />
            <span>
              {{ 'pages-names.mass-transfer' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.trade"
            tag="li"
            v-if="config.FEATURE_FLAGS.trade"
          >
            <i class="sidebar__list-item-icon mdi mdi-swap-horizontal" />
            <span>
              {{ 'pages-names.trade' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.fees"
            tag="li"
            v-if="config.FEATURE_FLAGS.feesExplorer"
          >
            <i class="sidebar__list-item-icon mdi mdi-flash" />
            <span>
              {{ 'pages-names.fees' | globalize }}
            </span>
          </router-link>
        </ul>
      </section>

      <section class="sidebar__section sidebar__section--account sidebar__list">
        <div class="sidebar__list-title">
          {{ 'sidebar.section-explore' | globalize }}
        </div>
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.tokens"
            tag="li"
            v-if="config.FEATURE_FLAGS.tokens"
          >
            <i class="sidebar__list-item-icon mdi mdi-coins" />
            <span>
              {{ 'pages-names.explore-tokens' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.sales"
            tag="li"
            v-if="config.FEATURE_FLAGS.sales"
          >
            <i class="sidebar__list-item-icon mdi mdi-trending-up" />
            <span>
              {{ 'pages-names.explore-sales' | globalize }}
            </span>
          </router-link>
        </ul>
      </section>

      <section
        class="sidebar__section sidebar__section--account sidebar__list"
        v-if="accountTypeI === ACCOUNT_TYPES.syndicate"
      >
        <div class="sidebar__list-title">
          {{ 'sidebar.section-corporate' | globalize }}
        </div>
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.tokenCreation"
            tag="li"
            v-if="config.FEATURE_FLAGS.tokenCreation"
          >
            <i class="sidebar__list-item-icon mdi mdi-plus-circle" />
            <span>
              {{ 'pages-names.create-token' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.saleCreation"
            tag="li"
            v-if="config.FEATURE_FLAGS.saleCreation"
          >
            <i class="sidebar__list-item-icon mdi mdi-calendar-blank" />
            <span>
              {{ 'pages-names.create-sale' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.preissuanceUpload"
            tag="li"
            v-if="config.FEATURE_FLAGS.preIssuanceUpload"
          >
            <i class="sidebar__list-item-icon mdi mdi-arrow-expand-all" />
            <span>
              {{ 'pages-names.upload-pre-issuance' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.issuanceCreation"
            tag="li"
            v-if="config.FEATURE_FLAGS.issuanceCreation"
          >
            <i class="sidebar__list-item-icon mdi mdi-chart-bar" />
            <span>
              {{ 'pages-names.create-issuance' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.requests"
            tag="li"
            v-if="config.FEATURE_FLAGS.requests"
          >
            <i class="sidebar__list-item-icon mdi mdi-book-open-variant" />
            <span>
              {{ 'pages-names.requests' | globalize }}
            </span>
          </router-link>
        </ul>
      </section>

      <section class="sidebar__section sidebar__section--account sidebar__list">
        <div class="sidebar__list-title">
          {{ 'sidebar.section-account' | globalize }}
        </div>
        <ul>
          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.verification"
            tag="li"
            v-if="config.FEATURE_FLAGS.verification"
          >
            <i class="sidebar__list-item-icon mdi mdi-shield" />
            <span>
              {{ 'pages-names.verification' | globalize }}
            </span>
          </router-link>

          <router-link
            v-ripple
            class="sidebar__list-item"
            @click.native="closeSidebar"
            :to="vueRoutes.settings"
            tag="li"
            v-if="config.FEATURE_FLAGS.settings"
          >
            <i class="sidebar__list-item-icon mdi mdi-settings" />
            <span>
              {{ 'pages-names.settings' | globalize }}
            </span>
          </router-link>
        </ul>
      </section>

      <app-footer />
    </div>
  </div>
</template>

<script>
import config from '@/config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import Logo from '@/vue/assets/Logo'
import AppFooter from '@/vue/navigation/Footer'
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { vueRoutes } from '@/vue-router'

export default {
  name: 'sidebar',

  components: {
    Logo,
    AppFooter
  },

  data: () => ({
    isOpened: false,
    config,
    ACCOUNT_TYPES,
    vueRoutes
  }),

  computed: {
    ...mapGetters({
      // FIXME: set actual getter
      accountTypeI: vuexTypes.accountTypeI
    })
  },

  methods: {
    openSidebar () {
      this.isOpened = true
    },
    closeSidebar () {
      this.isOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.sidebar {
  position: relative;
  background-color: $col-sidebar-background !important;
  box-shadow: inset -1 * $point -1 * $point 2 * $point 0 rgba(0, 0, 0, 0.03);
  min-height: 100%;
}

.sidebar__lists {
  width: $sidebar-width;
  min-height: 100%;
  padding-bottom: 7 * $point;
  z-index: 120;
  list-style: none;

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    width: $sidebar-width;
    background-color: $col-sidebar-background-media-small !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__lists--closed {
    @include respond-to-custom($sidebar-hide-bp) {
      opacity: 0;
      width: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.sidebar__backdrop {
  @include respond-to-custom($sidebar-hide-bp) {
    position: fixed;
    left: -100%;
    top: 0;
    z-index: 115;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.sidebar__backdrop--active {
    left: $sidebar-width;
    opacity: 1;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  }
}

.sidebar__burger-btn {
  position: absolute;
  left: .5 * $point;
  top: 4.1 * $point;
  z-index: 110;
  width: 4 * $point;
  height: 4 * $point;
  margin-right: 0;
  margin-left: .8 * $point !important;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: $col-button-flat-txt !important;
  transform: translateX($sidebar-width);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    transform: translateX(0);
  }

  &.sidebar__burger-btn--sidebar-active {
    transform: translateX($sidebar-width);
  }
}

.sidebar__list-item {
  display: flex;
  align-items: center;
  min-height: 4.8 * $point;
  cursor: pointer;
  color: $col-sidebar-text;

  &.router-link-active {
    background-color: $col-sidebar-active-elem-background;
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__list-title,
.sidebar__list-item,
.sidebar__logotype {
  padding: 0 2.4 * $point 0 4 * $point;
}

.sidebar__logotype {
  padding-top: 4 * $point;
  padding-bottom: 5 * $point;
}

.sidebar__logotype-icon {
  max-width: 9.5 * $point;
  width: 100%;
  height: 3.1 * $point;
  display: block;
}

.sidebar__list-item-icon {
  margin-right: 1.6 * $point;
  color: $col-sidebar-text;
  font-size: 2.4 * $point;

  .router-link-active & {
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__section--account {
  margin-top: 5 * $point;
}

.sidebar__list-title {
  color: $col-sidebar-active-elem-text;
  font-size: 1.6 * $point;
  margin-bottom: .8 * $point;
}
</style>
