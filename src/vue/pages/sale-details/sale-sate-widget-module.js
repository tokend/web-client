import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'

export class SaleStateWidgetModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/pages/sale-details/SaleStateWidget'),
      allowedSubmodules: [
        DashboardChartPseudoModule,
      ],
      ...opts,
    })
  }
}
