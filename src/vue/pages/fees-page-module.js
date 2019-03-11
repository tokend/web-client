import { PageModule } from '@/modules-arch/page-module'
import { FeesModule } from '@/vue/modules/fees/module'

export class FeesPageModule extends PageModule {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Fees'),
      allowedSubmodules: [
        FeesModule,
      ],
    })
  }
}
