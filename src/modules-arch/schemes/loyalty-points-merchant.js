import { vueRoutes } from '@/vue-router/routes'

import { LoyaltyPointsPageModule } from '@/vue/pages/loyalty-points-page-module'
import { LoyaltyPointsInvoicesModule } from '@/vue/modules/loyalty-points/loyalty-points-invoices/module'
import { LoyaltyPointsInvoicesPageModule } from '@/vue/pages/loyalty-points-invoices-page'
import { CreateInvoiceFormModule } from '@/vue/modules/loyalty-points/create-invoice-form/module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/loyalty-points-merchant.en.json')
  },
  appLogoUrl: '/static/pet-shop.png',
  pages: [
    new LoyaltyPointsPageModule(
      {
        routerEntry: {
          path: '/loyalty-points',
          name: vueRoutes.loyaltyPoints.name,
          meta: { pageNameTranslationId: 'pages-names.loyalty-points' },
        },
        menuButtonTranslationId: 'pages-names.loyalty-points',
        menuButtonMdiName: 'menu',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new LoyaltyPointsInvoicesPageModule({
            routerEntry: {
              path: '/loyalty-points/invoices',
              name: vueRoutes.loyaltyPointsInvoices.name,
            },
            submodules: [
              new LoyaltyPointsInvoicesModule(),
            ],
          }),
          new CreateInvoiceFormModule(),
          new IssuanceFormModule({
            isCorporateOnly: true,
          }),
          new MovementsHistoryModule(),
        ],
      },
    ),
  ],
}
