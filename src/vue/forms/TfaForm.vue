<template>
  <form
    class="app-form tfa-form"
    @submit.prevent="isFormValid() && enableTfa()"
  >
    <template v-if="!factor.seed">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.password"
            @blur="touchField('form.password')"
            name="tfa-password"
            type="password"
            :trim="false"
            :error-message="getFieldErrorMessage('form.password')"
            :label="'tfa-form.password-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="button"
          class="tfa-form__btn app__button-raised"
          @click="toggleFactor"
          :disabled="formMixin.isDisabled"
        >
          <template v-if="isTotpEnabled">
            {{ 'tfa-form.disable-btn' | globalize }}
          </template>
          <template v-else>
            {{ 'tfa-form.next-btn' | globalize }}
          </template>
        </button>
      </div>
    </template>

    <template v-else>
      <p class="tfa-form__hint">
        {{ 'tfa-form.qr-desc' | globalize }}
      </p>
      <key-viewer
        :value="factor.seed"
        :is-clipboard-shown="false"
      />
      <p class="tfa-form__hint">
        {{ 'tfa-form.secret-code-desc' | globalize }}
      </p>
      <clipboard-field
        :value="factor.secret"
        :label="'tfa-form.secret-lbl' | globalize"
        tooltip-type="tfaClipboard"
      />
      <p class="tfa-form__hint tfa-form__code-hint">
        {{ 'tfa-form.tfa-code-desc' | globalize }}
      </p>
      <div class="app__form-field">
        <input-field
          v-model="form.code"
          @blur="touchField('form.code')"
          name="tfa-code"
          :error-message="getFieldErrorMessage('form.code')"
          :label="'tfa-form.code-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="tfa-form__btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'tfa-form.enable-btn' | globalize }}
        </button>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import KeyViewer from '@/vue/common/KeyViewer'
import ClipboardField from '@/vue/fields/ClipboardField'

import { required, password } from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { api, factorsManager } from '@/api'
import { errors } from '@tokend/js-sdk'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

const ENABLED_FACTOR_PRIORITY = 1
const EVENTS = {
  update: 'update',
}

export default {
  name: 'tfa-form',
  components: {
    KeyViewer,
    ClipboardField,
  },
  mixins: [FormMixin],
  data: _ => ({
    factor: {},
    form: {
      password: '',
      code: '',
    },
  }),
  validations: {
    form: {
      password: { required, password },
      code: { required },
    },
  },
  computed: {
    ...mapGetters({
      isTotpEnabled: vuexTypes.isTotpEnabled,
      totpFactors: vuexTypes.factorsTotp,
      walletId: vuexTypes.walletId,
    }),
  },
  async created () {
    try {
      await this.loadFactors()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    ...mapActions({
      loadFactors: vuexTypes.LOAD_FACTORS,
    }),
    async toggleFactor () {
      if (!this.isFormValid('form.password')) {
        return
      }
      this.disableForm()
      if (this.isTotpEnabled) {
        await this.deleteTotpFactor()
      } else {
        await this.createTotpFactor()
      }
      this.enableForm()
    },
    async createTotpFactor () {
      const endpoint = `/wallets/${this.walletId}/factors`
      try {
        await this.deleteTotpFactor()

        await api.postWithSignature(endpoint, {
          data: { type: 'totp' },
        })
      } catch (error) {
        if (error instanceof errors.TFARequiredError) {
          try {
            await factorsManager.verifyPasswordFactor(
              error, this.form.password
            )
            const { data } = await api.postWithSignature(endpoint, {
              data: { type: 'totp' },
            })
            this.factor = data
          } catch (e) {
            ErrorHandler.process(e, 'tfa-form.wrong-password-err')
          }
        } else {
          ErrorHandler.process(error)
        }
      }
    },
    async deleteTotpFactor () {
      try {
        if (this.totpFactors[0]) {
          const factorId = this.totpFactors[0].id
          const endpoint = `/wallets/${this.walletId}/factors/${factorId}`

          await api.deleteWithSignature(endpoint)
        }
      } catch (error) {
        if (error instanceof errors.TFARequiredError) {
          try {
            await factorsManager.verifyPasswordFactorAndRetry(error,
              this.form.password
            )
            Bus.success('tfa-form.tfa-disabled-msg')
            this.$emit(EVENTS.update)
          } catch (e) {
            ErrorHandler.process(e, 'tfa-form.wrong-password-err')
          }
        } else {
          ErrorHandler.process(error)
        }
      }
    },
    async enableTfa () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await this.changeFactorPriority()
      } catch (error) {
        if (error instanceof errors.TFARequiredError) {
          try {
            await factorsManager.verifyTotpFactor(error, this.form.code)
            await this.changeFactorPriority()

            this.$emit(EVENTS.update)
            Bus.success('tfa-form.tfa-enabled-msg')
          } catch (e) {
            ErrorHandler.process(e, 'tfa-form.wrong-code-err')
          }
        } else {
          ErrorHandler.process(error)
        }
      }
      this.enableForm()
    },
    async changeFactorPriority () {
      const endpoint = `/wallets/${this.walletId}/factors/${this.factor.id}`
      await api.patchWithSignature(endpoint, {
        data: { attributes: { priority: ENABLED_FACTOR_PRIORITY } },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.tfa-form__btn {
  max-width: 18rem;
  width: 100%;
}

.tfa-form__hint {
  margin-bottom: 1.2rem;
}

.tfa-form__code-hint {
  margin-top: 3rem;
}
</style>
