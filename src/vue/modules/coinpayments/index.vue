<template>
  <div class="coinpayments">
    <coinpayments-form
      :asset="asset"
    />
    <div class="coinpayments__deposit-list-wrp">
      <deposit-list />
    </div>
  </div>
</template>

<script>
import coinpaymentsForm from './components/coinpayments-form'
import DepositList from './components/coinpayments-deposit-list'

export default {
  name: '',
  components: {
    coinpaymentsForm,
    DepositList,
  },
  mixins: [],
  props: {
    asset: { type: Object, required: true },
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {},
  created () {
  },
  destroyed () {
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
  .coinpayments__address-viewer-wrp {
    margin-top: 5rem;
  }

  .coinpayments__deposit-list-wrp {
    margin-top: 5rem;
  }
</style>
