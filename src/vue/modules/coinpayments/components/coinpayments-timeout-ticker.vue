<template>
  <div class="timeout-ticker">
    {{ 'coinpayments.time-left' | globalize }}: {{ timeLeftFormatted }}
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'timeout-ticker',
  props: {
    timeout: {
      type: Number, // ms
      required: true,
    },
  },
  data: _ => ({
    timeLeft: null,
    intervalId: null,
    moment,
  }),
  computed: {
    timeLeftFormatted () {
      const timeLeft = moment
        .duration(this.timeLeft, 'seconds')
        .asMilliseconds()

      if (timeLeft <= 0) {
        return '00:00:00'
      }

      return moment
        .utc(timeLeft)
        .format('HH:mm:ss')
    },
  },
  created () {
    this.timeLeft = this.timeout
    this.startTicker()
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    startTicker () {
      this.intervalId = setInterval(() => {
        this.timeLeft--
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.timeout-ticker {
  min-width: 13rem;
}
</style>
