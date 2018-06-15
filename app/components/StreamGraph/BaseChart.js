/* jshint node: true */

'use strict';

import React from "react";

import ReactDOM from "react-dom";

// import PureRenderMixin from "react-addons-pure-render-mixin";

// import LoadingAnimation from "./LoadingAnimation";
// import LoadFail from "./LoadFail";

/**
 * composeBaseChart is a higher order component (HOC) wrapper function
 * that takes as arguments a lower component (e.g. {@link LineChart}),
 * a chart render component, and properties.  From those arguments it
 * creates a component with the base wrapped functionality, such as
 * calling methods on the render component in response to React
 * lifecycle events.
 *
 * @param {object} WrappedComponent the component to be wrapped by the
 * {@link BaseChart} higher order component
 *
 * @param {object} renderComponent the component that will create the
 * graph, usually a class containing D3 code
 * 
 * @param {object} extProps additional necessary properites or
 * properties to override from the {@link BaseChart} component. Base
 * properties are: componentType, d3component (which is
 * filled by renderComponent)
 *
 * @return {object} the composited higher order component
 */
export default function composeBaseChart(WrappedComponent,
                                         renderComponent, extProps) {
    /**
     * [BaseChart description]
     */
    class BaseChart extends React.Component {
        /**
         * [constructor description]
         *
         * @param props {object} the properties
         */
        constructor(props) {
            super(props);
            
            this.state = Object.assign({},
                extProps, 
                this.props,
                {
                    showLoading: true,
                    loadingFailed: false,
                });
        }

        /**
         * Called after the component is mounted
         */
        componentDidMount() {
            var me = this;
            var element = ReactDOM.findDOMNode(this);
            var state = this.getChartState();
            this.getData(state, function(output) {
                state.data = output;
                state.d3component.create(element, {}, state);
                me.setState({
                    showLoading: false,
                    loadingFailed: false,
                });
            });
        }

        /**
         * Called after the component updates
         */
        componentDidUpdate() {
            var me = this;
            this.setState( {showLoading: true} );
            var element = ReactDOM.findDOMNode(this);
            var state = this.getChartState();
            this.getData(state, function(output) {
                state.data = output;
                state.d3component.update(element, state);
                me.setState({
                    showLoading: false,
                    loadingFailed: false,
                });
            });
        }

        /**
         * Called before the component receives props
         */
        componentWillReceiveProps(nextProps) {
            this.setState( nextProps );
        }

        /**
         * Called before the component is destroyed
         */
        componentWillUnmount() {
            var element = ReactDOM.findDOMNode(this);
            this.getChartState().d3component.destroy(element);
        }
  
        shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.data !== undefined && nextProps.data.size) {
                return (this.props.data === undefined || this.props.data.size !== nextProps.data.size);
            } else {
                return false;
            }
        }

        /**
         * Returns a copy of state for the component
         *
         * @return {object} a copy of component state
         */
        getChartState() {
            return Object.assign({}, this.state);
        }
        /**
         * Isolates the data to be plotted by making the AJAX call to the data url,
         * parsing the string data into a json object, or just reflecting back the json
         * data. Passes the data back to the callback function.
         * 
         * @param {object} state the state (mutable data) for the
         * render component
         *
         * @param {function} callback callback function that handles
         * the JSON data
         */
        getData(state, callback) {
            if (typeof state.data == 'string' && (state.data.length != 0)) {
                callback(JSON.parse(state.data));
            } else {
                callback(state.data);
            }
        }

        /**
         * Render the component
         */
        render() {
            var me = this;
            return ( 
                < WrappedComponent ref = "wrappedComp" {...me.state} > 
                < /WrappedComponent >
            );
        } //end: render
    } //--- End: Base Component ---

    /** The types of the properties of this component */
    BaseChart.propTypes = {
        componentType: React.PropTypes.string,      
        d3component: React.PropTypes.object,
    };

    /**
     * Returns the default values for this component's properties
     */
    BaseChart.defaultProps = {
        componentType: extProps.componentType,
        d3component: renderComponent,
    };

    return BaseChart;
} //--- End: composeBaseChart ---
