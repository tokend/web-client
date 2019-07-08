import moment from 'moment'
import _get from 'lodash/get'

const STATES = Object.freeze({
  open: 1,
  passed: 2,
  failed: 3,
  canceled: 4,
})

export class PollRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.ownerId = _get(record, 'owner.id')
    this.startsAt = _get(record, 'startTime')
    this.endsAt = _get(record, 'endTime')
    this.stateI = _get(record, 'pollState.value')
    this.permissionType = _get(record, 'permissionType')
    this.resultProviderId = _get(record, 'resultProvider.id')
    this.numberOfChoices = _get(record, 'numberOfChoices')
    this.isVoteConfirmationRequired = _get(record, 'voteConfirmationRequired')
    this.question = _get(record, 'creatorDetails.question')
    this.participants = _get(record, 'participation.votes', [])
      .map(item => ({
        id: item.voter.id,
        choice: item.voteData.singleChoice,
      }))

    this.choices = _get(record, 'creatorDetails.choices', [])
      .map(item => ({
        number: +item.number,
        description: item.description,
      }))
  }

  get isOpen () {
    return this.stateI === STATES.open
  }

  get isPassed () {
    return this.stateI === STATES.passed
  }

  get isFailed () {
    return this.stateI === STATES.failed
  }

  get isCanceled () {
    return this.stateI === STATES.canceled
  }

  get isStarted () {
    return moment().isSameOrAfter(this.startsAt)
  }

  get isEnded () {
    return moment().isSameOrAfter(this.endsAt)
  }

  get isInProgress () {
    return this.isOpen &&
      moment().isBetween(this.startsAt, this.endsAt)
  }

  static get states () {
    return STATES
  }
}
