<template>
  <div class="limits-manager">
    <h2 class="limits-manager__title">
      {{ i18n.lim_change_limits_title({assetName: assetName, asset: asset}) }}
    </h2>
    <div class="limits-manager__select-wrp">
      <select-field-unchained
        v-model="form.operationType"
        :values="Object.values(LIMIT_OPS_STR)"
        :label="i18n.lim_operation_type_limit_label()"
        class="limits-manager__select-field"
      />
    </div>
    <md-table class="limits-manager__table">
      <md-table-row class="limits-manager__table-row">
        <md-table-head class="limits-manager__table-head">
          {{ i18n.lbl_to() }}
        </md-table-head>
        <md-table-head
          class="limits-manager__table-head
                 limits-manager__table-head--right">
          {{ i18n.lim_limits() }}
        </md-table-head>
      </md-table-row>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell class="limits-manager__table-cell">
          <span class="limits-manager__limit-type">
            {{ i18n.lim_daily() }}
          </span>
        </md-table-cell>
        <md-table-cell class="limits-manager__table-cell">
          <editable-input-field
            :value="form.limits.dailyOut"
            :step="DEFAULT_INPUT_STEP"
            :field-id="`1`"
            type="number"
            name="daily limit amount"
            :nowrap="true"
            icon-size="18"
            align="right"
            min="0"
            :error-message="errorMessage('daily limit amount')"
            @changed-value="form.limits.dailyOut = $event.value"
          />
        </md-table-cell>
      </md-table-row>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell class="limits-manager__table-cell">
          <span class="limits-manager__limit-type">
            {{ i18n.lim_weekly() }}
          </span>
        </md-table-cell>
        <md-table-cell class="limits-manager__table-cell">
          <editable-input-field
            :value="form.limits.weeklyOut"
            :step="DEFAULT_INPUT_STEP"
            :field-id="`2`"
            type="number"
            name="weekly limit amount"
            :nowrap="true"
            icon-size="18"
            align="right"
            :error-message="errorMessage('weekly limit amount')"
            @changed-value="form.limits.weeklyOut = $event.value"
          />
        </md-table-cell>
      </md-table-row>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell class="limits-manager__table-cell">
          <span class="limits-manager__limit-type">
            {{ i18n.lim_monthly() }}
          </span>
        </md-table-cell>
        <md-table-cell class="limits-manager__table-cell">
          <editable-input-field
            :value="form.limits.monthlyOut"
            :step="DEFAULT_INPUT_STEP"
            :field-id="`3`"
            type="number"
            name="monthly limit amount"
            :nowrap="true"
            icon-size="18"
            align="right"
            :error-message="errorMessage('monthly limit amount')"
            @changed-value="form.limits.monthlyOut = $event.value"
          />
        </md-table-cell>
      </md-table-row>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell class="limits-manager__table-cell">
          <span class="limits-manager__limit-type">
            {{
              i18n.lim_annual()
            }}
          </span>
        </md-table-cell>
        <md-table-cell class="limits-manager__table-cell">
          <editable-input-field
            :value="form.limits.annualOut"
            :step="DEFAULT_INPUT_STEP"
            :field-id="`4`"
            type="number"
            name="annual limit amount"
            :nowrap="true"
            icon-size="18"
            align="right"
            :error-message="errorMessage('annual limit amount')"
            @changed-value="form.limits.annualOut = $event.value"
          />
        </md-table-cell>
      </md-table-row>
      <md-table-row class="limits-manager__table-row">
        <md-table-cell
          class="limits-manager__table-cell"
          colspan="2"
        >
          <h3 class="limits-manager__note-label">{{ i18n.lbl_note() }}</h3>
          <textarea-field
            v-model="form.note"
            class="limits-manager__note-field"
          />
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="limits-manager__btn-outer">
      <md-button
        class="limits-manager__update-btn md-primary"
        :disabled="isPending"
        @click="closeForm"
      >
        {{ i18n.lbl_cancel() }}
      </md-button>
      <md-button
        class="limits-manager__update-btn md-primary"
        :disabled="isPending"
        @click="submit"
      >
        {{ i18n.lbl_send_request() }}
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FormMixin from '../../common/mixins/form.mixin'
import EditableInputField from '../../common/fields/EditableInputField'
import {
  DEFAULT_INPUT_STEP,
  STATS_OPERATION_TYPES,
  LIMIT_OPS,
  DEFAULT_MAX_AMOUNT,
  LIMIT_OPS_STR,
  LIMITS_REQUEST_TYPE
} from '../../../js/const/const'
import { i18n } from '../../../js/i18n/index'
import { accountsService } from '../../../js/services/accounts.service'
import { ErrorHandler } from '../../../js/errors/error_handler'
import { EventDispatcher } from '../../../js/events/event_dispatcher'
import { commonEvents } from '../../../js/events/common_events'
import { vuexTypes } from '../../../vuex/types'
import _get from 'lodash/get'

