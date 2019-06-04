<template>
  <div class="issuance-form">
    <template v-if="isLoaded">
      <create-issuance-form
        v-if="ownedAssets.length"
        :owned-assets="ownedAssets"
        @submit="$emit(EVENTS.issuanceCreated)"
      />

      <no-data-message
        v-else
        icon-name="alert-circle"
        :title="'issuance-form.no-owned-assets-title' | globalize"
        :message="'issuance-form.no-owned-assets-msg' | globalize"
      />
    </template>

    <p v-else-if="isLoadFailed">
      {{ 'issuance-form.load-failed-msg' | globalize }}
    </p>

    <issuance-form-skeleton-loader
      v-else
    />
  </div>
</template>

<script>
import LoadOwnedAssetsMixin from './mixins/load-owned-assets.mixin'
import IssuanceFormSkeletonLoader from './components/issuance-form-skeleton-loader'

import NoDataMessage from '@/vue/common/NoDataMessage'
import CreateIssuanceForm from './components/create-issuance-form'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const EVENTS = {
  issuanceCreated: 'issuance-created',
}

export default {
  name: 'issuance-form-module',
  components: {
    NoDataMessage,
    CreateIssuanceForm,
    IssuanceFormSkeletonLoader,
  },
  mixins: [LoadOwnedAssetsMixin],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },
  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        await this.loadOwnedAssets(this.accountId)
        this.isLoaded = true
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>
