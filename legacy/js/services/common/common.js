import request from '../../builders/request_builder/index'

export default {
  getWalletKDF (email, isRecovery = false) {
    return request.kdf()
      .forEmail(email)
      .isRecovery(isRecovery)
      .get()
  }
}
