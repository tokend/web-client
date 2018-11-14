<template>
  <div class="limits-manager">
    <h2 class="limits-manager__title">
      <!-- eslint-disable-next-line -->
      {{ i18n.lim_change_limits_title({ assetName: assetName, asset: request.tokenCode }) }}
    </h2>
    <template v-if="view.mode === VIEW_MODES.upload">
      <detail
        :prop="i18n.lbl_request_creation_date()"
        :value="i18n.d(request.createdAt)"
        class="limits-manager__request-date limits-manager__detail-row"
      />
      <h3>{{ i18n.lim_requirements_title() }}</h3>
      <div
        class="limits-manager__doc-wrapper"
        v-for="(item, i) in documents"
        :key="i"
      >
        <detail
          :prop="i18n.lbl_document_type()"
          :value="item.label"
          class="limits-manager__doc-type limits-manager__detail-row"
        />
        <detail
          :prop="i18n.lbl_note()"
          :value="item.description"
          class="limits-manager__doc-description limits-manager__detail-row"
        />
        <div class="limits-manager__file-field-wrapper">
          <file-field
            class="limits-manager__file-field"
            v-model="documents[i].file"
            name="limits-proof-of-income"
            v-validate="'required'"
            :type="documentTypes.limitsProofOfIncome"
            label="Select File(s)"
            :id="`${i}-limits-document`"
            file-type="image"
          />
        </div>
      </div>
      <div class="limits-manager__action-btn-outer">
        <md-button
          class="limits-manager__action-btn md-primary"
          @click="submit"
          :disabled="isPending"
        >
          {{ i18n.lim_change_limits() }}
        </md-button>
      </div>
    </template>
    <template v-if="view.mode === VIEW_MODES.pending">
      <h3 class="limits-manager__title">{{ operationType }}</h3>
      <detail
        :prop="i18n.lim_daily()"
        :value="request.details.limits.dailyOut"
        class="limits-manager__limit-row"
      />
      <detail
        :prop="i18n.lim_weekly()"
        :value="request.details.limits.weeklyOut"
        class="limits-manager__limit-row"
      />
      <detail
        :prop="i18n.lim_monthly()"
        :value="request.details.limits.monthlyOut"
        class="limits-manager__limit-row"
      />
      <detail
        :prop="i18n.lim_annual()"
        :value="request.details.limits.annualOut"
        class="limits-manager__limit-row"
      />
      <strong>{{ i18n.lim_pending_request_msg() }}</strong>
      <div class="limits-manager__action-btn-outer">
        <md-button
          class="limits-manager__action-btn md-primary"
          @click="$emit(commonEvents.closeRequestEvent)"
          :disabled="isPending"
        >
          {{ i18n.lbl_ok() }}
        </md-button>
      </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '../../common/mixins/form.mixin'
import FileField from '../../common/fields/FileField'
import Detail from '../common/Detail.Row'
import {
  documentTypes,
  LIMITS_REQUEST_TYPE,
  LIMIT_OPS,
  LIMIT_OPS_STR
} from '../../../js/const/const'
import { i18n } from '../../../js/i18n/index'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../vuex/types'
import get from 'lodash/get'
import { fileService } from '../../../js/services/file.service'
import { accountsService } from '../../../js/services/accounts.service'
import { ErrorHandler } from '../../../js/errors/error_handler'
import { EventDispatcher } from '../../../js/events/event_dispatcher'
import { commonEvents } from '../../../js/events/common_events'

const VIEW_MODES = {
  pending: 'pending',
  upload: 'upload'
}

export default {
  components: {
    Detail,
    FileField
  },
  mixins: [FormMixin],
  props: { request: { type: [Object], default () { return {} } } },
  data: _ => ({
    documents: null,
    view: {
      mode: VIEW_MODES.upload
    },
    i18n,
    documentTypes,
    commonEvents,
    VIEW_MODES,
    LIMIT_OPS,
    LIMIT_OPS_STR
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ]),
    assetName () {
      return get(
        this.accountBalances[this.request.tokenCode],
        'asset_details.details.name'
      )
    },
    operationType () {
      const limitOp = Object.keys(LIMIT_OPS)
        .find(key => LIMIT_OPS[key] === this.request.details.operationType)
      return LIMIT_OPS_STR[limitOp]
    }
  },

  created () {
    this.documents = JSON.parse(get(this.request, 'rejectReason')).docsToUpload
  },

  methods: {
    ...mapActions({
      loadRequests: vuexTypes.GET_LIMITS_REQUESTS
    }),
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await this.uploadDocuments()
        await accountsService.createLimitRequest({
          requestID: this.request.id,
          details: {
            ...this.request.details,
            requestType: LIMITS_REQUEST_TYPE.docsUploading,
            documents: this.documents.map(item => {
              item.file = item.file.getDetailsForSave()
              return item
            })
          }
        })
        await this.loadRequests()
        EventDispatcher.dispatchShowSuccessEvent(i18n.lim_requested())
        this.view.mode = VIEW_MODES.pending
      } catch (e) {
        console.error(e)
        ErrorHandler.processUnexpected(e)
      }
      this.enable()
    },
    async uploadDocuments () {
      await Promise.all(
        this.documents.map(doc => this.uploadSingleDocument(doc.file))
      )
    },
    async uploadSingleDocument (document) {
      if (document.isUploaded) return
      const documentKey = await fileService
        .uploadFile(document.getDetailsForUpload())
      document.setKey(documentKey)
      return document
    }
  }
}
</script>

<style lang="scss" scoped>
.limits-manager__doc-wrapper,
.limits-manager__request-date {
  margin-bottom: 1rem;
}
.limits-manager__title {
  margin-bottom: 1.5rem;
}
.limits-manager__file-field-wrapper {
  margin-top: 1rem;
}
.limits-manager__action-btn-outer {
  text-align: right;
}
.limits-manager__action-btn {
  margin-right: -0.5rem;
}
.limits-manager__limit-row {
  margin-bottom: 1rem;
}
</style>
