<template>
  <div class="asset-viewer">
    <div class="asset-viewer__header">
      <asset-logo-dark
        class="asset-viewer__logo"
        :asset-code="asset.code"
        :logo-url="assetLogoUrl"
      />
      <div class="asset-viewer__name">
        {{ asset.name }}
      </div>
    </div>
    <div
      v-if="asset.description"
      class="asset-viewer__description"
    >
      <h3>{{ 'asset-viewer.description-title' | globalize }}</h3>
      <p>{{ asset.description }}</p>
    </div>
  </div>
</template>

<script>
import AssetLogoDark from '@/vue/common/assets/AssetLogoDark'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { documentsManager } from '@/api'

export default {
  name: 'asset-viewer',
  components: { AssetLogoDark },

  props: {
    assetCode: { type: String, required: true },
  },

  data () {
    return {
      asset: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    assetLogoUrl () {
      return documentsManager.getDocumentUrlByKey(this.asset.logoKey)
    },
  },

  created () {
    this.asset = this.assetByCode(this.assetCode)
  },

}
</script>

<style lang="scss">
@import '~@scss/variables';

.asset-viewer__header {
  display: flex;
  align-items: center;
}

.asset-viewer__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.asset-viewer__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
  margin-left: 1.8rem;
}

.asset-viewer__description {
  margin-top: 2rem;
}
</style>
