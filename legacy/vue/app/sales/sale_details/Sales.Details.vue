<template>
  <div
    class="sale-details"
    v-if="sale && token">
    <div class="sale-details__header">
      <h1 class="sale-details__heading">
        {{ sale.name }} ({{ sale.baseAsset }})
      </h1>
      <p class="sale-details__description">{{ sale.shortDescription }}</p>
    </div>
    <div class="sale-details__content">
      <div class="sale-details__banner">
        <img
          class="sale-details__banner-image"
          :src="sale.image"
          alt="crowdfund banner">
      </div>
      <div class="sale-details__information">
        <div class="sale-details__information-item">
          <invest-progress-bar
            class="invest-progress-bar"
            :sale="sale"
            :bar-height="'1.2rem'" />
        </div>
        <div class="sale-details__information-item">
          <sale-invest
            :sale="sale"
            @invest-in-sale="loadDetails" />
        </div>
      </div>
    </div>
    <sale-tabs
      class="sale-details__tabs"
      :sale="sale"
      :description="description"
      :syndicate="syndicate"
      :token="token"
    />
  </div>
</template>

<script>
import { salesService } from 'L@/js/services/sales.service'
import { tokensService } from 'L@/js/services/tokens.service'
import { SaleRecord } from 'L@/js/records/sale.record'
import { TokenRecord } from 'L@/js/records/token.record'
import { i18n } from 'L@/js/i18n'
import SaleInvest from './components/Sales.Invest'
import SaleTabs from './Sales.Tabs'
import InvestProgressBar from '../sale_card/Sales.ProgressBar'

export default {
  name: 'sale-details',
  components: {
    SaleInvest,
    InvestProgressBar,
    SaleTabs
  },
  props: {
    id: { type: String, required: true }
  },

  data: _ => ({
    sale: '',
    token: '',
    description: '',
    syndicate: {
      email: ''
    },
    i18n
  }),

  async created () {
    if (this.id) {
      await this.loadDetails()
    }
  },

  methods: {
    async loadDetails () {
      this.sale = new SaleRecord(await salesService.loadSaleById(this.id))
      await Promise.all([
        this.token = new TokenRecord(
          await tokensService.loadTokenByCode(this.sale.baseAsset)
        ),
        this.description =
          await salesService.loadSaleDescription(
            this.sale.owner,
            this.sale.descriptionID
          )
      ])
    }
  }
}
</script>

<style lang="scss">
@import "~L@scss/variables";
@import "~L@scss/mixins";
$ratio_16: 370px;
$ratio_9: $ratio_16 * (9/16);

.sale-details__tabs {
  @include overwrite-tabs(auto);
  align-items: flex-start;
  box-shadow: none !important;

  .md-tabs-navigation {
    background-color: transparent !important;
  }
  .md-content.md-tabs-content.md-theme-default {
    background-color: transparent;
    max-width: 725px;
  }
}

.sale-details__content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
  .sale-details__banner {
    width: 50%;

    @media (max-width: 1000px) {
      width: 100%;
    }
  }

  .sale-details__banner {
    position: relative;
    padding-bottom: $ratio_9;
  }

  .sale-details__banner-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sale-details__information {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    .sale-details__information-item {
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 2rem;
      }
    }
    @media (max-width: 1000px) {
      width: 100%;
      margin-top: 5 * $point;
    }
  }
}

.sale-details__main-info {
  @media (max-width: 1000px) {
    flex-direction: column-reverse;
  }
}

.sale-details__header {
  margin-bottom: 3 * $point;
}

.sale-details__heading {
  font-size: 2 * $point;
  line-height: 1.5;
  margin: 0.8 * $point 0;
  vertical-align: middle;
  color: $col-text-page-heading;
  opacity: 1;
}
.sale-details__owner {
  font-size: 75%;
  margin-left: 1rem;
  @include respond-to(medium) {
    margin-left: 0;
    margin-top: 1rem;
  }
}

.sale-details__description {
  font-size: 1.6 * $point;
  color: $col-text-page-explanations-inactive;
}

.sale-details__back-btn {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: .4 * $point;
  margin-right: .5 * $point;
}

.information-item__title {
  margin-top: 1.5rem;
  margin-bottom: 3rem;
}

.sale-details__invest-progress-bar {
  margin-top: 1rem;
}
</style>
