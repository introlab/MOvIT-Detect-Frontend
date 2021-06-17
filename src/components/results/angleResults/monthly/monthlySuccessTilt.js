import React, { Component } from 'react';

import { Chart } from 'primereact/components/chart/Chart';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomCard from '../../../shared/card';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { T } from '../../../../utilities/translator';
import { OFFSET, URL } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';
import { colorCode } from '../../colorCode';

class MonthlySuccessTilt extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      tiltMonthData_user: {
        good: [],
        badDuration: [],
        badAngle: [],
        bad: [],
        snoozed: [],
      },
      tiltMonthData_clinician: {
        good: [],
        badDuration: [],
        badAngle: [],
        bad: [],
        snoozed: [],
      },      
      labels: [],
      profil: 'clinician',
      month: props.month,
      year: props.year,
      isLoaded: false,
      hasErrors: false,
    };
  }


  componentDidUpdate(prevProps, prevState) {
    // console.log('MonthlySuccessTilt - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.month !== this.state.month || prevState.year !== this.state.year) {
      // This should load data async
      this.getMonthData(this.state.month, this.state.year);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('MonthlySuccessTilt - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.month !== prevState.month || nextProps.year !== prevState.year) {
      // console.log('MonthlySuccessTilt - Month/Year updated!');

      // Return new state
      return {
        month: nextProps.month, year: nextProps.year, isLoaded: false, hasErrors: false,
      };
    }
    return null;
  }

  componentDidMount() {
    // This is called only when component is instanciated
    console.log('MonthlySuccessTilt - componentDidMount');

    // This should load data async
    this.getMonthData(this.state.month, this.state.year);
  }

  async getMonthData(month, year) {
    this.setState({ hasErrors: false, isLoaded: false });
    try {
      const date = new Date(year, month, 1);
      const response = await get(`${URL}monthlySuccessfulTilts?Day=${+date}&Offset=${OFFSET}`);
      this.formatChartData(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  formatChartData(data) {
    var data_user = [];
    var data_clinician = [];
    this.state.labels = [];
    this.state.tiltMonthData_user = {
      good: [],
      badDuration: [],
      badAngle: [],
      bad: [],
      snoozed: [],
    };
    this.state.tiltMonthData_clinician = {
      good: [],
      badDuration: [],
      badAngle: [],
      bad: [],
      snoozed: [],
    };  
   // var size = data.length();  
   for (let key in data) {
      this.state.labels.push(key.toString());
      data_user = data[key].user;
      data_clinician = data[key].clinician;
      this.state.tiltMonthData_user.good.push(data_user[0]);
      this.state.tiltMonthData_user.badDuration.push(data_user[1]);
      this.state.tiltMonthData_user.badAngle.push(data_user[2]);
      this.state.tiltMonthData_user.bad.push(data_user[3]);
      this.state.tiltMonthData_user.snoozed.push(data_user[4]);
      this.state.tiltMonthData_clinician.good.push(data_clinician[0]);
      this.state.tiltMonthData_clinician.badDuration.push(data_clinician[1]);
      this.state.tiltMonthData_clinician.badAngle.push(data_clinician[2]);
      this.state.tiltMonthData_clinician.bad.push(data_clinician[3]);
      this.state.tiltMonthData_clinician.snoozed.push(data_clinician[4]);
    };
    this.setState({ loading: false });
  }

  getChartData(newData) {
    return {
      labels: this.state.labels,
      datasets: [
        {
          label: T.translate(`SuccessfulTilt.tiltSucessful.${this.props.language}`),
          lineTension: 0,
          data: newData.good,
          fill: true,
          borderColor: colorCode.successTilt.good,
          backgroundColor: colorCode.successTilt.good,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadDuration.${this.props.language}`),
          lineTension: 0,
          data: newData.badDuration,
          fill: true,
          borderColor: colorCode.successTilt.badDuration,
          backgroundColor: colorCode.successTilt.badDuration,
          borderColor : colorCode.successTilt.badDurationColorborder,
          borderWidth : 1,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadAngle.${this.props.language}`),
          lineTension: 0,
          data: newData.badAngle,
          fill: true,
          borderColor: colorCode.successTilt.badAngle,
          backgroundColor: colorCode.successTilt.badAngle,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltNotMade.${this.props.language}`),
          lineTension: 0,
          data: newData.bad,
          fill: true,
          borderColor: colorCode.successTilt.notMade,
          backgroundColor: colorCode.successTilt.notMade,
        },
      /*  {
          label: T.translate(`SuccessfulTilt.tiltSnoozed.${this.props.language}`),
          lineTension: 0,
          data: this.state.tiltMonthData.snoozed,
          fill: true,
          borderColor: 'blue',
          backgroundColor: 'blue',
        },*/
      ],
    };
  }

  render() {
    const style = {
      center: {
        textAlign: 'center',
      },
    };
    
    const tiltSuccessOptions = {
      scales: {
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: T.translate(`graphParameter.axeDay.${this.props.language}`),
          },
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            min: 0,
          },
          scaleLabel: {
            display: true,
            labelString: T.translate(`SuccessfulTilt.tiltMade.${this.props.language}`),
          },
        }],
      },
    };

    const profilSelectItems = [
      {label: (T.translate(`dailyResults.recommended.${this.props.language}`)), 
       value: 'clinician',
      },
       {label: (T.translate(`dailyResults.personal.${this.props.language}`)),
        value: 'user',
      }];

   const dropDownProfil = 
   <Dropdown
     value={this.state.profil}
     options= {profilSelectItems}
     onChange={e => {
       this.setState({ profil: e.value });
     }}
     style={{ width: '250px', marginRight: '15px'}}
     placeholder= {this.state.profil}
   />

    const data_clinician = this.getChartData(this.state.tiltMonthData_clinician);
    const data_user = this.getChartData(this.state.tiltMonthData_user);
    const chart_user = <div> {dropDownProfil} <Chart type="bar" data={data_user} options={tiltSuccessOptions} /></div>;
    const chart_clinician = <div> {dropDownProfil} <Chart type="bar" data={data_clinician} options={tiltSuccessOptions} /></div>;

    var element = (this.state.profil === 'clinician') ? chart_clinician: chart_user;
    

    return (
      <div classame="container" id="monthlyTilt">
        <CustomCard
          header={(<div>
            <h3 style = {style.center}>{`${T.translate(`SuccessfulTilt.tiltMadeMonth.${this.props.language}`)
            } (${this.state.year}/${this.state.month + 1})` }
            </h3></div>
          )}
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

export default connect(mapStateToProps)(MonthlySuccessTilt);
