<template>
  <div class="tfa-settings">
    <div
      class="tfa-settings__password-checker"
      v-if="!isSettingsOpened">
      <h2 class="tfa-settings__title">{{ i18n.mod_pwd_required() }}</h2>
      <div class="tfa-settings__switch-outer">
        <span class="tfa-settings__switch-text">
          {{ i18n.set_tfa_enable() }}
        </span>
        <md-switch
          class="md-primary"
          @change="changeState"
          :value="tfaState" />
      </div>
      <p
        class="state-banner__message"
        v-if="switchTriggered">
        <md-icon class="md-icon-size-065x">verified_user</md-icon>
        Enter password to apply changes
      </p>
      <input-field
        v-model="form.password"
        :disabled="!switchTriggered"
        v-validate="'required'"
        id="signup-recovery-seed"
        type="password"
        name="password"
        :label="i18n.lbl_pwd()"
        :toggle-password="true"
      />
      <button
        v-ripple
        :disabled="!switchTriggered"
        @click="save"
        class="app__button-flat tfa-settings__submit-btn">
        {{ i18n.lbl_ok() }}
      </button>
    </div>
    <div
      class="tfa-settings__qr-wrapper"
      v-if="isSettingsOpened">
      <md-dialog-title class="tfa-settings__qr-title">
        {{ i18n.set_tfa_enable() }}
      </md-dialog-title>
      <div class="app__dialog-inner">
        <p class="tfa-settings__explain">
          {{ i18n.set_tfa_scan_the_qr_code() }}
        </p>
        <div
          class="tfa-settings__qr-outer"
          v-if="inputMode === INPUT_MODES.qr">
          <!--TODO: use vue-qr instead for consistency-->
          <qrcode
            class="tfa-settings__qr-code"
            :text="factor.qr"
            :size="225"
            color="#3f4244"
          />
        </div>
        <p class="tfa-settings__explain-additional">
          {{ i18n.set_or_manually_enter() }}
        </p>
        <clipboard-field
          class="tfa-settings__copy-secret"
          :value="factor.secret"
          :label="i18n.lbl_secret()"
        />
      </div>

      <md-dialog-actions class="md-layout md-alignment-center-right">
        <button
          v-ripple
          @click="isSettingsOpened = false"
          class="app__button-flat">
          {{ i18n.lbl_cancel() }}
        </button>
        <button
          v-ripple
          @click="updateFactor"
          class="app__button-flat">
          {{ i18n.lbl_confirm() }}
        </button>
      </md-dialog-actions>
    </div>
  </div>
</template>

<script>
import FormMixin from '../../../common/mixins/form.mixin'
import ClipboardField from '../../../common/fields/ClipboardField'
import InputField from '../../../common/fields/InputField'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { factorsService } from '../../../../js/services/factors.service'
import { i18n } from '../../../../js/i18n/index'
import { AuthStateHelper } from '../../../../vuex/helpers/auth.helper'

import Qrcode from 'vue-qrcode-component'

const ENABLED_FACTOR_PRIORITY = 1
const TFA_STATES = {
  on: false,
  off: true
}
const INPUT_MODES = {
  qr: 'qr',
  manual: 'manual'
}

export default {
  name: 'tfa-settings',
  components: { Qrcode, ClipboardField, InputField },
  mixins: [FormMixin],
  data: _ => ({
    tfaState: TFA_STATES.off,
    inputMode: INPUT_MODES.qr,
    isSettingsOpened: false,
    factor: {
      id: -1,
      secret: null,
      qr: null
    },
    i18n,
    INPUT_MODES,
    form: {
      password: ''
    },
    switchTriggered: false
  }),
  created () {
    this.checkState()
  },
  methods: {
    changeState () {
      this.tfaState = !this.tfaState
      this.switchTriggered = !this.switchTriggered
    },

    async save () {
      if (!await this.isValid()) return
      if (!await AuthStateHelper.isPasswordCorrect(this.form.password)) {
        EventDispatcher.dispatchShowErrorEvent(i18n.mod_pwd_wrond())
        return
      }
      switch (!this.tfaState) {
        case TFA_STATES.off:
          await this.createFactor()
          break
        case TFA_STATES.on: {
          await this.deleteFactor()
          break
        }
      }
      this.inp = !this.inp
      this.switchTriggered = !this.switchTriggered
    },

    async checkState () {
      let factors
      try {
        factors = (await factorsService.loadFactors())
          .data()
          .filter(factor => factor.type === 'totp')
      } catch (error) {
        console.error(error)
        EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
        return
      }

      if (!factors.length) {
        return
      }

      const disabledFactors = factors
        .filter(factor => factor.attributes.priority === 0)
        .map(factor => factor.id)

      if (disabledFactors.length) {
        await Promise.all(disabledFactors.map(id =>
          factorsService.deleteFactor(id))
        )
        return
      }

      this.tfaState = TFA_STATES.on
      this.factor.id = factors[0].id
    },
    async createFactor () {
      try {
        if (this.factor.id !== -1) {
          await factorsService.deleteFactor(this.factor.id)
        }
        const factor = await factorsService.createFactor(
          'totp',
          this.form.password
        )
        this.factor.secret = factor.attribute('secret')
        this.factor.qr = factor.attribute('seed')
        this.factor.id = factor.data('id')
        this.isSettingsOpened = true
      } catch (error) {
        console.error(error)
        if (error.showBanner) {
          error.showBanner(i18n.unexpected_error())
          return
        }
        EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
      }
    },
    async updateFactor () {
      try {
        await factorsService.updateFactor(
          this.factor.id,
          ENABLED_FACTOR_PRIORITY
        )
        this.tfaState = TFA_STATES.on
        this.isSettingsOpened = false
        this.form.password = ''
      } catch (error) {
        if (error.showBanner) {
          error.showBanner(i18n.unexpected_error())
          return
        }
        EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
      }
    },
    async deleteFactor () {
      try {
        await factorsService.deleteFactor(this.factor.id, this.form.password)
        this.tfaState = TFA_STATES.off
        this.form.password = ''
      } catch (error) {
        if (error.showBanner) {
          error.showBanner(i18n.unexpected_error())
          return
        }
        EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'settings';
  @import "~L@scss/variables";
  @import "~L@scss/mixins";

  .md-dialog {
    width: 25rem;
  }

  .tfa-settings__qr-outer {
    max-width: 225px;
    margin: 0 auto 20px;
  }

  .tfa-settings__explain {
    margin-bottom: 20px;
  }

  .tfa-settings__explain-additional,
  .tfa-settings__copy-secret {
    margin-bottom: 10px;
  }

  .tfa-settings__switch-outer {
    display: flex;
    align-items: center;
  }

  .tfa-settings__password-message {
    color: $col-text-page-explanations;
    margin-bottom: 16px;

    i {
      font-size: 18px !important;
      margin-top: -2px;
      margin-right: 5px;
      color: $col-text-page-explanations !important;
    }
  }

  .tfa-settings__title {
    margin-bottom: 1rem;
    color: $col-text-page-heading;
  }

  .tfa-settings__switch-text {
    margin-right: 1rem;
  }

  .tfa-settings__submit-btn {
    float: right;
    margin-right: -1rem;
  }

</style>
