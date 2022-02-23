<script>
import SelectField from './SelectField.vue'

export default {
  extends: SelectField,
}
</script>

<style lang="scss" scoped>
.select-field {
  display: inline-block;
  width: auto;
}

::v-deep .select-field__opener {
  border-bottom: none;
  padding: 0 2rem 0 0;
  background: none;

  & > span {
    font-size: 1.6rem;
  }
}

.select-field--disabled ::v-deep .select-field__wrp > .select-field__opener,
.select-field--readonly ::v-deep .select-field__wrp > .select-field__opener {
  border-bottom: none;
}

::v-deep .select-field__selected-icon {
  top: calc(50% + 0.1rem);
  transform: translateY(-50%);
  right: 0;
  font-size: 1.8rem;
}

::v-deep .select-field__panel {
  top: calc(100% + 0.8rem);
}
</style>
