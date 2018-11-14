<template>
  <div>
    <record-details-viewer :tx="tx" />
    <button
      v-ripple
      @click="cancelOffer"
      class="cancel-button"
      :disabled="isPending"
    >
      {{ i18n.trd_cancel_order() }}
    </button>
  </div>
</template>

<script>
import DetailsMixin from './details.mixin'
import SubmitterMixin from '../../../../../common/mixins/submitter.mixin'

import { i18n } from '../../../../../../js/i18n/index'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../../vuex/types'
import { ErrorHandler } from '../../../../../../js/errors/error_handler'
import { offersService } from '../../../../../../js/services/offer.service'
import { EventDispatcher } from '../../../../../../js/events/event_dispatcher'
import { dispatchAppEvent } from '../../../../../../js/events/helpers'
import { commonEvents } from '../../../../../../js/events/common_events'
import { confirmAction } from '../../../../../../js/modals/confirmation_message'
import RecordDetailsViewer from 'L@/vue/app/common/RecordDetailsViewer'

export default {
  name: 'manage-orders',
  components: {
    RecordDetailsViewer
  },
  mixins: [DetailsMixin, SubmitterMixin],
  props: {
    tx: { type: Object, require: true, default: () => { } }
  },
  data () {
    return {
      i18n
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ])
  },
  methods: {
    async cancelOffer () {
      if (!await confirmAction()) return
      this.disable()
      try {
        await offersService.cancelOffer({
          baseBalance: this.accountBalances[this.tx.baseAssetCode].balance_id,
          quoteBalance: this.accountBalances[this.tx.quoteAssetCode].balance_id,
          offerId: this.tx.id.toString(),
          price: this.tx.price,
          orderBookId: this.tx.orderBookId.toString()
        })
        dispatchAppEvent(commonEvents.cancelOrder)
        EventDispatcher.dispatchShowSuccessEvent(i18n.trd_offer_canceled())
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~L@scss/mixins";

.cancel-button {
  @include button-accent();
  margin-left: -16px;
  margin-top: 24px;
  display: block;

  @include respond-to-custom(760px) {
    margin-left: 0;
    margin-right: auto;
  }
}
</style>
