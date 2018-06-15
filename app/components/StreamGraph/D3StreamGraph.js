
import * as d3 from 'd3';

// chart("data.csv", "orange");

let path = "../../../assets/data.csv";

var datearray = [];
var color = [];


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

    function transition() {
      var t;
      d3.selectAll("path")
      .data((t = layers1, layers1 = layers0, layers0 = t))
      .transition()
      .duration(2500)
      .attr("d", area);
    }

var D3StreamGarph = {

    /** 
   * Create the event-drop chart.  Called by the enclosing {@link
   * ParallelCoord}'s {@link ParallelCoord#componentDidMount} method.
   *
   * @param element the HTML element to which the event-drop chart 
   * should be appended
   *
   * @param props {object} the properties (immutable data) for the
   * event-drop chart
   *
   * @param state {object} the state (mutable data) for the line
   * chart
   */
  create: function(element, props, state) {
    this.update(element, state);
  },
  /**
   * <p>Update the event-drop chart because the enclosing {@link
   * ParallelCoord}'s state has changed.  Called by the enclosing {@link
   * ParallelCoord}'s {@link ParallelCoord#componentDidUpdate} method.</p>
   * @param  {object} element the HTML element to which the line
   * chart should be appended
   * @param  {object} state   the state (mutable data) for the line
   * chart
   */
  update: function(element, state) {
    /* The raw data was passed in */
    d3.selectAll('.tm-eventDrops__eventDropTooltip').remove();
    d3.select(element).select("svg").remove();
    d3.select(element).selectAll("canvas").remove();

    if (typeof state.colorArray != "undefined") {
      _colorArray = state.colorArray;
    }

    /* Render the event-drop chart */
    this._render(element, path, "orange");
  },

  /**
   * Destroy the event-drop chart because the enclosing {@link ParallelCoord}
   * was unmounted.  Called by the enclosing {@link ParallelCoord}'s
   * {@link ParallelCoord#componentWillUnmount} method.
   *
   * @param element {object} the HTML element to which the line
   * chart should be appended
   */
  destroy: function(element) {
    /* Do nothing */
  },

  _render: function(element, csvpath){
    var n = 20, // number of layers
    m = 200, // number of samples per layer
    k = 10; // number of bumps per layer

    var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
    layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers = layers0.concat(layers1);

    var svg = d3.select(element),
    width = 960,
    height = 500;

    var x = d3.scaleLinear()
    .domain([0, m - 1])
    .range([0, width]);

    var y = d3.scaleLinear()
    .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    .range([height, 0]);

    var z = d3.interpolateCool;

    var area = d3.area()
    .x(function(d, i) { return x(i); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

    svg.selectAll("path")
    .data(layers0)
    .enter().append("path")
    .attr("d", area)
    .attr("fill", function() { return z(Math.random()); });
  }

  // _render: function(element, csvpath, color) {

  //   if (color == "blue") {
  //     color = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
  //   }
  //   else if (color == "pink") {
  //     color = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
  //   }
  //   else if (color == "orange") {
  //     color = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
  //   }
  //   var strokecolor = color[0];

  //   var format = d3.timeFormat("%m/%d/%y");

  //   var margin = {top: 20, right: 40, bottom: 30, left: 30};
  //   var width = document.body.clientWidth - margin.left - margin.right;
  //   var height = 400 - margin.top - margin.bottom;

  //   var tooltip = d3.select("body")
  //   .append("div")
  //   .attr("class", "remove")
  //   .style("position", "absolute")
  //   .style("z-index", "20")
  //   .style("visibility", "hidden")
  //   .style("top", "30px")
  //   .style("left", "55px");

  //   var x = d3.scaleTime()
  //   .range([0, width]);

  //   var y = d3.scaleLinear()
  //   .range([height-10, 0]);

  //   var z = d3.scaleOrdinal()
  //   .range(color);

  //   var xAxis = d3.axisBottom(x)
  //   .ticks(d3.timeWeeks);

  //   var yAxis = d3.axisLeft(y);

  //   var yAxisr = d3.axisRight(y);

  //   var stack = d3.stack()
  //   .offset(d3.stackOffsetSilhouette);
  //   // .values(function(d) { return d.values; })
  //   // .x(function(d) { return d.date; })
  //   // .y(function(d) { return d.value; });

  //   var nest = d3.nest()
  //   .key(function(d) { return d.key; });

  //   var area = d3.area()
  //   .x(function(d) { return x(d.date); })
  //   .y0(function(d) { return y(d.y0); })
  //   .y1(function(d) { return y(d.y0 + d.y); });

  //   var svg = d3.select(element).append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //   var graph = d3.csv(csvpath, function(data) {
  //     data.forEach(function(d) {
  //       d.date = format.parse(d.date);
  //       d.value = +d.value;
  //     });

  //     var layers = stack(nest.entries(data));

  //     x.domain(d3.extent(data, function(d) { return d.date; }));
  //     y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  //     svg.selectAll(".layer")
  //     .data(layers)
  //     .enter().append("path")
  //     .attr("class", "layer")
  //     .attr("d", function(d) { return area(d.values); })
  //     .style("fill", function(d, i) { return z(i); });


  //     svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);

  //     svg.append("g")
  //     .attr("class", "y axis")
  //     .attr("transform", "translate(" + width + ", 0)")
  //     .call(yAxis.orient("right"));

  //     svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis.orient("left"));

  //     svg.selectAll(".layer")
  //     .attr("opacity", 1)
  //     .on("mouseover", function(d, i) {
  //       svg.selectAll(".layer").transition()
  //       .duration(250)
  //       .attr("opacity", function(d, j) {
  //         return j != i ? 0.6 : 1;
  //       })})

  //     .on("mousemove", function(d, i) {
  //       mousex = d3.mouse(this);
  //       mousex = mousex[0];
  //       var invertedx = x.invert(mousex);
  //       invertedx = invertedx.getMonth() + invertedx.getDate();
  //       var selected = (d.values);
  //       for (var k = 0; k < selected.length; k++) {
  //         datearray[k] = selected[k].date
  //         datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
  //       }

  //       mousedate = datearray.indexOf(invertedx);
  //       pro = d.values[mousedate].value;

  //       d3.select(this)
  //       .classed("hover", true)
  //       .attr("stroke", strokecolor)
  //       .attr("stroke-width", "0.5px"), 
  //       tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");

  //     })
  //     .on("mouseout", function(d, i) {
  //      svg.selectAll(".layer")
  //      .transition()
  //      .duration(250)
  //      .attr("opacity", "1");
  //      d3.select(this)
  //      .classed("hover", false)
  //      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  //    })

  //     var vertical = d3.select(element)
  //     .append("div")
  //     .attr("class", "remove")
  //     .style("position", "absolute")
  //     .style("z-index", "19")
  //     .style("width", "1px")
  //     .style("height", "380px")
  //     .style("top", "10px")
  //     .style("bottom", "30px")
  //     .style("left", "0px")
  //     .style("background", "#fff");

  //     d3.select(element)
  //     .on("mousemove", function(){  
  //      mousex = d3.mouse(this);
  //      mousex = mousex[0] + 5;
  //      vertical.style("left", mousex + "px" )})
  //     .on("mouseover", function(){  
  //      mousex = d3.mouse(this);
  //      mousex = mousex[0] + 5;
  //      vertical.style("left", mousex + "px")});
  //   })
  // } //end: _render

};

module.exports = D3StreamGarph;