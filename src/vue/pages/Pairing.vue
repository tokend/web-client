<template>
  <div class="pairing">
    <h2 class="pairing__header">
      Linde No. 1 coin
      <br>
      <span class="pairing__header-span">is</span>
    </h2>
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              Bell coins
            </td>
            <td>
              1.2
            </td>
          </tr>
          <tr>
            <td>
              BTC
            </td>
            <td>
              0.014
            </td>
          </tr>
          <tr>
            <td>
              ETH
            </td>
            <td>
              0.0068
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pairing',
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.pairing {
  width: 40rem;
  padding: 2rem;
  border-radius: 0.4rem;
  background: $col-asset-card-background;
  margin: 0 auto;
}

.pairing__header {
  text-align: center;
  margin-bottom: 2rem;
}

.pairing .app__table table tbody tr td {
  font-size: 1.6rem;
}

.pairing__header-span {
  font-size: 1.8rem;
}
</style>
