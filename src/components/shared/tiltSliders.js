/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { T } from '../../utilities/translator';
import SliderValue from './sliderValue';

class TiltSliders extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    tiltFrequency: PropTypes.number,
    tiltLength: PropTypes.number,
    tiltAngle: PropTypes.number,
    maxAngle: PropTypes.number,
    onFrequencyChange: PropTypes.func.isRequired,
    onLengthChange: PropTypes.func.isRequired,
    onAngleChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="col-12 col-md-10 ml-3">
        <SliderValue
          id="frequency-slider" min={0} max={180} onChange={this.props.onFrequencyChange}
          value={this.props.tiltFrequency} unit="min(s)" title={T.translate(`recommendations.frequency.${this.props.language}`)}
        />
        <SliderValue
          id="duration-slider" min={0} max={30} onChange={this.props.onLengthChange}
          value={this.props.tiltLength} unit="min(s)" title={T.translate(`recommendations.duration.${this.props.language}`)}
        />
        <SliderValue
          id="angle-slider" min={0} max={this.props.maxAngle} onChange={this.props.onAngleChange}
          value={this.props.tiltAngle} unit="°" title={T.translate(`recommendations.angle.${this.props.language}`)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(TiltSliders);
