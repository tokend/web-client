import { CommonResponseBuilder } from '../../js/builders/response_builder/modules/common_response_builder'
import { mockEmail } from './default.mocks'
const records = []

const next = () => {
  return Promise.resolve({
    next,
    records
  })
}

export const transactionsResponse = {
  next,
  records
}

export const detailsResponse = new CommonResponseBuilder({
  users: {
    mockAccountId: {
      email: mockEmail
    }
  }
})
