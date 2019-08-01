<template>
  <div class="business-details-attributes">
    <div class="business-details__header">
      <business-logo
        class="business-details__logo"
        :business="business"
        dark-mode
      />
      <p class="business-details__name">
        {{ business.name }}
      </p>
    </div>
    <!-- eslint-disable-next-line max-len -->
    <div class="app__table app__table--last-td-to-right business-details__table">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'business-attributes.id-key' | globalize }}
            </td>
            <td>
              {{ business.id }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'business-attributes.owner-key' | globalize }}
            </td>
            <td>
              <email-getter
                right-side
                :account-id="business.accountId"
              />
            </td>
          </tr>

          <tr v-if="business.industry">
            <td>
              {{ 'business-attributes.industry-key' | globalize }}
            </td>
            <td>
              {{ business.industry }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { BusinessRecord } from '@/js/records/entities/business.record'
import EmailGetter from '@/vue/common/EmailGetter'
import BusinessLogo from './BusinessLogo'

export default {
  name: 'business-attributes',

  components: {
    EmailGetter,
    BusinessLogo,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-details__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.business-details__header {
  display: flex;
  align-items: center;
}

.business-details__name {
  margin-left: 1.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
}

.business-details__table {
  margin-top: 4rem;
}
</style>
