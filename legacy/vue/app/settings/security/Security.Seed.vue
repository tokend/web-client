<template>
  <div class="settings-seed">
    <md-dialog-title>{{ i18n.set_copy_secret_seed() }}</md-dialog-title>
    <div class="account-seed__content app__card-content">
      <p class="app__page-explanations">{{ i18n.set_seed_description() }}</p>

      <clipboard-field
        class="account-seed__clipboard"
        :value="accountSeed"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'

import ClipboardField from 'L@/vue/common/fields/ClipboardField'

export default {
  name: 'account-seed',
  components: { ClipboardField },
  data: _ => ({
    isDialogOpened: false,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountSeed
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/mixins';

  .account-seed__description {
    margin-bottom: 16px;
    font-size: 14px;
  }

  .account-seed__clipboard {
    margin-right: 30px;

    @include respond-to(xsmall) {
      margin-right: 0;
    }
  }

</style>
