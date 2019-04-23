# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
#### Added
- Receivable distribution chart (Loyalty)
- Receivable-payable delta chart (Loyalty)
- Account number field to the invoice form (Loyalty)
- "Copy" button to EmailGetter
- Fix for handling a "400" errors

#### Changed
- Corrected statistics charts data (Loyalty)
- Use select field instead of table for acceptable points on
  create invoice form (Loyalty)
- Now sending payment transaction to the external system instead of
  creating a blob (Loyalty)
- Now running WDS run on nearest non-busy port. No more "EADDRINUSE"
  for us

#### Fixed
- Calculating percent delta on line chart
- Displaying negative values on line chart
- Fixed a bug when with `defaultQuoteAsset` loading race condition
- Polling when creating an invoice (Loyalty)
- Invoice transaction source account (Loyalty)
- Fixed a bug with absent preloading of account balance in `DepositForm`

#### Removed
- Quitted building sourcemaps for production

## [1.5.0]
### "Under the hood changes"
#### Changed
- Now using @tokend/js-sdk@1.5.0

## [1.5.0-rc.3] - 2019-04-19
### "Under the hood changes"
#### Changed
- Now using @tokend/js-sdk@1.5.0-rc.1

## [1.5.0-rc.2] - 2019-04-19
#### Added
- Displaying of limit request details in drawer

#### Changed
- Show limits request list on top of other limits on "Limits" page
- "Issuance" labels on Issuance page renamed to "Issuance requests"

#### Removed
- Dupe team size and website fields on corporate verification
- Displaying investors quantity in sale details
- Opera from noscript

#### Fixed
- Fixed a bug with unsubmitted transfer form
- Fixed a bug with displaying verification state message
- Fixed a bug with displaying "undefined" instead of quote asset in
  dashboard’s chart
- Fixed a bug with unreadable QR code on "Downloads" page
- Fixed a bug with undisplayed verification code on general KYC form
- Fixed a bug with incorrect displaying of fees paid for recipient while
  in transfer form

### "Under the hood" changes
#### Changed
- Now getting blob types from SDK
- Now using /v3 API for getting sales
- `SaleRecord` is now parsing the resource from new API

#### Removed
- Statistics property from `SaleRecord`
- Buttons' "form" attributes

## [1.5.0-rc.1] - 2019-04-17
#### Added
- Displaying of blocked account role
- Displaying of permanently rejected verification request state

### "Under the hood" changes
#### Changed
- Now loading KYC requests in the parent verification component
- Now getting latest approved request ID in creator details of the latest
  change role request, and loading the related request itself if account
  was reset or blocked

## [1.5.0-rc.0] - 2019-04-16
#### Added
- Displaying of feedback message after successful verification request submitting
- Displaying of available base asset amount on sale creation form
- Displaying of issuance status in issuances list
- Polling ticker of order book
- URL validation of Homepage field of corporate verification form
- User auto-logout on idle activity
- Auto-populating of limit change request forms
- Two-factor validation on login & change password forms
- Enabling/disabling 2FA form in "Settings" page
- Disclaimer message about pre-issuance asset signer if press "Use mine" button

#### Changed
- Movement list items displaying changes:
  - Display total fee
  - Display operation summary (type, operation and date)
  - Display fee information only if total fee is bigger than zero
- Redesigned recovery seed page:
  - Added warning message
  - Some minor design adjustments
  - Use redesigned clipboard field with a bit darken background
- Redesigned verification state message
- Redesigned clipboard field
- Redesigned feedback status message
- Renamed "Fund(s)" to "Sale(s)" and "Token(s)" to "Asset(s)"
- Renamed "Pre-issued asset signer" to "Pre-issuance asset signer"
- Hide "Withdraw" and "Deposit" buttons accordingly to selected assets’ policies
  on "Movements" page
- Increased width of "Already in your balances" to prevent its wrapping
- Made warning color (orange) a bit brighter
- Now support inserting both of YouTube video link and YouTube video ID on
  sale creating form
- Now sorting balances on "Balances" page in desc order by total balance
  converted to default quote asset

#### Removed
- "Fee" column from the movements table

