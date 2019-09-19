import safeGet from 'lodash/get'
import { Request } from '../../shared/wrappers/request'
import { store, vuexTypes } from '@/vuex/index'

export class SponsorshipRequest extends Request {
  constructor (record) {
    super(record)

    this.id = record.id
    this.consumerBusiness = safeGet(record, 'consumerBusiness.id')
    this.consumerAsset =
      store.getters[vuexTypes.assetByCode](record.consumerAsset.id)
    this.maxUsersCountToIssue = safeGet(record, 'maxUsersCountToIssue')
    this.amount = safeGet(record, 'sponsorAmount')
    this.sponsorAsset =
      store.getters[vuexTypes.assetByCode](record.sponsorAsset.id)
    this.sponsorBusiness = safeGet(record, 'sponsorBusiness.id')
    this.status = safeGet(record, 'status.value')
  }
}
