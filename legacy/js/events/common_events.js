import { AppEvent } from './event_types'

const common = {
  inputEvent: 'input'
}

const busEvents = Object.freeze({
  showSnackbarEvent: new AppEvent('show-snackbar'),
  hideSnackbarEvent: new AppEvent('hide-snackbar'),
  showLoaderEvent: new AppEvent('show-loader'),
  hideLoaderEvent: new AppEvent('hide-loader'),
  routesUpdateEvent: new AppEvent('update-routes'),

  accountOptionsOpenedEvent: new AppEvent('account-options-opened'),
  destroyFundEvent: new AppEvent('destroy-fund'),
  detailsOpenedEvent: new AppEvent('details-opened'),
  selectFundEvent: new AppEvent('select-fund'),
  openSaleViewEvent: new AppEvent('open-sale-view'),
  openFileViewEvent: new AppEvent('open-file-view'),
  closeFileViewEvent: new AppEvent('close-file-view'),
  showLoadIndicator: new AppEvent('show-load-indicator'),
  hideLoadIndicator: new AppEvent('hide-load-indicator'),
  openDiscourseConfirmation: new AppEvent('open-discource-confirmation'),
  closeDiscourseConfirmation: new AppEvent('close-discource-confirmation'),
  enterAppEvent: new AppEvent('enter-app'),
  showAirdropMessage: new AppEvent('show-airdrop-message'),
  selectOfferEvent: new AppEvent('select-offer'),
  touchEvent: new AppEvent('touch-event'),
  changePairsAsset: new AppEvent('change-pairs-asset'),
  cancelOrder: new AppEvent('cancel-order'),
  createdOrder: new AppEvent('created-order')
})

const componentEvents = Object.freeze({
  cancelClickEvent: 'cancel-click',
  confirmClickEvent: 'confirm-click',
  cancelFailEvent: 'cancel-fail',
  closeEvent: 'close',
  editClickEvent: 'edit-click',
  imageReadyEvent: 'image-ready',
  nextStepEvent: 'next-step',
  openDetailsEvent: 'open-details',
  selectSyndicateEvent: 'select-syndicate',
  searchInputEvent: 'search-input',
  timelineAddFinished: 'timeline-add-finished',
  timelineAddClick: 'timeline-add-click',
  updatedEvent: 'updated',
  selectTokenEvent: 'select-token',
  addMemberEvent: 'add-member',
  investInSale: 'invest-in-sale',
  formChangeEvent: 'form-change',
  formResetEvent: 'form-reset',
  cancelOfferEvent: 'cancel-offer',
  makeOfferEvent: 'make-offer',
  assetChangeEvent: 'asset-change',
  changeDashboardScale: 'change-dashboard-scale',
  checkDashboardChartHasValue: 'check-dashboard-chart-has-value',
  saleUpdateEvent: 'sale-update',
  saleSelectEvent: 'sale-select',
  saleEditEndEvent: 'sale-edit-end',
  selectUserTypeEvent: 'select-user-type',
  kycUpdateEvent: 'kyc-update',
  kycEditEndEvent: 'kyc-edit-end',
  closeRequestEvent: 'close-request'
})

export const commonEvents = {
  ...common,
  ...busEvents,
  ...componentEvents
}
