/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

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

class DailyAngleDistribution extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      dayData: [],
      date: props.date,
      isLoaded: false,
      hasErrors: false,
    };

    //console.log('DailyAngleDistribution ctor with date', this.state.date);
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('DailyAngleDistribution - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.date !== this.state.date) {
      // This should load data async
      this.getDayData(this.state.date);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    //console.log('DailyAngleDistribution - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.date !== prevState.date) {
      //console.log('Date updated!');

      // Return new state
      return { date: nextProps.date, isLoaded: false, hasErrors: false };
    }
    return null;
  }

  componentDidMount() {
    // This is called only when component is instanciated
    //console.log('DailyAngleDistribution - componentDidMount');

    // This should load data async
    this.getDayData(this.state.date);
  }

  async getDayData(date) {
    this.setState({ hasErrors: false, isLoaded: false });
    console.log('DailyAngleDistribution - getDayData() date:', this.state.date);
    try {
      const response = await get(`http://${process.env.BHOST}:${process.env.BPORT}/oneDay?Day=${+date}&Offset=${OFFSET}`);
      this.state.dayData = response.data.map(v => v / 60000);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  getChartData() {
    return {
      labels: [
        T.translate(`dailyResults.angleDistribution.zero.${this.props.language}`),
        T.translate(`dailyResults.angleDistribution.fifteen.${this.props.language}`),
        T.translate(`dailyResults.angleDistribution.thirty.${this.props.language}`),
        T.translate(`dailyResults.angleDistribution.fortyfive.${this.props.language}`),
        T.translate(`dailyResults.angleDistribution.more.${this.props.language}`),
      ],
      datasets: [
        {
          data: this.state.dayData,
          backgroundColor: [
            'red',
            'green',
            'blue',
            'orange',
            'purple',
          ],
          hoverBackgroundColor: [
            'red',
            'green',
            'blue',
            'orange',
            'purple',
          ],
        },
      ],
    };
  }

  formatTime(min) {
    const hours = Math.floor(min / 60);
    let minutes = Math.floor((min - ((hours * 3600)) / 60));
    let seconds = Math.floor((min * 60) - (hours * 3600) - (minutes * 60));

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  render() {
    console.log('DailyAngleDistribution - render() date:', this.state.date);

    const minOptions = {
      tooltips: {
        callbacks: {
          label: (tooltipItem, labelData) => {
            let label = labelData.labels[tooltipItem.index] || '';
            if (label) {
              label += ': ';
            }
            label += this.formatTime(labelData.datasets[0].data[tooltipItem.index]);
            return label;
          },
        },
      },
    };
    const data = this.getChartData();
    const chart = <Chart type="pie" data={data} options={minOptions} />;

    return (
      <div className="container graphic" id="dailyAngle">
        <CustomCard
          header={<h4>{T.translate(`dailyResults.angleDistribution.${this.props.language}`)} </h4>}
          element={getElement(this.state.isLoaded, this.state.hasErrors, chart)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    reduceWeight: state.recommendationReducer.reduceWeight,
    reduceSlidingRest: state.recommendationReducer.reduceSlidingRest,
    reduceSlidingMoving: state.recommendationReducer.reduceSlidingMoving,
  };
}

export default connect(mapStateToProps)(DailyAngleDistribution);
