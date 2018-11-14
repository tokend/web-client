<template>
  <div class="mass-transfer">
    <!-- <md-card-header>
        <div class="md-title">{{ i18n.tr_create_mass() }}</div>
      </md-card-header> -->
    <div class="mass-transfer__desc app__page-content-wrp">
      <h2 class="app__page-heading mass-transfers__page-heading">
        {{ i18n.tr_create_mass() }}
      </h2>

      <p class="mass-transfer__text-paragraph">{{ i18n.tr_mass_about() }}</p>

      <file-field
        class="mass-transfer__upload-input"
        v-model="documents.transfers"
        label="Select File(s)"
        accept=".csv"
        id="preissuance-field"
      />
      <template v-if="transfers.length">
        <p class="mass-transfer__total">
          {{ i18n.tr_total_amount() }}:
          <template v-for="(amount, asset, i) in totals.amounts">
            <template v-if="Object.keys(totals.amounts).length > 1">
              <br :key="`mass-transfer-total-amounts-br-${i}`">
              {{ i + 1 }}.
            </template>
            <span
              class="mass-transfer__amount"
              :key="`mass-transfer-total-amounts-value-${i}`">
              {{ amount }}
            </span>
            <span
              class="mass-transfer__asset"
              :key="`mass-transfer-total-amounts-asset-${i}`">
              {{ asset }}
            </span>
          </template>
        </p>

        <p class="mass-transfer__total">
          {{ i18n.tr_total_source_fee() }}:
          <template v-for="(amount, asset, i) in totals.sourceFees">
            <template v-if="Object.keys(totals.sourceFees).length > 1">
              <br :key="`mass-transfer-total-source-fees-br-${i}`">
              {{ i + 1 }}.
            </template>
            <span
              class="mass-transfer__amount"
              :key="`mass-transfer-total-source-fees-value-${i}`">
              {{ amount }}
            </span>
            <span
              class="mass-transfer__asset"
              :key="`mass-transfer-total-source-fees-asset-${i}`">
              {{ asset }}
            </span>
          </template>
        </p>

        <p class="mass-transfer__total">
          {{ i18n.tr_total_recipient_fee() }}:
          <template v-for="(amount, asset, i) in totals.destinationFees">
            <template v-if="Object.keys(totals.destinationFees).length > 1">
              <br :key="`mass-transfer-total-destination-fees-br-${i}`">
              {{ i + 1 }}.
            </template>
            <span
              class="mass-transfer__amount"
              :key="`mass-transfer-total-destination-fees-value-${i}`">
              {{ amount }}
            </span>
            <span
              class="mass-transfer__asset"
              :key="`mass-transfer-total-destination-fees-value-${i}`">
              {{ asset }}
            </span>
          </template>
        </p>
      </template>
      <md-card-actions
        md-alignment="space-between"
        class="mass-transfer__actions">
        <md-button
          class="md-primary mass-transfer__confirm-btn"
          :disabled="!transfers.length || isPending"
          @click="submit"
        >
          {{ i18n.lbl_confirm() }}
        </md-button>
        <md-button
          class="md-primary"
          @click="isHowToOpened = true">
          {{ i18n.tr_about_csv() }}
        </md-button>
      </md-card-actions>
    </div>

    <div
      class="mass-transfer__list-wrapper"
      v-if="transfers.length">
      <div
        class="mass-transfer__list"
        v-table-scroll-shadow>
        <div class="mass-transfer__list-header">
          <div
            class="mass-transfer__list-header-item
                   mass-transfer__list-header-item--status">
            {{ i18n.lbl_status() }}
          </div>
          <div
            class="mass-transfer__list-header-item
                   mass-transfer__list-header-item--amount">
            {{ i18n.lbl_amount() }}
          </div>
          <div
            class="mass-transfer__list-header-item
                   mass-transfer__list-header-item--email">
            {{ i18n.lbl_email() }}
          </div>
          <div
            class="mass-transfer__list-header-item
                   mass-transfer__list-header-item--source-fees">
            {{ i18n.lbl_source_fees() }}
            {{ i18n.lbl_fixed_percent() }}
          </div>
          <div
            class="mass-transfer__list-header-item
                   mass-transfer__list-header-item--destination-fees">
            {{ i18n.lbl_destination_fees() }}
            {{ i18n.lbl_fixed_percent() }}
          </div>
        </div>
        <div class="mass-transfer__list-body">
          <div
            class="mass-transfer__list-body-elem"
            v-for="(transfer, i) in transfers"
            :key="`activity-item-${i}`">
            <div class="mass-transfer__list-body-row">
              <div
                :title="transfer.status"
                class="mass-transfer__list-body-item
                       mass-transfer__list-body-item--status"
                :class="{ 'mass-transfer__table-cell--error':
                  transfer.status && transfer.status !== 'Success'
                }"
              >
                {{ transfer.status || '--' }}
              </div>
              <div
                :title="transfer.amount + transfer.asset"
                class="mass-transfer__list-body-item
                       mass-transfer__list-body-item--amount">
                {{ i18n.c(transfer.amount) }} {{ transfer.asset }}
              </div>
              <div
                :title="transfer.email"
                class="mass-transfer__list-body-item
                       mass-transfer__list-body-item--email">
                {{ transfer.email }}
              </div>
              <div
                :title="transfer.sourceFees.feeAsset"
                class="mass-transfer__list-body-item
                       mass-transfer__list-body-item--source-fees">
                {{ transfer.sourceFees.fixed }}
                /
                {{ transfer.sourceFees.percent }}
                {{ transfer.sourceFees.feeAsset }}
              </div>

              <div
                :title="transfer.destinationFees.feeAsset"
                class="mass-transfer__list-body-item
                       mass-transfer__list-body-item--destination-fees">
                {{ transfer.destinationFees.fixed }}
                /
                {{ transfer.destinationFees.percent }}
                {{ transfer.destinationFees.feeAsset }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="isHowToOpened">
      <md-dialog-title>{{ i18n.tr_about_csv() }}</md-dialog-title>
      <div class="app__dialog-inner">
        <p class="mass-transfer__text-paragraph">
          {{ i18n.tr_mass_about_detailed() }}
        </p>
        <md-table class="mass-transfer__text-paragraph">
          <md-table-row>
            <md-table-head class="mass-transfer__table-cell">
              {{ i18n.lbl_recipient_email_or_account() }}
            </md-table-head>
            <md-table-head class="mass-transfer__table-cell">
              {{ i18n.lbl_amount() }}
            </md-table-head>
            <md-table-head class="mass-transfer__table-cell">
              {{ i18n.lbl_asset() }}
            </md-table-head>
          </md-table-row>
          <md-table-row>
            <md-table-cell>alice@mail.com</md-table-cell>
            <md-table-cell>0.012</md-table-cell>
            <md-table-cell>BTC</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>bob@mail.com</md-table-cell>
            <md-table-cell>1.541</md-table-cell>
            <md-table-cell>ETH</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>john@mail.com</md-table-cell>
            <md-table-cell>0.998</md-table-cell>
            <md-table-cell>ETH</md-table-cell>
          </md-table-row>
        </md-table>

        <p class="mass-transfer__text-paragraph">
          {{ i18n.tr_should_look_like() }}
        </p>

        <blockquote class="mass-transfer__csv-example">
          alice@mail.com,0.012,BTC <br>
          bob@mail.com,1.541,ETH <br>
          john@mail.com,0.998,ETH <br>
        </blockquote>

        <p class="mass-transfer__text-paragraph">{{ i18n.tr_use_editor() }}</p>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          @click="isHowToOpened = false">
          {{ i18n.lbl_got_it() }}
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { FileHelper } from '../../../js/helpers/file.helper'
import { ErrorHandler } from '../../../js/errors/error_handler'
import { EventDispatcher } from '../../../js/events/event_dispatcher'
import { Keypair } from 'tokend-js-sdk'

import { accountsService } from '../../../js/services/accounts.service'
import { transferService } from '../../../js/services/transfers.service'
import { feeService } from '../../../js/services/fees.service'

import { i18n } from '../../../js/i18n/index'

import { PAYMENT_FEE_SUBTYPES } from '../../../js/const/xdr.const'

import FileField from '../../common/fields/FileField'
import FormMixin from '../../common/mixins/form.mixin'

import { add } from '../../../js/utils/math.util'

import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../vuex/types'

export default {
  name: 'mass-transfers-index',
  components: { FileField },
  mixins: [FormMixin],
  data: _ => ({
    documents: {
      transfers: null
    },
    transfers: [],
    i18n,
    isHowToOpened: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ]),
    totals () {
      const amountsByAssets = {}
      const sourceFeesByAssets = {}
      const destinationFeesByAssets = {}

      this.transfers.forEach(transfer => {
        amountsByAssets[transfer.asset] = [
          ...(amountsByAssets[transfer.asset] || []),
          transfer.amount
        ]
        sourceFeesByAssets[transfer.sourceFees.feeAsset] = [
          ...(sourceFeesByAssets[transfer.sourceFees.feeAsset] || []),
          add(transfer.sourceFees.fixed, transfer.sourceFees.percent)
        ]
        destinationFeesByAssets[transfer.destinationFees.feeAsset] = [
          ...(
            destinationFeesByAssets[transfer.destinationFees.feeAsset] ||
            []
          ),
          add(transfer.destinationFees.fixed, transfer.destinationFees.percent)
        ]
      })

      const totalAmounts = {}
      const totalSourceFees = {}
      const totalDestinationFees = {}

      for (const [asset, amounts] of Object.entries(amountsByAssets)) {
        totalAmounts[asset] =
          amounts.reduce((total, amount) => add(total, amount), 0)
      }
      for (const [asset, amounts] of Object.entries(sourceFeesByAssets)) {
        totalSourceFees[asset] =
          amounts.reduce((total, amount) => add(total, amount), 0)
      }
      for (const [asset, amounts] of Object.entries(destinationFeesByAssets)) {
        totalDestinationFees[asset] =
          amounts.reduce((total, amount) => add(total, amount), 0)
      }

      return {
        amounts: totalAmounts,
        sourceFees: totalSourceFees,
        destinationFees: totalDestinationFees
      }
    }
  },
  watch: { 'documents.transfers': 'parseFile' },
  methods: {
    async submit () {
      this.disable()
      try {
        await transferService
          .createMassTransfer(this.transfers.map(transfer => ({
            sourceBalanceId: this.accountBalances[transfer.asset].balance_id,
            destinationAccountId: transfer.accountId,
            amount: transfer.amount,
            feeData: {
              sourceFee: {
                maxPaymentFee: transfer.sourceFees.percent,
                fixedFee: transfer.sourceFees.fixed,
                feeAsset: transfer.sourceFees.feeAsset
              },
              destinationFee: {
                maxPaymentFee: transfer.destinationFees.percent,
                fixedFee: transfer.destinationFees.fixed,
                feeAsset: transfer.destinationFees.feeAsset
              }
            },
            sourcePaysForDest: false,
            subject: ''
          })))
        EventDispatcher.dispatchShowSuccessEvent(i18n.transfer_successful())
      } catch (e) {
        const messages = ErrorHandler.deriveTxErrorMessages(e)
        if (!messages || !messages.length) {
          ErrorHandler.processUnexpected(e)
        } else {
          this.transfers.forEach((transfer, i) => {
            transfer.status = messages[i]
          })
          EventDispatcher.dispatchShowErrorEvent(
            i18n.tr_mass_payment_failed()
          )
        }
      }
      this.enable()
    },
    async parseFile () {
      if (!this.documents.transfers) return
      const objKeys = ['recipient', 'amount', 'asset']
      const extracted =
        await FileHelper.readFileAsText(this.documents.transfers.file)

      const parsed = extracted
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(row => row
          .split(',')
          .reduce((transfer, item, i) => ({
            ...transfer, [objKeys[i]]: item
          }), {})
        )
      await this.loadTransferDetails(parsed)
    },
    async loadTransferDetails (transfers) {
      this.disable()
      try {
        for (const transfer of transfers) {
          if (Keypair.isValidPublicKey(transfer.recipient)) {
            transfer.email =
              await accountsService.loadEmailByAccountId(transfer.recipient)
            transfer.accountId = transfer.recipient
          } else {
            transfer.accountId =
              await accountsService.loadAccountIdByEmail(transfer.recipient)
            transfer.email = transfer.recipient
          }
          transfer.sourceFees = await feeService.loadPaymentFeeByAmount(
            transfer.asset,
            transfer.amount
          )
          transfer.destinationFees = await feeService.loadPaymentFeeByAmount(
            transfer.asset,
            transfer.amount,
            transfer.accountId,
            PAYMENT_FEE_SUBTYPES.incoming
          )
          transfer.sourcePaysForDest = false
        }
        this.transfers = transfers
      } catch (e) { ErrorHandler.processUnexpected(e) }
      this.enable()
    }
  }
}
</script>

<style lang="scss">
  @import '~L@scss/variables';

  .mass-transfer {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .mass-transfer__card {
    max-width: 1200px;
    margin: auto;
    width: 100%;
  }

  .mass-transfer__card {
    max-width: 1200px;
    margin: auto;
    width: 100%;
  }

  .mass-transfer__table-cell {
    white-space: nowrap;

    .md-checkbox {
      margin: 0 !important;
    }

    &--error {
      color: $col-accent;
    }
  }

  .mass-transfer__table-cell--account-id {
    .md-table-cell-container {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .mass-transfer__csv-example {
    border: 1px solid rgba($col-unfocused, .5);
    background: rgba($col-primary, .05);
    color: $col-accent;
    /*font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;*/
    border-radius: 5px;
    padding: .5rem 1rem;
    margin-bottom: 1rem;
  }

  .mass-transfer__total {
    margin-bottom: 1rem;
  }

  .mass-transfer__text-paragraph {
    margin-bottom: 1rem;
  }

  .mass-transfer__amount {
    color: $col-text-field-hint;
  }

  .mass-transfer__asset {
    font-weight: bold;
  }
</style>
