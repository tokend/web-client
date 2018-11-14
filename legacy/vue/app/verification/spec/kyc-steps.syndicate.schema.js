import step1Schema from './syndicate/step-1.details.schema'

import DefaultStep from '../steps/Step.Default'
import { i18n } from '../../../../js/i18n/index'

export default [
  { name: 'step-1', done: true, component: DefaultStep, schema: step1Schema, label: i18n.kyc_corporate_details() }
]
