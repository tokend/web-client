export const vueRoutes = Object.freeze({
  // existing routes:
  app: { name: 'app' },
  auth: { name: 'auth' },
  login: { name: 'login' },
  verify: { name: 'verify' },
  fees: { name: 'app.fees' },
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
  issuance: { name: 'app.issuance' },

  // stubs:
  terms: { name: 'terms' },
  downloads: { name: 'downloads' },
  dashboard: { name: 'app.dashboard' },
  deposit: { name: 'app.deposit' },
  limits: { name: 'app.limits' },
  transfers: { name: 'app.transfers' },
  massTransfers: { name: 'app.mass-transfers' },
  withdrawal: { name: 'app.withdrawal' },
  tokens: { name: 'app.tokens' },
  history: { name: 'app.history' },
  trade: { name: 'app.trade' },
  tokenCreation: { name: 'app.tokenCreation' },
  saleCreation: { name: 'app.saleCreation' },
  issuanceCreation: { name: 'app.issuanceCreation' },
  requests: { name: 'app.requests' },
  sales: { name: 'app.sales' },
  mySales: { name: 'app.my-sales' },
  preissuanceUpload: { name: 'app.preissuance-upload' },
})
