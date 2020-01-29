/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import React, { Component } from 'react';

import { Chart } from 'primereact/components/chart/Chart';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomCard from '../../../shared/card';
import { T } from '../../../../utilities/translator';
import { OFFSET, URL } from '../../../../redux/applicationReducer';
import { get } from '../../../../utilities/secureHTTP';
import { getElement } from '../../../../utilities/loader';

class MonthlySittingTime extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      sitMonthData: [],
      sitMonthLabels: [],
      sitChartData: null,
      month: props.month,
      year: props.year, 
      isLoaded: false,
      hasErrors: false,
    };

    //this.getSitMonthData(props.month, props.year);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('MonthlySittingTime - ComponentDidUpdate', prevProps, prevState, this.state);

    if (prevState.month !== this.state.month || prevState.year !== this.state.year) {
      // This should load data async
      this.getSitMonthData(this.state.month, this.state.year);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // WARNING - this does not exist in this static function
    console.log('MonthlySittingTime - getDerivedStateFromProps', nextProps, prevState);

    if (nextProps.month !== prevState.month || nextProps.year !== prevState.year) {
      console.log('MonthlySittingTime - Month/Year updated!');

      // Return new state
      return { date: nextProps.date, isLoaded: false, hasErrors: false };
    }
    return null;
  }

  componentDidMount() {
    // This is called only when component is instanciated
    console.log('MonthlySittingTime - componentDidMount');

    // This should load data async
    this.getSitMonthData(this.state.month ,this.state.year);
  }

  async getSitMonthData(month, year) {
    const date = new Date(year, month, 1);
    console.log("MonthlySittingTime - getSitMonthData with date:",date);
    this.setState({ isLoaded: false });
    try {
      const response = await get(`http://${process.env.BHOST}:${process.env.BPORT}/sittingTime?Day=${+date}&Offset=${OFFSET}`);
      this.formatSitChartData(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  formatSitChartData(data) {
    this.state.sitMonthLabels = [];
    this.state.sitMonthData = [];
    Object.keys(data).forEach((key) => {
      this.state.sitMonthLabels.push(key.toString());
      this.state.sitMonthData.push(data[key] / 60);
    });
    this.loadSitData();
  }

  loadSitData() {
    this.state.sitChartData = {
      labels: this.state.sitMonthLabels,
      datasets: [
        {
          label: T.translate(`monthlyResults.hours.${this.props.language}`),
          backgroundColor: 'red',
          borderColor: 'red',
          data: this.state.sitMonthData,
        },
      ],
    };
  }

  render() {
    const hourOptions = {
      scales: {
        yAxes: [{
          ticks: {
            callback: value => `${value} h`,
            min: 0,
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
            label += ' h';
            return label;
          },
        },
      },
      legend: {
        onClick: null,
      },
    };
    const chart = <Chart type="bar" data={this.state.sitChartData} options={hourOptions} />;

    return (
      <div className="container" id="monthlySitting">
        <CustomCard
          header={<h4>{T.translate(`monthlyResults.wheelChair.${this.props.language}`)}</h4>}
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

export default connect(mapStateToProps)(MonthlySittingTime);
