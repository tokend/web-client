<template>
  <div class="add-update-form">
    <h2 class="add-update-form__heading app__page-heading">
      {{ i18n.sale_upd_tab_add_update() }}
    </h2>

    <div class="app__form-row">
      <input-field-unchained
        v-model="form.title"
        class="input-field"
        :maxlength="50"
        :label="i18n.lbl_title()"
      />
    </div>

    <div class="app__form-row">
      <textarea-field-unchained
        v-model="form.message"
        v-validate="'required'"
        class="step__input-field"
        :maxlength="250"
        :label="i18n.lbl_description()"
      />
    </div>

    <div class="app__form-actions app__form-actions--right">
      <button
        v-ripple
        class="app__button-flat"
        @click="$emit(events.closeEvent)">
        {{ i18n.lbl_cancel() }}
      </button>
      <button
        v-ripple
        class="app__form-submit-btn add-update-form__submit-btn"
        :disabled="isPending"
        @click="createUpdate">
        {{ i18n.lbl_submit() }}
      </button>
    </div>
  </div>
</template>

<script>
import InputFieldUnchained from 'L@/vue/common/fields/InputFieldUnchained'
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import { i18n } from 'L@/js/i18n'
import moment from 'moment'
import { commonEvents } from 'L@/js/events/common_events'
import { confirmAction } from 'L@/js/modals/confirmation_message'
import { blobTypes, blobFilters } from 'L@/js/const/const'
import { usersService } from 'L@/js/services/users.service'
export default {
  name: 'add-update-form',
  components: {
    InputFieldUnchained
  },
  mixins: [FormMixin],
  props: {
    sale: { type: Object, default: () => {} }
  },
  data: _ => ({
    form: {
      title: '',
      message: ''
    },
    events: {
      closeEvent: commonEvents.closeEvent
    },
    i18n
  }),
  methods: {
    async createUpdate () {
      if (!await this.isValid()) return
      const confirmed = await confirmAction({
        message: i18n.sale_upd_tab_warning()
      })
      if (!confirmed) return
      this.disable()
      try {
        const date = moment() // .format('MMMM Do')
        await usersService.blobsOf(this.sale.owner).create(
          blobTypes.fundUpdate.str,
          {
            ...this.form,
            date
          },
          { [blobFilters.fundID]: this.sale.id }
        )
        this.$emit(commonEvents.timelineAddFinished)
        this.$emit(commonEvents.closeEvent)
      } catch (error) {
        console.error(error)
        error.showBanner(i18n.unexpected_error)
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/variables";

  .add-update-form {
    padding-top: 1.5rem;
  }

  .add-update-form__heading {
    display: inline-block;
    margin: 0 1rem 0 0;
  }

  .add-update-form__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-update-form__submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>
