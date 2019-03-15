import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SaleCreationRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/sale-creation-requests'),
      importStoreFn: async _ => {
        const { saleCreationRequestsModule: res } =
          await import('@/vue/modules/requests/sale-creation-requests/store')
        return res
      },
      ...opts,
    })
  }
}
