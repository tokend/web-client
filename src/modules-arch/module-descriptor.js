import { store } from '@/vuex/index'
import { vuexTypes } from '@/vuex/types'

/**
 * Describes the module. Its dependencies, incompatible modules,
 * allowed submodules, component and store module importers.
 */
export class ModuleDescriptor {
  /**
   * Creates a new ModuleDescriptor.
   *
   * @param {Object} opts
   *
   * @param {Function} opts.importComponent
   * Path to the entry point vue-component of the module. Please provide
   * function like _ => import('./path).
   *
   * Neither require() nor import() work with variables. So you cannot do
   * anything like require(SomeModule.componentPath). To make the components
   * lazy-loaded we have to define them in a way like _ => import('./path)
   * directly during the definition.
   *
   * @param {String} [opts.importStore]
   * Path to the entry point vuex-module of the module. Please provide
   * function like _ => import('./path).
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
   *
   * @param {Boolean} [opts.isCorporateOnly]
   * If `true` the component will be accessible only by corporate accounts
   *
   */
  constructor (opts = {}) {
    // will be assigned automatically while the component renders
    this._createdComponentUid = -1
    this._createdComponent = {}

    const {
      dependencies = [],
      allowedSubmodules = [],
      submodules = [],
      incompatibles = [],
      importComponent = null,
      importStore = null,
    } = opts

    if (typeof importComponent !== 'function') {
      throw new Error(`${this.constructor.name}: no importComponent provided`)
    }

    this._importComponent = this._rememberUidAfterImport(importComponent)

    if (importStore) {
      this._importStore = importStore
    }

    this._dependencies = dependencies
    this._incompatibles = incompatibles
    this._allowedSubmodules = allowedSubmodules
    this._isCorporateOnly = opts.isCorporateOnly || false

    this.validateSubmodules(submodules)
    this._submodules = submodules
  }

  get importComponent () { return this._importComponent }
  get importStore () { return this._importStore }
  get dependencies () { return this._dependencies }
  get allowedSubmodules () { return this._allowedSubmodules }
  get submodules () { return this._submodules }
  get incompatibles () { return this._incompatibles }
  get isAccessible () {
    return this._isCorporateOnly
      ? store.getters[vuexTypes.isAccountCorporate]
      : true
  }
  get createdComponentUid () { return this._createdComponentUid }
  get createdComponent () { return this._createdComponent }
  get isComponentCreated () { return this._createdComponentUid >= 0 }

  _rememberUidAfterImport (importFn) {
    return async _ => {
      if (this.isComponentCreated) {
        return importFn()
      }

      const imported = await importFn()
      const componentDefinition = Object.values(imported)
        .find(item => item.render)

      if (!componentDefinition) {
        throw new Error(`${this.constructor.name}: cannot find imported component definition`)
      }

      if (!componentDefinition.beforeCreate) {
        componentDefinition.beforeCreate = []
      }

      const self = this
      componentDefinition.beforeCreate.push(function () {
        self._createdComponentUid = this._uid
        self._createdComponent = this
      })

      return imported
    }
  }

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
   * Checks whether submodule with the provided constructor is registered and
   * can be rendered for the current account
   *
   * @param {ModuleDescriptor.constructor} submoduleConstructor
   */
  canRenderSubmodule (submoduleConstructor) {
    const submodule = this.getSubmodule(submoduleConstructor)

    if (!submodule) {
      return false
    }

    return submodule.isAccessible
  }

  /**
   * Checks whether submodule with the provided constructor is registered
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
  getSubmodule (submoduleConstructor) {
    return this.submodules.find(item => {
      return item instanceof submoduleConstructor
    })
  }
}
