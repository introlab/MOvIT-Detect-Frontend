/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import '../../../../styles/results.css';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GoalChart from './goalChart';
import MonthlyAngleDistribution from './monthlyAngleDistribution';
import MonthlySuccessTilt from './monthlySuccessTilt';
import { T } from '../../../../utilities/translator';
import { URL, IS_TABLET, OFFSET } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';


class MonthlyAngleResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    month: PropTypes.number,
    year: PropTypes.number,
    reduceSlidingMoving: PropTypes.bool,
    reduceSlidingRest: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      month: props.month,
      year: props.year,
      monthSildeRest: [],
      monthSildeMoving: [],
      monthSlideLabels: [],
      hasErrors: false,
      isLoaded: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('MonthlyAngleResults - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.month !== this.state.month || prevState.year !== this.state.year) {
      // This should load data async
      this.getMonthlySlidingProgress(this.state.month, this.state.year);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('MonthlyAngleResults - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.month !== prevState.month || nextProps.year !== prevState.year) {
      // console.log('MonthlyAngleResults - Month/Year updated!');

      // Return new state
      return {
        month: nextProps.month, year: nextProps.year, isLoaded: false, hasErrors: false,
      };
    }
    return null;
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // console.log('MonthlyAngleResults - componentDidMount');

    // This should load data async
    this.getMonthlySlidingProgress(this.state.month, this.state.year);
  }

  async getMonthlySlidingProgress(month, year) {
    const date = new Date(year, month, 1);
    this.setState({ hasErrors: false, isLoaded: false });
    try {
      const response = await get(`${URL}/monthlySlideProgress?Day=${+date}&Offset=${OFFSET}`);
      this.loadMonthlySlidingData(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  loadMonthlySlidingData(data) {
    const newMonthSlideLabels = [];
    const newMonthSildeRest = [];
    const newMonthSlideMoving = [];
    Object.keys(data).forEach((key) => {
      newMonthSlideLabels.push(key.toString());
      newMonthSildeRest.push(data[key][0] * 100);
      newMonthSlideMoving.push(data[key][1] * 100);
    });

    this.setState({
      monthSlideLabels: newMonthSlideLabels,
      monthSildeRest: newMonthSildeRest,
      monthSildeMoving: newMonthSlideMoving,
    });
  }

  render() {
    const travelData = {
      labels: this.state.monthSlideLabels,
      datasets: [
        {
          label: T.translate(`monthlyResults.travel.successRate.${this.props.language}`),
          lineTension: 0,
          data: this.state.monthSildeMoving,
          fill: true,
          borderColor: 'rgba(18,128,181,255)',
          backgroundColor: 'rgba(18,128,181,255)',
        },
      ],
    };
    

    const restData = {
      labels: this.state.monthSlideLabels,
      datasets: [
        {
          label: T.translate(`monthlyResults.travel.successRate.${this.props.language}`),
          lineTension: 0,
          data: this.state.monthSildeRest,
          fill: true,
          borderColor: 'rgba(18,128,181,255)',
          backgroundColor: 'rgba(18,128,181,255)',
        },
      ],
    };

    const percentOptions = {
      scales: {
        yAxes: [{
          ticks: {
            callback: value => `${value}%`,
            min: 0,
            max: 100,
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: T.translate(`graphParameter.axeDay.${this.props.language}`),
          },
        }],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += Math.round(tooltipItem.yLabel * 100) / 100;
            label += '%';
            return label;
          },
        },
      },
      legend: {
        onClick: null,
      },
    };

    return (
      <div>
        {!IS_TABLET
          && (
          <div className="col-lg-2 leftMenu">
            <ul className="graphlist">
              <li className="graphLink"><a href="results/angle#monthlyAngle">{T.translate(`results.graphicsLink.angle.${this.props.language}`)}</a></li>
              <li className="graphLink"><a href="results/angle#monthlyTilt">{T.translate(`SuccessfulTilt.tiltMade.${this.props.language}`)}</a></li>
              {this.props.reduceSlidingMoving || true
                && (
                  <li className="graphLink">
                    <a href="results/angle#reduceSlidingMoving">{T.translate(`dailyResults.travel.${this.props.language}`)}</a>
                  </li>
                )}
              {this.props.reduceSlidingRest || true
                && (
                  <li className="graphLink">
                    <a href="results/angle#reduceSlidingRest">{T.translate(`monthlyResults.rest.${this.props.language}`)}</a>
                  </li>
                )}
            </ul>
          </div>
          )
        }
        <div className=" col-lg-10 offset-lg-2 results resultsContainer">
          <div className="col-lg-8 offset-lg-2">
            <div>
              {(this.state.month >= 0 && this.state.month <= 11 && this.state.year)
              && (
              <div>
                <MonthlyAngleDistribution month={this.state.month} year={this.state.year} />
                <MonthlySuccessTilt month={this.state.month} year={this.state.year} />
                <div>
                  <div id="reduceSlidingMoving">
                    <GoalChart
                      condition={this.props.reduceSlidingMoving || true}
                      title={(T.translate(`monthlyResults.travel.${this.props.language}`) + " (" + (this.state.month + 1)+ "/" +(this.state.year) + ")")}       
                      successMessage={T.translate(`monthlyResults.travel.success.${this.props.language}`)}
                      data={travelData}
                      options={percentOptions}
                      isLoaded={this.state.isLoaded}
                      hasErrors={this.state.hasErrors}
                    />
                  </div>
                  <div id="reduceSlidingRest">
                    <GoalChart
                      condition={this.props.reduceSlidingRest || true}
                      title={(T.translate(`monthlyResults.rest.${this.props.language}`)+ " (" + (this.state.month + 1)+ "/" +(this.state.year) + ")")}
                      successMessage={T.translate(`monthlyResults.rest.success.${this.props.language}`)} 
                      data={restData}
                      options={percentOptions}
                      isLoaded={this.state.isLoaded}
                      hasErrors={this.state.hasErrors}
                    />
                  </div>
                </div>
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
    reduceSlidingRest: state.recommendationReducer.reduceSlidingRest,
    reduceSlidingMoving: state.recommendationReducer.reduceSlidingMoving,
  };
}

export default connect(mapStateToProps)(MonthlyAngleResults);
