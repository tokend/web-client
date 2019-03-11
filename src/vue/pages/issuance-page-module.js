import { PageModule } from '@/modules-arch/page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'

export class IssuancePageModule extends PageModule {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Issuance'),
      allowedSubmodules: [
        IssuanceExplorerModule,
      ],
    })
  }
}
