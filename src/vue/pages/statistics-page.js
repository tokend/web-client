import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { LoyaltyPointsStatisticsModule } from '@modules/loyalty-points/loyalty-points-statistics/module'

export class StatisticsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Statistics'),
      allowedSubmodules: [
        LoyaltyPointsStatisticsModule,
      ],
    })
  }
}
