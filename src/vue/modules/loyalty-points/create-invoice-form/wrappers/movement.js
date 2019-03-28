import safeGet from 'lodash/get'

export class Movement {
  constructor (record) {
    this.reference = safeGet(record, 'operation.details.reference')
  }
}
