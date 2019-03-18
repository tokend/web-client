# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
### Added
- Issuance explorer module
- Fees module
- User-friendly data displaying in the input fields. If the data does not fit in a field, then three dots are added at the end
- Displaying TokenD logo & load spinner while loading the page
- Documents page
- Document upload form module
- Cancel trade offers in the "My orders" tab on the "Trade" page
- CapsLock warning for the input fields with "password" type
- Displaying asset policies & asset type on the `AssetDetails` page
- `record` getter to the `AssetRecord`
- Added confirmation to cancel token creation request
- CLI config passing
- Added module enabling/disabling
- Added module schemes
- Healthcare document type
- Document explorer page
- Document explorer module
- Withdrawal fiat by the bank information form module
- Withdrawal fiat by the card information form module
- Asset creation requests module
- Asset update requests page & module
- Sale creation requests module
- Pre-issuance requests module
- LOAD_KV_ENTRIES action to key-values vuex module

### Changed
- Now using new account endpoint for loading the fees
- Moved fees filters to the corresponding viewers
- Renamed `DescriptionEditor` -> `MarkdownField`
- Moved `MarkdownField` to the fields & included it to the form mixin components
- Now using overall policy instead of policies array in asset forms
- Now using object type for checking request prop in asset & sale forms
- Now loading all the key-values entries instead of loading only account role ones
- Now using `request.id` check instead of `isUpdateMode` in create sale form

### Fixed
- Sidebar displaying in the Safari browser on the small screens
- Scrolling to the top of asset-create-form, asset-update-form, create-sale-form after moving to the next step
- Loading balances instead of account on the movements page
- Checking for KYC state, not for KYC latest data while loading KYC on the verification forms
- Move no-data-message translate ids pass to the elements that use component

### Removed
- `AssetRequestDetails` component
- `SaleRequestDetails` component
- `PreIssuanceCreateRequestRecord` wrapper
- `SaleRequestRecord` wrapper
- Update sale details JSON mock
- Sale create request JSON mock

## [1.3.0] - 2019-03-01

[Unreleased]: https://github.com/tokend/web-client/compare/1.3.0...HEAD
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
