<template>
  <div
    v-if="isLoaded && ownedAssets.length"
    class="issuance-form"
  >
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <!--
            :key is a hack to ensure that the component will be updated
            after property change
          -->
          <select-field
            :key="form.asset"
            v-model="form.asset"
            :values="assetListValues"
            :label="'issuance.asset-lbl' | globalize"
            id="issuance-asset"
            @blur="touchField('form.asset')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="issuance-form__amount-wrapper">
            <input-field
              white-autofill
              type="number"
              v-model="form.amount"
              @blur="touchField('form.amount')"
              id="issuance-amount"
              :label="'issuance.amount-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.amount',
                { from: MIN_AMOUNT, to: availableAmount.value }
              )"
              :disabled="formMixin.isDisabled"
            />
            <p
              v-if="availableAmount.currency"
              class="issuance-form__issuance-asset-code"
            >
              {{ availableAmount.currency }}
            </p>
          </div>
          <p
            v-if="availableAmount.value"
            class="issuance-form__available-amount-hint"
          >
            {{
              'issuance.available-for-issuance-hint'
                | globalize({ value: availableAmount })
            }}
          </p>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.receiver"
            @blur="touchField('form.receiver')"
            id="issuance-receiver"
            :label="'issuance.receiver-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.receiver')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.reference"
            @blur="touchField('form.reference')"
            id="issuance-reference"
            :error-message="getFieldErrorMessage('form.reference')"
            :label="'issuance.reference-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="issuance-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'issuance.issue-btn' | globalize }}
        </button>
        <button
          v-ripple
          type="button"
          class="issuance-form__cancel-btn"
          :disabled="formMixin.isDisabled"
          @click.prevent="$emit(EVENTS.cancel)"
        >
          {{ 'issuance.cancel-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
  <div v-else-if="isLoaded && !ownedAssets.length">
    <p>
      {{ 'issuance.no-owned-tokens-lbl' | globalize }}
    </p>
  </div>
  <div v-else>
    <loader
      :message-id="'issuance.loading-msg'"
    />
  </div>
</template>

<script>
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'
import FormMixin from '@/vue/mixins/form.mixin'

import Loader from '@/vue/common/Loader'

import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { required, amountRange, emailOrAccountId, email } from '@validators'

const EVENTS = {
  cancel: 'cancel',
}

export default {
  name: 'issuance-form',
  components: {
    Loader,
  },
  mixins: [OwnedAssetsLoaderMixin, FormMixin],
  data: _ => ({
    form: {
      asset: '',
      amount: '0',
      receiver: '',
      reference: '',
    },
    isLoaded: false,
    EVENTS,
    MIN_AMOUNT: config.MIN_AMOUNT,
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.availableAmount.value),
        },
        receiver: { required, emailOrAccountId },
        reference: { required },
      },
    }
  },
  computed: {
    assetListValues () {
      return this.ownedAssets
        .map(asset => ({
          value: asset.code,
          label: `${asset.details.name} (${asset.code})`,
        }))
    },
    availableAmount () {
      if (this.form.asset) {
        const asset = this.ownedAssets
          .find(asset => asset.code === this.form.asset)
        return {
          value: asset.availableForIssuance,
          currency: asset.code,
        }
      }
      return { value: 0 }
    },
  },
  async created () {
    await this.loadOwnedAssets()
    this.isLoaded = true
    if (this.ownedAssets.length > 0) {
      this.form.asset = this.ownedAssets[0].code
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const receiverBalance =
          await this.getReceiverBalance(this.form.receiver, this.form.asset)
        if (receiverBalance) {
          const operation =
            base.CreateIssuanceRequestBuilder.createIssuanceRequest({
              asset: this.form.asset,
              amount: this.form.amount.toString(),
              receiver: receiverBalance.balanceId,
              reference: this.form.reference,
              externalDetails: {},
            })
          await Sdk.horizon.transactions.submitOperations(operation)
          Bus.success('issuance.tokens-issued-msg')
          await this.loadOwnedAssets()
        } else {
          Bus.error('issuance.balance-required-err')
        }
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getReceiverBalance (receiver, asset) {
      const receiverAccountId = await this.getReceiverAccountId(receiver)
      const { data } =
        await Sdk.horizon.account.getBalances(receiverAccountId)
      const receiverBalance = data.find(balance => balance.asset === asset)
      return receiverBalance
    },
    async getReceiverAccountId (receiver) {
      if (email(receiver)) {
        const { data } = await Sdk.horizon.public.getAccountIdByEmail(receiver)
        return data.accountId
      }
      return receiver
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.issuance-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.issuance-form button + button {
  margin-left: auto;
}

.issuance-form__cancel-btn {
  @include button();

  padding-left: .1rem;
  padding-right: .1rem;
  margin-bottom: 2rem;
  font-weight: normal;
}

.issuance-form__amount-wrapper {
  display: flex;
}

.issuance-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}

.issuance-form__available-amount-hint {
  color: $col-field-text-secondary;
  font-size: 1.2rem;
  margin-top: .6rem;
}
</style>
