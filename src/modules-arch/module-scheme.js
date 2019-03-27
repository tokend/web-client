import { PageModuleDescriptor } from './page-module-descriptor'
import { SchemeRegistry } from './scheme-registry'

/**
 * Represents module set to be used by the application.
 */
export class ModuleScheme {
  /**
   * Build the scheme
   *
   * @param {Object} scheme
   * @param {String} scheme.sidebarLabel
   * Label that should be displayed in the sidebar. To make easier
   * distinguishing of the current scheme.
   *
   * @param {String} scheme.appLogoUrl
   * URL of the image that should be displayed as an application logo
   *
   * @param {Function} scheme.importEnLocaleFile
   * Example: _ => import('./path').
   *
   * @param {PageModuleDescriptor[]} scheme.pages
   */
  constructor (scheme) {
    this._validateRawScheme(scheme)

    this._rawScheme = scheme
    this._sidebarLabel = scheme.sidebarLabel
    this._appLogoUrl = scheme.appLogoUrl
    this._pages = scheme.pages
    this._importEnLocaleFile = scheme.importEnLocaleFile

    // To validate the whole bunch of modules for compatibility
    this._cache = this._createCache()
    this._validateCache()
  }

  get sidebarLabel () { return this._sidebarLabel }
  get appLogoUrl () { return this._appLogoUrl }
  get pages () { return this._pages }
  get cache () { return this._cache }
  get importEnLocaleFile () { return this._importEnLocaleFile }

  _validateRawScheme (scheme) {
    if (!scheme.pages) {
      throw new Error('ModuleScheme: no scheme.pages provided!')
    }

    if (!Array.isArray(scheme.pages)) {
      throw new Error('ModuleScheme: scheme.pages should be an Array!')
    }

    if (!scheme.pages.every(item => item instanceof PageModuleDescriptor)) {
      throw new Error('ModuleScheme: scheme.pages should contain only PageModuleDescriptor instances!')
    }
  }

  _createCache () {
    const cache = this._flattenDeep(this._rawScheme.pages)
    return cache
  }

  _validateCache () {
    for (const item of this.cache) {
      item.validateDependencies(this.cache)
      item.validateCompatibility(this.cache)
    }
  }

  _flattenDeep (modules = []) {
    const result = []
    for (const item of modules) {
      result.push(item)
      if (item.submodules) {
        result.push(...this._flattenDeep(item.submodules))
      }
    }
    return result
  }

  install (Vue) {
    Vue.prototype.getModule = function () {
      return SchemeRegistry.current.cache
        .find(item => item.createdComponentUid === this._uid)
    }
  }

  findModuleByPath (path) {
    return this.cache
      .find(item => item.routerEntry && item.routerEntry.path === path)
  }
}
