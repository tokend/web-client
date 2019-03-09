import _cloneDeep from 'lodash/cloneDeep'

/**
 * The ClientModule is the class to wrap vue-modules
 */
export class ClientModule {
  /**
   * Creates a new ClientModule
   * @param {Object} opts
   * @param {ClientModule[]} [opts.dependencies]
   * Constructors of modules the component depends on
   *
   * @param {ClientModule[]} [opts.allowedSubmodules]
   * Constructors of modules the module could use
   *
   * @param {ClientModule[]} [opts.submodules]
   * Constructors of modules the module will use as submodules.
   * Cannot contain any entry except those described in opts.allowedSubmodules
   *
   * @param {ClientModule[]} [opts.incompatibles]
   * Constructors of modules that cannot be used simultaneously with the module
   *
   * @param {Function} [opts.importComponent]
   * Path to the entry point vue-component of the module
   *
   * Neither require() nor import() work with variables. So you cannot do
   * anything like require(SomeModule.componentPath). To make the components
   * lazy-loaded we have to define them in a way like _ => import('./path)
   * directly during the definition
   *
   * @param {String} [opts.storePath]
   * Path to the entry point store-module of the module
   */
  constructor (opts = {}) {
    const {
      dependencies = [],
      allowedSubmodules = [],
      submodules = [],
      incompatibles = [],
      importComponent = null,
      storePath = '',
    } = opts

    if (typeof importComponent !== 'function') {
      throw new Error(`${this.constructor.name}: no component importer provided`)
    }

    this._importComponent = importComponent
    this._dependencies = _cloneDeep(dependencies)
    this._incompatibles = _cloneDeep(incompatibles)
    this._storePath = _cloneDeep(storePath)
    this._allowedSubmodules = _cloneDeep(allowedSubmodules)

    if (!this.isValidSubmodules(submodules)) {
      throw new Error(`${this.constructor.name}: invalid submodules provided`)
    } else {
      this._submodules = _cloneDeep(submodules)
    }
  }

  get importComponent () { return this._importComponent }
  get dependencies () { return _cloneDeep(this._dependencies) }
  get allowedSubmodules () { return _cloneDeep(this._allowedSubmodules) }
  get submodules () { return _cloneDeep(this._submodules) }
  get incompatibles () { return _cloneDeep(this._incompatibles) }
  get storePath () { return _cloneDeep(this._storePath) }

  /**
   * Checks all dependencies are plugged in and incompatibles modules
   * are absent
   *
   * @param {Array} modules
   * Array of the modules that should be checked against current module
   */
  validateCompatibility (modules) {
    if (!this._isAllDependenciesPresent(modules)) {
      throw new Error(`${this.constructor.name}: has unresolved dependency`)
    }

    if (this._isAnyIncompatiblePresent(modules)) {
      throw new Error(`${this.constructor.name} an incompatible module`)
    }
  }

  _isAllDependenciesPresent (modules) {
    return this.dependencies.every(dependency => modules.includes(dependency))
  }

  _isAnyIncompatiblePresent (modules) {
    return this.incompatibles
      .some(incompatible => modules.includes(incompatible))
  }

  /**
   * Check all the modules provided can be used as submodule of the module
   *
   * @param {Array} submoduleCandidates
   * Array of the modules that should be checked against current module
   */
  isValidSubmodules (submoduleCandidates) {
    return submoduleCandidates.every(candidate => {
      return this.allowedSubmodules.some(AllowedSubmoduleConstructor => {
        return candidate instanceof AllowedSubmoduleConstructor
      })
    })
  }

  hasSubmodule (submoduleConstructor) {
    return this.submodules.some(item => {
      return item instanceof submoduleConstructor
    })
  }
}
