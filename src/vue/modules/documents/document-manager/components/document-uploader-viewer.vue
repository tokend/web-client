<template>
  <div class="document-uploader-viewer" v-if="uploaderEmail">
    <p class="document-uploader-viewer__organization">
      <span class="document-uploader-viewer__lbl">
        {{ 'document-uploader-viewer.date-lbl' | globalize }}
      </span>
      {{ metadata.createdAt | formatCalendar }}
    </p>
    <p class="document-uploader-viewer__uploader">
      <span class="document-uploader-viewer__lbl">
        {{ 'document-uploader-viewer.uploaded-by-lbl' | globalize }}
      </span>
      {{ uploaderEmail }}
    </p>
    <p
      class="document-uploader-viewer__organization"
      v-if="uploaderOrganizationTranslationId"
    >
      <span class="document-uploader-viewer__lbl">
        {{ 'document-uploader-viewer.organization-lbl' | globalize }}
      </span>
      {{ uploaderOrganizationTranslationId | globalize }}
    </p>
  </div>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { Metadata } from '../wrappers/metadata'

export default {
  name: 'document-uploader-viewer',
  mixins: [IdentityGetterMixin],
  props: {
    metadata: {
      type: Metadata,
      required: true,
    },
  },
  data: _ => ({
    uploaderEmail: '',
  }),
  computed: {
    uploaderOrganizationTranslationId () {
      if (this.uploaderEmail === 'dr.johson@hospital.com') {
        return 'document-uploader-viewer.clinic-1-name'
      } else if (this.uploaderEmail === 'dr.smith@hospital.com') {
        return 'document-uploader-viewer.clinic-2-name'
      } else if (
        this.uploaderEmail.indexOf('hospital') !== -1 ||
        this.uploaderEmail.indexOf('dr.') !== -1
      ) {
        return 'document-uploader-viewer.clinic-3-name'
      }
      return ''
    },
  },
  async created () {
    this.uploaderEmail = await this
      .getEmailByAccountId(this.metadata.uploaderAccountId)
  },
}
</script>

<style lang="scss" scoped>
.document-uploader-viewer__uploader {
  line-height: 2rem;
}
.document-uploader-viewer__lbl {
  color: $col-document-uploader-text-unlighten;
  font-style: italic;
}

</style>
