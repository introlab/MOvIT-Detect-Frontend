/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';
import { Growl } from 'primereact/components/growl/Growl';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, post } from '../utilities/secureHTTP';

import { ConfigurationActions } from '../redux/configurationReducer';
import ErrorMessage from '../components/shared/errorMessage';
import Loading from '../components/shared/loading';
import LogoNumber from '../components/shared/logoNumber'; // For number field
import LogoText from '../components/shared/logoText'; // For text field
import TiltCalibration from '../components/configuration/tiltCalibration.js'; // For calibration card
import LogoButton from '../components/shared/logoButton'; // For min and max angle
import SubmitButtons from '../components/shared/submitButtons'; // For saving changes
import { T } from '../utilities/translator';
import { URL } from '../redux/applicationReducer';
import LogoPassword from '../components/shared/logoPassword';

class Configuration extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
    changeUserName: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    changeUserID: PropTypes.func.isRequired,
    maxAngle: PropTypes.number,
    minAngle: PropTypes.number,
    changeMaxAngle: PropTypes.func.isRequired,
    changeMinAngle: PropTypes.func.isRequired,
    userWeight: PropTypes.number,
    changeUserWeight: PropTypes.func.isRequired,
    overrideMin: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      hasErrors: false,
      seatAngle: 0, // websocket: init seatAngle
      socket: new WebSocket(`ws://${process.env.HOST}:${process.env.BPORT}/ws/chairState`), // websocket for reading current chair angle
    };
    this.load();
    this.save = this.save.bind(this);
    // websocket: reading angle :
    const self = this;
    this.state.socket.onmessage = function (evt) {
      const receivedObj = JSON.parse(evt.data);
      let seatAngle = receivedObj.Angle.seatAngle;
      self.setState({seatAngle})
      //console.log(`on Message print, seatAngle : ${self.state.seatAngle} `);
    };
  }

  // Initial fetch of the last value stored in the backend-connected database.
  async load() {
    try {
      const response = await get(`${URL}configuration`);
      await this.mapData(response.data);
      this.setState({ isLoaded: true });
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  }

  mapData(response) {
    const self = this;
    return new Promise(
      ((resolve) => {
        self.props.changeUserName(response.userName);
        self.props.changeUserID(response.userID);
        self.props.changeMaxAngle(response.maxAngle);
        self.props.changeMinAngle(response.minAngle);
        self.props.changeUserWeight(response.userWeight);
        self.props.changeTelaskHost(response.telaskHost);
        self.props.changeTelaskKey(response.telaskKey);
        self.props.changeTelaskUsername(response.telaskUsername);
        resolve();
      }),
    );
  }

  showSuccess() {
    this.growl.show({
      severity: 'success',
      summary: T.translate(`saveMessage.success.${this.props.language}`),
    });
  }

  showError() {
    this.growl.show({
      severity: 'error',
      summary: T.translate(`saveMessage.error.${this.props.language}`),
    });
  }

  async save() {
    const data = {
      userName: this.props.userName,
      userID: this.props.userID,
      maxAngle: this.props.maxAngle,
      minAngle: this.props.minAngle,
      userWeight: this.props.userWeight,
      telaskKey: this.props.telaskKey,
      telaskUsername: this.props.telaskUsername,
      telaskHost: this.props.telaskHost,
    };
    try {
      await post(`${URL}configuration`, data);
      this.showSuccess();
    } catch {
      this.showError();
    }
  }

  cancel() { }

  render() {
    const chairImagePath = require('../res/images/chair-old.png');
    //console.log(`Current seatAngle : ${this.state.seatAngle}`);
    if (!this.state.isLoaded) {
      return <Loading key="loading" />;
    }
    //console.log(`maxAngle returned by the configurationReducer : ${this.props.maxAngle}`);
    //console.log(`minAngle returned by the configurationReducer : ${this.props.minAngle}`);

    return (
      <div>
        <Growl ref={(growl) => { this.growl = growl; }} position="topright" />
        <h2 className="header text-center mt-5 mb-4">{T.translate(`configurations.${this.props.language}`)}</h2>
        <div className="col-12 col-lg-10 offset-lg-2 mb-4 mt-3">
          {this.state.hasErrors
            ? <ErrorMessage />
            : (
              <div>
                <LogoText
                  id="name"
                  iconClass="fa fa-user"
                  placeHolder={T.translate(`configurations.name.${this.props.language}`)}
                  value={this.props.userName}
                  onChange={this.props.changeUserName}
                />
                <LogoText
                  id="telask"
                  iconClass="fa fa-id-card"
                  placeHolder={T.translate(`configurations.telask.${this.props.language}`)}
                  value={this.props.userID}
                  onChange={this.props.changeUserID}
                />
                <LogoNumber
                  iconClass="fa fa-balance-scale"
                  placeHolder={T.translate(`configurations.weight.${this.props.language}`)}
                  value={this.props.userWeight}
                  onChange={this.props.changeUserWeight}
                />
                <LogoText
                  id="telaskHost"
                  iconClass="fa fa-server"
                  placeHolder={T.translate(`configurations.telaskHost.${this.props.language}`)}
                  value={this.props.telaskHost}
                  onChange={this.props.changeTelaskHost}
                />
                <LogoText
                  id="telaskUsername"
                  iconClass="fa fa-user-circle"
                  placeHolder={T.translate(`configurations.telaskUsername.${this.props.language}`)}
                  value={this.props.telaskUsername}
                  onChange={this.props.changeTelaskUsername}
                />
                <LogoPassword
                  iconClass="fa fa-key"
                  placeHolder={T.translate(`configurations.telaskKey.${this.props.language}`)}
                  value={this.props.telaskKey}
                  onChange={this.props.changeTelaskKey}
                />
                <TiltCalibration
                  title={T.translate(`configurations.calibCardTitle.${this.props.language}`)}
                  tooltip={T.translate(`configurations.calibCardTooltip.${this.props.language}`)}
                  id="calibConfig"
                  seatAngle={this.state.seatAngle}
                />
                <LogoButton
                  id="setMaxAngle"
                  iconClass="fa fa-plus-circle"
                  btnText={T.translate(`configurations.maxTilt.${this.props.language}`)}
                  onClick={() => {
                    this.state.seatAngle === 0
                      ? this.growl.show({
                        severity: 'warn', life: 6000, summary: T.translate(`saveMessage.warnUnavailable.summary.${this.props.language}`),
                        detail: T.translate(`saveMessage.warnUnavailable.detail.${this.props.language}`),
                      })
                      : this.props.changeMaxAngle(this.state.seatAngle);
                  }}
                  value={this.props.maxAngle}
                  onChange={this.props.changeMaxAngle}
                  tooltip={T.translate(`configurations.maxTiltTooltip.${this.props.language}`)}
                />
                <LogoButton
                  id="setMinAngle"
                  iconClass="fa fa-minus-circle"
                  btnText={T.translate(`configurations.minTilt.${this.props.language}`)}
                  onClick={() => {
                    this.state.seatAngle === 0
                      ? this.growl.show({
                        severity: 'warn', life: 6000, summary: T.translate(`saveMessage.warnUnavailable.summary.${this.props.language}`),
                        detail: T.translate(`saveMessage.warnUnavailable.detail.${this.props.language}`) ,
                      })
                      : this.props.changeMinAngle(this.state.seatAngle);
                  }}
                  value={this.props.minAngle}
                  onChange={this.props.changeMinAngle}
                  tooltip={T.translate(`configurations.minTiltTooltip.${this.props.language}`)}
                />
                <SubmitButtons
                  onSave={this.save.bind(this)}
                  onCancel={this.cancel}
                />
              </div>
            )
            }
        </div>
      </div>
    );
  }
}


// Maps the state coming from the configuration reducer to a props (this.props.[])
function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    userName: state.configurationReducer.userName,
    userID: state.configurationReducer.userID,
    userWeight: state.configurationReducer.userWeight,
    telaskKey: state.configurationReducer.telaskKey,
    telaskUsername: state.configurationReducer.telaskUsername,
    telaskHost: state.configurationReducer.telaskHost,
    maxAngle: state.configurationReducer.maxAngle,
    minAngle: state.configurationReducer.minAngle,
  };
}

// Maps the function of the reducer to a prop function (this.props.[])
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeUserName: ConfigurationActions.changeUserName,
    changeUserID: ConfigurationActions.changeUserID,
    changeUserWeight: ConfigurationActions.changeUserWeight,
    changeTelaskKey: ConfigurationActions.changeTelaskKey,
    changeTelaskHost: ConfigurationActions.changeTelaskHost,
    changeTelaskUsername: ConfigurationActions.changeTelaskUsername,
    changeMaxAngle: ConfigurationActions.changeMaxAngle,
    changeMinAngle: ConfigurationActions.changeMinAngle,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
