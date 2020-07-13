import { api } from '@/api'

export async function createPrivateBlob (type, value, blobOwnerId = '') {
  blobOwnerId = blobOwnerId || getCurrentAccId()
  const body = {
    data: {
      type,
      attributes: { value },
      relationships: {
        owner: { data: { id: blobOwnerId } },
      },
    },
  }
  const { data: blob } = await api.postWithSignature('/blobs', body)
  return blob
}

export async function getPrivateBlob (blobId, blobOwnerId = '') {
  blobOwnerId = blobOwnerId || getCurrentAccId()
  const endpoint = `/accounts/${blobOwnerId}/blobs/${blobId}`
  const { data: blob } = await api.getWithSignature(endpoint)
  return blob
}

export async function getPublicBlob (blobId) {
  const { data: blob } = await api.getWithSignature(`/blobs/${blobId}`)
  return blob
}

export async function getLatestRequest (endpoint, requestorId = '') {
  requestorId = requestorId || getCurrentAccId()
  const { data: [request] } = await api.getWithSignature(endpoint, {
    filter: { requestor: requestorId },
    page: { limit: 1, order: 'desc' },
    include: ['request_details'],
  })
  return request
}

export async function getRequest (endpoint, reqId, requestorId = '') {
  requestorId = requestorId || getCurrentAccId()
  const { data: request } = await api.getWithSignature(`${endpoint}/${reqId}`, {
    filter: { requestor: requestorId },
    include: ['request_details'],
  })
  return request
}

export function getCurrentAccId () {
  return api.wallet.accountId
}

export function getCurrentWalletPublicKey () {
  return api.wallet.keypair.accountId()
}
