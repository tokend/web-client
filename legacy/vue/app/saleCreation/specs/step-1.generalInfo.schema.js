import { i18n } from '../../../../js/i18n/index'

export default {
  form: {
    name: '',
    base_asset: '',
    start_time: '',
    end_time: '',
    soft_cap: '',
    hard_cap: '',
    baseAssetForHardCap: ''
  },
  rows: [
    [
      {
        'field': 'text',
        'model': 'name',
        'name': 'sale-name',
        'id': 'sale-name',
        'validate': 'required',
        'required': true,
        'label': i18n.lbl_sale_name()
      },
      {
        'field': 'select',
        'model': 'base_asset',
        'values': 'tokens',
        'name': 'sale-base-asset',
        'id': 'sale-base-asset',
        'label': i18n.lbl_base_asset()
      }
    ],
    [
      {
        'field': 'date',
        'model': 'start_time',
        'name': 'sale-open-time',
        'id': 'sale-open-time',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_start_time()
      },
      {
        'field': 'date',
        'model': 'end_time',
        'name': 'sale-close-time',
        'id': 'sale-close-time',
        'validate': 'required',
        'required': true,
        'disableBefore': new Date().toString(),
        'label': i18n.sale_close_time()
      }
    ],
    [
      {
        'field': 'text',
        'model': 'soft_cap',
        'name': 'sale-soft-cap',
        'id': 'sale-soft-cap',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_soft_cap()
      },
      {
        'field': 'text',
        'model': 'baseAssetForHardCap',
        'name': 'sale-base-asset-for-hard-cap',
        'id': 'sale-base-asset-for-hard-cap',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_base_asset_hard_cap_to_sell()
      },
      {
        'field': 'text',
        'model': 'hard_cap',
        'name': 'sale-hard-cap',
        'id': 'sale-hard-cap',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_hard_cap()
      }
    ]
  ]
}
