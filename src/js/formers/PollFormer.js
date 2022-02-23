import { Former } from './Former'
import { base } from '@tokend/js-sdk'
import { DateUtil } from '@/js/utils'
import { api } from '@/api'

/**
 * Collects the attributes for poll operations
 * @class
 * @implements {Former}
 */
export class PollFormer extends Former {
  attrs = this.attrs || this._defaultAttrs
  get _defaultAttrs () {
    return {
      question: '',
      choices: [],
      startTime: '',
      endTime: '',
      permissionType: '',
    }
  }

  buildOps () {
    const operation = {
      permissionType: Number(this.attrs.permissionType),
      voteConfirmationRequired: false,
      resultProviderID: api.networkDetails.masterAccountId,
      startTime: DateUtil.toTimestamp(this.attrs.startTime),
      endTime: DateUtil.toTimestamp(this.attrs.endTime),
      numberOfChoices: this.attrs.choices.length,
      pollType: base.xdr.PollType.singleChoice().value,
      creatorDetails: {
        question: this.attrs.question,
        choices: this.attrs.choices,
      },
    }
    return base.ManageCreatePollRequestBuilder.createPollRequest(operation)
  }
}
