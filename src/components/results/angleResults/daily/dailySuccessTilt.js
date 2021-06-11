import '../../../../styles/results.css';

import React, { Component } from 'react';

import { Chart } from 'primereact/components/chart/Chart';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomCard from '../../../shared/card';
import { T } from '../../../../utilities/translator';
import { URL, OFFSET } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';
import NoDataMessage from '../../../shared/noDataMessage';
import { colorCode } from '../../colorCode';

class DailySuccessTilt extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
  }

  constructor(props) {
    super(props);
    this.state = {
      dayDataUser: [],
      dayDataClinician: [],
      profil: 'clinician',
      date: props.date,
      disableDropdown : false,
      isLoaded: false,
      hasErrors: false,
    };
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // console.log('DailySuccessTilt - componentDidMount');

    // This should load data async
    this.getData(this.state.date);
    this.setState({});
  }


  componentDidUpdate(prevProps, prevState) {
    // console.log('DailySuccessTilt - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.date !== this.state.date) {
      // This should load data async
      this.getData(this.state.date);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('DailySuccessTilt - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.date !== prevState.date) {
      // console.log('DailySuccessTilt - Date updated!');

      // Return new state
      return { date: nextProps.date, isLoaded: false, hasErrors: false };
    }
    return null;
  }

  async getData(date) {
    this.setState({ hasErrors: false, isLoaded: false });
    try {
      const response = await get(`${URL}/dailySuccessfulTilts?Day=${+date}&Offset=${OFFSET}`);
      this.setState({
        dayDataUser: response.data.user,
        dayDataClinician: response.data.clinician,
        isLoaded: true,
      });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  getChartData(newData) {
    return {
      labels: [''],
      datasets: [
        {
          label: T.translate(`SuccessfulTilt.tiltSucessful.${this.props.language}`),
          data: [newData[0]],
          fill: true,
          backgroundColor: [
           colorCode.successTilt.good,
          ],
          hoverBackgroundColor: [
            colorCode.successTilt.good,
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadDuration.${this.props.language}`),
          data: [newData[1]],
          fill: true,
          backgroundColor: [
            colorCode.successTilt.badDuration,
          ],
          hoverBackgroundColor: [
            colorCode.successTilt.badDuration,
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadAngle.${this.props.language}`),
          data: [newData[2]],
          fill: true,
          backgroundColor: [ 
            colorCode.successTilt.badAngle,
          ],
          hoverBackgroundColor: [
            colorCode.successTilt.badAngle,
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltNotMade.${this.props.language}`),
          data: [newData[3]],
          fill: true,
          backgroundColor: [
            colorCode.successTilt.notMade,
          ],
          hoverBackgroundColor: [
            colorCode.successTilt.notMade,
          ],
          lineTension: 0,
        },
       /* {
          label: T.translate(`SuccessfulTilt.tiltSnoozed.${this.props.language}`),
          data: [newData[4]],
          fill: true,
          backgroundColor: [
            'blue',
          ],
          hoverBackgroundColor: [
            'blue',
          ],
          lineTension: 0,
        },*/
      ],
    };
  }

  boolNoData (data){
    var emptydata = 0
    var lenghtdata = data.length
    for (var key = 0 ; key <lenghtdata ; key++) {
      if (data[key] == 0) {
        emptydata++
      }
    }
    return ((emptydata == lenghtdata)? true : false);
  }
  
  render() 
  {
    const style = {
      center: {
        textAlign: 'center',
      },
    };

    const style2 = {
      center: {
        textAlign: 'center',
      },
      color : 'gray'
    };


    const tiltSuccessOptions = {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: (T.translate(`SuccessfulTilt.tiltSnoozed.${this.props.language}`) + ": " + this.state.dayDataUser[4]),
        position: 'bottom',
      },
      scales: {
        xAxes: [{
            categoryPercentage: 1.0,
            barPercentage: 1.0,
          }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: T.translate(`SuccessfulTilt.tiltMade.${this.props.language}`),
          },
          ticks: {
            precision: 0,
            beginAtZero: true
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
      disabled = {this.state.disableDropdown}
      onChange={e => {
        this.setState({ profil: e.value });
      }}
      style={{ width: '250px', marginRight: '15px'}}
      placeholder= {this.state.profil}
    />


    
    const noData = <NoDataMessage />;

    const data_clinician = this.getChartData(this.state.dayDataClinician);
    const chart_clinician = <Chart type="bar" data={data_clinician} options={tiltSuccessOptions}/>;
    const subtitle_clinician = <h4>{T.translate(`dailyResults.recommended.${this.props.language}`)}</h4>;
    const link = <p style = {style2}> {T.translate(`SuccessfulTilt.tiltInformation.${this.props.language}`)} <a href="/goals"> <u style = {style2}>{T.translate(`SuccessfulTilt.tiltLink.${this.props.language}`)}</u></a>.</p>;
    const element_clinician = (<div> {dropDownProfil} {/*subtitle_clinician*/} {chart_clinician}<br/>{link} </div>);

    const data_user = this.getChartData(this.state.dayDataUser);
    const chart_user = <Chart type="bar" data={data_user} options={tiltSuccessOptions}/>;
    const subtitle_user = <h4>{T.translate(`dailyResults.personal.${this.props.language}`)}</h4>;
    const element_user = (<div> {dropDownProfil}{/*subtitle_user*/} {chart_user}<br/>{link} </div>);

    var element;
    
    if (this.state.profil === 'clinician')
    {
        element = (this.boolNoData(this.state.dayDataClinician)) ? (<div> {/*subtitle_clinician*/} {noData} </div>) : element_clinician;
    }

    else{
        element = (this.boolNoData(this.state.dayDataUser))? (<div> {/*subtitle_user*/} {noData} </div>) : element_user;
      }


    return (
      <div id="dailyTilt">
        <CustomCard
          header={<div> <h3 style = {style.center}>{`${T.translate(`SuccessfulTilt.tiltMadeDaily.${this.props.language}`)
            } (${this.state.date.getFullYear()}/${this.state.date.getMonth() + 1}/${this.state.date.getDate()})`}
            </h3> </div>}
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

export default connect(mapStateToProps)(DailySuccessTilt);
