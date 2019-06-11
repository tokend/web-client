<template>
  <div class="issuance-form">
    <template v-if="isLoaded">
      <create-poll-form
        :restricted-poll-type="restrictedPollType"
        @submit="$emit(EVENTS.submit)"
      />
    </template>

    <p v-else-if="isLoadFailed">
      {{ 'create-poll-form.load-failed-msg' | globalize }}
    </p>

    <create-poll-form-skeleton-loader
      v-else
    />
  </div>
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'
import LoadPollTypesMixin from './mixins/load-poll-types.mixin'
import CreatePollFormSkeletonLoader from './components/create-poll-form-skeleton-loader'
import CreatePollForm from './components/create-poll-form'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'create-poll-form-module',
  components: {
    CreatePollFormSkeletonLoader,
    CreatePollForm,
  },
  mixins: [LoadPollTypesMixin],
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),
  computed: {
    pollTypes () {
      return [
        {
          labelTranslationId: 'create-poll-form.restricted-poll-lbl',
          value: this.restrictedPollType,
        },
      ]
    },
  },
  async created () {
    await this.init()
  },
  methods: {
    async init () {
      try {
        await this.loadRestrictedPollType()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-poll-form__result-provider-id-wrp {
  display: flex;
  align-items: center;
}

.create-poll-form__insert-account-id-btn {
  margin-left: 0.4rem;
}

.create-poll-form__choice-description-wrp {
  display: flex;
  align-items: center;
}
</style>
