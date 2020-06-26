<template>
  <form
    class="app__form advanced-step"
    @submit.prevent="confirm()"
  >
    <div class="advanced-step__sections">
      <template v-if="former.isCreateOpBuilder">
        <issuance-section
          class="app__form advanced-step__section"
          :former="former"
          :on-collect="onCollect"
          :is-disabled="isDisabled"
        />

        <permissions-section
          class="app__form advanced-step__section"
          :former="former"
          :on-collect="onCollect"
          :is-disabled="isDisabled"
        />
      </template>

      <template v-if="kvBridgesEnabled">
        <stellar-section
          class="app__form advanced-step__section"
          :former="former"
          :on-collect="onCollect"
          :is-disabled="isDisabled"
          :is-other-integration="isOtherIntegration(INTEGRATIONS.stellar)"
          @enabled="setIntegration(INTEGRATIONS.stellar)"
          @disabled="unsetIntegration(INTEGRATIONS.stellar)"
        />

        <erc20-section
          class="app__form advanced-step__section"
          :former="former"
          :on-collect="onCollect"
          :is-disabled="isDisabled"
          :is-other-integration="isOtherIntegration(INTEGRATIONS.erc20)"
          @enabled="setIntegration(INTEGRATIONS.erc20)"
          @disabled="unsetIntegration(INTEGRATIONS.erc20)"
        />
      </template>

      <terms-section
        class="app__form advanced-step__section"
        :former="former"
        :on-collect="onCollect"
        :is-disabled="isDisabled"
      />
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || next()"
        @cancel="hideConfirmation() || $emit('update:isDisabled', false)"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step__btn"
        :disabled="isDisabled"
      >
        <template v-if="former.willUpdateRequest">
          {{ 'asset-form.update-request-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'asset-form.create-request-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import IssuanceSection from './IssuanceSection'
import PermissionsSection from './PermissionsSection'
import StellarSection from './StellarSection'
import Erc20Section from './Erc20Section'
import TermsSection from './TermsSection'

const INTEGRATIONS = {
  stellar: 'stellar',
  erc20: 'erc20',
}

export default {
  name: 'advanced-step',

  components: {
    IssuanceSection,
    PermissionsSection,
    StellarSection,
    Erc20Section,
    TermsSection,
  },

  mixins: [FormMixin],

  props: {
    former: { type: AssetFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    return {
      integration: '',
      collectCallbacks: [],
      INTEGRATIONS,
    }
  },

  computed: {
    ...mapGetters({ kvBridgesEnabled: vuexTypes.kvBridgesEnabled }),
  },

  methods: {
    onCollect (callback) {
      this.collectCallbacks.push(callback)
      const unsubscribe = () => {
        this.collectCallbacks = this.collectCallbacks
          .filter(el => el !== callback)
      }
      return unsubscribe
    },

    confirm () {
      if (!this.isFormValid()) return
      this.showConfirmation()
      this.$emit('update:isDisabled', true)
    },

    next () {
      if (!this.isFormValid()) return
      this.collectCallbacks.forEach(cb => cb())
      this.$emit('next')
    },

    isOtherIntegration (integration) {
      if (!this.integration) return false
      return this.integration !== integration
    },

    setIntegration (integration) {
      if (!Object.values(INTEGRATIONS).includes(integration)) return
      this.integration = integration
    },

    unsetIntegration (integration) {
      if (this.integration && this.integration !== integration) return
      this.integration = ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.advanced-step__sections {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 3.2rem;
}
</style>
