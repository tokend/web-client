import { ResponseBuilder } from '../response_builder'
import get from 'lodash/get'

export class CommonResponseBuilder extends ResponseBuilder {
  constructor (response) {
    super(response)
    this._parsedData = ''
    if (response.body) {
      try {
        this._parsedData = JSON.parse(response.body)
      } catch (err) {
        this._parsedData = response.body || response
      }
    }
  }

  meta (field) {
    const meta = this._parsedData.meta
    if (!field) {
      return meta
    }

    if (!meta[field]) {
      throw new Error(`Error. Meta has no ${field} field`)
    }

    return meta[field]
  }

  data (field) {
    const data = this._parsedData.data ||
                 this._parsedData ||
                 this._rawResponse.data ||
                 this._rawResponse
    if (!field) {
      return data
    }

    if (!data[field]) {
      throw new Error(`Error. Data has no ${field} field`)
    }

    return data[field]
  }

  attributes (index) {
    const data = this.data()
    if (!data) {
      console.warn('No response data found')
    }

    if (data instanceof Array) {
      if (index) {
        return get(data[index], 'attributes')
      } else {
        return data.map(item => get(item, 'attributes') ||
               get(item, 'data.attributes'))
      }
    }

    if (!data.attributes) {
      throw new Error(`Error. Data has no attributes field`)
    }

    return data.attributes
  }

  attribute (attributeName) {
    if (!attributeName) {
      throw new Error(`
        Attribute name is required when using attribute().
        To get all the attributes, use attributes() instead
      `)
    }
    const attributes = this.attributes()
    return attributes[attributeName]
  }
}
