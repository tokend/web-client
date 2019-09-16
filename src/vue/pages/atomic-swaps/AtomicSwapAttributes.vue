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
              {{ 'atomic-swap-attributes.amount-key' | globalize }}
            </td>
            <td :title="atomicSwap.amount | formatMoney">
              {{ atomicSwap.amount | formatBalance }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.price-key' | globalize }}
            </td>
            <td :title="atomicSwap.price | formatMoney">
              {{ {
                value: atomicSwap.price,
                currency: statsQuoteAsset.code
              } | formatMoney
              }}
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
            <tr>
              <td>
                {{ 'atomic-swap-attributes.destination-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.destination }}
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
