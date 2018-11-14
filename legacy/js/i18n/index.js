import documents from './to_replace/documens'
import offers from './to_replace/offers'
import sales from './to_replace/sales'
import transactions from './to_replace/transactions'
import transfers from './to_replace/transfers'
import defaults from './to_replace/default'

import txHistoryView from './views/tx-history_view'
import depositView from './views/deposit_view'
import withdrawView from './views/withdrawal_view'
import signupView from './views/signup_view'
import loginView from './views/login_view'
import saleView from './views/sale_view'
import labels from './views/labels'
import inactivitymessage from './views/inactivity_message'
import issuancesView from './views/issuances_view'
import settingsView from './views/settings_view'
import dashboardView from './views/dashboard_view'
import transfersView from './views/transfers_view'
import tokensView from './views/tokens_view'
import modals from './views/modals'
import verification from './views/verification_view'
import fileUpload from './views/file-upload'
import trade from './views/trade_view'
import companyView from './views/company_view'
import preissuanceView from './views/preissuance_view'
import fees from './views/fees'
import common from './views/common'
import auth from './views/auth_view'
import formConfirmation from './views/form_confirmation_view'
import saleInvest from './views/sale_invest_view'
import marketPriceChartView from './views/market_price_chart_view'
import sidebarView from './views/sidebar_view'
import supportedBrowsersView from './views/supported_browsers_view'
import downloadsView from './views/downloads_view'
import limitsView from './views/limits_view'
import iosInstallGuide from './views/ios_install_guide'
import txView from './views/tx_view'

import { formatConvertedCurrency, formatCurrency, formatNumber } from './numbers'
import { humanizePastDate, getDateByDMY } from '../utils/dates.util'
import Polyglot from 'node-polyglot'

const polyglot = new Polyglot()

const dictionary = {
  ...auth,
  ...documents,
  ...offers,
  ...sales,
  ...transactions,
  ...transfers,
  ...loginView,
  ...saleView,
  ...signupView,
  ...depositView,
  ...withdrawView,
  ...labels,
  ...inactivitymessage,
  ...issuancesView,
  ...txHistoryView,
  ...settingsView,
  ...transfersView,
  ...labels,
  ...modals,
  ...defaults,
  ...dashboardView,
  ...verification,
  ...fileUpload,
  ...trade,
  ...companyView,
  ...preissuanceView,
  ...common,
  ...formConfirmation,
  ...tokensView,
  ...saleInvest,
  ...marketPriceChartView,
  ...sidebarView,
  ...supportedBrowsersView,
  ...downloadsView,
  ...limitsView,
  ...fees,
  ...iosInstallGuide,
  ...txView
}

polyglot.extend(dictionary)

export { polyglot }

export const i18n = {
  ...Object.keys(dictionary)
    .reduce((obj, key) => {
      obj[key] = (opts) => polyglot.t(key, opts)
      return obj
    }, {}),
  n: formatNumber(),
  c: formatCurrency(),
  cc: formatConvertedCurrency(),
  d: humanizePastDate,
  dmy: getDateByDMY
}
