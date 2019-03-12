<template>
  <div class="donut-chart">
    <svg
      height="35rem"
      width="100%"
      viewBox="0 0 100 100"
    >
      <path
        :d="dBg"
        fill="transparent"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
      />

      <path
        :d="d"
        fill="transparent"
        :stroke="foregroundColor"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'donut-chart',
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    foregroundColor: {
      type: String,
      default: '#1993ff',
    },
    backgroundColor: {
      type: String,
      default: '#ecf6ff',
    },
    strokeWidth: {
      type: Number,
      default: 10,
    },
    radius: {
      type: Number,
      default: 35,
    },
  },

  computed: {
    largeArc () {
      return this.percent < 50 ? 0 : 1
    },

    x () {
      return 50
    },

    y () {
      return 50 - this.radius
    },

    endX () {
      return -Math.sin(this.radians) * this.radius + 50 - 0.0001
    },

    endY () {
      return Math.cos(this.radians) * this.radius + 50
    },

    radians () {
      const degrees = (this.percent / 100) * 360
      const value = degrees - 180
      return (value * Math.PI) / 180
    },

    z () {
      return this.percent === 100 ? 'z' : ''
    },

    dBg () {
      return `M ${this.x} ${this.y} A ${this.radius} ${this.radius} 0 1 1
        ${this.x - 0.0001} ${this.y} z`
    },

    d () {
      return `M ${this.x} ${this.y} A ${this.radius} ${this.radius} 0 ${
        this.largeArc
      } 1 ${this.endX} ${this.endY} ${this.z}`
    },
  },
}
</script>
