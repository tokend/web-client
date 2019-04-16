import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class PreIssuanceRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/pre-issuance-requests'),
      importStoreFn: async _ => {
        const { preIssuanceRequestsModule: res } =
          await import('@/vue/modules/requests/pre-issuance-requests/store')
        return res
      },
      ...opts,
    })
  }
}
