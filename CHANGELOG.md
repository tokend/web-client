# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
### Changed
- Now using 2 decimal points for invoice amounts

## [1.4.0-rc.0] - 2019-04-01
### Added
 Modularized:
  - Issuance explorer page
  - Fees page
  - TopBar component
- Improvements of `<input-field>`:
  - Added ellipsis of overflowed text to
  - Added "CapsLock enabled" warning for fields with "password" type
- CLI arguments support
- Module-descriptors schemes (see `src/modules-arch/README.md`)
- TokenD loading spinner at application initialization
- Trade offers cancellation in "My orders" tab on "Trade" page
- Displaying of asset policies and asset type to asset details drawer
- Confirmation before token creation request canceling
- Experimental features reference and note to README.md
- Polling tickers:
  - Charts now poll prices
  - Passport now poll account and KYC
- `<noscript>` with message for users with JavaScript switched off or
  browsers that don’t support JavaScript
- Client withdrawable requests:
  - Show withdrawal reviewer’s email address in withdrawal form
  - Added "Incoming withdrawal" tab to "Requests" page
- User avatar upload. Both general and corporate users can upload avatars
- For sales that were ended show highlighted "Closed X days ago" text
- Custom validation rules for sale’s "Soft cap" and "Hard cap" values
- Watcher for console calls that shows the error message if the console
  method was called at least once through tests execution
- Account reset support:
  - `isAccountRoleReseted` state field to the KYC vuex module
  - Checking for previous account role & resetting reason when loading
    KYC request
  - Checking for reset account role on verification pages
  - `resetReason` field to the `ChangeRoleRequestRecord`
- Coinpayments-deposit module (client-side integration with Coinpayments)
- Movements history modules unit tests
- Allow requesting of limits change for all account types
- `record` getter to the `AssetRecord`

### Changed
- Use @tokend/js-sdk@1.3.1-x.2
- Renamed `DescriptionEditor` => `MarkdownField`. Also moved to the fields
  directory & included it to the form mixin components
- Now using new account endpoint for loading fees
- Moved fees filters out of global scope to the corresponding viewer components
- One request to fetch all the account roles instead of fetching then one-by-one
- Rename fee "Subtype" table header to "Destination"
- Renamed operation state "Sale state updated" -> "Sale closed"
- Asset loading via the loop instead of fetching by `filter[limit]=100`

### Removed
- Removed feature flags from config
- Remove `globalize` from asset creating form’s `assetTypes` computed property
- Converting account role to string in `ChangeRoleRequestRecord`

### Fixed
- Now display negative amount on balance effect viewers
- Sidebar displaying in the Safari browser on small screens
- Scrolling to the top of asset-create-form, asset-update-form, create-sale-form
  after moving to the next step
- Loading balances instead of account on "Movements" page
- Checking for KYC state, not for KYC latest data while loading KYC in the
  verification forms
- Replace translation IDs of no-data-message component with non-translatable
  analogues (should accept already translated strings now)
- Loading balances instead of account on withdrawal form
- Sale investment total amount calculation
- Amount validation in "Withdrawal" forms
- Asset name displaying on some screens
- Displaying long strings (asset name, sale short description) inside card-like
  components
- "Tokens" page responsive design
- Do not allow unverified users to add an asset with "KYC required" type to
  their balances
- Added loading balances to some components that show current balance hints
- Pending status updating in the "Change Limits" form
- Sorting of order book (now descending for asks)
- Converting account role to string while creating change role request
- Invalid start date for sales that are already started
- Fixed a bug with unconverted account role ID to number before KYC submitting
- Fixed upload kyc form without avatar
- Fixed some strings displaying on "Movements"
- Fixed console errors causing in "Movements" page unit tests
- Fixed `getAccountIdByEmail`’s email fetching bug of identity-getter.js
- Fixed a bug with impossible order cancelling if user had insufficient balance
- Fixed a bug with import `mapActions` in `SubmitTradeOfferForm`
- Fixed a bug with chart line displaying
- Fixed a bug with balance updating in `AddressLoader`

## [1.3.1-rc.0] - 2019-03-20
### Changed
- Do not throw an error if movement has an unknown effect or operation details

### Fixed
- Not handling 'manage-asset-pair' operation details

## [1.3.0] - 2019-03-01

[Unreleased]: https://github.com/tokend/web-client/compare/1.4.0-rc.0...HEAD
[1.4.0-rc.0]: https://github.com/tokend/web-client/compare/1.3.0-rc.0...1.4.0-rc.0
[1.3.1-rc.0]: https://github.com/tokend/web-client/compare/1.3.0...1.3.1-rc.0
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
