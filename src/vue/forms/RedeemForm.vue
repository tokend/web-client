<template>
  <div class="redeem-form">
    <form @submit.prevent="isFormValid()">
      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="redeem-amount"
            validation-type="outgoing"
            :label="'redeem-form.amount-lbl' | globalize"
            :asset="assetCode"
            @input="generateQrCode"
          />
        </div>
      </div>

      <template v-if="reddemQrCodeValue && isAmountMoreThanZero">
        <qr-code-wrapper
          class="redeem-form__qr-code"
          :value="reddemQrCodeValue"
          :size="250"
        />

        <p class="redeem-form__qr-code-msg">
          {{ 'redeem-form.qr-code-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <no-data-message
          class="redeem-form__no-qr-code-msg"
          icon-name="qrcode-scan"
          :title="'redeem-form.no-qr-code-title' | globalize"
          :message="'redeem-form.no-qr-code-msg' | globalize"
        />
      </template>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { MAX_INT_32 } from '@/js/const/numbers.const'

export default {
  name: 'redeem-form',
  components: {
    QrCodeWrapper,
    NoDataMessage,
  },

  mixins: [FormMixin],

  props: {
    assetCode: { type: String, required: true },
  },

  data () {
    return {
      form: {
        amount: 0,
      },
      reddemQrCodeValue: '',
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.accountBalanceByCode,
      vuexTypes.accountId,
    ]),

    accountBalance () {
      return this.accountBalanceByCode(this.assetCode)
    },

    asset () {
      return this.assetByCode(this.assetCode)
    },

    isAmountMoreThanZero () {
      return +this.form.amount > 0
    },
  },

  beforeDestroy () {
    this.loadAccountBalancesDetails()
  },

  methods: {
    ...mapActions({
      loadAccountBalancesDetails: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async generateQrCode (value) {
      const salt = this.getRandomSalt()
      const paymentOperation = this.buildPaymentOperation(salt)
      // eslint-disable-next-line max-len
      const tx = await api.getBuildedTransaction(paymentOperation, { salt: salt })
      const redeemOp = this.buildRedeemOp(tx)
      const redeemOpBase64 = btoa(String.fromCharCode(...redeemOp))
      this.reddemQrCodeValue = redeemOpBase64
    },

    buildPaymentOperation (salt) {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.accountBalance.id,
        destination: this.asset.owner,
        amount: this.form.amount,
        feeData: {
          sourceFee: {
            percent: '0',
            fixed: '0',
          },
          destinationFee: {
            percent: '0',
            fixed: '0',
          },
          sourcePaysForDest: false,
        },
        subject: '',
        reference: salt.toString(),
      },
      false
      )
    },

    getArrayBytes (value, bytes) {
      const buf = Buffer.allocUnsafe(bytes)
      buf.writeUIntBE(value, 0, bytes)
      return buf
    },

    buildRedeemOp (tx) {
      const redeemOp = []

      redeemOp.push(tx.tx.sourceAccount()._value)
      redeemOp.push(this.getArrayBytes(this.assetCode.length, 4))
      redeemOp.push(Buffer.from(this.assetCode, 'utf-8'))
      // eslint-disable-next-line max-len
      redeemOp.push(this.getArrayBytes(tx.operations[0].amount * base.Operation.ONE, 8))
      redeemOp.push(this.getArrayBytes(tx.salt, 8))
      redeemOp.push(this.getArrayBytes(tx.timeBounds.minTime, 8))
      redeemOp.push(this.getArrayBytes(tx.timeBounds.maxTime, 8))
      redeemOp.push(tx.signatures[0]._attributes.hint)
      redeemOp.push(tx.signatures[0]._attributes.signature)
      return Buffer.concat(redeemOp)
    },

    getRandomSalt () {
      const n = Math.random() * Number(MAX_INT_32)
      return n.toFixed()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.redeem-form__qr-code {
  margin-top: 5rem;
  text-align: center;
}

.redeem-form__no-qr-code-msg {
  margin-top: 5rem;
}

.redeem-form__qr-code-msg {
  margin-top: 5rem;
  text-align: center;
}
</style>
