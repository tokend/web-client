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
import { DateUtil } from '@/js/utils'

export default {
  name: 'timeout-ticker',
  props: {
    endTime: { type: Number, required: true }, // unix timeStamp
  },
  data: _ => ({
    secondsLeft: null,
    intervalId: null,
  }),
  computed: {
    timeLeftFormatted () {
      const timeLeft = DateUtil.millisecondOf(
        DateUtil.duration({ seconds: this.secondsLeft })
      )
      if (timeLeft <= 0) {
        return '00:00:00'
      }

      return DateUtil.format(
        DateUtil.utc(timeLeft), 'HH:mm:ss'
      )
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
      this.secondsLeft = (this.endTime - DateUtil.toTimestamp())
      this.intervalId = setInterval(() => {
        this.secondsLeft = this.endTime - DateUtil.toTimestamp()
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
