import { base } from '@tokend/js-sdk'
import { api } from '../_api'

import { FileUtil } from '@/js/utils/file.util'

import { Issuance } from '../wrappers/issuance'

import { AssetNotOwnedError, FileCorruptedError } from '../_errors'

export default {
  data: _ => ({
    issuance: null,
  }),

  methods: {
    async createPreIssuanceRequest () {
      if (!this.isAssetOwned(this.issuance.asset)) {
        throw new AssetNotOwnedError()
      }

      const operation = base.PreIssuanceRequestOpBuilder
        .createPreIssuanceRequestOp({
          request: this.issuance.xdr,
        })
      await api().postOperations(operation)
    },

    isAssetOwned (assetCode) {
      return Boolean(this.ownedAssets
        .filter(item => item.code === assetCode)
        .length
      )
    },

    async extractPreIssuanceRequest (file) {
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
