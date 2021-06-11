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
import { OFFSET, URL } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';

class MonthlyPressureResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    reduceWeight: PropTypes.bool,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      month: props.month,
      tiltMonthData_user : [],
      tiltMonthData_clinician : [],
      labels: [],
      year: props.year,
      isLoaded: false,
      hasErrors: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('MonthlyPressureResults - ComponentDidUpdate', prevProps, prevState, this.state);
    if (prevState.month !== this.state.month || prevState.year !== this.state.year) {
      this.getMonthData(this.state.month, this.state.year);
    }
  }

  componentDidMount() {
    // This is called only when component is instanciated
    console.log('MonthlySuccessTilt - componentDidMount');
    this.getMonthData(this.state.month, this.state.year);
  }

  dataDaily(data){
    this.state.tiltMonthData_user = [];
    this.state.tiltMonthData_clinician = [];  
    var data_user = [];
    var data_clinician = [];
    this.state.labels = [];
    try {
    for (let key in data) {
      this.state.labels.push(key.toString());
      data_user = data[key].user;
      data_clinician = data[key].clinician;
      var value_user = 0;
      var value_clinician = 0;

      const bon_angle_bonne_duree_user = data_user[0];
      const bon_angle_duree_insuffisante_user = data_user[1];
      const bonne_duree_angle_insuffisant_user = data_user[2];
      const non_realisee_user = data_user[3];
      const somme_user = bon_angle_bonne_duree_user + bon_angle_duree_insuffisante_user + bonne_duree_angle_insuffisant_user + non_realisee_user; 
  
      const bon_angle_bonne_duree_clinician = data_clinician[0];
      const bon_angle_duree_insuffisante_clinician = data_clinician[1];
      const bonne_duree_angle_insuffisant_clinician = data_clinician[2];
      const non_realisee_clinician = data_clinician[3];
      const somme_clinician = bon_angle_bonne_duree_clinician + bon_angle_duree_insuffisante_clinician + bonne_duree_angle_insuffisant_clinician + non_realisee_clinician; 

      if(somme_user!=0)
      {
        value_user = Math.round(bon_angle_bonne_duree_user / somme_user * 100);
      }
      if(somme_clinician!=0)
      {
        value_clinician = Math.round(bon_angle_bonne_duree_clinician / somme_clinician * 100);
      }
      this.state.tiltMonthData_clinician.push(value_clinician);
      this.state.tiltMonthData_user.push(value_user);
      }
    }
      catch (error) {
        this.setState({ hasErrors: true });
      }
    }

  async getMonthData(month, year) {
    this.setState({ hasErrors: false, isLoaded: false });
    try {
      const date = new Date(year, month, 1);
      const response = await get(`${URL}monthlySuccessfulTilts?Day=${+date}&Offset=${OFFSET}`);
      this.dataDaily(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
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
    const userTiltData = {
      labels: this.state.labels,
      datasets: [
        {
          label: T.translate(`monthlyResults.pressure.tiltLegendUser.${this.props.language}`),
          data: this.state.tiltMonthData_user,
          fill: true,
          borderColor: 'rgba(18,128,181,255)',
          backgroundColor: 'rgba(18,128,181,255)',
        }
      ],
    };

    const clinicianTiltData = {
      labels: this.state.labels,
      datasets: [
        {
          label: T.translate(`monthlyResults.pressure.tiltLegendClinician.${this.props.language}`),
          data: this.state.tiltMonthData_clinician,
          fill: true,
          borderColor: 'rgba(18,128,181,255)',
          backgroundColor: 'rgba(18,128,181,255)',
        },
      ],
    };

    const TiltData = {
      labels: this.state.labels,
      datasets: [
        {
          label: T.translate(`monthlyResults.pressure.tiltLegendClinician.${this.props.language}`),
          data: this.state.tiltMonthData_clinician,
          fill: true,
          borderColor: 'rgba(18,128,181,255)',
          backgroundColor: 'rgba(18,128,181,255)',
        },
        {
          label: T.translate(`monthlyResults.pressure.tiltLegendUser.${this.props.language}`),
          data: this.state.tiltMonthData_user,
          fill: true,
          borderColor: 'green',//'rgba(18,128,181,255)',
          backgroundColor: 'green',//'rgba(18,128,181,255)',
        }
      ],
    };


    const percentOptions = {
      title:{
        display: false,
        position: 'bottom',
      },
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
        display: false,
        onClick: null,
      },
    };

    return (
      <div>
        {!IS_TABLET
          && (
            <div className="col-lg-2 leftMenu">
              <ul className="graphlist">
                <li className="graphLink">
                  <a href="results/pressure#reduceWeight">{T.translate(`dailyResults.pressure.${this.props.language}`)}</a>
                </li>

                <li className="graphLink">
                  <a href="results/pressure#monthlySitting">{T.translate(`results.graphicsLink.sittingTime.${this.props.language}`)}</a>
                </li>
              </ul>
            </div>
          )
        }
        <div className=" col-lg-10 offset-lg-2 results resultsContainer">
          <div className="col-lg-8 graphic" style={{ margin: 'auto' }}>
            <div id="reduceWeight">
              <RecGoalChart
                condition={this.props.reduceWeight || true}
                title={(T.translate(`monthlyResults.pressure.${this.props.language}`) + " (" + (this.state.month + 1) + "/" +(this.state.year) + ")")}
                subtitle={T.translate(`monthlyResults.pressure.successRate.${this.props.language}`)}
                goalTitle={T.translate(`monthlyResults.pressure.personal.${this.props.language}`)}
                recTitle={T.translate(`monthlyResults.pressure.recommended.${this.props.language}`)}
                goalData={userTiltData}
                recData={clinicianTiltData}
                isLoaded= {this.state.isLoaded}
                hasErrors = {this.state.hasErrors}
                options = {percentOptions}
                tooltip = {(T.translate(`monthlyResults.pressure.pourcentageInfo.${this.props.language}`))}
                id = "reduceWeight"
              />
            </div>

            <div>
              {(this.state.month >= 0 && this.state.month <= 11 && this.state.year)
                && (<MonthlySittingTime month={this.state.month} year={this.state.year} />)
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

export default connect(mapStateToProps)(MonthlyPressureResults);
