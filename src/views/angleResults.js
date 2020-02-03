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
import MonthlyAngleResults from '../components/results/angleResults/monthly/monthlyAngleResults';
import DailyAngleResults from '../components/results/angleResults/daily/dailyAngleResults';


class AngleResults extends Component {
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
      width: window.innerWidth,
      date: props.date,
      month: props.month,
      year: props.year,
    };

    // console.log('AngleResults initialized with date:', this.state.date);
  }

  changeMonth(newMonth) {
    // console.log('AngleResults.changeMonth', newMonth);
    this.setState({ month: newMonth });
  }

  changeDate(newDate) {
    // console.log('AngleResults.changeDate', newDate);
    this.setState({ date: newDate });
  }

  changeYear(newYear) {
    // console.log('AngleResults.changeYear', newYear);
    this.setState({ year: newYear });
    // const now = new Date(0);
    // console.log(now);
    // this.setState({ date: now });
  }

  changePeriod(newPeriod) {
    // This changes month/day
    // console.log('AngleResults.changePeriod', newPeriod);
    this.setState({ period: newPeriod });
  }

  render() {
    // console.log('AngleResults - render()');
    return (
      <div className="mt-5">
        <ResultsCalendar
          onPeriodChange={this.changePeriod.bind(this)}
          onDateChange={this.changeDate.bind(this)}
          onMonthChange={this.changeMonth.bind(this)}
          onYearChange={this.changeYear.bind(this)}
        />
        <h2 className="center">{T.translate(`results.categories.angle.${this.props.language}`)}</h2>
        <hr />
        {
          this.state.period === 'day'
            ? <DailyAngleResults date={this.state.date} />
            : <MonthlyAngleResults month={this.state.month} year={this.state.year} />
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

export default connect(mapStateToProps)(AngleResults);
