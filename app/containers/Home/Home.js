import React, { Component } from 'react';
import { Link } from 'react-router';
import './Home.scss';

import ReactStreamGraph from '../../components/StreamGraph/ReactStreamGraph2';

let path = "../../../assets/data.csv";

export default class Home extends Component {
  render() {
    return (
      <div className="homepage">
        <h2>Starter Project</h2>
        <p>Example application built with React, Redux, and Matter. </p>
        <p>Webpack is used to supply hot reloading for modules during development.</p>
        <ReactStreamGraph height={500} width={500} dataPath={path} />
      </div>
    )
  }
}
