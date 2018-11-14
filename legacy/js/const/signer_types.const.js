export const SIGNER_TYPES = Object.freeze({
  reader: 1,
  notVerifiedAccManager: 2,
  generalAccManager: 4,
  directDebitOperator: 8,
  assetManager: 16,
  assetRateManager: 32,
  balanceManager: 64,
  issuanceManager: 128,
  invoiceManager: 256,
  paymentOperator: 512,
  limitsManager: 1024,
  accountManager: 2048,
  commissionBalanceManager: 4096,
  operationalBalanceManager: 8192,
  eventsChecker: 16384,
  exchangeAccManager: 32768,
  syndicateAccManager: 65536
})
