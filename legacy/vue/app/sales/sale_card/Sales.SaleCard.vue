<template>
  <div class="card">
    <div class="card__image-wrp">
      <img
        :src="imgUrl || getUrl"
        alt="">
    </div>

    <div class="card__content">
      <div class="card__header">
        <h3 class="card__name">{{ sale.name }}</h3>
      </div>
      <p class="card__description">{{ sale.shortDescription }}</p>
      <div class="card__progress-wrp">
        <invest-progress-bar
          :sale="sale"
          :bar-height="'1.2rem'" />
      </div>
    </div>

    <div
      class="card__state-tip"
      :class="`card__state-tip--${stateTip}`">
      {{ stateTip }}
    </div>
  </div>
</template>

<script>
import { humanizeFutureDate } from 'L@/js/utils/dates.util'
import config from '@/config'
import _get from 'lodash/get'
import InvestProgressBar from './Sales.ProgressBar'

export default {
  name: 'sale-card',
  components: { InvestProgressBar },
  props: {
    sale: { type: Object, default: () => {} },
    imgUrl: { type: String, default: '' }
  },
  computed: {
    stateTip () {
      if (this.sale.isCanceled) return 'cancelled'
      if (this.sale.isUpcoming) return 'upcoming'
      if (this.sale.isClosed) return 'finished'
      return ''
    },
    getUrl () {
      const key = _get(this.sale, '_record.details.logo.key')
      if (!key) return ''
      return `${config.FILE_STORAGE}/${key}`
    }
  },
  methods: {
    humanizeFutureDate
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  $padding-side: 20px;

  $ratio_16: 100%;
  $ratio_9: $ratio_16 * (9/16);

  .card {
    font-weight: 200;
    overflow: hidden;
    position: relative;
    width: $ratio_16;
    color: $col-text-page-heading;

    &:before {
      bottom: 0;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  .card__image-wrp {
    position: relative;
    padding-bottom: $ratio_9;

    img {
      position: absolute;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .card__content {
    padding: 1.2rem 1rem;
    height: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card__name {
    font-weight: 200;
  }

  .card__header {
    position: relative;
  }

  .card__syndicate {
    color: $col-text-accented;
    font-style: italic;
  }

  .card__syndicate,
  .card__description {
    font-size: .8rem;
  }

  .card__description {
    $line-height: 1.15rem;
    $max-lines: 3;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: $max-lines;
    -webkit-box-orient: vertical;
    line-height: $line-height;
    max-height: 3.45rem;
    min-height: 3.45rem;
  }

  .card__state-tip {
    position: absolute;
    top: 0;
    right: 0;
    padding: .5rem 3rem;
    transform: translate(32%,33%) rotate(45deg);
    color: $col-fund-card-state-tip;

    &--upcoming { background: $col-pending }
    &--finished { background: $col-success }
    &--cancelled { background: $col-accent }
  }

</style>
