<template>
  <no-data-message
    icon-name="check"
    :msg-title="i18n.kyc_approved_title()"
    :msg-message="i18n.kyc_approved_msg()" />
</template>

<script>
import { i18n } from 'L@/js/i18n'
import NoDataMessage from 'L@/vue/common/messages/NoDataMessage'

export default {
  name: 'verification-syndicate-banner',
  components: { NoDataMessage },
  data: _ => ({
    i18n
  })
}
</script>
