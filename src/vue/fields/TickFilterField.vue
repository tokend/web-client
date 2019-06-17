<script>
import TickField from './TickField.vue'

export default {
  extends: TickField,
}
</script>

<style lang="scss" scoped>
$filter-tick-size: 1.4rem;

.tick-field {
  display: inline-block;
  width: auto;
}

.tick-field /deep/ .tick-field__label {
  font-size: 1.6rem;
  padding-left: 2.4rem;
}

.tick-field /deep/ .tick-field__tick {
  width: $filter-tick-size;
  min-width: $filter-tick-size;
  height: $filter-tick-size;

  &:after {
    top: calc(50% - #{$filter-tick-size * 0.12});
    height: $filter-tick-size * 0.5;
    width: $filter-tick-size * 0.25;
  }
}

.tick-field /deep/ .tick-field__input {
  width: $filter-tick-size;
  height: $filter-tick-size;
}
</style>
