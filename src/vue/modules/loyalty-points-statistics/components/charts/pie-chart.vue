<template>
  <div
    class="pie-chart"
    ref="chart"
    :id="id"
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

export default {
  name: 'pie-chart',

  props: {
    cornerRadius: { type: Number, default: 5 },
    padAngle: { type: Number, default: 0.1 },
    data: { type: Array, default: _ => [] },
    id: { type: String, required: true },
  },

  data: _ => ({
    svg: {},
    width: 0,
    height: 0,
  }),

  computed: {
    color () {
      return d3.scaleOrdinal().range(['#33a494', '#ef5350', '#7b6eff'])
    },

    floatFormat () {
      return d3.format('.4r')
    },

    percentFormat () {
      return d3.format(',.2%')
    },

    radius () {
      return Math.min(this.width, this.height) / 2
    },

    totalValue () {
      return this.data.reduce((sum, item) => sum + Number(item.value), 0)
    },

    innerArc () {
      return d3.arc()
        .outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4)
        .cornerRadius(this.cornerRadius)
        .padAngle(this.padAngle)
    },

    outerArc () {
      return d3.arc()
        .outerRadius(this.radius * 0.9)
        .innerRadius(this.radius * 0.9)
    },
  },

  mounted () {
    this.setDimensions()
    this.render()
  },

  methods: {
    setDimensions () {
      this.width = this.$el.parentElement.clientWidth - 1
      this.height = this.width / 2
    },

    render () {
      d3.select(this.$refs.chart)
        .call(this.chartRenderer)
    },

    chartRenderer (selection) {
      const pie = d3.pie()
        .value(item => this.floatFormat(item.value))

      this.svg = selection.append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .append('g')
        .attr('transform', `translate(${this.width / 2},${this.height / 2})`)

      this.renderPieParts(pie)
    },

    renderPieParts (pie) {
      this.renderSlices(pie)
      this.renderLabel(pie)
      this.renderLines(pie)

      d3.selectAll('.pie-chart__label text, .pie-chart__slices path')
        .call(this.renderToolTip)
    },

    renderSlices (pie) {
      this.svg.append('g').attr('class', 'pie-chart__slices')

      this.svg.select('.pie-chart__slices')
        .datum(this.data)
        .selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('fill', item => this.color(item.data.label))
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
        .attr('dy', '.35em')
        .html(item => `${item.data.label}: <tspan>${item.data.value}</tspan>`)
        .attr('transform', item => {
          let pos = this.outerArc.centroid(item)

          pos[0] = this.radius * 0.9 * this.getMidAngleDirectionSign(item)
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
          let pos = this.outerArc.centroid(item)
          pos[0] = 0.85 * this.radius * this.getMidAngleDirectionSign(item)

          return [
            this.innerArc.centroid(item),
            this.outerArc.centroid(item),
            pos,
          ]
        })
    },

    renderToolTip (selection) {
      selection.on('mouseenter', item => {
        this.svg.append('text')
          .attr('class', 'pie-chart__tool-circle')
          .attr('dy', 10)
          .html(this.percentFormat(item.data.value / this.totalValue))
          .style('font-size', '2.4rem')
          .style('text-anchor', 'middle')

        this.svg.append('circle')
          .attr('class', 'pie-chart__tool-circle')
          .attr('r', this.radius * 0.35)
          .style('fill', this.color(item.data.label))
          .style('fill-opacity', 0.35)
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
.pie-chart {
  svg {
    -webkit-filter: drop-shadow(0rem 0.3rem 0.3rem rgba(0, 0, 0, 0.3));
    filter: drop-shadow(0rem 0.3rem 0.3rem rgba(0, 0, 0, 0.25));
  }

  &__lines polyline {
    opacity: 0.3;
    stroke: black;
    stroke-width: 0.2rem;
    fill: none;
  }

  &__label {
    font-size: 1.6rem;
    font-style: italic;

    tspan {
      font-style: normal;
      font-weight: bold;
    }
  }
}
</style>
