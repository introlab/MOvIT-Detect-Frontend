import React, { Component } from 'react';
import { Button } from 'primereact/components/button/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, post } from '../../utilities/secureHTTP';

import ErrorMessage from '../shared/errorMessage';
import Loading from '../shared/loading';
import LogoPassword from '../shared/logoPassword';
import LogoText from '../shared/logoText';
import SubmitButtons from '../shared/submitButtons';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';

const NUMBER_OF_RETRIES = 15;
const RETRY_INTERVAL = 1000;
const ENTER_KEY = 'Enter';

class Wifi extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    isConnected: PropTypes.bool.isRequired,
    changeIsConnected: PropTypes.func.isRequired,
    hasErrors: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      wifi: '',
      password: '',
      connecting: false,
      changingNetwork: false,
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.changeWifi = this.changeWifi.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  enableConnection() {
    this.setState({ connecting: false, changingNetwork: true });
    this.props.changeIsConnected(false);
  }

  changeWifi(wifiName) {
    this.setState({ wifi: wifiName });
  }

  changePassword(passwordString) {
    this.setState({ password: passwordString });
  }

  save() {
    post(`${URL}wifi`, this.state);
    this.waitConnection();
  }

  waitConnection() {
    this.setState({ connecting: true });
    let tries = 0;
    const connectionValidation = window.setInterval(async () => {
      if (tries >= NUMBER_OF_RETRIES) {
        window.clearInterval(connectionValidation);
        this.setState({ ...this.state, connecting: false });
        this.props.changeIsConnected(false);
      } else {
        tries += 1;
        try {
          const response = await get(`${URL}wifi`);
          if (response.data.connected) {
            window.clearInterval(connectionValidation);
            this.setState({ ...this.state, connecting: false });
            this.props.changeIsConnected(true);
          }
        } catch {
          window.clearInterval(connectionValidation);
          this.setState({ ...this.state, connecting: false });
          this.props.changeIsConnected(false);
        }
      }
    }, RETRY_INTERVAL);
  }

  handleKeyPress(event) {
    if (event.key === ENTER_KEY) {
      this.save();
    }
  }

  cancel() {
    this.setState({
      wifi: '',
      password: '',
      changingNetwork: false,
    });
    this.props.changeIsConnected(true);
  }

  render() {
    if (this.props.hasErrors) {
      return <ErrorMessage />;
    }
    return (
      <div>
        {this.props.isConnected
          && (
            <div>
              <h6>{T.translate(`settings.wifi.connected.${this.props.language}`)}</h6>
              <Button
                type="button"
                className="btn btn-link"
                onClick={() => this.enableConnection()}
                label={T.translate(`settings.wifi.changeWifi.${this.props.language}`)}
              />
            </div>
          )
        }
        {!this.props.isConnected
          && (this.state.connecting
            ? <Loading key="loading" />
            : (
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <LogoText
                      iconClass="fa fa-wifi"
                      placeHolder={T.translate(`settings.wifi.name.${this.props.language}`)}
                      value={this.state.wifi}
                      onChange={this.changeWifi}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <LogoPassword
                      iconClass="fa fa-key"
                      placeHolder={T.translate(`login.password.${this.props.language}`)}
                      value={this.state.password}
                      onChange={this.changePassword}
                      onKeyPress={this.handleKeyPress}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <SubmitButtons
                      displayCancel={this.state.changingNetwork}
                      onSave={this.save.bind(this)}
                      onCancel={this.cancel.bind(this)}
                    />
                  </div>
                </div>
              </div>
            )
          )
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

export default connect(mapStateToProps)(Wifi);
