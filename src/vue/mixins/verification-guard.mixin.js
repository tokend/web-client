import {
  store,
  vuexTypes,
} from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'

function verificationGuard (to, from, next) {
  const kycAccountType = store.getters[vuexTypes.kycAccountTypeToSet]
  switch (kycAccountType) {
    case ACCOUNT_TYPES.syndicate:
      to.name === vueRoutes.verification.corporate.name
        ? next()
        : next(vueRoutes.verification.corporate)
      break
    case ACCOUNT_TYPES.general:
      to.name === vueRoutes.verification.general.name
        ? next()
        : next(vueRoutes.verification.general)
      break
    default:
      next()
      break
  }
}

export default {
  beforeRouteEnter (to, from, next) {
    verificationGuard(to, from, next)
  },
  beforeRouteUpdate (to, from, next) {
    verificationGuard(to, from, next)
  },
}
