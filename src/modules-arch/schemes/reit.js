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
import { SalesPageModule } from '@/vue/pages/sales-page-module'
import { OpportunityDetailsPageModule } from '@/vue/pages/opportunity-details-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { VerificationGeneralPageModule } from '@/vue/pages/verification-general-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DividendFormModule } from '@modules/dividend-form/module'
import { BuyBackFormModule } from '@modules/buy-back-form/module'
import { CreateOpportunityModule } from '@/vue/modules/create-opportunity/module'
import { SalesListPageModule } from '@/vue/pages/sales/all-sales-page-module'
import { SalesListOwnedPageModule } from '@/vue/pages/sales/user-owned-sales-page-module'
import { SaleCampaignViewerPageModule } from '@/vue/pages/sale-details/sale-campaign-viewer-page-module'
import { SaleStateWidgetModule } from '@/vue/pages/sale-details/sale-sate-widget-module'
import { MovementsTopBarReitModule } from '@modules/movements-top-bar-reit/module'
import { DepositFiatModule } from '@modules/deposit-fiat/module'
import { DepositFiatCardModule } from '@modules/deposit-fiat-card/module'
import { DepositFiatBankModule } from '@modules/deposit-fiat-bank/module'
import { WithdrawalFiatModule } from '@modules/withdrawal-fiat/module'
import { WithdrawalFiatCardModule } from '@modules/withdrawal-fiat-card/module'
import { WithdrawalFiatBankModule } from '@modules/withdrawal-fiat-bank/module'
import { RedeemFormModule } from '@modules/redeem-form/module'
import { CoinpaymentsDepositModule } from '@/vue/modules/coinpayments-deposit/module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/reit-en.json')
  },
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
        ],
      },
    ),

    new SalesPageModule(
      {
        routerEntry: {
          path: '/opportunities',
          name: vueRoutes.sales.name,
          meta: { pageNameTranslationId: 'pages-names.sales' },
        },
        menuButtonTranslationId: 'pages-names.sales',
        menuButtonMdiName: 'trending-up',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new SalesListPageModule({
            routerEntry: {
              path: '/opportunities/all',
              name: vueRoutes.allSales.name,
              props: {
                default: true,
                isUserSales: false,
              },
            },
          }),
          new SalesListOwnedPageModule({
            routerEntry: {
              path: '/opportunities/my',
              name: vueRoutes.userOwnedSales.name,
              props: {
                default: true,
                isUserSales: true,
              },
            },
          }),
          new CreateOpportunityModule({
            isCorporateOnly: true,
          }),
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
          new MovementsTopBarReitModule({
            submodules: [
              new WithdrawalFiatModule({
                submodules: [
                  new WithdrawalFiatCardModule(),
                  new WithdrawalFiatBankModule(),
                ],
              }),
              new WithdrawalDrawerPseudoModule(),
              new CoinpaymentsDepositModule(),
              new DepositFiatModule({
                submodules: [
                  new DepositFiatCardModule(),
                  new DepositFiatBankModule(),
                ],
              }),
              new TransferDrawerPseudoModule(),
              new RedeemFormModule(),
            ],
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
        ],
      },
    ),

    new OpportunityDetailsPageModule(
      {
        routerEntry: {
          path: '/opportunities/:id',
          name: vueRoutes.saleDetails.name,
          meta: { pageNameTranslationId: 'pages-names.sale-details' },
          redirect: to => ({ ...vueRoutes.saleCampaign, params: to.params }),
          props: true,
        },
        submodules: [
          new DividendFormModule(),
          new BuyBackFormModule(),
          new SaleCampaignViewerPageModule({
            routerEntry: {
              path: '/opportunities/:id/campaign',
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
              new VerificationGeneralPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
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
            ],
          }),
        ],
      }
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
  ],
}
