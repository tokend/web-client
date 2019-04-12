# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]

#### Added
- Subject field to the create invoice form (Loyalty)
- Displaying invoice summary on create invoice form (Loyalty)
- Displaying total fee in the movement attributes
- Displaying operation summary in the movement attributes
- Show available base asset amount on sale creation form
- Warning message when showing recovery seed on signup page
- QR code plugin wrapper
- Ticker to refresh order book with interval
- Ticker interval is now global and applies for all tickers throughout the app
- Added transaction errors handling
- Show issuance status in issuances list
- Displaying success message after sending verification request

#### Changed
- Modularized:
  - Update asset form
  - Create asset form
  - Update asset form
  - Asset explorer
  - Balance explorer
  - Create asset requests
  - Update asset requests
  - Create sale requests
  - Pre-issuance requests
  - Incoming withdrawal requests
- Now using 2 decimal points for invoice amounts (Loyalty)
- Allow inserting both of YouTube video link or ID
- Moved movements module translation filters to a mixin
- Now displaying fees in the movement attributes only if total fee is
  bigger than zero
- Now using "EUR" asset instead of "PET" one on the loyalty statistics
  charts (Loyalty)
- Now sorting balances in desc order by total balance in stats quote asset
- Now getting previous account role from previous KYC request instead of
  `creatorDetails` of approved reset request
- Moved redeem offer creation from the global mixin to the local store
- Removed useless fields and getters in the Redeem `Sale` and `Asset` records
- Now using "qrcode.vue" plugin instead of "vue-qr"
- Clipboard field styles to differ it from input fields
- Renamed `Fund(s)` -> `Sale(s)` and `Token(s)` -> `Asset(s)`
- Redesigned status message

#### Removed
- "Fee" column from the movements table
- Transfer & deposit pseudomodules from the loyalty points reconciliation
  scheme
- Common records wrappers:
  - `RecordWrapper` factory
  - `AssetCreateRequestRecord`
  - `AssetUpdateRequestRecord`
  - `WithdrawalDetailsRequestRecord`
  - `PreIssuanceCreateRequestRecord`
  - `SaleRequestRecord`
- Hardcoded `REQUEST_TYPES` constant
- Horizon version prefix

#### Fixed
- Fixed a bug with animation flickering on drawer closing
- Translations for loyalty points merchant module (Loyalty)
- Setting merchant account ID to invoice URL (Loyalty)
- Displaying insufficient/absent balance message on submit trade form
- Warning message about insufficient balance in the "Invest" form
- Converted balance displaying on "Dashboard" page

## [1.4.0] - 2019-04-05

## [1.4.0-rc.3] - 2019-04-04
#### Fixed
- Withdrawal request creating where invalid creatorDetails were submitted

## [1.4.0-rc.2] - 2019-04-02
#### Fixed
- A bug with uneditable general verification form for brand-new users

## [1.4.0-rc.1] - 2019-04-02
#### Added
- Updating of movements list and balances on Dashboard page after transfer
  performed
- Updating of movements list on "Movements" page after transfer performed

#### Changed
- Change default chart scope to "Day"
- Swap order book and trade history on "Trades exchange" page

## [1.4.0-rc.0] - 2019-04-01
#### Added
- Improvements of input fields:
  - Added ellipsis of overflowed text
  - Added "CapsLock enabled" warning for fields with "password" type
- TokenD loading spinner at application initialization
- Trade offers cancellation in "My orders" tab on "Trade" page
- Displaying of asset policies and asset type to asset details drawer
- Confirmation before token creation request canceling
- Polling tickers:
  - Charts now poll prices
  - Passport now poll account and KYC
- Message for users with JavaScript switched off or browsers that don’t support
  JavaScript
- Client withdrawable requests:
  - Show withdrawal reviewer’s email address in withdrawal form
  - Added "Incoming withdrawal" tab to "Requests" page
- User avatar upload. Both general and corporate users can upload avatars
- "Closed X days ago" text for sales that were ended
- Account reset client-side support. Now showing banners with "Your account was
  reset due to X reason". Previous KYC form should be automatically populated.
