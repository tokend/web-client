import { DetailsRequestBuilder } from './modules/details_requests_builder'
import { KDFRequestBuilder } from './modules/kdf_request_builder'
import { WalletRequestBuilder } from './modules/wallet_request_builder'
import { UserIDRequestBuilder } from './modules/user_id_request_builder'
import { UsersRequestBuilder } from './modules/users_request_builder'
import config from '../../../../src/config'
import { OperationBuilder } from '../operation_builder/operation_builder'
import { ChartsRequestBuilder } from './modules/charts_request_builder'
import { IntegrationsRequestBuilder } from './modules/integrations_request_builder'
import { DataRequestBuider } from './modules/data_request_builder'
import { PublicRequestBuilder } from './modules/public_request_builder'

export class Request {
  operation () {
    return new OperationBuilder(config.HORIZON_SERVER)
  }

  details () {
    return new DetailsRequestBuilder(config.HORIZON_SERVER)
  }

  charts () {
    return new ChartsRequestBuilder(config.HORIZON_SERVER)
  }

  commonData () {
    return new DataRequestBuider(config.HORIZON_SERVER)
  }

  integrations () {
    return new IntegrationsRequestBuilder(config.HORIZON_SERVER)
  }

  kdf () {
    return new KDFRequestBuilder(config.HORIZON_SERVER)
  }

  userId () {
    return new UserIDRequestBuilder(config.HORIZON_SERVER)
  }

  users () {
    return new UsersRequestBuilder(config.HORIZON_SERVER)
  }

  wallets () {
    return new WalletRequestBuilder(config.HORIZON_SERVER)
  }

  public () {
    return new PublicRequestBuilder(config.HORIZON_SERVER)
  }
}

export default new Request()
