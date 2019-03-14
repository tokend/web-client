import { ModuleDescriptor } from './module-descriptor'

/**
 * Describes the module that represents a page. Extends ModuleDescriptor but
 * have some specific fields for rendering buttons and sections in the sidebar
 * menu.
 */
export class PageModuleDescriptor extends ModuleDescriptor {
  /**
   * @param {Object} opts
   * All the opts of ModuleDescriptor but also some Page-related args
   * Submodule instances of PageModuleDescriptor will be automatically assigned
   * as `children` to the `routerEntry`.
   *
   * @param {Object} opts.routerEntry
   * Vue router entry.
   *
   * @param {String} [opts.menuButtonTranslationId]
   * Menu button translation ID. The button wont be rendered if no translation
   * ID provided.
   *
   * @param {String} [opts.menuButtonMdiName]
   * Name of the icon to be used in sidebar. Should be kebab-cased.
   *
   * @param {String} [opts.menuSectionTranslationId]
   * All the menu items with the same value of menuSectionTranslationId will be
   * rendered as a group in the Sidebar. If the argument is omitted, the menu
   * item will be rendered in default section with no label.
   *
   * @param {Boolean} [opts.isAutoRedirectToFirstChild]
   * Will redirect to the first child automatically.

   * @param {Object} moduleOpts @link ModuleDescriptor
   */
  constructor (opts = {}) {
    super(opts)
    this._menuButtonTranslationId = opts.menuButtonTranslationId || ''
    this._menuButtonMdiName = opts.menuButtonMdiName || ''
    this._menuSectionTranslationId = opts.menuSectionTranslationId || ''
    this._isAutoRedirectToFirstChild = opts.isAutoRedirectToFirstChild || false

    this._routerEntry = this._parseRouterEntry(opts)
    this._tryPopulateRouterEntryWithChildren()
  }

  get routerEntry () { return this._routerEntry }
  get menuButtonTranslationId () { return this._menuButtonTranslationId }
  get menuButtonMdiName () { return this._menuButtonMdiName }
  get menuSectionTranslationId () { return this._menuSectionTranslationId }
  get isAutoRedirectToFirstChild () { return this._isAutoRedirectToFirstChild }

  _parseRouterEntry (opts = {}) {
    if (!opts.routerEntry) {
      throw new Error(`${this.constructor.name}: no opts.routerEntry provided!`)
    }

    const entry = opts.routerEntry
    entry.component = this.importComponentFn
    return entry
  }

  _tryPopulateRouterEntryWithChildren () {
    const children = this.submodules
      .filter(item => item instanceof PageModuleDescriptor)
      .filter(item => item.isAccessible)
      .map(item => item.routerEntry)

    // We rewrite the children field intentionally to prevent mixing of default
    // children property of the vue-router-entry and enforce migrating to the
    // new module architecture.
    this.routerEntry.children = children

    if (this.isAutoRedirectToFirstChild) {
      if (!this.routerEntry.children.length) {
        throw new Error(`${this.constructor.name}: no children pages provided but isAutoRedirectToFirstChild is on!`)
      }
      this.routerEntry.redirect = this.routerEntry.children[0].path
    }
  }
}
