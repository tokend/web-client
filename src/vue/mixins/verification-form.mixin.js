import FormMixin from '@/vue/mixins/form.mixin'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

const KYC_LEVEL_TO_SET = 0
const KYC_CREATION_REQUEST_ID = '0'

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
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    async createKycBlob (blobType) {
      const { data } = await Sdk.api.blobs.create(
        blobType,
        JSON.stringify(this.createKycData())
      )
      return data.id
    },
    createKycOperation (kycBlobId) {
      return base.CreateUpdateKYCRequestBuilder.createUpdateKYCRequest({
        requestID: this.kycState === REQUEST_STATES_STR.rejected
          ? this.kycRequestId
          : KYC_CREATION_REQUEST_ID,
        accountToUpdateKYC: this.account.accountId,
        accountTypeToSet: this.accountType,
        kycLevelToSet: KYC_LEVEL_TO_SET,
        kycData: {
          blob_id: kycBlobId,
        },
      })
    },
  },
}
