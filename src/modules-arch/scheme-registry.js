import _cloneDeep from 'lodash/cloneDeep'

let currentScheme = {}
const SCHEME_IMPORTERS = {
  vanilla: _ => import('@/modules-arch/schemes/vanilla'),
}

export class SchemeRegistry {
  static get current () {
    return _cloneDeep(currentScheme)
  }

  static async useScheme (schemeName) {
    if (!SCHEME_IMPORTERS[schemeName]) {
      throw new Error(`SchemeRegistry: no such module scheme: ${schemeName}`)
    }

    const { default: scheme } = await SCHEME_IMPORTERS[schemeName]()
    currentScheme = scheme
  }
}
