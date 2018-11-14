<template>
  <div class="chart-root">
    <div v-if="isLoading" class="chart-root__wrapper">
      <div class="chart-root__wrapper-message">
        {{ i18n.dash_chart_loading() }}
      </div>
    </div>
    <div v-else-if="!hasValue" class="chart-root__wrapper">
      <div class="chart-root__wrapper-message">
        {{ i18n.dash_empty_volume() }}
      </div>
    </div>
    <div class="chart-root__chart" ref="chart" />
  </div>
</template>

<script>
import { i18n } from 'L@/js/i18n'

import * as d3Array from 'd3-array'
import * as d3Selection from 'd3-selection'
import * as d3Scale from 'd3-scale'
import * as d3Axis from 'd3-axis'
import * as d3Shape from 'd3-shape'
import * as d3Transition from 'd3-transition'
import * as d3Ease from 'd3-ease'

// import * as d3 from 'd3'
import moment from 'moment'
import { chunk } from 'lodash'
import config from '@/config'
const d3 = Object.assign(
  {},
  d3Array,
  d3Selection,
  d3Axis,
  d3Shape,
  d3Scale,
  d3Transition,
  d3Ease
)

export default {
  name: 'chart-renderer',
  props: {
    data: { type: Array, default: () => [] },
    currency: { type: String, default: 'SUN' },
    scale: { type: String, default: 'hour' },
    requiredTicks: { type: Array, default: () => [] },
    precision: { type: Number, default: 0 },
    hasValue: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false }
  },

  data: _ => ({
    defaultAsset: config.DEFAULT_QUOTE_ASSET,
    chartRenderingTime: 500,
    dataCount: 360,
    i18n
  }),

  computed: {
    normalizedData () {
      return this.data.map(item => ({
        time: moment(item.timestamp).toDate(),
        value: parseFloat(parseFloat(item.value).toFixed(this.precision))
      }))
    },
    barTicks () {
      switch (this.scale) {
        case 'year': return this.dataCount / 24
        case 'month': return this.dataCount / 30
        case 'day': return this.dataCount / 24
        case 'hour': return this.dataCount / 30
        default: return this.dataCount / 30
      }
    }
  },

  watch: {
    data (data) {
      this.render()
    }
  },

  mounted (...args) {
    this.render()
    window.addEventListener('resize', this.render)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.render)
  },

  methods: {
    clear () {
      d3.select('svg.chart').remove()
    },

    getDimensions () {
      const parentElement = this.$el.parentElement
      return {
        width: parentElement.clientWidth,
        height: parentElement.clientHeight < 250
          ? 250
          : parentElement.clientHeight
      }
    },

    getMaxAndMin (data) {
      const arr = data.map(item => item.value)
      const max = Math.max(...arr, ...this.requiredTicks)
      const min = this.requiredTicks && this.requiredTicks.length
        ? 0
        : Math.min(...arr)
      return { max, min }
    },

    addDomainPadding (domain) {
      let [min, max] = domain
      const diff = (max - min) || 0.0001
      const padding = diff * 0.05
      min = min - padding
      max = max + padding
      return [min, max]
    },

    formatMoney (amount) {
      const curSym = ({ 'SUN': 'SUN' })[this.currency]
      const moneyFormats = {
        'en': (curSym, amount) => `${curSym}${amount}`
      }
      return moneyFormats['en'](curSym, amount.toFixed(this.precision))
    },

    render () {
      this.clear()

      // Setup the data
      // const scale = this.scale
      const data = chunk(this.normalizedData, this.barTicks).map(item => {
        const itemLength = item.length
        let defaultDate = 0
        let max = 0

        for (let i = 0; i < itemLength; i++) {
          defaultDate += Date.parse(item[i].time)
          if (item[i].value > max) max = item[i].value
        }

        return {
          time: new Date(defaultDate / itemLength),
          value: max
        }
      })
      const { max, min } = this.getMaxAndMin(data)
      if (!data[0] || !data[data.length - 1]) return

      const firstDate = data[0].time
      const lastDate = data[data.length - 1].time

      // Setup svg
      const className = 'chart'
      const yAxisTickWidth = this.formatMoney(max).length * 9 + 5
      const margin = { top: 2, left: yAxisTickWidth, bottom: 32, right: 0 }
      const dimensions = this.getDimensions(this.$el)
      const width = dimensions.width // - margin.right - margin.left
      const height = dimensions.height - margin.top - margin.bottom

      const viewWidth = width + margin.left
      const viewHeight = height + margin.top + margin.bottom
      const svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', '100%')
        .attr('viewBox', `0 0 ${viewWidth} ${viewHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr('class', className)
        .append('g')

      if (!this.hasValue) {
        const y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, 12])

        const yAxisLine = d3.axisRight(y)
          .tickValues([0, 5, 10])
          .tickFormat((d) => `${i18n.c(d)} ${this.defaultAsset}`)
          .tickSizeInner(width)
          .tickSizeOuter(0)
          .tickPadding(25)

        svg.append('g')
          .attr('class', `${className}__y-axis`)
          .call(yAxisLine)
          .selectAll('line')

        return
      }

      // Define domains
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain(this.addDomainPadding([min, max]))

      const x = d3.scaleTime()
        .range([0, width])
        .domain([firstDate, lastDate])

      // Render the line and area
      const area = d3.area()
        .x((d) => x(d.time))
        .y0(y(min))
        .y1((d) => y(d.value))

      const line = d3.line()
        .x((d) => x(d.time))
        .y((d) => y(d.value))

      const path = svg.append('path')
        .attr('class', `${className}__line`)
        .attr('d', line(data))

      const totalLength = path.node().getTotalLength()

      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(this.chartRenderingTime)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)

      let defs = svg.append('defs')
      let lg = defs.append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%')

      lg.append('stop')
        .attr('offset', '30%')
        .style('stop-color', '#d5ceff')
        .style('stop-opacity', 0.5)

      lg.append('stop')
        .attr('offset', '50%')
        .style('stop-color', '#d5ceff')
        .style('stop-opacity', 0.25)

      lg.append('stop')
        .attr('offset', '70%')
        .style('stop-color', '#d5ceff')
        .style('stop-opacity', 0.1)

      lg.append('stop')
        .attr('offset', '90%')
        .style('stop-color', '#d5ceff')
        .style('stop-opacity', 0.07)

      lg.append('stop')
        .attr('offset', '100%')
        .style('stop-color', '#d5ceff')
        .style('stop-opacity', 0.05)

      if (max !== min) {
        const chartAreaWithGradient = svg
          .append('path')
          .datum(data)
          .attr('fill', 'url(#area-gradient)')
          .attr('d', area)
          .style('opacity', '0')
          .style('transition', '0.3s ease-out')

        setTimeout(() => {
          chartAreaWithGradient.style('opacity', '1')
        }, this.chartRenderingTime)

        svg.append('g')
          .attr('height', height)
          .selectAll('rect')
          .data(data)
          .enter().append('rect')
          .attr('fill', '#837fa1')
          .attr('opacity', '0.2')
          .attr('width', '1')
          .attr('height', (localData) => height - y(localData.value) - 9)
          .attr('x', (localData) => x(localData.time))
          .attr('y', (localData) => y(localData.value))

        const chartTipsPoints = svg.append('g')
          .attr('height', height)
          .attr('width', width)
          .selectAll('circle')
          .data(data)
          .enter().append('circle')
          .attr('r', '3')
          .attr('fill', '#bdb6ff')
          .style('opacity', '0')
          .style('transition', '0.3s ease-out')
          .attr('cx', (localData) => x(localData.time))
          .attr('cy', (localData) => y(localData.value))
        setTimeout(() => {
          chartTipsPoints.style('opacity', '1')
        }, this.chartRenderingTime)
      }

      // Render y-axis
      const yAxisLine = d3.axisRight(y)
        .tickValues([
          max,
          max - ((max - min) * 0.3333),
          max - ((max - min) * 0.3333) - ((max - min) * 0.3333),
          min
        ].concat(this.requiredTicks))
        .tickFormat((d) => `${i18n.c(d.toFixed(2))} ${this.defaultAsset}`)
        .tickSizeInner(width)
        .tickSizeOuter(0)
        .tickPadding(25)

      svg.append('g')
        .attr('class', `${className}__y-axis`)
        .call(yAxisLine)
        .selectAll('line')

      // Tip
      const tip = svg.append('g')
        .attr('class', `${className}__tip`)

      // Tip line
      const tipLine = tip.append('line')
        .attr('class', `${className}__tip-line`)
        .attr('x1', 0)
        .attr('y1', 10)
        .attr('x2', 0)
        .attr('y2', 0)

      // Tip circle
      const tipCircle = tip.append('circle')
        .attr('class', `${className}__tip-circle`)
        .attr('cx', 0)
        .attr('r', 5)

      // Tip text box
      const tipTextBox = tip.append('g')

      tipTextBox.append('polygon')
        .attr('points', '0,0 11.5,7 11.5,7 21,0') // width 21, height 7
        .style('fill', 'white')
        .attr('transform', 'translate(-11.5, 17)')

      tipTextBox.append('rect')
        .attr('class', `${className}__tip-text-box`)
        .attr('width', 150)
        .attr('height', 55)
        .attr('transform', 'translate(-75, -38)')
        .attr('rx', 3)
        .attr('ry', 30)

      const tipPriceText = tipTextBox.append('text')
        .attr('class', `${className}__tip-text-price`)
        .attr('text-anchor', 'middle')
        .attr('y', -15)

      const tipPriceChangeText = tipTextBox.append('text')
        .attr('class', `${className}__tip-text-price-change`)
        .attr('text-anchor', 'middle')
        .attr('y', 5)

      const tipTimeTextDD = tip.append('text')
        .attr('class', `${className}__tip-text-time-dd`)
        .attr('text-anchor', 'middle')
        .attr('y', height + margin.bottom - 5)

      const tipTimeTextMM = tip.append('text')
        .attr('class', `${className}__tip-text-time-mm`)
        .attr('text-anchor', 'middle')
        .attr('y', height + margin.bottom + 8)

      // Tip motion capture area
      const motionCaptureArea = svg.append('rect')
        .attr('class', `${className}__tip-motion-capture-area`)
        .attr('width', width)
        .attr('height', height - 25)
        .attr('transform', 'translate(0, 25)')

      // Tip Mouse events
      for (const event of ['mouseenter', 'touchenter']) {
        motionCaptureArea.on(event, function () {
          tip.classed(`${className}__tip--show`, true)
        })
      }

      for (const event of ['mousemove', 'touchmove']) {
        motionCaptureArea.on(event, () => {
          tip.classed(`${className}__tip--hidden`, false)
          const x0 = x.invert(d3.mouse(svg.node())[0])
          const bisectDate = d3.bisector(d => d.time).left
          const bisectIndex = bisectDate(data, x0, 1)
          const d0 = data[bisectIndex - 1]
          const d1 = data[bisectIndex]
          const nearestPoint = x0 - d0.time > d1.time - x0 ? d1 : d0
          // Change text of the tooltip
          tipPriceText.text(`${i18n.c(nearestPoint.value)} ${this.defaultAsset}`)

          switch (this.scale) {
            case 'year': {
              tipTimeTextDD.text(moment(nearestPoint.time).format('DD MMM'))
              tipTimeTextMM.text(moment(nearestPoint.time).format('YYYY'))
              break
            }
            case 'month': {
              tipTimeTextDD.text(moment(nearestPoint.time).format('DD'))
              tipTimeTextMM.text(moment(nearestPoint.time).format('MMM'))
              break
            }
            case 'day': {
              tipTimeTextDD.text(moment(nearestPoint.time).format('h:mm a'))
              tipTimeTextMM.text(moment(nearestPoint.time).format('DD MMM'))
              break
            }
            case 'hour': {
              tipTimeTextDD.text(moment(nearestPoint.time).format('h:mm a'))
              tipTimeTextMM.text(moment(nearestPoint.time).format('DD MMM'))
              break
            }
            default: {
              tipTimeTextDD.text(moment(nearestPoint.time).format('DD'))
              tipTimeTextMM.text(moment(nearestPoint.time).format('MMM'))
              break
            }
          }

          function getPrecision (number) {
            return number.toString().split('.')[0].length + 1
          }

          if (data[data.indexOf(nearestPoint) - 1]) {
            const prevValue = data[data.indexOf(nearestPoint) - 1].value
            const currentValue = nearestPoint.value

            if (prevValue > currentValue) {
              const val = ((prevValue - currentValue) / currentValue) * 100
              tipPriceChangeText.text(`-${val.toPrecision(getPrecision(val))}%`)
            } else if (prevValue < currentValue) {
              const val = ((currentValue - prevValue) / currentValue) * 100
              tipPriceChangeText.text(`+${val.toPrecision(getPrecision(val))}%`)
            } else {
              tipPriceChangeText.text('+0%')
            }
          } else {
            tipPriceChangeText.text('+0%')
          }

          // Change X position of the tip
          tip.attr('transform', `translate(${x(nearestPoint.time)})`)
          tipTextBox.style('transform', `translateY(${y(nearestPoint.value) - 35}px)`)
          if (min === max) {
            tipLine.attr('y1', height / 2)
            tipLine.attr('y2', height)
          } else {
            tipLine.attr('y1', y(nearestPoint.value))
            tipLine.attr('y2', height - 10)
          }

          // Change Y position of the circle
          tipCircle.attr('cy', y(nearestPoint.value))
        })
      }

      for (const event of ['mouseout', 'touchout']) {
        motionCaptureArea.on(event, function () {
          tip.classed(`${className}__tip--show`, false)
        })
      }

      tip.classed(`${className}__tip--hidden`, true)
    }
  }
}
</script>

<style lang="scss">
  @import "~L@scss/variables";
  @import "~L@scss/mixins";

  .chart-root {
    position: relative;
  }

  .chart-root__wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: $col-chart-message-wrapper;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-root__wrapper-message {
    background-color: $col-chart-message-background;
    padding: 16px 28px;
    min-width: 20rem;
    color: $col-chart-message-text;
    text-align: center;
    box-shadow: 0 0 14px 1px $col-chart-message-background;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .chart-root__chart,
  .chart-root__chart svg {
    transition: .2s;

    @media (min-width: 767px) {
      min-height: 200px;
    }
  }

  svg.chart {
    display: block;
    overflow: visible;

    * { font-family: inherit; }
    & > g { overflow: hidden; }
  }

  .chart__area {
    fill: $col-chart-fill;
    opacity: 0;
  }

  .chart__line {
    fill: none;
    stroke-width: 2px;
    stroke: $col-chart-line;
    stroke-linecap: round;
  }

  .chart__x-axis {
    text {
      font-size: 1rem;
      fill: $col-chart-text;
    }
    .domain { display: none; }
  }

  .chart__y-axis {
    text {
      font-size: 1rem;
      fill: $col-chart-text;
    }
    line {
      stroke-dasharray: 3 3;
      stroke: $col-chart-ticks;
      opacity: .15;
    }
    .domain { display: none; }
  }

  .chart__tip {
    transition: opacity .2s;
    opacity: 0;
    &--show { opacity: 1; }
    &--hidden { opacity: 0!important; }
  }
  .chart__tip-line {
    stroke-width: 1px;
    stroke: $col-chart-tip-line-inactive;
  }

  .chart__tip-circle {
    stroke-width: 5px;
    stroke: $col-chart-tip-circle-border;
    fill: $col-chart-tip-circle;
  }

  .chart__tip-text-box { fill: $col-chart-tip-text-box }
  .chart__tip-text-price {
    font-size: 1rem;
    fill: $col-chart-tip-text-price;
    font-weight: 800;
  }

  .chart__tip-text-price-change {
    fill: $col-chart-tip-text-price;
    font-weight: 400;
  }

  .chart__tip-text-time-dd {
    font-size: 18px;
    fill: $col-chart-tip-date-dd;
  }

  .chart__tip-text-time-mm {
    font-size: 12px;
    fill: $col-chart-tip-date-mm;
  }

  .chart__tip-motion-capture-area { opacity: 0 }
</style>
