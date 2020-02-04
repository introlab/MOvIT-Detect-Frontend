import '../../../../styles/results.css';

import React, { Component } from 'react';

import { Chart } from 'primereact/components/chart/Chart';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomCard from '../../../shared/card';
import { T } from '../../../../utilities/translator';
import { OFFSET } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';

class DailySuccessTilt extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
  }

  constructor(props) {
    super(props);
    this.state = {
      dayData: [],
      date: props.date,
      isLoaded: false,
      hasErrors: false,
    };
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // console.log('DailySuccessTilt - componentDidMount');

    // This should load data async
    this.getData(this.state.date);
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
      const response = await get(`http://${process.env.BHOST}:${process.env.BPORT}/dailySuccessfulTilts?Day=${+date}&Offset=${OFFSET}`);
      this.setState({
        dayData: response.data,
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
            'green',
          ],
          hoverBackgroundColor: [
            'green',
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadDuration.${this.props.language}`),
          data: [newData[1]],
          fill: true,
          backgroundColor: [
            'yellow',
          ],
          hoverBackgroundColor: [
            'yellow',
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltBadAngle.${this.props.language}`),
          data: [newData[2]],
          fill: true,
          backgroundColor: [
            'orange',
          ],
          hoverBackgroundColor: [
            'orange',
          ],
          lineTension: 0,
        },
        {
          label: T.translate(`SuccessfulTilt.tiltNotMade.${this.props.language}`),
          data: [newData[3]],
          fill: true,
          backgroundColor: [
            'red',
          ],
          hoverBackgroundColor: [
            'red',
          ],
          lineTension: 0,
        },
        {
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
        },
      ],
    };
  }

  render() {
    const tiltSuccessOptions = {
      legend: {
        display: true,
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
            min: 0,
          },
        }],
      },
    };
    const data = this.getChartData(this.state.dayData);
    const chart = <Chart type="bar" data={data} options={tiltSuccessOptions} />;

    return (
      <div className="container graphic" id="dailyTilt">
        <CustomCard
          header={<h4>{T.translate(`SuccessfulTilt.tiltMade.${this.props.language}`) + 
          ` (${this.state.date.getFullYear()}/${this.state.date.getMonth() + 1}/${this.state.date.getDate()})`}</h4>}
          element={getElement(this.state.isLoaded, this.state.hasErrors, chart)}
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
