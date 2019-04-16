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
    month: PropTypes.string,
    year: PropTypes.string,
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

    this.changePeriod = this.changePeriod.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.changeYear = this.changeYear.bind(this);
  }

  changeMonth(newMonth) {
    this.setState({ month: newMonth });
  }

  changeDate(newDate) {
    this.setState({ date: newDate });
  }

  changeYear(newDate) {
    this.setState({ year: newDate });
    var now = new Date(0);
    console.log(now)
    this.setState({ date: now});
  }

  changePeriod(newPeriod) {
    this.setState({ period: newPeriod });
  }

  render() {
    return (
      <div className="mt-5">
        <ResultsCalendar onPeriodChange={this.changePeriod} onDateChange={this.changeDate} onMonthChange={this.changeMonth} onYearChange={this.changeYear} />
        <h2 className="center">{T.translate(`results.categories.angle.${this.props.language}`)}</h2>
        <hr />
        {this.state.period === 'day'
          ? <DailyAngleResults date={this.state.date} />
          : <MonthlyAngleResults month={this.state.month} />
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
