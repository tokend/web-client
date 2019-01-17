<template>
  <tr>
    <td>{{ label }}</td>
    <td>{{ value }}</td>
  </tr>
</template>

<script>
export default {
  name: 'details',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number, Boolean, Date], required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
