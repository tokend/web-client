# web-client

TokenD client application.

Known issues:

* Some tests are forcing `Vue.config.silent` flag because of a few annoying
warnings, (https://github.com/vuejs/vue-test-utils/issues/532). Remove once
migrating to Vue 2.6
* `documents` module and all it's internals are in draft, may not be released and may not be compatible with other TokenD features.
* Windows support is experimental and has known issues. Set `git config --global core.autocrlf false` to avoid line endings issues
