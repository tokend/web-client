import { ModuleScheme } from './module-scheme'

let currentScheme = {}
const SCHEME_IMPORTERS = {
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
