/**
 * The ClientModule is the class to wrap vue-modules
 */
export class ClientModule {
  /**
   * Creates a new ClientModule
   * @param {Object} opts
   * @param {Array} [opts.dependencies]
   * Modules that the component depends on
   *
   * @param {Array} [opts.allowedSubmodules]
   * Modules that the module could use
   *
   * @param {Array} [opts.incompatibles]
   * Modules that cannot be used simultaneously with the module
   *
   * @param {String} [opts.componentPath]
   * Path to the entry point vue-component of the module
   *
   * @param {String} [opts.storePath]
   * Path to the entry point store-module of the module
   */
  constructor (opts = {}) {
    const {
      dependencies = [],
      allowedSubmodules = [],
      incompatibles = [],
      componentPath = {},
      storePath = {},
    } = opts

    if (!componentPath) {
      throw new Error('ClientModule: no component provided')
    }

    this._dependencies = dependencies
    this._allowedSubmodules = allowedSubmodules
    this._incompatibles = incompatibles
    this._componentPath = componentPath
    this._storePath = storePath
  }

  get dependencies () { return this._dependencies }
  get allowedSubmodules () { return this._allowedSubmodules }
  get incompatibles () { return this._incompatibles }
  get componentPath () { return this._componentPath }
  get storePath () { return this._storePath }

  /**
   * Checks all dependencies are plugged in and incompatibles modules
   * are absent
   *
   * @param {Array} modules
   * Array of the modules that should be checked against current module
   */
  isCompatibleWithModules (modules) {
    if (this._isAllDependenciesPresent(modules)) {
      throw new Error('A module has unresolved dependency')
    }

    if (this._isAnyIncompatiblePresent(modules)) {
      throw new Error('A module met an incompatible module')
    }

    return true
  }

  _isAllDependenciesPresent (modules) {
    return this.dependencies.reduce(
      (result, dependency) => result & modules.includes(dependency),
      true
    )
  }

  _isAnyIncompatiblePresent (modules) {
    return this.incompatibles
      .some(incompatible => modules.includes(incompatible))
  }

  /**
   * Check all the modules provided can be used as submodule of the module
   *
   * @param {Array} potentialSubmodules
   * Array of the modules that should be checked against current module
   */
  isValidSubmodules (potentialSubmodules) {
    return !potentialSubmodules.some(candidate => {
      return !this.allowedSubmodules.includes(candidate)
    })
  }
}
