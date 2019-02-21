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
import LogoNumber from '../components/shared/logoNumber';
import LogoText from '../components/shared/logoText';
import SubmitButtons from '../components/shared/submitButtons';
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
    changeMaxAngle: PropTypes.func.isRequired,
    userWeight: PropTypes.number,
    changeUserWeight: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      hasErrors: false,
    };
    this.load();
    this.save = this.save.bind(this);
  }

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
    if (!this.state.isLoaded) {
      return <Loading key="loading" />;
    }
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
                  iconClass="fa fa-user"
                  placeHolder={T.translate(`configurations.name.${this.props.language}`)}
                  value={this.props.userName}
                  onChange={this.props.changeUserName}
                />
                <LogoText
                  iconClass="fa fa-id-card"
                  placeHolder={T.translate(`configurations.telask.${this.props.language}`)}
                  value={this.props.userID}
                  onChange={this.props.changeUserID}
                />
                <LogoNumber
                  iconClass="fa fa-wheelchair"
                  placeHolder={T.translate(`configurations.maxTilt.${this.props.language}`)}
                  value={this.props.maxAngle}
                  onChange={this.props.changeMaxAngle}
                />
                <LogoNumber
                  iconClass="fa fa-balance-scale"
                  placeHolder={T.translate(`configurations.weight.${this.props.language}`)}
                  value={this.props.userWeight}
                  onChange={this.props.changeUserWeight}
                />
                <LogoText
                  iconClass="fa fa-server"
                  placeHolder={T.translate(`configurations.telaskHost.${this.props.language}`)}
                  value={this.props.telaskHost}
                  onChange={this.props.changeTelaskHost}
                />
                <LogoText
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
                  style={"width:"}
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeUserName: ConfigurationActions.changeUserName,
    changeUserID: ConfigurationActions.changeUserID,
    changeUserWeight: ConfigurationActions.changeUserWeight,
    changeTelaskKey: ConfigurationActions.changeTelaskKey,
    changeTelaskHost: ConfigurationActions.changeTelaskHost,
    changeTelaskUsername: ConfigurationActions.changeTelaskUsername,
    changeMaxAngle: ConfigurationActions.changeMaxAngle,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
