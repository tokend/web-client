<template>
  <div class="asset-information">
    <div class="asset-information__header">
      <asset-logo-dark
        class="asset-information__logo"
        :asset-code="asset.code"
        :logo-url="assetLogoUrl"
      />
      <div class="asset-information__info">
        <p class="asset-information__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <div
      v-if="asset.description"
      class="asset-information__description"
    >
      <h3>{{ 'asset-information.description-title' | globalize }}</h3>
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
  name: 'asset-information',
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

.asset-information__header {
  display: flex;
  align-items: center;
}

.asset-information__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.asset-information__info {
  margin-left: 1.8rem;
}

.asset-information__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
}

.asset-information__description {
  margin-top: 2rem;
}
</style>
