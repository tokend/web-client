import { ExtendableError } from './extendable_error.error'

export class OtpError extends ExtendableError {
  constructor ({ factorId, token, repeatDetails }) {
    super('TFA required')
    this.errorType = 'TFA'
    this.meta = {
      factorId,
      token,
      repeatDetails
    }
  }
}

export class OTPCancelledError extends ExtendableError {
  constructor () {
    super('TFA cancelled')
  }

  // TODO: remove this
  showBanner () {
    // we need this to prevent showing errors when user cancels tfa verification
    return true
  }
}

export class PasswordFactorError extends ExtendableError {
  constructor (factorId, token, keychainData, salt, repeatDetails) {
    super('Password factor required')
    this.errorType = 'TFA'
    this.meta = {
      factorId,
      token,
      keychainData,
      salt,
      repeatDetails
    }
  }
}

export class TFAWrongCodeError extends ExtendableError {
  constructor () {
    super('Wrong TFA code')
    this.errorType = 'TFA'
  }
}
