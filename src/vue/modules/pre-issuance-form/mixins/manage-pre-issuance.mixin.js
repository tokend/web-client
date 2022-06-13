import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { FileUtil } from '@/js/utils/file.util'

import { Issuance } from '../wrappers/issuance'

import { AssetNotOwnedError, FileCorruptedError } from '../_errors'

export default {
  data: _ => ({
    issuance: {},
  }),

  methods: {
    async createPreIssuanceRequest () {
      const issuanceAsset = this.ownedAssets && this.ownedAssets
        .find(item => item.code === this.issuance.asset)

      if (!issuanceAsset) {
        throw new AssetNotOwnedError()
      }

      const operation = base.PreIssuanceRequestOpBuilder
        .createPreIssuanceRequestOp({
          request: this.issuance.xdr,
        })
      await api.postOperations(operation)
    },

    async extractPreIssuance (file) {
      try {
        const extracted = await FileUtil.getText(file)
        const rawPreIssuance = JSON.parse(extracted).issuances[0]
        this.parsePreIssuance(rawPreIssuance)
      } catch (e) {
        throw new FileCorruptedError()
      }
    },

    parsePreIssuance (preIssuance) {
      const _xdr = base.xdr.PreIssuanceRequest
        .fromXDR(preIssuance.preEmission, 'hex')
      const result = base.PreIssuanceRequest.dataFromXdr(_xdr)

      this.issuance = new Issuance({
        record: result,
        xdr: _xdr,
        isUsed: preIssuance.used,
      })
    },
  },
}
