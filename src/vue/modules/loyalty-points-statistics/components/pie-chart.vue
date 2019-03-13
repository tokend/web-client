<template>
  <div
    class="pie-chart"
    ref="chart"
    :id="id"
  />
</template>

<script>
import * as d3 from 'd3'

import species from './species'

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
      return d3.scaleOrdinal().range(['green', 'red', 'blue'])
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
      return this.data.reduce((sum, item) => sum + item.value, 0)
    },
  },

  mounted () {
    this.width = this.$el.parentElement.clientWidth - 1
    this.height = this.width / 2
    this.render()
  },

  methods: {
    render () {
      this.data = species
      d3.select(this.$refs.chart)
        .datum(this.data)
        .call(this.chartRenderer)
    },

    chartRenderer (selection) {
      selection.each(data => {
        this.buildPieChart(data, selection)
      })
    },

    buildPieChart (data, selection) {
      const pie = d3.pie()
        .value(d => this.floatFormat(d.value))
        .sort(null)

      const arc = d3.arc()
        .outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4)
        .cornerRadius(this.cornerRadius)
        .padAngle(this.padAngle)

      const outerArc = d3.arc()
        .outerRadius(this.radius * 0.9)
        .innerRadius(this.radius * 0.9)

      this.svg = selection.append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .append('g')
        .attr('transform', `translate(${this.width / 2},${this.height / 2})`)

      this.svg.append('g').attr('class', 'slices')
      this.svg.append('g').attr('class', 'labelName')
      this.svg.append('g').attr('class', 'lines')

      this.renderSlices(data, pie, arc)
      this.renderLabel(pie, outerArc)
      this.renderLines(pie, arc, outerArc)

      d3.selectAll('.labelName text, .slices path').call(this.renderToolTip)
    },

    renderSlices (data, pie, arc) {
      this.svg.select('.slices')
        .datum(data).selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('fill', d => this.color(d.data.label))
        .attr('d', arc)
    },

    renderLabel (pie, outerArc) {
      this.svg.select('.labelName').selectAll('text')
        .data(pie)
        .enter().append('text')
        .attr('dy', '.35em')
        .html((d) => d.data.label + ': <tspan>' + d.data.value + '</tspan>')
        .attr('transform', d => {
          let pos = outerArc.centroid(d)

          pos[0] = this.radius * 0.85 * (this.midAngle(d) < Math.PI ? 1 : -1)
          return 'translate(' + pos + ')'
        })
        .style('text-anchor', d => (this.midAngle(d)) < Math.PI ? 'start' : 'end')
    },

    renderLines (pie, arc, outerArc) {
      this.svg.select('.lines')
        .selectAll('polyline')
        .data(pie)
        .enter().append('polyline')
        .attr('points', d => {
          let pos = outerArc.centroid(d)
          pos[0] = this.radius * 0.8 * (this.midAngle(d) < Math.PI ? 1 : -1)
          return [arc.centroid(d), outerArc.centroid(d), pos]
        })
    },

    midAngle (d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
    },

    renderToolTip (selection) {
      selection.on('mouseenter', data => {
        this.svg.append('text')
          .attr('class', 'toolCircle')
          .attr('dy', 10)
          .html(this.percentFormat(data.data.value / this.totalValue))
          .style('font-size', '2.4rem')
          .style('text-anchor', 'middle')

        this.svg.append('circle')
          .attr('class', 'toolCircle')
          .attr('r', this.radius * 0.35)
          .style('fill', this.color(data.data.label))
          .style('fill-opacity', 0.35)
      })

      selection.on('mouseout', () => d3.selectAll('.toolCircle').remove())
    },
  },
}
</script>

<style lang="scss">
svg {
  -webkit-filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.3) );
  filter: drop-shadow( 0px 3px 3px rgba(0,0,0,.25) );
}

polyline{
  opacity: .3;
  stroke: black;
  stroke-width: .2rem;
  fill: none;
}

.labelName tspan {
  font-style: normal;
  font-weight: bold;
}

.labelName {
  font-size: 1.6rem;
  font-style: italic;
}
</style>
