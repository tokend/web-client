<template>
  <div class="security-page">
    <drawer :is-shown.sync="isDrawerShown">
      <template v-if="viewMode === VIEW_MODES.enableTfa">
        <template slot="heading">
          <template v-if="isTotpEnabled">
            {{ 'security-page.disable-tfa-title' | globalize }}
          </template>
          <template v-else>
            {{ 'security-page.enable-tfa-title' | globalize }}
          </template>
        </template>
        <tfa-form @update="updateTfa" />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.changePassword">
        <template slot="heading">
          {{ 'security-page.change-password-btn' | globalize }}
        </template>
        <change-password-form />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.viewAccountId">
        <template slot="heading">
          {{ 'security-page.account-id-title' | globalize }}
        </template>
        <key-viewer
          :value="accountId"
          :label="'security-page.account-id-label' | globalize"
        />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.viewSecretSeed">
        <template slot="heading">
          {{ 'security-page.secret-seed-title' | globalize }}
        </template>
        <div class="secret-seed">
          <p class="secret-seed__description">
            {{ 'security-page.secret-seed-desc' | globalize }}
          </p>
          <clipboard-field
            :value="walletSeed"
            :label="'security-page.secret-seed-title' | globalize"
          />
        </div>
      </template>

      <template v-else-if="viewMode === VIEW_MODES.viewNetworkPassphrase">
        <template slot="heading">
          {{ 'security-page.network-passphrase-title' | globalize }}
        </template>
        <div class="network-passphrase">
          <p class="network-passphrase__description">
            {{ 'security-page.network-passphrase-desc' | globalize }}
          </p>
          <clipboard-field
            :value="api.networkDetails.networkPassphrase"
            :label="'security-page.network-passphrase-title' | globalize"
          />
        </div>
      </template>
    </drawer>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.enable-tfa-title' | globalize }}
      </p>
      <button @click="showDrawer(VIEW_MODES.enableTfa)">
        <switch-field :value="isTotpEnabled" />
      </button>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.password-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.changePassword)"
      >
        {{ 'security-page.change-password-btn' | globalize }}
      </a>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.account-id-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.viewAccountId)"
      >
        {{ 'security-page.view-account-id-btn' | globalize }}
      </a>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.secret-seed-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.viewSecretSeed)"
      >
        {{ 'security-page.view-secret-seed-btn' | globalize }}
      </a>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.network-passphrase-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.viewNetworkPassphrase)"
      >
        {{ 'security-page.view-network-passphrase-btn' | globalize }}
      </a>
    </div>
  </div>
</template>

<script>
import SwitchField from '@/vue/fields/SwitchField'
import ClipboardField from '@/vue/fields/ClipboardField'

import Drawer from '@/vue/common/Drawer'
import KeyViewer from '@/vue/common/KeyViewer'

import ChangePasswordForm from '@/vue/forms/ChangePasswordForm'
import TfaForm from '@/vue/forms/TfaForm'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

const VIEW_MODES = {
  enableTfa: 'enableTfa',
  changePassword: 'changePassword',
  viewAccountId: 'viewAccountId',
  viewSecretSeed: 'viewSecretSeed',
  viewNetworkPassphrase: 'viewNetworkPassphrase',
  default: '',
}

export default {
  name: 'security',
  components: {
    SwitchField,
    Drawer,
    KeyViewer,
    ClipboardField,
    ChangePasswordForm,
    TfaForm,
  },
  data: _ => ({
    isDrawerShown: false,
    viewMode: VIEW_MODES.default,
    VIEW_MODES,
    api,
    walletSeed: '',
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isTotpEnabled: vuexTypes.isTotpEnabled,
    }),
  },

  async created () {
    try {
      await this.loadFactors()
      this.walletSeed = await this.decryptSecretSeed()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadFactors: vuexTypes.LOAD_FACTORS,
      decryptSecretSeed: vuexTypes.DECRYPT_SECRET_SEED,
    }),
    showDrawer (viewMode) {
      this.viewMode = viewMode
      this.isDrawerShown = true
    },
    async updateTfa () {
      this.isDrawerShown = false
      try {
        await this.loadFactors()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.security-page {
  background: $col-block-bg;
  padding: 0 2.4rem;

  @include box-shadow();
}

.security-page__row {
  padding: 2.4rem 0;
  height: 7.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & + & {
    border-top: $col-block-line solid 0.05rem;
  }
}

.security-page__row-title {
  font-size: 1.8rem;
  color: $col-text;
}

.security-page__row-action {
  font-size: 1.3rem;
  cursor: pointer;
  color: $col-link;
  text-align: end;
}

.secret-seed__description,
.network-passphrase__description {
  font-size: 1.2rem;
  line-height: 1.25;
  color: $col-text-secondary;
  margin-bottom: 3rem;
}
</style>
