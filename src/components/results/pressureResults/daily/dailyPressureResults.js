/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import '../../../../styles/results.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IS_TABLET } from '../../../../redux/applicationReducer';


import PressureCenter from './pressureCenter';
import RecGoalProgress from './recGoalProgress';
import { T } from '../../../../utilities/translator';

class DailyPressureResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
    reduceWeight: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      date: props.date,
      value1: 50,
      value2: 70,
      isLoaded: false,
      hasErrors: false,
    };
  }


  componentDidUpdate(prevProps, prevState) {
    console.log('DailyPressureResults - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.date !== this.state.date) {

    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    console.log('DailyPressureResults - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.date !== prevState.date) {
      console.log('DailyPressureResults - Date updated!');

      // Return new state
      return { date: nextProps.date, isLoaded: false, hasErrors: false };
    }
    return null;
  }

  render() {
    return (
      <div>
        {!IS_TABLET
          && (
            <div className="col-lg-2 leftMenu">
              <ul className="graphlist">
                <li className="graphLink">
                  <a href="results/pressure#dailyPressureCenter">{T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}</a>
                </li>
                {/* this.props.reduceWeight
                  && (
                    <li className="graphLink">
                      <a href="results/pressure#reduceWeight">{T.translate(`dailyResults.pressure.${this.props.language}`)}</a>
                    </li>
                  ) */}
              </ul>
            </div>
          )
        }
        <div className=" col-lg-10 offset-lg-2 results resultsContainer">
          <div className="col-lg-8 graphic" style={{ margin: 'auto' }}>
            <div>
              {this.state.date
                && (
                  <div>
                    <PressureCenter
                      title={T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}
                      date={this.state.date}
                    />{/*
                    <div id="reduceWeight">
                      <RecGoalProgress
                        condition={this.props.reduceWeight}
                        title={T.translate(`dailyResults.pressure.${this.props.language}`)}
                        goalValue={this.state.value2}
                        recValue={this.state.value1}
                      />
                    </div> */}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    reduceWeight: state.recommendationReducer.reduceWeight,
  };
}

export default connect(mapStateToProps)(DailyPressureResults);
