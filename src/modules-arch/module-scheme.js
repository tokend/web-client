import { PageModuleDescriptor } from './page-module-descriptor'
import { SchemeRegistry } from './scheme-registry'
import { ModuleDescriptor } from './module-descriptor'

function findRouteByName (routes, name) {
  if (!Array.isArray(routes)) {
    return undefined
  }

  let result
  for (const route of routes) {
    const item = route || {}

    if (item.name === name) {
      result = item
    }

    if (!result && item.children) {
      result = findRouteByName(item.children, name)
    }

    if (result) {
      break
    }
  }

  return result
}

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
   * @param {Function} scheme.importLanguageResource
   * Should accept lang key as an argument and return callback
   * Example: _ => import('./path').
   *
   * @param {PageModuleDescriptor[]} scheme.pages
   * @param {ModuleDescriptor[]} scheme.modules
   */
  constructor (scheme) {
    this._validateRawScheme(scheme)

    this._rawScheme = scheme
    this._sidebarLabel = scheme.sidebarLabel
    this._appLogoUrl = scheme.appLogoUrl
    this._pages = scheme.pages
    this._modules = scheme.modules
    this._importLanguageResources = scheme.importLanguageResource

    // To validate the whole bunch of modules for compatibility
    this._cache = this._createCache()
    this._validateCache()
  }

  get sidebarLabel () { return this._sidebarLabel }
  get appLogoUrl () { return this._appLogoUrl }
  get pages () { return this._pages }
  get modules () { return this._modules || [] }
  get cache () { return this._cache }
  get importLanguageResource () { return this._importLanguageResources }

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

    // eslint-disable-next-line max-len
    if (!(scheme.modules || []).every(item => item instanceof ModuleDescriptor)) {
      throw new Error('ModuleScheme: scheme.pages should contain only ModuleDescriptor instances!')
    }
  }

  _createCache () {
    const pages = this._flattenDeep(this._rawScheme.pages)
    const modules = this._flattenDeep(this._rawScheme.modules)
    return [].concat(pages, modules)
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
    Vue.prototype.getScheme = function () {
      return SchemeRegistry.current
    }
    Vue.prototype.isAvailableRouteName = function (name) {
      const routeByName = findRouteByName(this.$router.options.routes, name)
      if (!routeByName) {
        return false
      }

      const routeModule = SchemeRegistry.current.findModuleByName(name)
      return routeModule
        ? routeModule.isAccessible
        : true
    }
  }

  canRenderModule (moduleConstructor) {
    const theModule = this.findModule(moduleConstructor)

    if (theModule) {
      return theModule.isAccessible
    }

    return false
  }

  findModule (moduleConstructor) {
    return this.cache.find(item => item instanceof moduleConstructor)
  }

  findModuleByPath (path) {
    return this.cache
      .find(item => item.routerEntry && item.routerEntry.path === path)
  }

  findModuleByName (name) {
    return this.cache
      .find(item => item.routerEntry && item.routerEntry.name === name)
  }
}
