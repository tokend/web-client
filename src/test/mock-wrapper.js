import { HorizonResponse, ApiResponse } from '@tokend/js-sdk'

export class MockWrapper {
  static makeHorizonData (record) {
    const response = new HorizonResponse({ data: record }, {})
    return response.data
  }

  static makeApiData (record) {
    const response = new ApiResponse({ data: record }, {})
    return response.data
  }

  static makeHorizonResponse (record) {
    return new HorizonResponse({ data: record }, {})
  }
  static makeApiResponse (record) {
    return new ApiResponse({ data: record }, {})
  }
}
