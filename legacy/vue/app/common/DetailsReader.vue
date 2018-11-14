<template>
  <div class="details-reader">
    <template v-if="typeof details === 'object'">
      <div
        class="details-reader__row"
        v-for="(detail, detailIndex) in details"
        :key="`detail-${detailIndex}`">
        <template
          v-if="!isPrivateValue(detailIndex) && typeof detail !== 'function'">
          <template v-if="Array.isArray(detail)">
            <div>
              <p class="details-reader__label">{{ detailIndex }}</p>
              <div class="details-reader__block">
                <template v-for="detailNested in detail">
                  <details-reader
                    :details="detailNested"
                    :key="`${_uid}-${detailNested}-${detailIndex}`"
                  />
                </template>
              </div>
            </div>
          </template>
          <template v-else-if="typeof detail === 'object'">
            <p class="details-reader__label">{{ detailIndex }}</p>
            <details-reader
              :details="detail"
              :key="`${_uid}-${detailIndex}`"
              class="details-reader__block"
            />
          </template>
          <template v-else>
            <p class="details-reader__label">{{ verbozify(detailIndex) }}</p>
            <p class="details-reader__value" :title="detail">{{ detail }}</p>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="details-reader__block">
        <div class="details-reader__row">
          <p class="details-reader__label">a</p>
          <p class="details-reader__value" :title="details">{{ details }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { verbozify } from 'L@/js/utils/verbozify'

export default {
  name: 'details-reader',
  props: {
    details: {
      type: [Object, Number, Array, String],
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      dictionary: {}
    }
  },
  methods: {
    verbozify,
    isPrivateValue (value) {
      if (typeof value === 'string' || value instanceof String) {
        return value.charAt(0) === '_'
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .details-reader__block {
    width: 100%;
    padding-left: 2rem;
    border-left: 1px solid black;
  }

  .details-reader__row {
    display: flex;
    flex-wrap: wrap;

    & + & {
      margin-top: 0.25rem;
    }
  }

  .details-reader__label {
    min-width: 10rem;
    font-weight: 500;
  }

  .details-reader__value {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 15rem;
    white-space: nowrap;
  }
</style>
