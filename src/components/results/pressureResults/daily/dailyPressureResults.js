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
import { URL, OFFSET } from '../../../../redux/applicationReducer';

import PressureCenter from './pressureCenter';
import RecGoalProgress from './recGoalProgress';
import DailySittingTime from './dailySittingTime';
import { T } from '../../../../utilities/translator';
import { get } from '../../../../utilities/secureHTTP';

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
      value_user: 0,
      value_clinician: 0,
      isLoaded: false,
      hasErrors: false,
      noDataUser : false,
      noDataClinician: false,
    };
  }


  componentDidUpdate(prevProps, prevState) {
    // console.log('DailyPressureResults - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.date !== this.state.date) {
        // This should load data async
        this.getDailySucessfulTilts(this.state.date);
    }
  }


  async getDailySucessfulTilts(date) {
    this.setState({ hasErrors: false, isLoaded: false });
    try {
      const response = await get(`${URL}/dailySuccessfulTilts?Day=${+date}&Offset=${OFFSET}`);

      const bon_angle_bonne_duree_user = response.data.user[0];
      const bon_angle_duree_insuffisante_user = response.data.user[1];
      const bonne_duree_angle_insuffisant_user = response.data.user[2];
      const non_realisee_user = response.data.user[3];
      //const snooze_user = response.data.user[4];
      const somme_user = bon_angle_bonne_duree_user + bon_angle_duree_insuffisante_user + bonne_duree_angle_insuffisant_user + non_realisee_user; 
      
      const bon_angle_bonne_duree_clinician = response.data.clinician[0];
      const bon_angle_duree_insuffisante_clinician = response.data.clinician[1];
      const bonne_duree_angle_insuffisant_clinician = response.data.clinician[2];
      const non_realisee_clinician = response.data.clinician[3];
      //const snooze_clinician = response.data.clinician[4];
      const somme_clinician = bon_angle_bonne_duree_clinician + bon_angle_duree_insuffisante_clinician + bonne_duree_angle_insuffisant_clinician + non_realisee_clinician; 

      if (somme_user != 0)
      {
        this.setState({
          value_user: Math.round(bon_angle_bonne_duree_user / somme_user * 100),
          noDataUser: false,
        });
      }
      else 
      {
        this.setState({
          value_user: 0,
          noDataUser : true,
        });
      }
      if (somme_clinician != 0)
      {
        this.setState({
          value_clinician: Math.round(bon_angle_bonne_duree_clinician / somme_clinician * 100),
          noDataClinician: false,
        });
      }
      else 
      {
        this.setState({
          value_clinician: 0,
          noDataClinician: true,
        });
      }
      this.setState({isLoaded: true})
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // This should load data async
    if (this.state.date != undefined)
    {
      this.getDailySucessfulTilts(this.state.date);
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('DailyPressureResults - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.date !== prevState.date) {
      // console.log('DailyPressureResults - Date updated!');

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
                  <a href="results/pressure#reduceWeight">{T.translate(`dailyResults.pressure.${this.props.language}`)}</a>
                </li>
                <li className="graphLink">
                  <a href="results/pressure#dailySittingTime">{T.translate(`results.graphicsLink.sittingTime.${this.props.language}`)}</a>
                </li>
                {/*<li className="graphLink">
                  <a href="results/pressure#dailyPressureCenter">{T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}</a>
                </li>*/}
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
                    <div id="reduceWeight">
                      <RecGoalProgress
                        condition={this.props.reduceWeight || true}
                        title={(T.translate(`dailyResults.pressure.${this.props.language}`) + " (" + (this.state.date.getFullYear()) + "/" + (this.state.date.getMonth() + 1)
                        + "/" + (this.state.date.getDate()) + ")")}
                        goalValue={this.state.value_user}
                        recValue={this.state.value_clinician}
                        noDataUser = {this.state.noDataUser}
                        noDataClinician = {this.state.noDataClinician}
                        tooltip = {(T.translate(`monthlyResults.pressure.pourcentageInfo.${this.props.language}`))}
                        id ="reduceWeight"
                      />
                    </div>
                  
                  {/* <PressureCenter
                      title={T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}
                      date={this.state.date}
                    />*/}
                    <div id="dailySittingTime">
                    <DailySittingTime
                    title={T.translate(`dailyResults.dailySittingTime.${this.props.language}`)}
                    date={this.state.date}
                    />
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
    reduceWeight: state.recommendationReducer.reduceWeight,
  };
}

export default connect(mapStateToProps)(DailyPressureResults);
