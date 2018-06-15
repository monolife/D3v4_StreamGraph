  

'use strict';

import React, {Component} from 'react';

import composeBaseChart from "./BaseChart";

import D3StreamGraph from "./D3StreamGraph";
import {List} from 'immutable';

//UX
import './StreamGraph.scss';

class StreamGraph extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return ( < div className = "StreamGraph" style={{height:"500"}} > 
      { this.props.children } 
      < /div > 
      );
  }
}

/** The types of the properties of this component */
StreamGraph.propTypes = {
  data: React.PropTypes.object,
  selectionCallback: React.PropTypes.func,
};


export default composeBaseChart(
  StreamGraph,
  D3StreamGraph, 
  {
    componentType: "StreamGraph",
    data: new List(),
    csvPath: "",
    selectionCallback: function() {},
  }
)
