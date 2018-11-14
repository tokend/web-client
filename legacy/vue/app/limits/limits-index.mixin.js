import FormMixin from '../../common/mixins/form.mixin'
import FileField from '../../common/fields/FileField'

import { ErrorHandler } from '../../../js/errors/error_handler'
import { RecordFactory } from '../../../js/records/factory'
import { EventDispatcher } from '../../../js/events/event_dispatcher'

import { mapGetters, mapActions } from 'vuex'
import {
  documentTypes,
  STATS_OPERATION_TYPES
} from '../../../js/const/const'

import { vuexTypes } from '../../../vuex/types'
import { i18n } from '../../../js/i18n/index'

import { accountsService } from '../../../js/services/accounts.service'
import { fileService } from '../../../js/services/file.service'

const LIMIT_OPS = Object.freeze({
  payment: 'Outgoing payment',
  withdrawal: 'Withdrawal'
})

export default {
  name: 'LimitsIndex',
  mixins: [FormMixin],
  components: { FileField },
  data: _ => ({
    filters: {
      tokenCode: null
    },
    documents: {
      [documentTypes.limitsProofOfIncome]: null
    },
    isDialogOpened: false,
    i18n,
    documentTypes,
    LIMIT_OPS,
    STATS_OPERATION_TYPES
  }),
  created () {
    this.loadLimits()
    this.loadRequests()
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountLimits,
      vuexTypes.limitsRequests,
      vuexTypes.accountId
    ]),
    balance () {
      return this.accountBalances[this.filters.tokenCode]
    },
    limits () {
      const limits = this.accountLimits
        .filter(limit => limit.tokenCode === this.filters.tokenCode)
        .reduce((limits, limit) => {
          if (limit.statsOpType === STATS_OPERATION_TYPES.paymentOut) {
            return { ...limits, payment: limit }
          }
          if (limit.statsOpType === STATS_OPERATION_TYPES.withdraw) {
            return { ...limits, withdrawal: limit }
          }
          return limits
        }, {})
      if (!limits.payment) {
        limits.payment = RecordFactory.createLimitRecord()
      }
      if (!limits.withdrawal) {
        limits.withdrawal = RecordFactory.createLimitRecord()
      }
      return limits
    }
  },
  methods: {
    ...mapActions({
      loadLimits: vuexTypes.GET_ACCOUNT_LIMITS,
      loadRequests: vuexTypes.GET_LIMITS_REQUESTS,
      loadNext: vuexTypes.NEXT_LIMITS_REQUESTS
    }),
    setFilters () {
      if (this.filters.tokenCode) return
      this.filters.tokenCode = Object.keys(this.accountBalances)[0] || null
    },
    async submit () {
      this.disable()
      try {
        await fileService.uploadSingleDocument(
          this.documents[documentTypes.limitsProofOfIncome]
        )
        // eslint-disable-next-line
        const document = this.documents[documentTypes.limitsProofOfIncome].getDetailsForSave()
        const asset = this.filters.tokenCode
        await accountsService.createLimitRequest({
          details: JSON.stringify({
            document,
            asset
          })
        })
        this.isDialogOpened = false
        EventDispatcher.dispatchShowSuccessEvent(i18n.lim_requested())
      } catch (e) { ErrorHandler.processUnexpected(e) }
      this.enable()
    }
  },
  watch: {
    accountBalances: {
      handler: 'setFilters',
      immediate: true
    }
  }
}
