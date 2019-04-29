<template>
  <div
    class="pie-chart"
    ref="chart"
  />
</template>

<script>
import * as d3Selection from 'd3-selection'
import * as d3Scale from 'd3-scale'
import * as d3Shape from 'd3-shape'
import * as d3Format from 'd3-format'

const d3 = Object.assign(
  {},
  d3Selection,
  d3Shape,
  d3Scale,
  d3Format,
)

const SCALE_COEFF = 0.9

export default {
  name: 'pie-chart',

  props: {
    // sector rounding
    cornerRadius: { type: Number, default: 5 },
    // distance between sectors
    padAngle: { type: Number, default: 0.1 },
    // size of central hole
    innerRadius: { type: Number, default: 0.4 },
    // [{ label, value, color }]
    data: { type: Array, default: _ => [] },
  },

  data: _ => ({
    svg: {},
  }),

  computed: {
    dimensions () {
      const parentWidth = this.$el.parentElement.clientWidth - 1

      return {
        width: parentWidth,
        height: parentWidth / 2,
      }
    },

    floatFormat () {
      return d3.format('.4r')
    },

    percentFormat () {
      return d3.format(',.2%')
    },

    radius () {
      return Math.min(this.dimensions.width, this.dimensions.height) / 2
    },

    totalValue () {
      return this.data.reduce((sum, item) => sum + Number(item.value), 0)
    },

    innerArc () {
      return d3.arc()
        .outerRadius(this.radius * (SCALE_COEFF - 0.1))
        .innerRadius(this.radius * this.innerRadius)
        .cornerRadius(this.cornerRadius)
        .padAngle(this.padAngle)
    },

    outerArc () {
      return d3.arc()
        .outerRadius(this.radius * SCALE_COEFF)
        .innerRadius(this.radius * SCALE_COEFF)
    },
  },

  mounted () {
    this.render()
  },

  methods: {
    render () {
      d3.select(this.$refs.chart)
        .call(this.chartRenderer)
    },

    chartRenderer (selection) {
      const pie = d3.pie()
        .value(item => this.floatFormat(item.value))
      const { width, height } = this.dimensions

      this.svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)

      this.renderPieParts(pie)
    },

    renderPieParts (pie) {
      this.renderSlices(pie)
      this.renderLabel(pie)
      this.renderLines(pie)

      d3.select(this.$refs.chart)
        .selectAll('.pie-chart__label text, .pie-chart__slices path')
        .call(this.renderToolTip)
    },

    renderSlices (pie) {
      this.svg.append('g').attr('class', 'pie-chart__slices')

      this.svg.select('.pie-chart__slices')
        .datum(this.data)
        .selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('fill', item => item.data.color)
        .attr('d', this.innerArc)
    },

    renderLabel (pie) {
      this.svg.append('g').attr('class', 'pie-chart__label')

      this.svg.select('.pie-chart__label')
        .datum(this.data)
        .selectAll('text')
        .data(pie)
        .enter()
        .append('text')
        .attr('dy', '-0.25em')
        .html(item => `${item.data.label}<tspan x="0" dy="1.2em">${item.data.value}</tspan>`)
        .attr('transform', item => {
          const labelPosition = SCALE_COEFF * this.radius
          let pos = this.outerArc.centroid(item)

          pos[0] = labelPosition * this.getMidAngleDirectionSign(item)
          return `translate(${pos})`
        })
        .style('text-anchor', item => {
          return this.getMidAngleDirectionSign(item) > 0 ? 'start' : 'end'
        })
    },

    renderLines (pie) {
      this.svg.append('g').attr('class', 'pie-chart__lines')

      this.svg.select('.pie-chart__lines')
        .datum(this.data)
        .selectAll('polyline')
        .data(pie)
        .enter()
        .append('polyline')
        .attr('points', item => {
          const linePosition = (SCALE_COEFF - 0.025) * this.radius
          let pos = this.outerArc.centroid(item)

          pos[0] = linePosition * this.getMidAngleDirectionSign(item)

          return [
            this.innerArc.centroid(item),
            this.outerArc.centroid(item),
            pos,
          ]
        })
    },

    renderToolTip (selection) {
      const tipMarginTop = 10
      const tipFontSize = '2.4rem'
      const tipOpacity = 0.35

      selection.on('mouseenter', item => {
        this.svg.append('text')
          .attr('class', 'pie-chart__tool-circle')
          .attr('dy', tipMarginTop)
          .html(this.percentFormat(item.data.value / this.totalValue))
          .style('font-size', tipFontSize)
          .style('text-anchor', 'middle')

        this.svg.append('circle')
          .attr('class', 'pie-chart__tool-circle')
          .attr('r', this.radius * this.innerRadius * SCALE_COEFF)
          .style('fill', item.data.color)
          .style('fill-opacity', tipOpacity)
      })

      selection.on('mouseout', () => {
        d3.selectAll('.pie-chart__tool-circle').remove()
      })
    },

    getMidAngleDirectionSign (item) {
      const midAngle = item.startAngle + (item.endAngle - item.startAngle) / 2
      return midAngle < Math.PI ? 1 : -1
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.pie-chart {
  svg {
    filter: drop-shadow(0 0.3rem 0.3rem $col-pie-chart-shadow);
  }

  .pie-chart__lines polyline {
    stroke-width: 0.2rem;
    stroke: $col-pie-chart-stroke;
    fill: none;
  }

  .pie-chart__label {
    font-size: 1.6rem;
    fill: $col-pie-chart-text;

    tspan {
      font-weight: 700;
    }
  }
}
</style>
