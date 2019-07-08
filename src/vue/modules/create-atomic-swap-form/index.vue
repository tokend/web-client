<template>
  <div class="create-atomic-swap">
    <template
      v-if="isLoaded &&
        baseAtomicSwapBalancesAssets.length &&
        quoteAtomicSwapAssets.length"
    >
      <create-atomic-swap-form
        @created-atomic-swap="$emit(EVENTS.createdAtomicSwap)"
      />
    </template>
    <!-- eslint-disable max-len -->
    <no-data-message
      v-else-if="isLoaded && !baseAtomicSwapBalancesAssets.length"
      icon-name="alert-circle"
      :title="'create-atomic-swap-form.no-base-atomic-swap-assets-title' | globalize"
      :message="'create-atomic-swap-form.no-base-atomic-swap-assets-msg' | globalize"
    />

    <no-data-message
      v-else-if="isLoaded && !quoteAtomicSwapAssets.length"
      icon-name="alert-circle"
      :title="'create-atomic-swap-form.no-quote-atomic-swap-assets-title' | globalize"
      :message="'create-atomic-swap-form.no-quote-atomic-swap-assets-msg' | globalize"
    />
    <!-- eslint-enable max-len -->

    <template v-else-if="isLoadFailed">
      <p class="create-atomic-swap-form__error-msg">
        {{ 'create-atomic-swap-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <create-atomic-swap-form-skeleton-loader
      v-else
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CreateAtomicSwapFormSkeletonLoader from './components/create-atomic-swap-form-skeleton-loader'
import CreateAtomicSwapForm from './components/create-atomic-swap-form'

const EVENTS = {
  createdAtomicSwap: 'created-atomic-swap',
}

export default {
  name: 'create-atomic-swap-form-module',
  components: {
    NoDataMessage,
    CreateAtomicSwapFormSkeletonLoader,
    CreateAtomicSwapForm,
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      quoteAtomicSwapAssets: vuexTypes.quoteAtomicSwapAssets,
    }),
  },

  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback()
    }
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
  },
}
</script>
