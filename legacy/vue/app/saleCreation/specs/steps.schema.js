import step2Schema from './step-2.blurb.schema'

import DefaultStep from '../steps/Step.Default'
import GeneralInfoStep from '../steps/Step.GeneralInfo'
import DescriptionStep from '../steps/Step.Description'
import { i18n } from '../../../../js/i18n/index'

export default [
  { name: 'step-1', done: false, component: GeneralInfoStep, label: i18n.sale_provide_information() },
  { name: 'step-2', done: false, component: DefaultStep, schema: step2Schema, label: i18n.sale_short_blurb_step() },
  { name: 'step-3', done: true, component: DescriptionStep, label: i18n.sale_full_description() }
]
