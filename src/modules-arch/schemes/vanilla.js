import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { FeesPageModule } from '@/vue/pages/fees-page-module'
import { FeesModule } from '@modules/fees/module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@modules/issuance-explorer/module'
import { TradePageModule } from '@/vue/pages/trade-page-module'
import { LimitsPageModule } from '@/vue/pages/limits-page-module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { CreateAssetFormModule } from '@modules/create-asset-form/module'
import { SalesPageModule } from '@/vue/pages/sales-page-module'
import { SaleDetailsPageModule } from '@/vue/pages/sale-details-page-module'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { AssetCreationRequestsPageModule } from '@/vue/pages/asset-creation-requests-page'
import { CreateAssetRequestsModule } from '@/vue/modules/requests/create-asset-requests/module'
import { AssetUpdateRequestsPageModule } from '@/vue/pages/asset-update-requests-page'
import { UpdateAssetRequestsModule } from '@/vue/modules/requests/update-asset-requests/module'
import { SaleCreationRequestsPageModule } from '@/vue/pages/sale-creation-requests-page'
import { CreateSaleRequestsModule } from '@/vue/modules/requests/create-sale-requests/module'
import { PreIssuanceRequestsPageModule } from '@/vue/pages/pre-issuance-requests-page'
import { PreIssuanceRequestsModule } from '@/vue/modules/requests/pre-issuance-requests/module'
import { IncomingWithdrawalRequestsPageModule } from '@/vue/pages/incoming-withdrawal-requests-page'
import { IncomingWithdrawalRequestsModule } from '@/vue/modules/requests/incoming-withdrawal-requests/module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { VerificationGeneralAdvancedPageModule } from '@/vue/pages/verification-general-advanced-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { PreIssuanceFormModule } from '@/vue/modules/pre-issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { CreateSaleFormModule } from '@modules/create-sale-form/module'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'
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
import { ShowNetworkPassphrasePseudoModule } from '@/modules-arch/pseudo-modules/show-network-passphrase-pseudo-module'
import { PollsPageModule } from '@/vue/pages/polls-page-module'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'
import { PollRequestsPageModule } from '@/vue/pages/polls/poll-requests-page'
import { PollsAllPageModule } from '@/vue/pages/polls-all-page-module'
import { CreatePollFormModule } from '@/vue/modules/create-poll-form/module'

import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'
import { MyAssetsPageModule } from '@/vue/pages/my-assets-page-module'
import { MyAssetsExplorerModule } from '@/vue/modules/assets/my-assets-explorer/module'
import { SharesPageModule } from '@/vue/pages/shares-page-module'

export default {
  pages: [
    new DashboardPageModule(
      {
        routerEntry: {
          path: '/dashboard',
          name: vueRoutes.dashboard.name,
          meta: { pageNameTranslationId: 'pages-names.dashboard' },
        },
        menuButtonTranslationId: 'pages-names.dashboard',
        menuButtonMdiName: 'view-dashboard',
        submodules: [
          new MovementsHistoryModule(),
          new IssuanceFormModule({
            isCorporateOnly: true,
          }),
          new TransferDrawerPseudoModule(),
          new DashboardChartPseudoModule(),
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

    new SharesPageModule(
      {
        routerEntry: {
          path: '/register-of-shares',
          name: vueRoutes.registerOfShares.name,
          meta: { pageNameTranslationId: 'pages-names.register-of-shares' },
        },
        menuButtonTranslationId: 'pages-names.register-of-shares',
        menuButtonMdiName: 'book-open',
        submodules: [
          new MovementsTopBarModule(),
          new MovementsHistoryModule(),
        ],
        isCorporateOnly: true,
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
          new CreateAssetFormModule({
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

    new TradePageModule(
      {
        routerEntry: {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
          children: [
            // Carefully: have some issues because of is-loading prop provided
            // to children from parent component. Leave it lke that for now
            {
              path: '/trade/exchange',
              name: vueRoutes.tradeExchange.name,
              component: _ => import('@/vue/pages/TradeExchange'),
            },
            {
              path: '/trade/my-orders',
              name: vueRoutes.tradeUserOffers.name,
              component: _ => import('@/vue/pages/TradeUserOffers'),
            },
          ],
        },
        menuButtonTranslationId: 'pages-names.trade',
        menuButtonMdiName: 'finance',
      },
    ),

    new RequestsPageModule(
      {
        routerEntry: {
          path: '/requests',
          name: vueRoutes.requests.name,
          meta: { pageNameTranslationId: 'pages-names.requests' },
        },
        isCorporateOnly: true,
        menuButtonTranslationId: 'pages-names.requests',
        menuButtonMdiName: 'book-open-variant',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new AssetCreationRequestsPageModule({
            routerEntry: {
              path: '/requests/asset-creation',
              name: vueRoutes.assetCreationRequests.name,
            },
            submodules: [
              new CreateAssetRequestsModule(),
            ],
          }),
          new AssetUpdateRequestsPageModule({
            routerEntry: {
              path: '/requests/asset-update',
              name: vueRoutes.assetUpdateRequests.name,
            },
            submodules: [
              new UpdateAssetRequestsModule(),
            ],
          }),
          new SaleCreationRequestsPageModule({
            routerEntry: {
              path: '/requests/sale-creation',
              name: vueRoutes.saleCreationRequests.name,
            },
            submodules: [
              new CreateSaleRequestsModule(),
            ],
          }),
          new PreIssuanceRequestsPageModule({
            routerEntry: {
              path: '/requests/pre-issuance-upload',
              name: vueRoutes.preIssuanceUploadRequests.name,
            },
            submodules: [
              new PreIssuanceRequestsModule(),
            ],
          }),
          new IncomingWithdrawalRequestsPageModule({
            routerEntry: {
              path: '/requests/incoming-withdrawal',
              name: vueRoutes.incomingWithdrawalRequests.name,
            },
            submodules: [
              new IncomingWithdrawalRequestsModule(),
            ],
          }),
        ],
      },
    ),

    new IssuancePageModule(
      {
        routerEntry: {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
        },
        menuButtonTranslationId: 'pages-names.issuance',
        menuButtonMdiName: 'poll',
        submodules: [
          new IssuanceExplorerModule(),
          new IssuanceFormModule({
            isCorporateOnly: true,
          }),
          new PreIssuanceFormModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new LimitsPageModule(
      {
        routerEntry: {
          path: '/limits',
          name: vueRoutes.limits.name,
          meta: { pageNameTranslationId: 'pages-names.limits' },
        },
        menuButtonTranslationId: 'pages-names.limits',
        menuButtonMdiName: 'poll-box',
      },
    ),

    new FeesPageModule(
      {
        routerEntry: {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
        },
        menuButtonTranslationId: 'pages-names.fees',
        menuButtonMdiName: 'flash',
        submodules: [
          new FeesModule(),
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
              new VerificationGeneralAdvancedPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
                submodules: [
                  new VerificationGeneralFormModule(),
                ],
              }),
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
              new ShowAccountIdPseudoModule(),
              new ShowSeedPseudoModule(),
              new ShowNetworkPassphrasePseudoModule(),
            ],
          }),
        ],
      }
    ),
  ],
}
