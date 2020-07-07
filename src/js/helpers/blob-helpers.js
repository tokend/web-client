import { api } from '@/api'
import { BlobRecord } from '../records/entities/blob.record'
import { store } from '@/vuex'
import { vuexTypes } from '@/vuex/types'

export async function getPrivateBlob (blobId, accountId = '') {
  accountId = accountId || store.getters[vuexTypes.accountId]
  const endpoint = `/accounts/${accountId}/blobs/${blobId}`
  const { data: blob } = await api.getWithSignature(endpoint)
  return new BlobRecord(blob)
}

export async function getPublicBlob (blobId) {
  const { data: blob } = await api.getWithSignature(`/blobs/${blobId}`)
  return new BlobRecord(blob)
}
