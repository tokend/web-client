<template>
  <div class="atomic-swap-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'atomic-swap-attributes.id-key' | globalize }}
            </td>
            <td>
              {{ atomicSwap.id }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.owner-key' | globalize }}
            </td>
            <td>
              <email-getter
                right-side
                :account-id="atomicSwap.ownerId"
              />
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.base-asset-key' | globalize }}
            </td>
            <td>
              {{ atomicSwap.baseAsset }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.available-amount-key' | globalize }}
            </td>
            <td>
              {{ atomicSwap.availableAmount }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'atomic-swap-attributes.locked-amount-key' | globalize }}
            </td>
            <td>
              {{ atomicSwap.lockedAmount }}
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

        <template
          v-for="(quoteAsset, index) in atomicSwap.quoteAssets"
        >
          <tbody :key="quoteAsset.id">
            <tr>
              <td colspan="2">
                {{ 'atomic-swap-attributes.quote-assets-subheading'
                  | globalize({ number: index + 1 })
                }}
              </td>
            </tr>

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
                {{ 'atomic-swap-attributes.current-cap-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.currentCap }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'atomic-swap-attributes.hard-cap-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.hardCap }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'atomic-swap-attributes.total-current-cap-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.totalCurrentCap }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'atomic-swap-attributes.price-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.price }}
              </td>
            </tr>

            <tr :key="quoteAsset.id">
              <td>
                {{ 'atomic-swap-attributes.address-key' | globalize }}
              </td>
              <td>
                {{ quoteAsset.address }}
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import EmailGetter from '@/vue/common/EmailGetter'

export default {
  name: 'atomic-swap-attributes',

  components: {
    EmailGetter,
  },

  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.app__table table tbody:nth-child(even) tr:nth-child(even) {
  background-color: $col-table-alt-row-background;
}

.app__table table tbody:nth-child(even) tr:nth-child(odd) {
  background-color: transparent;
}
</style>
