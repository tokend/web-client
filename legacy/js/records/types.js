import { TransferRecord } from './transfer.record'
import { TransferV2Record } from './transferV2.record'
import { TokenRecord } from './token.record'
import { TokenCreationRecord } from './token_creation.record'
import { SaleCreationRecord } from './sale_creation.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './issuance.record'
import { WithdrawalRecord } from './withdrawal.record'
import { SaleRecord } from './sale.record'
import { OfferRecord } from './offer.record'
import { MatchRecord, MatchTransaction } from './match.record'
import { TxRecord } from './tx.record'
import { AssetPairRecord } from './asset_pair.record'
import { TradeRecord } from './trade.record'

export const RecordTypes = {
  AssetPairRecord,
  TransferRecord,
  TransferV2Record,
  TokenRecord,
  TokenCreationRecord,
  SaleCreationRecord,
  ExternalAccountEntity,
  IssuanceRecord,
  WithdrawalRecord,
  SaleRecord,
  OfferRecord,
  MatchRecord,
  TradeRecord,
  TxRecord,
  MatchTransaction
}
