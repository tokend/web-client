import FormMixin from '@/vue/mixins/form.mixin'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { KycTemplateParser } from '@/js/helpers/kyc-template-parser'
import { ErrorHandler } from '@/js/helpers/error-handler'

const KYC_LEVEL_TO_SET = 0

export default {
  mixins: [FormMixin],
  computed: {
    ...mapGetters({
      kycLatestData: vuexTypes.kycLatestData,
      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      account: vuexTypes.account,
    }),
  },
  async created () {
    try {
      await this.loadKyc()
    } catch (e) {
      console.error(e)
      ErrorHandler.process(e)
    }
    this.parseKycData()

    if (this.kycState && this.kycState !== REQUEST_STATES_STR.rejected) {
      this.disableForm()
    }
  },
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    parseKycData () {
      if (this.kycState) {
        this.form = KycTemplateParser.fromTemplateToForm(
          this.kycLatestData,
          this.accountType
        )
      }
    },
    async createKycData () {
      const { data } = await Sdk.api.blobs.create(
        BLOB_TYPES.kycSyndicate,
        JSON.stringify(KycTemplateParser.fromFormToTemplate(
          this.form,
          this.accountType
        )),
        this.account.accountId
      )
      return {
        blob_id: data.id,
      }
    },
    createKycOperation (kycData) {
      return base.CreateUpdateKYCRequestBuilder.createUpdateKYCRequest({
        requestID: this.kycState === REQUEST_STATES_STR.rejected
          ? this.kycRequestId
          : '0',
        accountToUpdateKYC: this.account.accountId,
        accountTypeToSet: this.accountType,
        kycLevelToSet: KYC_LEVEL_TO_SET,
        kycData: kycData,
      })
    },
  },
}
