/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import '../styles/results.css';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ResultsCalendar from '../components/results/resultsCalendar';
import { T } from '../utilities/translator';
import DailyPressureResults from '../components/results/pressureResults/daily/dailyPressureResults';
import MonthlyPressureResults from '../components/results/pressureResults/monthly/monthlyPressureResults';


class PressureResults extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
    month: PropTypes.number,
    year: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      period: 'day',
      date: props.date,
      month: props.month,
      year: props.year,
    };
  }

  changeMonth(newMonth) {
    console.log('PressureResults- changeMonth: ', newMonth);
    this.setState({ month: newMonth });
  }

  changeDate(newDate) {
    console.log('PressureResults- changeDate: ', newDate, newDate.getMonth(), newDate.getFullYear());

    // We make sure we update all state
    this.setState({ date: newDate });
    this.setState({ month: newDate.getMonth() });
    this.setState({ year: newDate.getFullYear() });
  }

  changePeriod(newPeriod) {
    console.log('PressureResults- changePeriod: ', newPeriod);
    this.setState({ period: newPeriod });
  }

  changeYear(newYear) {
    console.log('PressureResults- changeYear: ', newYear);
    this.setState({ year: newYear });
  }

  render() {
    return (
      <div>
        <ResultsCalendar
          onPeriodChange={this.changePeriod.bind(this)}
          onDateChange={this.changeDate.bind(this)}
          onMonthChange={this.changeMonth.bind(this)}
          onYearChange={this.changeYear.bind(this)}
        />

        <h2 className="center">{T.translate(`results.categories.pressure.${this.props.language}`)}</h2>
        <hr />
        {this.state.period === 'day'
          ? <DailyPressureResults date={this.state.date} />
          : <MonthlyPressureResults month={this.state.month} year={this.state.year} />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(PressureResults);
