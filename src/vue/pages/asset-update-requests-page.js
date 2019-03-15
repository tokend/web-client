import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { AssetUpdateRequestsModule } from '@/vue/modules/requests/asset-update-requests/module'

export class AssetUpdateRequestsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AssetUpdateRequests'),
      allowedSubmodules: [
        AssetUpdateRequestsModule,
      ],
    })
  }
}