- Coinpayments-deposit module (client-side integration with Coinpayments)
- Allow requesting of limits change for all account types

#### Changed
- Renamed "Subtype" table header to "Direction" on "Fees" page
- Renamed  "Sale state updated" -> "Sale closed" (state) in movements lists

#### Fixed
- Now display negative amount on balance effect viewers
- Sidebar displaying in Safari browser on small screens
- Scrolling to the top of the form after moving to a next step in:
  - Asset create form
  - Asset update form
  - Create sale form
- Bug with a sale investment total amount calculation when you were unable to
  submit an amount equal to hard cap
- Amount validation in "Withdrawal" forms now work correctly
- Asset name displaying on most screens
- Displaying long strings (asset name, sale short description) inside card-like
  components
- "Tokens" page responsive design
- Do not allow unverified users to add an asset with "KYC required" type to
  their balances
- Now forms that show "Available balance" hint show actual balance
- Sorting of order book (now descending for asks)
- Invalid start date for sales that are already started
- Fixed a bug with impossible order cancelling if user has insufficient balance
- Fixed a bug with chart line rendering

### "Under the hood" changes
#### Added
- CLI arguments support
- Module-descriptors schemes (see `src/modules-arch/README.md`)
- Experimental features section to README.md
- Custom validation rules for sale’s "Soft cap" and "Hard cap" values
- A feature that makes your tests execution fail if there’s any `console.log`,
  `console.warn` or `console.error` call
- Account reset related stuff:
  - `isAccountRoleReseted` state field to the KYC vuex module
  - Checking for previous account role & resetting reason when loading
    KYC request
  - Checking for reset account role on verification pages
  - `resetReason` field to the `ChangeRoleRequestRecord`
- Movements history modules unit tests
- `record` getter to the `AssetRecord`

#### Changed
- Use @tokend/js-sdk@1.3.1-x.2
- Now using new account endpoint for loading fees
- Renamed `DescriptionEditor` => `MarkdownField`. Also moved to the fields
  directory & included it to the form mixin components
- Moved fees filters out of global scope to the corresponding viewer components
- One request to fetch all the account roles instead of fetching then one-by-one
- Asset loading via the loop instead of fetching by `filter[limit]=100`
- Modularized:
  - Issuance explorer page
  - Fees page
  - TopBar component

#### Removed
- Removed feature flags from config
- Removed `globalize` from asset creating form’s `assetTypes` computed property
- Converting account role to string in `ChangeRoleRequestRecord`

#### Fixed
- Loading balances instead of account on "Movements" page
- Loading balances instead of account on withdrawal form
- Checking for KYC state, not for KYC latest data while loading KYC in the
  verification forms
- Replace translation IDs of no-data-message component with non-translatable
  analogues (should provide already translated strings now)
- Pending status updating in the "Change Limits" form
- Fixed console errors causing in "Movements" page unit tests
- Fixed `getAccountIdByEmail`’s email fetching bug of identity-getter.js
- Fixed a bug with import `mapActions` in `SubmitTradeOfferForm`

## [1.3.1-rc.0] - 2019-03-20
### "Under the hood" changes
#### Changed
- Do not throw an error if movement has an unknown effect or operation details

#### Fixed
- Not handling 'manage-asset-pair' operation details

## [1.3.0] - 2019-03-01

[Unreleased]: https://github.com/tokend/web-client/compare/1.4.0...HEAD
[1.4.0]: https://github.com/tokend/web-client/compare/1.4.0-rc.3...1.4.0
[1.4.0-rc.3]: https://github.com/tokend/web-client/compare/1.4.0-rc.2...1.4.0-rc.3
[1.4.0-rc.2]: https://github.com/tokend/web-client/compare/1.4.0-rc.1...1.4.0-rc.2
[1.4.0-rc.1]: https://github.com/tokend/web-client/compare/1.4.0-rc.0...1.4.0-rc.1
[1.4.0-rc.0]: https://github.com/tokend/web-client/compare/1.3.0-rc.0...1.4.0-rc.0
[1.3.1-rc.0]: https://github.com/tokend/web-client/compare/1.3.0...1.3.1-rc.0
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
