import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { LoyaltyPointsStatisticsModule } from '@modules/loyalty-points/loyalty-points-statistics/module'

export class LoyaltyPointsStatisticsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/LoyaltyPointsStatistics'),
      allowedSubmodules: [
        LoyaltyPointsStatisticsModule,
      ],
    })
  }
}
