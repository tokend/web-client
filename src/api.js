import {
  ApiCaller,
  DocumentsManager,
  FactorsManager,
  WalletsManager,
} from '@tokend/js-sdk'

export const api = new ApiCaller()

export const documentsManager = new DocumentsManager()
export const walletsManager = new WalletsManager()
export const factorsManager = new FactorsManager()

export function useWallet (newWallet) {
  api.useWallet(newWallet)

  documentsManager.useApi(api)
  factorsManager.useApi(api)
  walletsManager.useApi(api)
}
