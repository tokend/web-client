import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { AssetExplorerModule } from '@modules/assets/asset-explorer/module'

export class AssetExplorerPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/AssetExplorer'),
      allowedSubmodules: [
        AssetExplorerModule,
      ],
    })
  }
}
