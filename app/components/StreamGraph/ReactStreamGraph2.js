  

'use strict';

import React, {Component} from 'react';

import * as d3 from 'd3v4';

// import {List} from 'immutable';

//UX
import './StreamGraph.scss';

// Inspired by Lee Byron’s test data generator.
function bumps(n, m) {
  let a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < m; ++i) bump(a, n);
      return a;
}   

function bump(a, n) {
  let x = 1 / (0.1 + Math.random()),
  y = 2 * Math.random() - 0.5,
  z = 10 / (0.1 + Math.random());
  for (let i = 0; i < n; i++) {
    let w = (i / n - y) * z;
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
  let t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  // context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

class ReactStreamGraph2 extends Component {

  constructor(props) {
    super(props);
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart(this.props.dataPath)
  }
  componentDidUpdate() {
    this.createChart(this.props.dataPath)
  }

  createChart(dataPath){

    //Color range
    let colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
    let strokecolor = colorrange[0];
    let mousex = null;
    let datearray = [];

    let parser = d3.timeParse("%m/%d/%y");

    //SVG measurments
    let margin = {top: 0, right: 40, bottom: 30, left: 40};
    const width= this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const node = this.node;

    var tooltip = d3.select(node)
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");

    let x = d3.scaleTime()
        .range([0, width]);
    let xAxis = d3.axisBottom(x)
        .ticks(d3.timeWeek);

    let y = d3.scaleLinear()
        .range([height, 0]);
    let yAxis = d3.axisLeft(y);
    let yAxisr = d3.axisRight(y);

    let z = d3.scaleOrdinal()
        .range(colorrange);

    let nester = d3.nest()
                .key(function(d) { return d.key; });

    let area = d3.area()
                // .curve(d3.curveCardinal)
                .x(function(d) { return x(d.data.date); })
                .y0(function(d) { return y(d[0]); })
                .y1(function(d) { return y(d[1]); });

    //Base SVG of chart
    let svg = d3.select(node).append("svg")
                .attr("class", "graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                // .call(d3.zoom().on("zoom", function () {
                //    svg.attr("transform", d3.event.transform)
                //   }))
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Where the magic happens
    let graph = d3.csv(dataPath, (err, data)=>{
      if (err) throw error;

      let headers = d3.keys(data[0]).filter(key => key != 'date');

      data.forEach(function(d) {
        d.date = parser(d.date);
        d.AR = +d.AR;
        d.DJ = +d.DJ;
        d.MS = +d.MS;
      });

      let stack = d3.stack()
        .keys( headers)
        .offset(d3.stackOffsetSilhouette);
        // .order(d3.stackOrderNone);
      let layers = stack(data);

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);

      svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
          .attr("d", area)
          .style("fill", function(d, i) { return z(i); });

      //Draw Axes
      svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      svg.append('g')
        .attr("class", 'axis axis--y')
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxisr);
      svg.append('g')
        .attr("class", 'axis axis--y')
        .call(yAxis);

      //Rollover effects
      svg.selectAll(".layer")
      .attr("opacity", 1)
      .on("mouseover", function(d, i) {
        svg.selectAll(".layer").transition()
        .duration(250)
        .attr("opacity", function(d, j) {
          return j != i ? 0.6 : 1;
        })})
      .on("mousemove", function(d, i) {
        mousex = d3.mouse(this);
        mousex = mousex[0];
        let invertedx = x.invert(mousex);
        invertedx = invertedx.getMonth() + invertedx.getDate();
        let selected = (d);//.values);
        for (let k = 0; k < selected.length; k++) {
          datearray[k] = selected[k].data.date
          datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
        }

        let mousedate = datearray.indexOf(invertedx);
        let step =d[mousedate];
        let pro = step.data[d.key];

        d3.select(this)
        .classed("hover", true)
        .attr("stroke", strokecolor)
        .attr("stroke-width", "0.5px"); 
        tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
        console.log(d.key + " " + pro);
      })
      .on("mouseout", function(d, i) {
       svg.selectAll(".layer")
       .transition()
       .duration(250)
       .attr("opacity", "1");
       d3.select(this)
       .classed("hover", false)
       .attr("stroke-width", "0px");
       tooltip.html( "<p>" + d.key + "<br>" + 0 + "</p>" ).style("visibility", "hidden");
      });

    });/* End: Graph funciton */

      //Vertical orientation line
    let boundingRect = node.getBoundingClientRect();
    let vertical = d3.select(node)
                      .append("div")
                      .attr("class", "line")
                      .style("position", "absolute")
                      .style("z-index", "19")
                      .style("width", "1px")
                      .style("height", margin.bottom+height+"px")
                      .style("top", boundingRect.y+"px")
                      .style("bottom", "30px")
                      .style("left", "0px")
                      .style("background", "#f00");
    d3.select(node)
      .on("mousemove", function(){  
        mousex = d3.mouse(this);
        mousex = mousex[0];
        vertical.style("left", mousex + "px" );
      })
      .on("mouseover", function(){  
        mousex = d3.mouse(this);
        mousex = mousex[0];
        vertical.style("left", mousex + "px");
      });

  }

  render() {
    return ( 
      <div ref={node => this.node = node}  >
      </div>
      );
  }
}

export default ReactStreamGraph2;

