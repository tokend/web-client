import FormMixin from '@/vue/mixins/form.mixin'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

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
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),
    async createKycBlob (blobType) {
      const { data } = await Sdk.api.blobs.create(
        blobType,
        JSON.stringify(this.createKycData())
      )
      return data.id
    },
    createKycOperation (kycBlobId) {
      return base.CreateChangeRoleRequestBuilder.createChangeRoleRequest({
        requestID: this.kycState === REQUEST_STATES_STR.rejected
          ? this.kycRequestId
          : KYC_CREATION_REQUEST_ID,
        destinationAccount: this.account.accountId,
        accountRoleToSet: this.accountType,
        kycData: {
          blob_id: kycBlobId,
        },
      })
    },
  },
}
