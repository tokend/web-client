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
              {{ atomicSwapAsk.baseAssetName }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.amount-key' | globalize }}
            </td>
            <td :title="atomicSwapAsk.amount | formatMoney">
              {{ atomicSwapAsk.amount | formatBalance }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.price-key' | globalize }}
            </td>
            <td :title="atomicSwapAsk.price | formatMoney">
              {{ {
                value: atomicSwapAsk.price,
                currency: statsQuoteAsset.code
              } | formatMoney
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template
      v-for="(quoteAsset, index) in atomicSwapAsk.quoteAssets"
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
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'atomic-swap-attributes',
  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
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
