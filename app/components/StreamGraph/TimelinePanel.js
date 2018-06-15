import React, {Component, PropTypes} from 'react';
import StreamGraph from './StreamGraph';

class TimelinePanel extends Component {
	  constructor(props) {
	  	super(props);
	  }

	  render(){
	  	return(
	  		<div className="timeline-panel">
	  			<StreamGraph className="stream-graph" />
	  		</div>
	  	);
	  }
}

export default TimelinePanel;