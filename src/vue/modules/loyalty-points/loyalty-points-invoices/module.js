import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class LoyaltyPointsInvoicesModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/loyalty-points/loyalty-points-invoices'),
      importStoreFn: async _ => {
        const { loyaltyPointsInvoicesModule: res } =
          await import('@modules/loyalty-points/loyalty-points-invoices/store')
        return res
      },
      ...opts,
    })
  }
}
