export const conversionCustomEvents = Object.freeze({
  CompleteRegistration: 'CompleteRegistration',
  signUp: 'Signed up',
  logIn: 'Signed in',
  exploreIo: 'Explored IO',
  viewIoDetails: 'Viewed IO Details',
  makeInvestment: 'Made Investment',
  submitKyc: 'Submitted KYC'
})

export const twitterEvents = Object.freeze({
  [conversionCustomEvents.CompleteRegistration]: 'CompleteRegistration',
  [conversionCustomEvents.signUp]: 'Sign up',
  [conversionCustomEvents.logIn]: 'Sign in',
  [conversionCustomEvents.exploreIo]: 'Explore IO',
  [conversionCustomEvents.viewIoDetails]: 'Viewed IO',
  [conversionCustomEvents.makeInvestment]: 'Make Investment',
  [conversionCustomEvents.submitKyc]: 'Submit KYC'
})

export const googleAnalyticsEventCategories = Object.freeze({
  [conversionCustomEvents.CompleteRegistration]: 'sign_up',
  [conversionCustomEvents.signUp]: 'sign_up',
  [conversionCustomEvents.logIn]: 'login',
  [conversionCustomEvents.exploreIo]: 'view_item_list',
  [conversionCustomEvents.viewIoDetails]: 'view_item',
  [conversionCustomEvents.makeInvestment]: 'purchase',
  [conversionCustomEvents.submitKyc]: 'purchase'
})

export const conversionFbEvents = Object.freeze({
  CompleteRegistration: 'CompleteRegistration'
})
