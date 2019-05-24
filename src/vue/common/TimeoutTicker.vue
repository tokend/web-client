<template>
  <div class="timeout-ticker">
    <template v-if="secondsLeft > 0">
      {{ 'coinpayments-deposit.time-left-msg' | globalize }}:
      {{ timeLeftFormatted }}
    </template>
    <template v-else>
      {{ 'coinpayments-deposit.time-over-msg' | globalize }}
    </template>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'timeout-ticker',
  props: {
    endTime: { type: Number, required: true }, // unix timeStamp
  },
  data: _ => ({
    secondsLeft: null,
    intervalId: null,
    moment,
  }),
  computed: {
    timeLeftFormatted () {
      const timeLeft = moment
        .duration(this.secondsLeft, 'seconds')
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
    this.startTicker()
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    startTicker () {
      this.secondsLeft = (this.endTime - moment().unix())
      this.intervalId = setInterval(() => {
        this.secondsLeft = this.endTime - moment().unix()
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
