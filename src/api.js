import {
  ApiCaller,
  DocumentsManager,
  FactorsManager,
  WalletsManager,
  Document,
} from '@tokend/js-sdk'

export const api = new ApiCaller()

export const documentsManager = new DocumentsManager()
export const walletsManager = new WalletsManager()
export const factorsManager = new FactorsManager()

Document.useDocumentsManager(documentsManager)

export function useWallet (newWallet) {
  api.useWallet(newWallet)

  documentsManager.useApi(api)
  factorsManager.useApi(api)
  walletsManager.useApi(api)
}

export async function loadingDataViaLoop (response) {
  let data = response.data
  while (response.data.length) {
    response = await response.fetchNext()
    data = [...data, ...response.data]
  }
  return data
}
