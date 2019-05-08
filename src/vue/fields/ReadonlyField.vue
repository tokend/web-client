<template>
  <div
    class="readonly-field__form-row"
  >
    <table class="readonly-field__fee-table">
      <tbody
        class="readonly-field__fee-tbody"
      >
        <tr>
          <td>
            {{ label }}
          </td>
          <td>
            {{ value || '0.00' }} {{ asset }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'readonly-field',
  props: {
    label: { type: String, default: 'Label' },
    value: { type: [String, Number], default: undefined },
    asset: { type: String, require: true, default: '' },
  },
}
</script>

<style scoped lang="scss">
.readonly-field__fee-table {
  width: 100%;
  font-size: 1.4rem;
}

.readonly-field__fee-table tr {
  height: 2rem;
}

.readonly-field__fee-table td:last-child {
  text-align: right;
}
</style>