export default {
  name: 'limits-manager',
  components: { EditableInputField },
  mixins: [FormMixin],
  props: {
    asset: { type: String, default: '' },
    limits: { type: Object, default () { return {} } }
  },
  data: _ => ({
    form: {
      operationType: '',
      limits: {
        dailyOut: null,
        weeklyOut: null,
        monthlyOut: null,
        annualOut: null
      },
      note: ''
    },
    DEFAULT_INPUT_STEP,
    STATS_OPERATION_TYPES,
    LIMIT_OPS_STR,
    LIMIT_OPS,
    i18n
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountType
    ]),
    assetName () {
      return _get(
        this.accountBalances[this.asset],
        'asset_details.details.name',
        ''
      )
    }
  },

  created () {
    this.form.operationType = Object.values(LIMIT_OPS_STR)[0]
  },

  methods: {
    ...mapActions({
      loadRequests: vuexTypes.GET_LIMITS_REQUESTS
    }),
    async submit () {
      if (!this.validateForm()) return
      this.disable()
      try {
        const asset = this.asset
        const limits = Object.keys(this.form.limits)
          .filter(item => item).reduce((newObj, item) => {
            return {
              ...newObj,
              [item]: this.form.limits[item]
                ? this.form.limits[item]
                : DEFAULT_MAX_AMOUNT
            }
          }, {})
        const note = this.form.note
        const requestType = LIMITS_REQUEST_TYPE.initial
        const operationTypeStr = Object.keys(LIMIT_OPS_STR)
          .find(key => LIMIT_OPS_STR[key] === this.form.operationType)
        const operationType = LIMIT_OPS[operationTypeStr]
        const statsOpType = STATS_OPERATION_TYPES[operationType]
        await accountsService.createLimitRequest({
          requestID: '0',
          details: {
            operationType,
            statsOpType,
            asset,
            limits,
            requestType,
            note
          }
        })
        this.loadRequests()
        this.closeForm()
        EventDispatcher.dispatchShowSuccessEvent(i18n.lim_requested())
      } catch (e) {
        ErrorHandler.processUnexpected(e)
      }
      this.enable()
    },
    validateForm () {
      const form = this.form.limits
      if (form.annualOut) {
        if (+form.annualOut < 0) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_annual_fall_behind_msg())
          return false
        } else if (!form.dailyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_daily_validation_msg())
          return false
        } else if (!form.weeklyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_weekly_validation_msg())
          return false
        } else if (!form.monthlyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_monthly_validation_msg())
          return false
        } else if (+form.annualOut < +form.monthlyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_monthly_exceed_msg())
          return false
        }
      }
      if (form.monthlyOut) {
        if (+form.monthlyOut < 0) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_monthly_fall_behind_msg())
          return false
        } else if (!form.dailyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_daily_validation_msg())
          return false
        } else if (!form.weeklyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_weekly_validation_msg())
          return false
        } else if (+form.monthlyOut < +form.weeklyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_weekly_exceed_msg())
          return false
        }
      }
      if (form.weeklyOut) {
        if (+form.weeklyOut < 0) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_weekly_fall_behind_msg())
          return false
        } else if (!form.dailyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_daily_validation_msg())
          return false
        } else if (+form.weeklyOut < +form.dailyOut) {
          EventDispatcher
            .dispatchShowErrorEvent(i18n.limit_daily_exceed_msg())
          return false
        }
      }
      if (form.dailyOut && +form.dailyOut < 0) {
        EventDispatcher
          .dispatchShowErrorEvent(i18n.limit_daily_fall_behind_msg())
        return false
      }
      if (
        !form.dailyOut && !form.weeklyOut &&
        !form.monthlyOut && !form.annualOut
      ) {
        EventDispatcher
          .dispatchShowErrorEvent(i18n.limit_validation_msg())
        return false
      }
      return true
    },

    closeForm () {
      this.$emit(commonEvents.closeRequestEvent)
    }
  }
}
</script>

<style lang="scss">
@import "../../../scss/variables";

.limits-manager {
  width: 100%;
  max-width: 40rem;
}

.limits-manager__content-title {
  font-weight: bold;
}

.limits-manager__limit-type {
  text-transform: capitalize;
  white-space: nowrap;
}

.limits-manager__table-row {
  border: none !important;
  &:hover .md-table-cell {
    background: none !important;
  }
}

.limits-manager__table-head {
  &--right {
    text-align: right;
  }
}

.limits-manager__table-cell:first-child .md-table-cell-container,
.limits-manager__table-head:first-child .md-table-head-label {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.limits-manager__table-cell {
  border: none !important;
  & .md-table-cell-container {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
    height: auto !important;
  }
}

.limits-manager__note-label {
  margin-bottom: 1rem;
}

.limits-manager__btn-outer {
  display: flex;
  justify-content: flex-end;
  margin-right: -1.5rem;
}

.md-table-head-label:last-child,
.md-table-cell:last-child .md-table-cell-container {
  padding-right: 0 !important;
}
</style>
