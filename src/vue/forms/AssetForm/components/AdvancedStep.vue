<template>
  <form
    class="app__form advanced-step"
    @submit.prevent="confirm()"
  >
    <template v-if="former.isCreateOpBuilder">
      <issuance-section
        ref="issuance-section"
        class="app__form advanced-step__section"
        :former="former"
        :is-disabled="isDisabled"
      />

      <permissions-section
        ref="permissions-section"
        class="app__form advanced-step__section"
        :former="former"
        :is-disabled="isDisabled"
      />
    </template>

    <template v-if="kvBridgesEnabled">
      <stellar-section
        ref="stellar-section"
        class="app__form advanced-step__section"
        :former="former"
        :is-disabled="isDisabled"
        :is-other-integration="!!integration && integration !== 'stellar'"
        @enabled="integration = 'stellar'"
        @disabled="integration = integration === 'stellar' ? '' : integration"
      />

      <erc20-section
        ref="erc20-section"
        class="app__form advanced-step__section"
        :former="former"
        :is-disabled="isDisabled"
        :is-other-integration="!!integration && integration !== 'erc20'"
        @enabled="integration = 'erc20'"
        @disabled="integration = integration === 'erc20' ? '' : integration"
      />
    </template>

    <terms-section
      ref="terms-section"
      class="app__form advanced-step__section"
      :former="former"
      :is-disabled="isDisabled"
    />

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
    }
  },

  computed: {
    ...mapGetters({ kvBridgesEnabled: vuexTypes.kvBridgesEnabled }),
  },

  methods: {
    confirm () {
      if (!this.isFormValid()) return
      this.showConfirmation()
      this.collectChildrenAttrs()
      this.$emit('update:isDisabled', true)
    },

    next () {
      if (!this.isFormValid()) return
      this.$emit('next')
    },

    collectChildrenAttrs () {
      Object.values(this.$refs)
        .filter(el => el.collect).forEach(el => el.collect())
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.advanced-step {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 3.2rem;
}
</style>
