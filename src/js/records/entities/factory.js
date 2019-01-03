import { TokenRecord } from './token.record'

export class RecordFactory {
  static createTokenRecord () {
    return new TokenRecord(...arguments)
  }
}
