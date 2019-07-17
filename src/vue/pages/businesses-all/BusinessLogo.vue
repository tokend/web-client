<template>
  <div class="business-logo">
    <img
      v-if="url"
      class=" business-logo__image"
      :src="url"
    >
    <p
      v-else
      class="business-logo business-logo__code-abbr-wrp"
    >
      <span class="business-logo__code-abbr">
        {{ name | abbreviate }}
      </span>
    </p>
  </div>
</template>

<script>
import { BusinessRecord } from './business.record'
import { documentsManager } from '@/api'

export default {
  name: 'business-logo',
  props: {
    business: { type: BusinessRecord, required: true },
    name: { type: String, required: true },
  },
  computed: {
    url () {
      return documentsManager.getDocumentUrlByKey(this.business.logoKey)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-logo {
  position: relative;
  padding-bottom: 56.2%;
}

.business-logo__image,
.business-logo__code-abbr-wrp {
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  background: $col-asset-logo-dark-background;
}

.business-logo__code-abbr {
  position: absolute;
  font-size: 2.4rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $col-asset-logo-dark-text;
  line-height: 1;
}
</style>
