<template>
  <div class="business-attributes">
    <div class="business-attributes__header">
      <business-logo
        class="business-attributes__logo"
        :business="business"
        dark-mode
      />
      <p class="business-attributes__name">
        {{ business.name }}
      </p>
    </div>
    <!-- eslint-disable-next-line max-len -->
    <div class="app__table app__table--last-td-to-right business-attributes__table">
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
import EmailGetter from '@/vue/common/EmailGetter'
import BusinessLogo from './BusinessLogo'
import { BusinessRecord } from '@/js/records/entities/business.record'

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

.business-attributes__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.business-attributes__header {
  display: flex;
  align-items: center;
}

.business-attributes__name {
  margin-left: 1.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
}

.business-attributes__table {
  margin-top: 4rem;
}
</style>
