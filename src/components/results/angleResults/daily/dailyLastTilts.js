import '../../../../styles/results.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OFFSET, URL } from '../../../../redux/applicationReducer';

import CustomCard from '../../../shared/card';
import { T } from '../../../../utilities/translator';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';

const TILT_COUNT = 5;

class DailyLastTilts extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
  }

  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      data: null,
      isLoaded: false,
      hasErrors: false,
    };
    this.getData(this.state.date);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.state.date) {
      this.setState({ date: nextProps.date });
      this.getData(nextProps.date);
    }
  }

  async getData(date) {
    this.setState({ isLoaded: false, hasErrors: false });
    try {
      const response = await get(`${URL}lastTilts?Day=${+date},offset=${OFFSET},count=${TILT_COUNT}`);
      this.setState({ data: response.data, isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  getResult(index) {
    // Indexes:
    // 0 success
    // 1 trop court
    // 2 fail
    // 3 snooze
    // 4 wrong angle
    switch (index) {
      case 0: return T.translate(`lastTilts.successful.${this.props.language}`);
      case 1: return T.translate(`lastTilts.tooShort.${this.props.language}`);
      case 2: return T.translate(`lastTilts.unsuccessful.${this.props.language}`);
      case 3: return T.translate(`lastTilts.snooze.${this.props.language}`);
      case 4: return T.translate(`lastTilts.tooSmallAngle.${this.props.language}`);
      default:
        break;
    }
  }

  getTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours() + OFFSET;
    const minutes = date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : date.getMinutes();
    return `${hours}:${minutes}`;
  }

  render() {
    const element = (
      <div>
        {this.state.data && this.state.data.map((tilt, index) => (
          <div className="row" key={`lastTilts${tilt.timestamp}`}>
            <div className="col-6">
              {index + 1}. {T.translate(`lastTilts.result.${this.props.language}`)}: {this.getResult(tilt.index)}
            </div>
            <div className="col-6">
              {T.translate(`lastTilts.time.${this.props.language}`)}: {this.getTime(tilt.timestamp)}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div className="container graphic" id="dailyLastTilt">
        <CustomCard
          header={<h4>{T.translate(`lastTilts.title.${this.props.language}`)}</h4>}
          element={getElement(this.state.isLoaded, this.state.hasErrors, element)}
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

export default connect(mapStateToProps)(DailyLastTilts);