import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateSaleRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/create-sale-requests'),
      importStoreFn: async _ => {
        const { createSaleRequestsModule: res } =
          await import('@/vue/modules/requests/create-sale-requests/store')
        return res
      },
      ...opts,
    })
  }
}
