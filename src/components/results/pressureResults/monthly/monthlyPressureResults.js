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


import MonthlySittingTime from './monthlySittingTime';
import RecGoalChart from './recGoalChart';
import { T } from '../../../../utilities/translator';

class MonthlyPressureResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    reduceWeight: PropTypes.bool,
    month: PropTypes.number,
    year: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      month: props.month,
      year: props.year,
      isLoaded: false,
      hasErrors: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('MonthlyPressureResults - ComponentDidUpdate', prevProps, prevState, this.state);
    if (prevState.month !== this.state.month || prevState.year !== this.state.year) {

    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('MonthlyPressureResults - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.month !== prevState.month || nextProps.year !== prevState.year) {
      // console.log('MonthlyPressureResults - Month/Year updated!');

      // Return new state
      return {
        month: nextProps.month, year: nextProps.year, isLoaded: false, hasErrors: false,
      };
    }
    return null;
  }

  render() {
    const personalTiltData = {
      labels: [
        '1', '2', '3', '4', '5',
        '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30',
      ],
      datasets: [
        {
          label: T.translate(`monthlyResults.pressure.tiltMade.${this.props.language}`),
          lineTension: 0,
          data: [
            36, 40, 27, 38, 42,
            55, 40, 28, 32, 26,
            25, 28, 31, 22, 25,
            34, 36, 30, 21, 24,
            26, 28, 31, 32, 8,
            0, 26, 30, 21, 24,
          ],
          fill: true,
          borderColor: 'red',
        },
        {
          label: T.translate(`monthlyResults.pressure.tiltGoal.${this.props.language}`),
          lineTension: 0,
          data: [
            26, 28, 31, 32, 8,
            34, 36, 30, 21, 24,
            55, 40, 28, 32, 26,
            25, 28, 31, 22, 25,
            0, 26, 30, 21, 24,
            36, 40, 27, 38, 42,
          ],
          fill: false,
          borderColor: 'blue',
        },
      ],
    };

    return (
      <div>
        {!IS_TABLET
          && (
            <div className="col-lg-2 leftMenu">
              <ul className="graphlist">
                <li className="graphLink">
                  <a href="results/pressure#monthlySitting">{T.translate(`results.graphicsLink.sittingTime.${this.props.language}`)}</a>
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
              {(this.state.month >= 0 && this.state.month <= 11 && this.state.year)
                && (<MonthlySittingTime month={this.state.month} year={this.state.year} />)
              }
              {/*
              <div id="reduceWeight">
                <RecGoalChart
                  condition={this.props.reduceWeight}
                  title={T.translate(`monthlyResults.pressure.${this.props.language}`)}
                  goalTitle={T.translate(`monthlyResults.pressure.personal.${this.props.language}`)}
                  recTitle={T.translate(`monthlyResults.pressure.recommended.${this.props.language}`)}
                  goalData={personalTiltData}
                  recData={personalTiltData}
                />
              </div>
              */}
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

export default connect(mapStateToProps)(MonthlyPressureResults);
