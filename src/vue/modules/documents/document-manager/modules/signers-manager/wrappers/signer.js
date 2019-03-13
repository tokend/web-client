import safeGet from 'lodash/get'

class Rule {
  constructor (rawRule) {
    this.action = rawRule.action
    this.forbids = rawRule.forbids
    this.resource = rawRule.resource
  }
}

export class Signer {
  constructor (rawSigner) {
    this._rawSigner = rawSigner

    this.publicKey = rawSigner.id
    this.weight = rawSigner.weight
    this.details = rawSigner.details
    this.identity = rawSigner.identity

    this._rules = rawSigner.role.rules.map(r => new Rule(r))
  }

  get isAllowedToManageSigners () {
    return safeGet(this.details, 'isAllowedToManageSigners')
  }

  get isAllowedToUpdateMetadata () {
    return safeGet(this.details, 'isAllowedToUpdateMetadata')
  }
}
