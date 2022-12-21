<template>
  <div class="chart-renderer">
    <div
      v-if="isLoading"
      class="chart-renderer__wrapper">
      <div class="chart-renderer__wrapper-message">
        {{ 'chart.fetching-the-price-history' | globalize }}
      </div>
    </div>
    <div
      v-else-if="!hasValue"
      class="chart-renderer__wrapper">
      <div class="chart-renderer__wrapper-message">
        {{ 'chart.no-price-history-of-selected-asset' | globalize }}
      </div>
    </div>
    <div
      class="chart-renderer__chart"
      ref="chart" />
  </div>
</template>

<script>
import { formatMoney } from '@/js/helpers/money-helper'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import * as d3Array from 'd3-array'
import * as d3Selection from 'd3-selection'
import * as d3Scale from 'd3-scale'
import * as d3Axis from 'd3-axis'
import * as d3Shape from 'd3-shape'
import * as d3Transition from 'd3-transition'
import * as d3Ease from 'd3-ease'
import * as d3Format from 'd3-format'
// import * as d3 from 'd3'
import moment from 'moment'
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
const CLASS_NAME = 'chart'
export default {
  name: 'chart-renderer',
  props: {
    data: { type: Array, default: () => [] },
    currency: { type: String, default: '' },
    scale: { type: String, default: 'day' },
    requiredTicks: { type: Array, default: () => [] },
    precision: { type: Number, default: 0 },
    hasValue: { type: Boolean, default: true },
    isLoading: { type: Boolean, default: false },
    isTicksShown: { type: Boolean, default: true },
  },
  data () {
    return {
      chartRenderingTime: 500,
      margin: '',
      width: '',
      height: '',
      svg: '',
      y: '',
      x: '',
      yAxisLine: '',
      isFirstRender: true,
      isAnimating: false,
    }
  },
  computed: {
    ...mapGetters({
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
    normalizedData () {
      return this.data.map(item => ({
        time: moment(item.timestamp).toDate(),
        value: parseFloat(parseFloat(item.value).toFixed(this.precision)),
      }))
    },
    defaultAsset () {
      return this.currency || this.defaultQuoteAsset
    },
  },
  watch: {
    data (data) {
      this.isFirstRender ? this.init() : this.update()
    },
  },
  mounted (...args) {
    this.isFirstRender ? this.init() : this.update()
    window.addEventListener('resize', this.init)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.init)
  },
  methods: {
    formatMoney,
    clear () {
      d3.select(this.$refs.chart).select('svg').remove()
    },
    getDimensions () {
      const parentElement = this.$el.parentElement
      return {
        width: parentElement.clientWidth,
        height: parentElement.clientHeight < 250
          ? 250
          : parentElement.clientHeight,
      }
    },
    getMaxAndMin (data) {
      const arr = data.map(item => item.value)
      let max = Math.max(...arr)
      let min = Math.min(...arr)

      if (max === min) {
        max *= 1.1
        min *= 0.9
      }

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
    formatMoneyCustom (amount) {
      const curSym = ({ 'BTC': 'BTC' })[this.currency]
      const moneyFormats = {
        'en': (curSym, amount) => `${curSym}${amount}`,
      }
      return moneyFormats['en'](curSym, amount.toFixed(this.precision))
    },
    init () {
      this.isFirstRender = true
      this.clear()
      const data = this.normalizedData
      let { max } = this.getMaxAndMin(data)
      if (!data[0] || !data[data.length - 1]) return
      const yAxisTickWidth = this.isTicksShown
        ? this.formatMoneyCustom(max).length * 9 - 5
        : 0
      this.margin = { top: 2, left: yAxisTickWidth, bottom: 32, right: 0 }
      const dimensions = this.getDimensions(this.$el)
      this.width = dimensions.width // - margin.right - margin.left
      this.height = dimensions.height - this.margin.top - this.margin.bottom
      const viewWidth = this.width + this.margin.left
      const viewHeight = this.height + this.margin.top + this.margin.bottom
      this.svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', '100%')
        .attr('viewBox', `0 0 ${viewWidth} ${viewHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr('class', CLASS_NAME)
        .append('g')
      if (!this.hasValue) {
        if (this.isTicksShown) {
          const y = d3.scaleLinear()
            .range([this.height, 0])
            .domain([0, 12])
          this.yAxisLine = d3.axisRight(y)
            .tickValues([0, 5, 10])
            .tickFormat((d) => `${formatMoney({ value: d })} ${this.defaultAsset}`)
            .tickSizeInner(this.width)
            .tickSizeOuter(0)
            .tickPadding(25)
          this.svg.append('g')
            .attr('class', `${CLASS_NAME}__y-axis`)
            .call(this.yAxisLine)
            .selectAll('line')
        }
        return
      }
      this.y = d3.scaleLinear().range([this.height, 0])
      this.x = d3.scaleTime().range([0, this.width])
      // init y-axis
      this.svg.append('g')
        .attr('class', `${CLASS_NAME}__y-axis`)
      this.update()
    },
    update () {
      this.isAnimating = true
      const chartSvg = d3.select(`svg.${CLASS_NAME}`)
      chartSvg.classed(`${CLASS_NAME}--overflow-hidden`, true)
      const data = this.normalizedData
      let { max, min } = this.getMaxAndMin(data)
      const firstDate = data[0].time
      const lastDate = data[data.length - 1].time
      // Define domains
      this.y.domain(this.addDomainPadding([min, max]))
      this.x.domain([firstDate, lastDate])
      // Render the line and area
      const area = d3.area()
        .x((d) => this.x(d.time))
        .y0(this.y(min))
        .y1((d) => this.y(d.value))
      const line = d3.line()
        .x((d) => this.x(d.time))
        .y((d) => this.y(d.value))

      if (this.isFirstRender) {
        // Render line
        const path = this.svg.append('path')
          .attr('class', `${CLASS_NAME}__line`)
          .attr('d', line(data))

        const totalLength = path.node().getTotalLength()
        path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(this.chartRenderingTime)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
      } else {
        // Update the line
        let path = this.svg.selectAll(`.${CLASS_NAME}__line`)
          .attr('stroke-dasharray', null)
          .attr('stroke-dashoffset', null)
          .attr('stroke-dashoffset', null)
          .data([data])
        path = path
          .enter()
          .append('path')
          .attr('class', `${CLASS_NAME}__line`)
          .merge(path)
        path.transition()
          .duration(this.chartRenderingTime)
          .attr('d', line)
      }
      let defs = this.svg.append('defs')
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
        if (this.isFirstRender) {
          const chartAreaWithGradient = this.svg
            .append('path')
            .attr('class', `${CLASS_NAME}__linear-gradient`)
            .datum(data)
            .attr('fill', 'url(#area-gradient)')
            .attr('d', area)
            .style('opacity', '0')
            .style('transition', '0.3s ease-out')
          setTimeout(() => {
            chartAreaWithGradient.style('opacity', '1')
          }, this.chartRenderingTime)
        } else {
          let chartAreaWithGradient = this.svg.selectAll(`.${CLASS_NAME}__linear-gradient`)
            .datum(data)
            .style('transition', null)
          chartAreaWithGradient = chartAreaWithGradient
            .enter()
            .append('path')
            .attr('class', `${CLASS_NAME}__linear-gradient`)
            .merge(chartAreaWithGradient)
          chartAreaWithGradient.transition()
            .duration(this.chartRenderingTime)
            .attr('d', area)
        }
      }
      // Render x-axis
      if (this.isTicksShown) {
        const yAxisLine = d3.axisRight(this.y)
          .ticks(4)
          .tickFormat((d) => `${formatMoney({ value: d.toFixed(2) })} ${this.defaultAsset}`)
          .tickSizeInner(this.width)
          .tickSizeOuter(0)
          .tickPadding(25)
        this.svg.selectAll(`.${CLASS_NAME}__y-axis`)
          .transition()
          .duration(this.chartRenderingTime)
          .call(yAxisLine)

        const isZeroAxisRendered = min < 0 && max > 0

        if (isZeroAxisRendered) {
          const yAxisLineZero = d3.axisRight(this.y)
            .tickValues([0])
            .tickFormat((d) => `${d} ${this.defaultAsset}`)
            .tickSizeInner(this.width)
            .tickSizeOuter(0)
            .tickPadding(25)
          this.svg.append('g')
            .attr('class', `${CLASS_NAME}__y-axis-zero`)
            .call(yAxisLineZero)
        }
      }
      // Tip
      const tip = this.svg.append('g')
        .attr('class', `${CLASS_NAME}__tip`)
      // Tip line
      const tipLine = tip.append('line')
        .attr('class', `${CLASS_NAME}__tip-line`)
        .attr('x1', 0)
        .attr('y1', 10)
        .attr('x2', 0)
        .attr('y2', 0)
      // Tip circle
      const tipCircle = tip.append('circle')
        .attr('class', `${CLASS_NAME}__tip-circle`)
        .attr('cx', 0)
        .attr('r', 5)
      // Tip text box
      const tipTextBox = tip.append('g')
      tipTextBox.append('polygon')
        .attr('points', '0,0 11.5,7 11.5,7 21,0') // width 21, height 7
        .style('fill', 'white')
        .attr('transform', 'translate(-11.5, 17)')
      tipTextBox.append('rect')
        .attr('class', `${CLASS_NAME}__tip-text-box`)
        .attr('width', 150)
        .attr('height', 55)
        .attr('transform', 'translate(-75, -38)')
        .attr('rx', 3)
        .attr('ry', 30)
      const tipPriceText = tipTextBox.append('text')
        .attr('class', `${CLASS_NAME}__tip-text-price`)
        .attr('text-anchor', 'middle')
        .attr('y', -15)
      const tipPriceChangeText = tipTextBox.append('text')
        .attr('class', `${CLASS_NAME}__tip-text-price-change`)
        .attr('text-anchor', 'middle')
        .attr('y', 5)
      const tipTimeTextDD = tip.append('text')
        .attr('class', `${CLASS_NAME}__tip-text-time-dd`)
        .attr('text-anchor', 'middle')
        .attr('y', this.height + this.margin.bottom - 5)
      const tipTimeTextMM = tip.append('text')
        .attr('class', `${CLASS_NAME}__tip-text-time-mm`)
        .attr('text-anchor', 'middle')
        .attr('y', this.height + this.margin.bottom + 8)
      // Tip motion capture area
      const motionCaptureArea = this.svg.append('rect')
        .attr('class', `${CLASS_NAME}__tip-motion-capture-area`)
        .attr('width', this.width)
        .attr('height', this.height - 25)
        .attr('transform', 'translate(0, 25)')
      // Tip Mouse events
      for (const event of ['mouseenter', 'touchenter']) {
        motionCaptureArea.on(event, function () {
          tip.classed(`${CLASS_NAME}__tip--show`, true)
        })
      }
      for (const event of ['mousemove', 'touchmove']) {
        motionCaptureArea.on(event, () => {
          if (!this.isAnimating) {
            tip.classed(`${CLASS_NAME}__tip--hidden`, false)
          }
          const x0 = this.x.invert(d3.mouse(this.svg.node())[0])
          const bisectDate = d3.bisector(d => d.time).left
          const bisectIndex = bisectDate(data, x0, 1)
          const d0 = data[bisectIndex - 1]
          const d1 = data[bisectIndex]
          const nearestPoint = x0 - d0.time > d1.time - x0 ? d1 : d0
          // Change text of the tooltip
          tipPriceText.text(`${formatMoney(nearestPoint.value)} ${this.defaultAsset}`)
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
          if (data[data.indexOf(nearestPoint) - 1]) {
            const prevValue = data[data.indexOf(nearestPoint) - 1].value
            const currentValue = nearestPoint.value
            if (prevValue === 0) {
              if (prevValue < currentValue) {
                tipPriceChangeText.text('+100%')
              } else {
                tipPriceChangeText.text('+0%')
              }
            } else if (prevValue > currentValue) {
              const val = ((prevValue - currentValue) /
                Math.abs(prevValue)) * 100
              tipPriceChangeText.text(`-${d3Format.format('.2~s')(val)}%`)
            } else if (prevValue < currentValue) {
              const val = ((currentValue - prevValue) /
                Math.abs(prevValue)) * 100
              tipPriceChangeText.text(`+${d3Format.format('.2~s')(val)}%`)
            } else {
              tipPriceChangeText.text('+0%')
            }
          } else {
            tipPriceChangeText.text('+0%')
          }
          // Change X position of the tip
          tip.attr('transform', `translate(${this.x(nearestPoint.time)})`)
          tipTextBox.style('transform', `translateY(${this.y(nearestPoint.value) - 35}px)`)
          if (min === max) {
            tipLine.attr('y1', this.height / 2)
            tipLine.attr('y2', this.height)
          } else {
            tipLine.attr('y1', this.y(nearestPoint.value))
            tipLine.attr('y2', this.height - 10)
          }
          // Change Y position of the circle
          tipCircle.attr('cy', this.y(nearestPoint.value))
        })
      }
      for (const event of ['mouseout', 'touchout']) {
        motionCaptureArea.on(event, function () {
          tip.classed(`${CLASS_NAME}__tip--show`, false)
        })
      }
      tip.classed(`${CLASS_NAME}__tip--hidden`, true)
      this.isFirstRender = false
      setTimeout(() => {
        this.isAnimating = false
        chartSvg.classed(`${CLASS_NAME}--overflow-hidden`, false)
      }, this.chartRenderingTime)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.chart-renderer {
  position: relative;
}

.chart-renderer__wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: $col-chart-message-wrapper;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-renderer__wrapper-message {
  background-color: $col-chart-message-background;
  padding: 1.6rem 2.8rem;
  min-width: 20rem;
  color: $col-chart-message-text;
  text-align: center;
  box-shadow: 0 0 1.4rem 0.1rem $col-chart-message-background;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-renderer__chart,
.chart-renderer__chart svg {
  transition: 0.2s;

  @media (min-width: 76.7rem) {
    min-height: 20rem;
  }
}

svg.chart {
  display: block;
  overflow: visible;
  &--overflow-hidden { overflow: hidden; }
}

svg.chart * { font-family: inherit; }
svg.chart > g { overflow: hidden; }

.chart__area {
  fill: $col-chart-fill;
  opacity: 0;
}

.chart__line {
  fill: none;
  stroke-width: 0.1rem;
  stroke: $col-chart-line;
  stroke-linecap: round;
}

.chart__x-axis text {
  font-size: 1rem;
  fill: $col-chart-text;
}
.chart__x-axis .domain { display: none; }

.chart__y-axis text,
.chart__y-axis-zero text {
  font-size: 1.6rem;
  fill: $col-chart-text;
}

.chart__y-axis line,
.chart__y-axis-zero line {
  stroke-dasharray: 3 3;
  stroke: $col-chart-ticks;
  opacity: 0.55;
}

.chart__y-axis .domain,
.chart__y-axis-zero .domain {
  display: none;
}

.chart__y-axis-zero line {
  opacity: 1;
}

.chart__tip {
  transition: opacity 0.2s;
  opacity: 0;
  &--show { opacity: 1; }
  // stylelint-disable-next-line
  &--hidden { opacity: 0 !important; }
}

.chart__tip-line {
  stroke-width: 0.1rem;
  stroke: $col-chart-tip-line-inactive;
}

.chart__tip-circle {
  stroke-width: 0.5rem;
  stroke: $col-chart-tip-circle-border;
  fill: $col-chart-tip-circle;
}

.chart__tip-text-box { fill: $col-chart-tip-text-box; }

.chart__tip-text-price {
  font-size: 1.6rem;
  fill: $col-chart-tip-text-price;
  font-weight: 800;
}

.chart__tip-text-price-change {
  fill: $col-chart-tip-text-price;
  font-weight: 400;
}

.chart__tip-text-time-dd {
  font-size: 1.8rem;
  fill: $col-chart-tip-date-dd;
}

.chart__tip-text-time-mm {
  font-size: 1.2rem;
  fill: $col-chart-tip-date-mm;
}

.chart__tip-motion-capture-area { opacity: 0; }
</style>
