# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
### Added
- Fees module
- Fees vuex namespaced module
- Fee scope column to the fees table
- Fee type, subtype & scope viewers
- Fee record wrapper
- Fees module, wrapper & store unit tests
- `filterFees` helper for getting only the fees corresponding to the specific account & account role

### Changed
- Now using new API endpoint for loading the fees
- Now using fees module for displaying the fees on the fees page
- Moved fees filters to the corresponding viewers

## [1.3.0] - 2019-03-01

[Unreleased]: https://github.com/tokend/web-client/compare/1.3.0...HEAD
[1.3.0]: https://github.com/tokend/web-client/releases/tag/1.3.0
