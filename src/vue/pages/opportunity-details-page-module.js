import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { DividendFormModule } from '@/vue/modules/dividend-form/module'
import { BuyBackFormModule } from '@/vue/modules/buy-back-form/module'

export class OpportunityDetailsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/OpportunityDetails'),
      allowedSubmodules: [
        DividendFormModule,
        BuyBackFormModule,
      ],
    })
  }
}
