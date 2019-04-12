import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class IncomingWithdrawalRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/incoming-withdrawal-requests'),
      importStoreFn: async _ => {
        const { incomingWithdrawalRequestsModule: res } =
          await import('@/vue/modules/requests/incoming-withdrawal-requests/store')
        return res
      },
      ...opts,
    })
  }
}
