<template>
  <div class="business-viewer">
    <business-attributes
      :business="business"
    />

    <button
      v-ripple
      class="app__button-raised business-viewer__btn"
      @click="addBusiness"
      :disabled="isSubmitting"
    >
      {{ 'business-viewer.add-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import BusinessAttributes from './BusinessAttributes'
import { BusinessRecord } from '@/js/records/entities/business.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { api } from '@/api'
const EVENTS = {
  businessAdded: 'business-added',
}

export default {
  name: 'business-viewer',

  components: {
    BusinessAttributes,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },

  data: _ => ({
    isSubmitting: false,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  methods: {
    async addBusiness () {
      this.isSubmitting = true
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        await api.postWithSignature(endpoint, {
          data: {
            id: this.business.accountId,
            type: 'businesses',
          },
        })

        this.$emit(EVENTS.businessAdded)
        Bus.success('business-viewer.business-added-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },
  },

}
</script>

<style lang="scss" scoped>
.business-viewer__btn {
  margin-top: 5rem;
}
</style>
