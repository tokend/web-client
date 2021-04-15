import { Former } from '@/js/formers/Former'
import { Document } from '@tokend/js-sdk'
import { CampaignRecord } from '@/js/records/entities/campaign.record'

export class CampaignFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      name: '',
      description: '',
      raisingAmount: '',
      amountOfShapes: '',
      logo: new Document(),
    }
  }

  _opBuilder = this._opBuilder || this._buildOpCreate
  get isCreateOpBuilder () { return this._opBuilder === this._buildOpCreate }
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  useCreateOpBuilder () { this._opBuilder = this._buildOpCreate; return this }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }

  async buildOps () {
    await Document.uploadDocumentsDeep(this.attrs)
    return this._opBuilder()
  }

  populate (source) {
    switch (source.constructor) {
      case CampaignRecord:
        this._populateFromRecord(source)
        break
      default:
        throw new TypeError('Unknown source type')
    }
    return this
  }

  _populateFromRecord (source) {
    this.useUpdateOpBuilder()
    this.attrs = this.attrs || this._defaultAttrs

    this.attrs.name = source.name
    this.attrs.description = source.description
    this.attrs.raisingAmount = source.raisingAmount
    this.attrs.amountOfShapes = source.amountOfShapes
    this.attrs.logo = source.logo
  }

  _buildOpCreate () {
    const opts = {
      data: {
        type: 'identity_settings',
        attributes: {
          campaign: {
            name: this.attrs.name,
            description: this.attrs.description,
            raisingAmount: this.attrs.raisingAmount,
            amountOfShapes: this.attrs.amountOfShapes,
            logo: this.attrs.logo,
          },
        },
      },
    }
    return opts
  }

  _buildOpUpdate () {
    const opts = {
      data: {
        type: 'identity_settings',
        attributes: {
          campaign: {
            name: this.attrs.name,
            description: this.attrs.description,
            raisingAmount: this.attrs.raisingAmount,
            amountOfShapes: this.attrs.amountOfShapes,
            logo: this.attrs.logo,
          },
        },
      },
    }
    return opts
  }
}
