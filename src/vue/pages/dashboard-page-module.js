import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'

export class DashboardPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Dashboard'),
      allowedSubmodules: [
        MovementsHistoryModule,
        IssuanceFormModule,
        TransferDrawerPseudoModule,
        DashboardChartPseudoModule,
      ],
    })
  }
}
