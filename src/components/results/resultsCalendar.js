/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import React, { Component } from 'react';

import { Calendar } from 'primereact/components/calendar/Calendar';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { T } from '../../utilities/translator';
import { URL, OFFSET } from '../../redux/applicationReducer';
import { get } from '../../utilities/secureHTTP';

class ResultsCalendar extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    onPeriodChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onMonthChange: PropTypes.func.isRequired,
    onYearChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: null,
      month: null,
      year: null,
      period: 'day',
    };
    this.setDefaultDate();
    this.onPeriodChange = this.onPeriodChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.onYearChange = this.onYearChange.bind(this);
  }

  onPeriodChange(e) {
    this.props.onPeriodChange(e.value);
    this.setState({ period: e.value });
  }

  onDateChange(e) {
    var now = new Date(e.value);
    now.setFullYear(parseInt(this.state.year))
    this.setState({ date: now });
    this.props.onDateChange(now);
  }

  onMonthChange(e) {
    this.props.onMonthChange(e.value);
    this.setState({ month: e.value });
  }

  onYearChange(e) {
    this.props.onYearChange(e.value);
    this.setState({ year: e.value });

    const date = this.state.date
    date.setUTCHours(0, date.getTimezoneOffset(), 0, 0);
    const month = date.getMonth();
    const year = date.getFullYear();
    this.setState({ date, month});
    this.setState({ year: year.toString()});
    this.props.onDateChange(date);
    this.props.onMonthChange(month);
    this.props.onYearChange(year);
  }

  async setDefaultDate() {
    const response = await get(`${URL}lastDate?Offset=${OFFSET}`);
    const date = new Date(response.data);
    date.setUTCHours(0, date.getTimezoneOffset(), 0, 0);
    const month = date.getMonth();
    const year = date.getFullYear();
    this.setState({ date, month});
    this.setState({ year: year.toString()});
    this.props.onDateChange(date);
    this.props.onMonthChange(month);
    this.props.onYearChange(year);
  }

  render() {
    const style = {
      marginBottom: '20vh',
      content: {
        textAlign: 'center',
      },
    };

    const periods = [
      { label: T.translate(`graphics.day.${this.props.language}`), value: 'day' },
      { label: T.translate(`graphics.month.${this.props.language}`), value: 'month' },
    ];

    const year = [{ label: '2019', value:'2019'},
    { label: '2020', value:'2020'},
    { label: '2021', value:'2021'},
    { label: '2022', value:'2022'},
    { label: '2023', value:'2023'},
    { label: '2024', value:'2024'},
    { label: '2025', value:'2025'},
    { label: '2026', value:'2026'},
    { label: '2027', value:'2027'},
    { label: '2028', value:'2028'},
    { label: '2029', value:'2029'},
    { label: '2030', value:'2030'},
    { label: '2031', value:'2031'},
    { label: '2032', value:'2032'},
    { label: '2033', value:'2033'},
    { label: '2034', value:'2034'},
    { label: '2035', value:'2035'}];


    const months = (this.props.language === 'FR' || this.props.language === 'cFR') ? [
      { label: 'Janvier', value: 0 },
      { label: 'Février', value: 1 },
      { label: 'Mars', value: 2 },
      { label: 'Avril', value: 3 },
      { label: 'Mai', value: 4 },
      { label: 'Juin', value: 5 },
      { label: 'Juillet', value: 6 },
      { label: 'Août', value: 7 },
      { label: 'Septembre', value: 8 },
      { label: 'Octobre', value: 9 },
      { label: 'Novembre', value: 10 },
      { label: 'Décembre', value: 11 },
    ] : [
      { label: 'January', value: 0 },
      { label: 'February', value: 1 },
      { label: 'March', value: 2 },
      { label: 'April', value: 3 },
      { label: 'May', value: 4 },
      { label: 'June', value: 5 },
      { label: 'July', value: 6 },
      { label: 'August', value: 7 },
      { label: 'September', value: 8 },
      { label: 'October', value: 9 },
      { label: 'November', value: 10 },
      { label: 'December', value: 11 }];

    const title = this.state.period === 'day'
      ? T.translate(`dailyResults.${this.props.language}`)
      : T.translate(`monthlyResults.${this.props.language}`);

    const locale = {
      FR: {
        firstDayOfWeek: 1,
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames:
          ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        monthNamesShort:
          ['jan', 'fév', 'mar', 'avr', 'mai', 'jui', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'],
      },
      EN: {
        firstDayOfWeek: 1,
        dayNames: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        dayNamesShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        monthNames:
          ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      },
      cFR: {
        firstDayOfWeek: 1,
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames:
          ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        monthNamesShort:
          ['jan', 'fév', 'mar', 'avr', 'mai', 'jui', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'],
      },
      cEN: {
        firstDayOfWeek: 1,
        dayNames: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        dayNamesShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        monthNames:
          ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      },
    };

    return (
      <div className="mt-5">
        <div style={style.content}>
          <h2 className="mb-4">{title}</h2>
          <span>Date: </span>
          <Dropdown
            value={this.state.period}
            options={periods}
            onChange={e => this.onPeriodChange(e)}
            style={{ width: '150px', marginRight: '15px' }}
            placeholder="Select a period"
          />
          {
            this.state.period === 'day'
              ? <Calendar locale={locale[this.props.language]} value={this.state.date} onChange={e => this.onDateChange(e)} dateFormat="yy-mm-dd" />
              : (
                <Dropdown
                  value={this.state.month}
                  options={months}
                  onChange={e => this.onMonthChange(e)}
                  style={{ width: '150px', marginLeft: '15px' }}
                  placeholder="Select a month"
                />
              )
          }
           <Dropdown
            value={this.state.year}
            options={year}
            onChange={e => this.onYearChange(e)}
            style={{ width: '150px', marginLeft: '15px' }}
            placeholder="Select a year"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(ResultsCalendar);
