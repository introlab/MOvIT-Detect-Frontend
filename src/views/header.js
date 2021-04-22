/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import '../styles/header.css';

import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { T } from '../utilities/translator';
import {
  ApplicationActions,
  IS_DEMO,
  IS_MOBILE,
} from '../redux/applicationReducer';

class Header extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    profile: PropTypes.string,
    changeLanguage: PropTypes.func,
    changeProfile: PropTypes.func,
    changeToken: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.props.changeProfile(localStorage.getItem('profile'));
    this.props.changeToken(localStorage.getItem('token'));
    this.props.updateLanguage();// localStorage.getItem('language'));
  }

  changeLanguage() {
    this.props.changeLanguage();
    localStorage.setItem('language', this.props.language);
  }

  logout() {
    this.props.changeProfile('');
    this.props.changeToken('');
    this.props.updateLanguage();
    localStorage.setItem('token', '');
    localStorage.setItem('profile', '');
    $('.navbar-collapse').collapse('hide');
    return <Redirect to="/home" />;
  }

  isLoggedIn() {
    if (this.props.profile === '' && localStorage.getItem('profile') === '') {
      return <Redirect to="/home" />;
    }
    return '';
  }

  render() {
    return (
      <div className="top headerNav">
        {this.isLoggedIn()}
        {IS_DEMO && (
          <div className="demo">
            <span className="demoTitle">{T.translate(`demo.${this.props.language}`)}</span>
            &nbsp;
            <span>{T.translate(`demo.message.${this.props.language}`)}</span>
          </div>
        )}
        <nav className="navbar navbar-expand-lg">
          <Link to="/home" className="navbar-brand title">MOvIT+</Link>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="nav navbar-nav mr-auto">
              {(this.props.profile === 'clinician' || this.props.profile === 'user')
                && (
                  <li className="nav-item px-3 mt-1" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <Link to="/configurations" className="navLink">{T.translate(`configurations.${this.props.language}`)}</Link>
                  </li>
                )
              }
              {this.props.profile === 'clinician'
                && (
                  <li className="nav-item px-3 mt-1" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <Link to="/recommendations" className="navLink">{T.translate(`recommendations.${this.props.language}`)}</Link>
                  </li>
                )
              }
              {this.props.profile
                && (
                  <li className="nav-item px-3 mt-1" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <Link to="/goals" className="navLink">{T.translate(`goals.${this.props.language}`)}</Link>
                  </li>
                )
              }
              {this.props.profile && !IS_MOBILE
                && (
                  <li className="nav-item px-3 mt-1" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <Link to="/results" className="navLink">{T.translate(`graphics.${this.props.language}`)}</Link>
                  </li>
                )
              }
            </ul>

            <li className="nav navbar-nav pl-1">
              <a className="small-font navLink" onClick={this.changeLanguage.bind(this)}>{(this.props.language === 'FR' || this.props.language === 'cFR') ? 'EN' : 'FR'}</a>
            </li>

            {this.props.profile && (
            <li className="nav navbar-nav pl-1" data-toggle="collapse" data-target=".navbar-collapse.show">
              <Link to="/settings" className="navLink px-2"><i className="fa fa-cog" /></Link>
            </li>
            )}

            {this.props.profile && (
              <li className="nav navbar-nav pl-1">
                <Link to="/home" className="navLink" onClick={() => this.logout()}>
                  {T.translate(`welcome.logout.${this.props.language}`)}
                  <i className="fa fa-sign-out pl-2" />
                </Link>
              </li>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps', state);

  return {
    language: state.applicationReducer.language,
    profile: state.applicationReducer.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeLanguage: ApplicationActions.changeLanguage,
    changeProfile: ApplicationActions.changeProfile,
    changeToken: ApplicationActions.changeToken,
    updateLanguage: ApplicationActions.updateLanguage,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
