import { ModuleScheme } from './module-scheme'

let currentScheme = {}
const SCHEME_IMPORTERS = {
  vanilla: _ => import('@/modules-arch/schemes/vanilla'),
  healthcare: _ => import('@/modules-arch/schemes/healthcare'),
  reit: _ => import('@/modules-arch/schemes/reit'),
  loyaltyPointsMerchant: _ => import('@/modules-arch/schemes/loyalty-points-merchant'),
  loyaltyPointsReconciliation: _ => import('@/modules-arch/schemes/loyalty-points-reconciliation'),
  conto: _ => import('@/modules-arch/schemes/conto'),
}

/**
 * Switches the ModuleScheme and returns the current one. For global access to
 * the current scheme within the application.
 */
export class SchemeRegistry {
  static get current () {
    return currentScheme
  }

  static async useScheme (schemeName = '') {
    if (!SCHEME_IMPORTERS[schemeName]) {
      throw new Error(`SchemeRegistry: no such module scheme: ${schemeName}`)
    }

    const { default: scheme } = await SCHEME_IMPORTERS[schemeName]()
    currentScheme = new ModuleScheme(scheme)
  }
}
