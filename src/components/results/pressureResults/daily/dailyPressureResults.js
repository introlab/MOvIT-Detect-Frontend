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
      value1: 0,
      value2: 0,
      isLoaded: false,
      hasErrors: false,
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

      const bon_angle_bonne_duree = response.data[0];
      const bon_angle_duree_insuffisante = response.data[1];
      const bonne_duree_angle_insuffisant = response.data[2];
      const non_realisee = response.data[3];
      const snooze = response.data[4];
      const somme = bon_angle_bonne_duree + bon_angle_duree_insuffisante + bonne_duree_angle_insuffisant + non_realisee; // + snooze;

      if (somme != 0)
      {
        this.setState({
          value1: Math.round(bon_angle_bonne_duree / somme * 100),
          //Vérifier le calcul "recommandé", va probablement nécessiter un nouveau endpoint dans le backend
          //Pour le calcul des angles avec la valeur recommandée en DB.
          value2: Math.round(bon_angle_bonne_duree / somme * 100),
          isLoaded: true,
        });
      }
      else 
      {
        this.setState({
          value1: 0,
          value2: 0,
          isLoaded: true,
        });
      }
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
                  <a href="results/pressure#dailyPressureCenter">{T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}</a>
                </li>
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
                        title={T.translate(`dailyResults.pressure.${this.props.language}`)}
                        goalValue={this.state.value2}
                        recValue={this.state.value1}
                      />
                    </div>

                    <PressureCenter
                      title={T.translate(`results.graphicsLink.pressureCenter.${this.props.language}`)}
                      date={this.state.date}
                    />

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
