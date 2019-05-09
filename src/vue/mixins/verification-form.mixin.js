import FormMixin from '@/vue/mixins/form.mixin'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { api } from '@/api'
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
      accountId: vuexTypes.accountId,
    }),
  },
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    async createKycBlob (blobType) {
      const { data: blob } = await api().postWithSignature('/blobs', {
        data: {
          type: blobType,
          attributes: { value: JSON.stringify(this.createKycData()) },
          relationships: {
            owner: { data: { id: this.accountId } },
          },
        },
      })

      return blob.id
    },
    createKycOperation (kycBlobId, accountRole) {
      return base.CreateChangeRoleRequestBuilder.createChangeRoleRequest({
        requestID: this.kycState === REQUEST_STATES_STR.rejected
          ? this.kycRequestId
          : KYC_CREATION_REQUEST_ID,
        destinationAccount: this.accountId,
        accountRoleToSet: String(accountRole),
        creatorDetails: {
          blob_id: kycBlobId,
        },
      })
    },
  },
}
