<template>
  <div
    id="card-list"
    class="card-list"
    :style="styleObject"
  >
    <div
      class="card-list__item"
      v-for="item in list"
      :key="item.id"
    >
      <slot :item="item" />
    </div>
  </div>
</template>

<script>
const NUMBER_OF_CARDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
}
const CONTENT_DISPLAY_WIDTH = {
  sixCards: 3000,
  fiveCards: 1678,
  fourCards: 1030,
  threeCards: 760,
  twoCards: 510,
}

export default {
  name: 'card-list',
  props: {
    list: {
      type: [Array, Number],
      required: true,
    },
  },
  data () {
    return {
      styleObject: {},
    }
  },
  mounted () {
    this.setCardWidth()
    window.addEventListener('resize', this.setCardWidth)
  },
  destroyed () {
    window.removeEventListener('resize', this.setCardWidth)
  },
  methods: {
    setCardWidth () {
      const numberOfCards = this.getNumberOfCards()

      this.styleObject = {
        'grid-template-columns': `repeat(${numberOfCards}, minmax(25rem, 1fr))`,
      }
    },

    getNumberOfCards () {
      const cardListWidth = document.getElementById('card-list').clientWidth
      let numberOfCards = NUMBER_OF_CARDS.one

      if (cardListWidth > CONTENT_DISPLAY_WIDTH.sixCards) {
        numberOfCards = NUMBER_OF_CARDS.six
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.fiveCards) {
        numberOfCards = NUMBER_OF_CARDS.five
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.fourCards) {
        numberOfCards = NUMBER_OF_CARDS.four
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.threeCards) {
        numberOfCards = NUMBER_OF_CARDS.three
      } else if (cardListWidth > CONTENT_DISPLAY_WIDTH.twoCards) {
        numberOfCards = NUMBER_OF_CARDS.two
      }
      return numberOfCards
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables.scss';

.card-list {
  display: grid;
  grid-gap: $list-item-margin;
}
</style>
