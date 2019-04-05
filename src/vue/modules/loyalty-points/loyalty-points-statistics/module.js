import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class LoyaltyPointsStatisticsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/loyalty-points/loyalty-points-statistics'),
      ...opts,
    })
  }
}
