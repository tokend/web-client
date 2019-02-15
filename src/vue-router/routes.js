export const vueRoutes = Object.freeze({
  // existing routes:
  app: { name: 'app' },
  auth: { name: 'auth' },
  login: { name: 'login' },
  verify: { name: 'verify' },
  fees: { name: 'app.fees' },
  operations: { name: 'app.operations' },
  signup: { name: 'signup' },
  recovery: { name: 'recovery' },
  settings: { name: 'app.settings' },
  verification: {
    name: 'app.verification',
    general: {
      name: 'app.verification.general',
    },
    corporate: {
      name: 'app.verification.corporate',
    },
  },
  security: { name: 'app.security' },
  dashboard: { name: 'app.dashboard' },
  trade: {
    name: 'app.trade',
    exchange: {
      name: 'app.exchange',
    },
    userOffers: {
      name: 'app.user-offers',
    },
  },
  issuance: { name: 'app.issuance' },
  limits: { name: 'app.limits' },
  assets: { name: 'app.assets' },
  balances: { name: 'app.balances' },
  assetsExplore: { name: 'app.assets-explore' },
  requests: {
    name: 'app.requests',
    assetCreation: { name: 'app.asset-creation' },
    fundCreation: { name: 'app.fund-creation' },
    preissuanceUpload: { name: 'app.preissuance-upload' },
  },
  terms: { name: 'terms' },
  downloads: { name: 'downloads' },
  iosInstallationGuide: { name: 'ios-installation-guide' },
  // stubs:
  deposit: { name: 'app.deposit' },
  transfers: { name: 'app.transfers' },
  massTransfers: { name: 'app.mass-transfers' },
  withdrawal: { name: 'app.withdrawal' },
  history: { name: 'app.history' },
  tokenCreation: { name: 'app.tokenCreation' },
  saleCreation: { name: 'app.saleCreation' },
  issuanceCreation: { name: 'app.issuanceCreation' },
  sales: { name: 'app.sales' },
  mySales: { name: 'app.my-sales' },
})
