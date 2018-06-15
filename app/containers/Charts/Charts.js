import React, { Component } from 'react';
import { Link } from 'react-router';
import './Charts.scss';

export default class Charts extends Component {
  render() {
    return (
      <div className="homepage">
        <h2>Starter Project</h2>
        <p>Example application built with React, Redux, and Matter. </p>
        <p>Webpack is used to supply hot reloading for modules during development.</p>
      </div>
    )
  }
}
