import { Service } from './service'
import Vue from 'vue'
import get from 'lodash/get'

export class EmailService extends Service {
  sendResendEmailRequest (walletId) {
    return this._apiRequestBuilder.wallets()
      .walletId(walletId)
      .verification()
      .post()
  }

  sendVerifyEmailRequest (token, walletId) {
    return this._apiRequestBuilder.wallets()
      .walletId(walletId)
      .verification()
      .attributes({ token })
      .put()
  }

  validateOnMailgun (email) {
    // eslint-disable-next-line
    const url = `https://api.mailgun.net/v3/address/validate?address=${email}&api_key=pubkey-95abcf87f43d7dbd20bf0856a39a8536&syntax_only=false`
    return Vue.http.get(url)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => {
        return get(response, 'body')
      })
  }
}

export const emailService = new EmailService()
