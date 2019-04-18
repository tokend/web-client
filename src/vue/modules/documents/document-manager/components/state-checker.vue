<template>
  <div :class="classObj" v-if="!isVerifying">
    <div class="state-checker__inner">
      <i class="state-checker__icon mdi mdi-shield-check" v-if="isVerified" />
      <i class="state-checker__icon mdi mdi-alert" v-else />

      <div class="state-checker__text">
        <template v-if="isVerified">
          <h3 class="state-checker__heading">
            {{ 'document-manager.document-verified-title' | globalize }}
          </h3>
          <p class="state-checker__msg">
            {{ 'document-manager.document-verified-msg' | globalize }}
          </p>
        </template>

        <template v-else>
          <h3 class="state-checker__heading">
            {{ 'document-manager.document-not-verified-title' | globalize }}
          </h3>

          <p class="state-checker__msg">
            <template v-if="isHashInvalid">
              {{ 'document-manager.invalid-hash-msg' | globalize }}
            </template>
            <template v-else>
              {{ 'document-manager.hash-mismatch-msg' | globalize }}
            </template>
          </p>
        </template>
      </div>
    </div>
  </div>
  <load-spinner v-else message-id="document-manager.verifying-doc-msg" />
</template>

<script>
import { ErrorHandler } from '@/js/helpers/error-handler'
import { CryptoUtil } from '../helpers/crypto.util'
import { FileUtil } from '@/js/utils/file.util'

import Vue from 'vue'
import LoadSpinner from '@/vue/common/Loader'

const LENGTH_SHA256_HEX_ENCODED = 64

export default {
  name: 'state-checker',
  components: {
    LoadSpinner,
  },
  props: {
    downloadLink: { type: String, required: true },
    fileHash: { type: String, required: true },
    fileMimeType: { type: String, required: true },
  },
  data: _ => ({
    isVerifying: false,
    isVerified: false,
    isHashInvalid: false,
  }),
  computed: {
    classObj () {
      return {
        'state-checker': true,
        'state-checker--verified': this.isVerified,
        'state-checker--not-verified': !this.isVerified,
      }
    },
  },
  async created () {
    await this.verifyFile()
  },
  methods: {
    async verifyFile () {
      this.isVerifying = true

      if (this.fileHash.length !== LENGTH_SHA256_HEX_ENCODED) {
        this.isHashInvalid = true
        return
      }

      try {
        const blob = await this.getFileBlob()
        const hash = await this.getFileHash(blob)

        this.isVerified = hash === this.fileHash
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      this.isVerifying = false
    },
    async getFileBlob () {
      const { body: fileStr } = await Vue.http.get(this.downloadLink)

      return new Blob([fileStr], { type: this.fileMimeType })
    },
    async getFileHash (fileBlob) {
      const msg = await FileUtil.getText(fileBlob)
      return CryptoUtil.hashMessage(msg)
    },
  },
}
</script>

<style lang="scss" scoped>
.state-checker {
  padding: 1rem 0;

  @mixin state-checker ($color) {
    background: rgba($color, .15);
    border-top: 1px solid $color;
    border-bottom: 1px solid $color;
    color: $color;

    .state-checker__icon i {
      color: $color;
    }
  }

  &--verified { @include state-checker($col-success) }
  &--not-verified { @include state-checker($col-error) }
}

.state-checker__heading {
  margin-bottom: .35rem;
}

.state-checker__inner {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.state-checker__icon {
  font-size: 5rem;
  margin-right: 1.5rem;
}
</style>
