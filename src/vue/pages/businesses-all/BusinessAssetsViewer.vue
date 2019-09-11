<template>
  <div class="business-assets-viewer">
    <div class="app__table app__table--last-td-to-right">
      <table class="business-assets-viewer__table">
        <thead>
          <tr>
            <th :title="'business-assets-viewer.asset-name-th' | globalize">
              {{ 'business-assets-viewer.asset-name-th' | globalize }}
            </th>
            <!-- eslint-disable-next-line max-len -->
            <th :title="'business-assets-viewer.number-of-holders-th' | globalize">
              {{ 'business-assets-viewer.number-of-holders-th' | globalize }}
            </th>
            <th>
              <!-- actions -->
            </th>
          </tr>
        </thead>

        <tbody v-if="businessAssets.length">
          <tr
            v-for="businessAsset in businessAssets"
            :key="businessAsset.id"
          >
            <td>
              Name
            </td>

            <td>
              Quantity
            </td>

            <td>
              <button
                class="business-assets-viewer__sponsor-btn"
                @click="selectItem(businessAsset)"
              >
                {{ 'business-assets-viewer.sponsor-btn' | globalize }}
              </button>
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="isLoaded"
          :colspan="3"
          :message="'business-assets-viewer.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="3"
          :message="'business-assets-viewer.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="3"
          template="smallString"
        />
      </table>
    </div>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'sponsor-business-form.form-heading' | globalize }}
      </template>
    </drawer>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import Drawer from '@/vue/common/Drawer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'business-assets-viewer',

  components: {
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
    Drawer,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },

  data () {
    return {
      businessAssets: [],
      currentBusinessAsset: {},
      isLoaded: true,
      isLoadFailed: false,
      isDrawerShown: false,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetsByOwner,
    ]),
  },

  created () {
    this.businessAssets = this.assetsByOwner(this.business.accountId)
  },

  methods: {
    selectItem (item) {
      this.currentBusinessAsset = item
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-assets-viewer__sponsor-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
}
</style>
