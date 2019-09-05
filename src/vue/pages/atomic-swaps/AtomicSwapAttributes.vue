<template>
  <div class="atomic-swap-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'atomic-swap-attributes.base-asset-name' | globalize }}
            </td>
            <td>
              {{ atomicSwap.baseAssetName }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.available-amount-key' | globalize }}
            </td>
            <td :title="atomicSwap.availableAmount | formatMoney">
              {{ atomicSwap.availableAmount | formatBalance }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.locked-amount-key' | globalize }}
            </td>
            <td :title="atomicSwap.lockedAmount | formatMoney">
              {{ atomicSwap.lockedAmount | formatBalance }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.price-key' | globalize }}
            </td>
            <td :title="atomicSwap.quoteAssets[0].price | formatMoney">
              {{ {
                value: atomicSwap.quoteAssets[0].price,
                currency: statsQuoteAsset.code
              } | formatMoney
              }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.is-canceled-key' | globalize }}
            </td>
            <td>
              <template v-if="atomicSwap.isCanceled">
                {{ 'atomic-swap-attributes.yes-val' | globalize }}
              </template>
              <template v-else>
                {{ 'atomic-swap-attributes.no-val' | globalize }}
              </template>
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.created-key' | globalize }}
            </td>
            <td>
              {{ atomicSwap.createdAt | formatDateDMYT }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template
      v-for="(quoteAsset, index) in atomicSwap.quoteAssets"
    >
      <div class="app__table app__table--last-td-to-right" :key="quoteAsset.id">
        <h4 class="atomic-swap-attributes__quote-asset-header">
          {{ 'atomic-swap-attributes.quote-assets-subheading'
            | globalize({ number: index + 1 })
          }}
        </h4>

        <table>
          <tbody>
            <tr>
              <td>
                {{ 'atomic-swap-attributes.quote-asset-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.id }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'atomic-swap-attributes',
  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
    ]),
  },
}
</script>

<style lang="scss">
.atomic-swap-attributes__quote-asset-header {
  margin: 2rem 0;
}
</style>
