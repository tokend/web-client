<template>
  <form
    class="campaigns-form"
    @submit.prevent="isFormValid() && showConfirmation()">
    <template v-if="formMixin.isPending">
      <loader />
    </template>
    <template v-else-if="isCreated">
      <div class="campaigns-form__created">
        <no-data-message
          icon-name=""
          :title="'campaigns-form.created-campaign-title' | globalize"
          :message="'campaigns-form.created-campaign-message' | globalize"
        />
      </div>
    </template>
    <template v-else>
      <div class="campaigns-form__wrapper">
        <div class="campaigns-form__left">
          <div class="app__form-row">
            <file-field
              class="app__form-field app__campaign-form-file-field"
              v-model="form.logo"
              @input="former.setAttr('logo', form.logo)"
              :label="'campaigns-form.logo-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.logo')"
              @blur="touchField('form.logo')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="campaigns-form__right">
          <div class="app__form-row">
            <input-field
              class="app__form-field"
              :white-autofill="false"
              v-model="form.name"
              @input="former.setAttr('name', form.name)"
              :label="'campaigns-form.name-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.name')"
              @blur="touchField('form.name')"
              :disabled="formMixin.isDisabled"
            />
          </div>
          <div class="app__form-row">
            <textarea-field
              class="app__form-field-description"
              v-model="form.description"
              @input="former.setAttr('description', form.description)"
              :label="'campaigns-form.description-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.description')"
              @blur="touchField('form.description')"
              :disabled="formMixin.isDisabled"
            />
          </div>
          <div class="app__form-row">
            <input-field
              class="app__form-field"
              type="number"
              v-model="form.amountOfShapes"
              @input="former.setAttr('amountOfShapes', form.amountOfShapes)"
              :label="'campaigns-form.amount-of-shapes-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.amountOfShapes')"
              @blur="touchField('form.amountOfShapes')"
              :white-autofill="false"
              :disabled="formMixin.isDisabled"
            />
            <input-field
              class="app__form-field"
              type="number"
              v-model="form.raisingAmount"
              @input="former.setAttr('raisingAmount', form.raisingAmount)"
              :label="'campaigns-form.rising-amount-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.raisingAmount')"
              @blur="touchField('form.raisingAmount')"
              :white-autofill="false"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </div>
      <div class="app__form-actions">
        <template v-if="formMixin.isConfirmationShown">
          <form-confirmation
            class="app__form-confirmation"
            :message="'campaigns-form.recheck-form-msg' | globalize"
            :ok-button="'campaigns-form.create-campaign-btn' | globalize"
            :is-pending="formMixin.isPending"
            @cancel="hideConfirmation()"
            @ok="hideConfirmationAfterSubmit(submit)"
          />
        </template>
        <template v-else>
          <button
            v-ripple
            class="app__button-raised campaigns-form__submit-btn"
            type="submit"
          >
            {{ 'campaigns-form.submit-btn' | globalize }}
          </button>
        </template>
      </div>
    </template>
  </form>
</template>

<script>
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { CampaignFormer } from '@/js/formers/CampaignFormer'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { required } from '@/validators'
import { sleep } from '@/js/helpers/sleep-helper'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'campaigns-form',
  components: { NoDataMessage, Loader },
  mixins: [FormMixin],
  props: {
    former: {
      type: CampaignFormer,
      default: () => new CampaignFormer(),
    },
  },
  data () {
    return {
      isCreated: false,
      form: {
        name: this.former.attrs.name,
        description: this.former.attrs.description,
        raisingAmount: this.former.attrs.raisingAmount,
        amountOfShapes: this.former.attrs.amountOfShapes,
        logo: this.former.attrs.logo,
      },
    }
  },
  validations () {
    return {
      form: {
        name: { required },
        description: { required },
        raisingAmount: { required },
        amountOfShapes: { required },
        logo: { required },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  methods: {
    ...mapActions({
      getIsShowAllCampaigns: 'GET_IS_SHOW_ALL_CAMPAIGNS',
    }),
    async submit () {
      this.disableForm()
      try {
        this.getIsShowAllCampaigns(true)
        await sleep(3000)
        Bus.success('campaigns-form.create-success')
        await this.$router.push(vueRoutes.campaignsList)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'app-form';

.campaigns-form__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3rem;

  @include respond-to(small) {
    grid-template-columns: 1fr;
  }
}

.campaigns-form__left {
  display: flex;
}

.campaigns-form__right {
}

.campaigns-form__submit-btn {
  margin-left: auto;
}
</style>
