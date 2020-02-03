/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import { Button } from 'primereact/components/button/Button';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { T } from '../utilities/translator';
import Password from '../components/home/password';
import { ApplicationActions, URL } from '../redux/applicationReducer';
import { post } from '../utilities/secureHTTP';

class Home extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    changeProfile: PropTypes.func.isRequired,
    changeToken: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    profile: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: null,
      loginFail: false,
    };
  }

  setLoginProfile(userName) {
    if (this.state.user === userName) {
      this.setState({ user: null });
    } else {
      this.setState({ user: userName });
    }
  }

  setProfile(token) {
    const profileName = this.state.user;
    this.props.changeProfile(profileName);
    this.props.changeToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('profile', profileName);
    this.props.updateLanguage();
    if (profileName === 'user') {
      this.props.history.push('/goals');
    } else {
      this.props.history.push('/configurations');
    }
  }

  async login(passwordString) {
    try {
      const response = await post(`${URL}login`, {
        username: this.state.user,
        password: passwordString,
      });
      this.setProfile(response.data.token);
    } catch (error) {
      this.loginError(error);
    }
  }

  loginError() {
    this.setState({ loginFail: true });
  }

  clear() {
    this.setState({ user: null });
  }

  forgotPassword() {
    this.props.history.push(`/forgotpassword?user=${this.state.user}`);
  }

  render() {
    const style = {
      content: {
        textAlign: 'center',
        height: 'fit-content',
      },
      pageTop: {
        marginBottom: '2em',
      },
      profileButton: {
        backgroundColor: 'transparent',
        border: 0,
        outline: 'none',
        fontSize: '20em',
        maxHeight: '430px',
      },
      icons: {
        fontSize: '20em',
      },
    };

    return (
      <div style={style.content} className="content-section mt-5 implementation ui-fluid">
        <h2>{T.translate(`welcome.${this.props.language}`)}</h2>
        {!this.props.profile && <h3 style={style.pageTop}>{T.translate(`welcome.chooseProfile.${this.props.language}`)}</h3>}
        <div>
          {this.props.profile
            && (
              <div>
                <h4>
                  {T.translate(`welcome.loginMessage.${this.props.language}`, { userType: T.translate(`${this.props.profile}.${this.props.language}`) })}
                </h4>
                <div>
                  {
                    this.props.profile === 'user'
                      ? <i className="fa fa-user" style={style.icons} />
                      : <i className="fa fa-user-md" style={style.icons} />
                  }
                </div>
              </div>
            )
          }
          {!this.props.profile
            && (
              <div className="row">
                <div className="col-12 col-md-4 offset-md-2">
                  <h2>{T.translate(`user.${this.props.language}`)}</h2>
                  <Button
                    id="userButton"
                    onClick={() => this.setLoginProfile('user')}
                    className="p-button-secondary"
                    type="button"
                    style={style.profileButton}
                    icon="fa fa-user"
                  />
                  {this.state.user === 'user'
                    && (
                      <Password
                        onSubmit={this.login.bind(this)}
                        failed={this.state.loginFail}
                        onForgotPassword={this.forgotPassword.bind(this)}
                      />
                    )
                  }
                </div>
                <div className="col-12 col-md-4">
                  <h2>{T.translate(`clinician.${this.props.language}`)}</h2>
                  <Button
                    id="clinicianButton"
                    onClick={() => this.setLoginProfile('clinician')}
                    type="button"
                    style={style.profileButton}
                    icon="fa fa-user-md"
                  />
                  {this.state.user === 'clinician'
                    && (
                      <div>
                        <Password
                          onSubmit={this.login.bind(this)}
                          failed={this.state.loginFail}
                          onForgotPassword={this.forgotPassword}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    profile: state.applicationReducer.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeProfile: ApplicationActions.changeProfile,
    changeToken: ApplicationActions.changeToken,
    updateLanguage: ApplicationActions.updateLanguage,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