#### Fixed
- Fixed disabled state of form stepper tabs, disallow attending of pass steps
- Fixed a bug with animation flickering on drawer closing
- Fixed displaying of insufficient/absent balance message on submit trade
  offer form
- Fixed converted balance displaying on "Dashboard" page
- Fixed invalid matched fee calculation in invest form
- Fixed trade history tables top margin
- Fixed displaying of input field label in Firefox browser
- Reworded "Verification required" translations on invest form
- Reworded warning message about insufficient balance in the "Invest" form

### "Under the hood" changes
#### Added
- QR code plugin wrapper
- Default quote asset fetching from the server

#### Changed
- Now using @tokend/js-sdk@1.4.4
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
- Moved ticker interval to a config and apply it for all tickers within the app
- Moved movements modules translation filters to a mixin
- Extracted verification state message to a separate component
- Now using "qrcode.vue" package instead of "vue-qr"
- Now getting previous account role from previous KYC request instead of
  `creatorDetails` of approved reset request
- Now using main signers account id instead of accounts account ID for
  setting pre-issuance asset signer

#### Removed
- `DEFAULT_QUOTE_ASSET` field from config
- Common records wrappers:
  - `RecordWrapper` factory
  - `AssetCreateRequestRecord`
  - `AssetUpdateRequestRecord`
  - `WithdrawalDetailsRequestRecord`
  - `PreIssuanceCreateRequestRecord`
  - `SaleRequestRecord`
- Constants of horizon version prefix
- Hard-coded `REQUEST_TYPES` constant
- ID attributes from forms & charts

### Experimental features changes
#### Added
- Subject field to the create invoice form (Loyalty)
- Displaying invoice summary on create invoice form (Loyalty)
- Coinpayments deposit drawer (Reit)
- Withdrawal drawer (Reit)

#### Changes
- Now using 2 decimal points for invoice amounts (Loyalty)
- Now using "EUR" asset instead of "PET" one on the loyalty statistics
  charts (Loyalty)
- Moved redeem offer creation from the global mixin to the local store
  (UTH, Reit)

#### Removed
- Removed Transfer & deposit from the loyalty points reconciliation scheme
  (Loyalty)
- Removed useless fields and getters in the Redeem `Sale` and `Asset` records

#### Fixed
- Translations for loyalty points merchant module (Loyalty)
- Setting merchant account ID to invoice URL (Loyalty)
- Fixed bug with validation of maturity date (Reit)
- Fixed bug with getting asset pair price in opportunity creation form. Now
  opportunity creation should work for both inverted and straight asset pairs.
  (Reit)

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
  - Show withdrawal reviewer email address in withdrawal form
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
- Custom validation rules for sales "Soft cap" and "Hard cap" values
- A feature that makes your tests execution fail if there is any `console.log`,
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
- Removed `globalize` from asset creating forms’ `assetTypes` computed property
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

[Unreleased]: https://github.com/tokend/web-client/compare/1.5.0...HEAD
[1.5.0]: https://github.com/tokend/web-client/compare/1.5.0-rc.3...1.5.0
[1.5.0-rc.3]: https://github.com/tokend/web-client/compare/1.5.0-rc.2...1.5.0-rc.3
[1.5.0-rc.2]: https://github.com/tokend/web-client/compare/1.5.0-rc.1...1.5.0-rc.2
[1.5.0-rc.1]: https://github.com/tokend/web-client/compare/1.5.0-rc.0...1.5.0-rc.1
[1.5.0-rc.0]: https://github.com/tokend/web-client/compare/1.4.0...1.5.0-rc.0
[1.4.0]: https://github.com/tokend/web-client/compare/1.4.0-rc.3...1.4.0
[1.4.0-rc.3]: https://github.com/tokend/web-client/compare/1.4.0-rc.2...1.4.0-rc.3
[1.4.0-rc.2]: https://github.com/tokend/web-client/compare/1.4.0-rc.1...1.4.0-rc.2
[1.4.0-rc.1]: https://github.com/tokend/web-client/compare/1.4.0-rc.0...1.4.0-rc.1
[1.4.0-rc.0]: https://github.com/tokend/web-client/compare/1.3.0-rc.0...1.4.0-rc.0
[1.3.1-rc.0]: https://github.com/tokend/web-client/compare/1.3.0...1.3.1-rc.0
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
