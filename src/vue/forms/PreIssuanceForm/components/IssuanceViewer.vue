<template>
  <div class="issuance-viewer">
    <h3>
      {{ 'pre-issuance-form.pre-issuance-details-title' | globalize }}
    </h3>

    <div class="app__table issuance-viewer__table ">
      <table>
        <tbody>
          <tr>
            <td>{{ 'pre-issuance-form.asset-lbl' | globalize }}</td>
            <td>{{ issuance.asset }}</td>
          </tr>

          <tr>
            <td>{{ 'pre-issuance-form.amount-lbl' | globalize }}</td>
            <td>{{ issuance.amount | formatMoney }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pre-issuance-viewer',

  props: {
    issuance: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
.issuance-viewer__table {
  margin-top: 1rem;
}

.issuance-viewer__table table tr td:last-child {
  text-align: right;
}
</style>
