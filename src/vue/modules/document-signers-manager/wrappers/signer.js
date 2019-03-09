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
    return true // this._rules.includes(r => true) // TODO
  }

  get isAllowedToUpdateMetadata () {
    return true // this._rules.includes(r => true) // TODO
  }
}
