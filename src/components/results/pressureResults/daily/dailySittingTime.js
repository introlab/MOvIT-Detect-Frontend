/**
 * @author Marie-Laurence Bazinet
 */

import '../../../../styles/results.css';
import React, { Component } from 'react';

import { Chart } from 'primereact/components/chart/Chart';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomCard from '../../../shared/card';
import { T } from '../../../../utilities/translator';
import { OFFSET, URL } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';



class DailySittingTime extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date : PropTypes.instanceOf(Date),
    title: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sitHourData: [],
      sitHourLabels: [],
      date: props.date,
      hours: [],
      isLoaded: false,
      hasErrors: false,
      chart: {}
    };

    // this.getsitHourData(props.day, props.year);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('DailySittingTime - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.date !== this.state.date) {
      // This should load data async
      this.getsitHourData(this.state.date);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    // console.log('DailySittingTime - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.date !== prevState.date) {
      // console.log('PressureCenter - Date updated!');
      // Return new state
      return { date: nextProps.date, isLoaded: false, hasErrors: false };
    }
    return null;
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // 0console.log('DailySittingTime - componentDidMount');

    // This should load data async
    this.getsitHourData(this.state.date);
  }

  async getsitHourData(date) {

    // console.log('DailySittingTime - getsitHourData with date:', date);
    this.setState({ isLoaded: false });
    try {
      const response = await get(`${URL}/dailySittingTime?Day=${+date}&Offset=${OFFSET}`);
      this.formatSitChartData(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  formatSitChartData(data) {
    this.state.sitHourLabels = [];
    this.state.sitHourData = [];
    Object.keys(data).forEach((key) => {
      this.state.sitHourLabels.push(key.toString());
      this.state.sitHourData.push(data[key]);
    });
    this.loadSitData();
  }

  loadSitData() {
    return {
      labels: ['0h', '1h','2h','3h','4h','5h','6h','7h',
      '8h','8h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h'],
      datasets: [
        {
          label: T.translate(`dailyResults.dailySittingTime.minute.${this.props.language}`),
          backgroundColor: 'red',
          borderColor: 'red',
          data: this.state.sitHourData,
        },
      ],
    };
  }

  render() {
    const style = {
      center: {
        textAlign: 'center',
      },
    };

    const minOptions = {
      scales: {
        yAxes: [{
          scaleLabel:{
            display: false,
            labelString: (T.translate(`dailyResults.dailySittingTime.yAxe.${this.props.language}`)),
          },
          ticks: {
            callback: value => `${value} min`,
            beginAtZero: true, 
            max: 60,
            stepSize: 10
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: T.translate(`dailyResults.dailySittingTime.xAxe.${this.props.language}`),
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
            label += ' min';
            return label;
          },
        },
      },
      legend: {
        onClick: null,
      },
    };
    const data = this.loadSitData();
    const chart = <Chart type="bar" data={data} options={minOptions} />;
   // this.setState({chart: chart});

    return (
      <div id="dailySittingTime">
        <CustomCard
         header ={(<h3 style = {style.center}>{`${this.props.title
         } (${this.state.date.getFullYear()}/${this.state.date.getMonth() + 1}/${this.state.date.getDate()})`}
         </h3>)}
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

export default connect(mapStateToProps)(DailySittingTime);
