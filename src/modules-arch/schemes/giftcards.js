import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { CustomersPageModule } from '@/vue/pages/customers-page-module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { CreateAssetFormSimplifiedModule } from '@modules/create-asset-form-simplified/module'
import { SalesPageModule } from '@/vue/pages/sales-page-module'
import { SaleDetailsPageModule } from '@/vue/pages/sale-details-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { CreateSaleFormModule } from '@modules/create-sale-form/module'
import { SalesListPageModule } from '@/vue/pages/sales/investable-sales-page-module'
import { SalesListOwnedPageModule } from '@/vue/pages/sales/user-owned-sales-page-module'
import { SaleCampaignViewerPageModule } from '@/vue/pages/sale-details/sale-campaign-viewer-page-module'
import { SaleStateWidgetModule } from '@/vue/pages/sale-details/sale-sate-widget-module'
import { CoinpaymentsDepositModule } from '@/vue/modules/coinpayments-deposit/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositFormPseudoModule } from '@/modules-arch/pseudo-modules/deposit-form-pseudo-module'
import { AssetExplorerPageModule } from '@/vue/pages/asset-explorer-page'
import { BalancesPageModule } from '@/vue/pages/balances-page'
import { AssetExplorerModule } from '@/vue/modules/assets/asset-explorer/module'
import { BalanceExplorerModule } from '@/vue/modules/assets/balance-explorer/module'
import { PollsPageModule } from '@/vue/pages/polls-page-module'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'
import { PollRequestsPageModule } from '@/vue/pages/polls/poll-requests-page'
import { PollsAllPageModule } from '@/vue/pages/polls-all-page-module'
import { CreatePollFormModule } from '@/vue/modules/create-poll-form/module'

import { MyAssetsPageModule } from '@/vue/pages/my-assets-page-module'
import { MyAssetsExplorerModule } from '@/vue/modules/assets/my-assets-explorer/module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/giftcards-en.json')
  },
  pages: [
    new CustomersPageModule(
      {
        routerEntry: {
          path: '/customers',
          name: vueRoutes.customers.name,
          meta: { pageNameTranslationId: 'pages-names.customers' },
        },
        menuButtonTranslationId: 'pages-names.customers',
        menuButtonMdiName: 'account',
        submodules: [
        ],
      },
    ),

    new MovementsHistoryPageModule(
      {
        routerEntry: {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: { pageNameTranslationId: 'pages-names.movements' },
        },
        menuButtonTranslationId: 'pages-names.movements',
        menuButtonMdiName: 'menu',
        submodules: [
          new MovementsHistoryModule(),
          new MovementsTopBarModule({
            submodules: [
              new WithdrawalDrawerPseudoModule(),
              new DepositFormPseudoModule({
                submodules: [new CoinpaymentsDepositModule()],
              }),
              new TransferDrawerPseudoModule(),
            ],
          }),
        ],
      },
    ),

    new AssetsPageModule(
      {
        routerEntry: {
          path: '/assets',
          name: vueRoutes.assets.name,
        },
        menuButtonTranslationId: 'pages-names.assets',
        menuButtonMdiName: 'coins',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new AssetExplorerPageModule({
            routerEntry: {
              path: '/assets/explore',
              name: vueRoutes.assetsExplore.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new AssetExplorerModule(),
            ],
          }),
          new BalancesPageModule({
            routerEntry: {
              path: '/assets/balances',
              name: vueRoutes.balances.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new BalanceExplorerModule(),
            ],
          }),
          new MyAssetsPageModule({
            routerEntry: {
              path: '/assets/my-assets',
              name: vueRoutes.myAssets.name,
              meta: { pageNameTranslationId: 'pages-names.assets' },
            },
            submodules: [
              new MyAssetsExplorerModule(),
            ],
            isCorporateOnly: true,
          }),
          new CreateAssetFormSimplifiedModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new SalesPageModule(
      {
        routerEntry: {
          path: '/sales',
          name: vueRoutes.sales.name,
          meta: { pageNameTranslationId: 'pages-names.sales' },
        },
        menuButtonTranslationId: 'pages-names.sales',
        menuButtonMdiName: 'trending-up',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new SalesListPageModule({
            routerEntry: {
              path: '/sales/all',
              name: vueRoutes.investableSales.name,
              props: {
                default: true,
                isUserSales: false,
              },
            },
          }),
          new SalesListOwnedPageModule({
            routerEntry: {
              path: '/sales/my',
              name: vueRoutes.userOwnedSales.name,
              props: {
                default: true,
                isUserSales: true,
              },
            },
            isCorporateOnly: true,
          }),
          new CreateSaleFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new SaleDetailsPageModule(
      {
        routerEntry: {
          path: '/sales/:id',
          name: vueRoutes.saleDetails.name,
          meta: { pageNameTranslationId: 'pages-names.sale-details' },
          redirect: to => ({ ...vueRoutes.saleCampaign, params: to.params }),
          props: true,
        },
        submodules: [
          new SaleCampaignViewerPageModule({
            routerEntry: {
              path: '/sales/:id/campaign',
              name: vueRoutes.saleCampaign.name,
              props: true,
            },
            submodules: [
              new SaleStateWidgetModule(),
            ],
          }),
        ],
      },
    ),

    new PollsPageModule(
      {
        routerEntry: {
          path: '/polls',
          name: vueRoutes.polls.name,
          meta: { pageNameTranslationId: 'pages-names.polls' },
        },
        menuButtonTranslationId: 'pages-names.polls',
        menuButtonMdiName: 'vote',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new PollsAllPageModule({
            routerEntry: {
              path: '/polls/all',
              name: vueRoutes.allPolls.name,
              props: true,
            },
          }),
          new PollRequestsPageModule({
            routerEntry: {
              path: '/polls/poll-requests',
              name: vueRoutes.pollRequests.name,
              props: true,
            },
            isCorporateOnly: true,
            submodules: [
              new PollRequestsModule(),
            ],
          }),
          new CreatePollFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new SettingsPageModule(
      {
        routerEntry: {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
        },
        menuButtonTranslationId: 'pages-names.settings',
        menuButtonMdiName: 'account-settings',
        menuSectionTranslationId: 'sidebar.section-account',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new VerificationPageModule({
            routerEntry: {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
            },
            submodules: [
              new VerificationCorporatePageModule({
                routerEntry: {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                },
              }),
            ],
          }),

          new SecurityPageModule({
            routerEntry: {
              path: '/settings/security',
              name: vueRoutes.security.name,
            },
            submodules: [
              new ChangePasswordPseudoModule(),
            ],
          }),
        ],
      }
    ),
  ],
}
