import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class IssuanceExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('@/vue/modules/issuance-explorer'),
      importStoreModule: async _ => {
        const { issuanceExplorerModule: res } =
          await import('@/vue/modules/issuance-explorer/store')
        return res
      },
      ...opts,
    })
  }
}
