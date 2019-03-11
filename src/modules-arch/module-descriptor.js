import _cloneDeep from 'lodash/cloneDeep'

/**
 * The ModuleDescriptor is the class to wrap descriptions of the modules.
 */
export class ModuleDescriptor {
  /**
   * Creates a new ModuleDescriptor.
   *
   * @param {Object} opts
   *
   * @param {ModuleDescriptor.constructor[]} [opts.dependencies]
   * Constructors of modules the module depends on.
   *
   * @param {ModuleDescriptor.constructor[]} [opts.allowedSubmodules]
   * Constructors of modules the module could use as submodules.
   *
   * @param {ModuleDescriptor[]} [opts.submodules]
   * Modules that the module will use as submodules.
   * Cannot contain any entries except those described in
   * opts.allowedSubmodules.
   *
   * @param {ModuleDescriptor.constructor[]} [opts.incompatibles]
   * Constructors of modules that cannot be used simultaneously with the module.
   *
   * @param {Function} [opts.importComponent]
   * Path to the entry point vue-component of the module. Please provide
   * function like _ => import('./path).
   *
   * Neither require() nor import() work with variables. So you cannot do
   * anything like require(SomeModule.componentPath). To make the components
   * lazy-loaded we have to define them in a way like _ => import('./path)
   * directly during the definition.
   *
   * @param {String} [opts.storePath]
   * Path to the entry point store-module of the module.
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
      throw new Error(`${this.constructor.name}: no importComponent provided`)
    }

    this._importComponent = importComponent
    this._dependencies = _cloneDeep(dependencies)
    this._incompatibles = _cloneDeep(incompatibles)
    this._storePath = _cloneDeep(storePath)
    this._allowedSubmodules = _cloneDeep(allowedSubmodules)

    this.validateSubmodules(submodules)
    this._submodules = _cloneDeep(submodules)
  }

  get importComponent () { return this._importComponent }
  get dependencies () { return _cloneDeep(this._dependencies) }
  get allowedSubmodules () { return _cloneDeep(this._allowedSubmodules) }
  get submodules () { return _cloneDeep(this._submodules) }
  get incompatibles () { return _cloneDeep(this._incompatibles) }
  get storePath () { return _cloneDeep(this._storePath) }

  /**
   * Checks all dependencies are present.
   * Throws an error in case of missing dependency.
   *
   * @param {ModuleDescriptor[]} modules
   * Array of the modules that should be checked against the current module.
   */
  validateDependencies (modules) {
    const moduleConstructors = modules.map(item => item.constructor)

    const missingDependency = this.dependencies
      .find(item => !moduleConstructors.includes(item))

    if (missingDependency) {
      throw new Error(`${this.constructor.name}: missing ${missingDependency.name} dependency`)
    }
  }

  /**
   * Checks whether the current module compatible with the provided array.
   * Throws an error in case of any incompatible module found.
   *
   * @param {ModuleDescriptor[]} modules
   * Array of the modules that should be checked against the current module.
   */
  validateCompatibility (modules) {
    const moduleConstructors = modules.map(item => item.constructor)

    const incompatibleModule = this.incompatibles
      .find(item => moduleConstructors.includes(item))

    if (incompatibleModule) {
      throw new Error(`${this.constructor.name}: cannot be used with incompatible ${incompatibleModule.name}`)
    }
  }

  /**
   * Check all the modules provided can be used as submodule of the module.
   * Throws an error if disallowed or duplicated submodule present.
   *
   * @param {ModuleDescriptor[]} modules
   * Array of the modules that should be checked against the current module.
   */
  validateSubmodules (modules) {
    const disallowedModule = modules.find(candidate => {
      return !this.allowedSubmodules.some(AllowedSubmoduleConstructor => {
        return candidate instanceof AllowedSubmoduleConstructor
      })
    })

    if (disallowedModule) {
      throw new Error(`${this.constructor.name}: disallowed submodule ${disallowedModule.constructor.name} provided`)
    }

    const constructors = modules.map(item => item.constructor)
    const hasDupes = constructors.length - [...new Set(constructors)].length > 0

    if (hasDupes) {
      throw new Error(`${this.constructor.name}: shouldn’t contain duplicated submodules`)
    }
  }

  /**
   * Checks whether module with the provided constructor is registered
   *
   * @param {ModuleDescriptor.constructor} submoduleConstructor
   */
  hasSubmodule (submoduleConstructor) {
    return this.submodules.some(item => {
      return item instanceof submoduleConstructor
    })
  }

  /**
   * Returns submodules that created with the provided constructor
   *
   * @param {ModuleDescriptor.constructor} submoduleConstructor
   */
  getSubmoduleByConstructor (submoduleConstructor) {
    return this.submodules.find(item => {
      return item instanceof submoduleConstructor
    })
  }
}
