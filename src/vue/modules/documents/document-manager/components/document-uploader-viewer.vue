<template>
  <div class="document-uploader-viewer" v-if="uploaderEmail">
    <p class="document-uploader-viewer__uploader">
      <span class="document-uploader-viewer__uploader-lbl">
        {{ 'document-uploader-viewer.uploaded-by-lbl' | globalize }}
      </span>
      <span class="document-uploader-viewer__uploader-email">
        {{ uploaderEmail }}
      </span>
    </p>
    <p class="document-uploader-viewer__organization">
      {{ uploaderOrganizationTranslationId | globalize }}
    </p>
  </div>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'

export default {
  name: 'document-uploader-viewer',
  mixins: [IdentityGetterMixin],
  props: {
    uploaderAccountId: {
      type: String,
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
      return 'document-uploader-viewer.no-organization-msg'
    },
  },
  async created () {
    this.uploaderEmail = await this.getEmailByAccountId(this.uploaderAccountId)
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.document-uploader-viewer__uploader {
  line-height: 2rem;
}
.document-uploader-viewer__uploader-lbl,
.document-uploader-viewer__organization {
  color: $col-document-uploader-text-unlighten;
  font-style: italic;
}

</style>
