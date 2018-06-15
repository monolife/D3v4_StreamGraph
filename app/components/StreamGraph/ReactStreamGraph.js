  

'use strict';

import React, {Component} from 'react';

import * as d3 from 'd3v4';

// import {List} from 'immutable';

//UX
import './StreamGraph.scss';

// Inspired by Lee Byron’s test data generator.
function bumps(n, m) {
  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < m; ++i) bump(a, n);
      return a;
}   

function bump(a, n) {
  var x = 1 / (0.1 + Math.random()),
  y = 2 * Math.random() - 0.5,
  z = 10 / (0.1 + Math.random());
  for (var i = 0; i < n; i++) {
    var w = (i / n - y) * z;
    a[i] += x * Math.exp(-w * w);
  }
}

function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  // context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

class ReactStreamGraph extends Component {

  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart()
  }
  componentDidUpdate() {
    this.createChart()
  }

  createChart(){
    var margin = {top: 0, right: 2, bottom: 30, left: 40};
    const width= this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const node = this.node;
    var n = 3, // number of layers
    m = 200, // number of samples per layer
    k = 10; // number of bumps per layer

    var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetSilhouette),
    layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers = layers0;

    var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

    var svg = d3.select(node)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(d3.zoom().on("zoom", function () {
                  var t = d3.event.transform;
                  x.domain(t.rescaleX(x2).domain());  
                  svg.attr("transform", t)
                }))
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleLinear()
              .domain([0, m - 1])
              .range([0, width]);
    var x2 = d3.scaleLinear()
              .domain([0, m - 1])
              .range([0, width]);
    var xAxis = d3.axisBottom(x);

    var y = d3.scaleLinear()
              .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
              .range([height, 0]);
    var yPan = 0;
    var yMin = (-height / 2);
    var yMax = (height / 2);
    var yAxis = d3.axisLeft(y)

    var z = d3.interpolateCool;

    var area = d3.area()
    .x(function(d, i) { return x(i); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });
      
      console.log(layers0);
    svg.selectAll("path")
    .data(layers0)
    .enter().append("path")
    .attr("d", area)
    .attr("fill", function() { return z(Math.random()); });

    svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append('g')
      .attr("class", 'axis axis--y')
      .call(yAxis);
  }

  render() {
    return ( 
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}>
      </svg>
      );
  }
}

export default ReactStreamGraph;

