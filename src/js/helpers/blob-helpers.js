import { api } from '@/api'
import { BlobRecord } from '../records/entities/blob.record'
import { store } from '@/vuex'
import { vuexTypes } from '@/vuex/types'

export async function createPrivateBlob (type, value, accountId = '') {
  accountId = accountId || store.getters[vuexTypes.accountId]
  const body = {
    data: {
      type,
      attributes: { value },
      relationships: {
        owner: { data: { id: accountId } },
      },
    },
  }
  const { data: rawBlob } = await api.postWithSignature('/blobs', body)
  return new BlobRecord(rawBlob)
}

export async function getPrivateBlob (blobId, accountId = '') {
  accountId = accountId || store.getters[vuexTypes.accountId]
  const endpoint = `/accounts/${accountId}/blobs/${blobId}`
  const { data: rawBlob } = await api.getWithSignature(endpoint)
  return new BlobRecord(rawBlob)
}

export async function getPublicBlob (blobId) {
  const { data: rawBlob } = await api.getWithSignature(`/blobs/${blobId}`)
  return new BlobRecord(rawBlob)
}
