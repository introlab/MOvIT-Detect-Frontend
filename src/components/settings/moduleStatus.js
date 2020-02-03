import '../../styles/components/moduleStatus.css';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { connect } from 'react-redux';
import ErrorMessage from '../shared/errorMessage';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import { get } from '../../utilities/secureHTTP';

class ModuleStatus extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    moduleStatus: PropTypes.object.isRequired,
    changeModulesStatus: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      socket: new WebSocket(`ws://${process.env.BHOST}:${process.env.BPORT}/ws/rawData`),
      tofConnected: false,
      flowConnected: false,
      alarmConnected: false,
      pressureMatConnected: false,
      mIMUConnected: false,
      fIMUConnected: false,
      hasErrors: false,
    };
  }

  onWebSocketMessage(evt) {
    const receivedObj = JSON.parse(evt.data);
    //All at once
    this.setState({ tofConnected: receivedObj.ToFSensor.connected ,
        flowConnected: receivedObj.flowSensor.connected,
        alarmConnected: receivedObj.alarmSensor.connected ,
        pressureMatConnected: receivedObj.pressureMat.connected, 
        mIMUConnected: receivedObj.mIMU.connected ,
        fIMUConnected: receivedObj.fIMU.connected, 
        hasErrors: false });

    this.updateModulesStatus();
  }

  onWebSocketError(evt) {
    this.setState({ hasErrors: true });
  }

  componentDidMount() {
    this.state.socket.onmessage = this.onWebSocketMessage.bind(this);
    this.state.socket.onerror = this.onWebSocketError.bind(this);
  }

  componentWillUnmount() {

    //Make sure websocket is closed
    if (this.state.socket)
    {
      this.state.socket.close();
      delete this.state.socket;
    }
  }

  getModulesStatus() {
    const a = {
      notificationModule: this.state.alarmConnected,
      fixedAccelerometer: this.state.fIMUConnected,
      mobileAccelerometer: this.state.mIMUConnected,
      pressureMat: this.state.pressureMatConnected,
      flowSensor: this.state.flowConnected,
      tofSensor: this.state.tofConnected,
    };
    return a;
  }

  async updateModulesStatus() {
    const modulesStatus = this.getModulesStatus();
    this.props.changeModulesStatus(modulesStatus);
  }

  render() {
    const moduleList = [];
    const whiteList = [
      'notificationModule',
      'fixedAccelerometer',
      'mobileAccelerometer',
      'pressureMat',
      'flowSensor',
      'tofSensor',
    ];

    for (const module in this.props.moduleStatus) {
      if (whiteList.includes(module)) {
        const moduleValue = this.props.moduleStatus[module];
        moduleList.push((
          <li className="mb-2" key={module}>
            {T.translate(`settings.state.value.${module}.${this.props.language}`)}: &nbsp;
            <span id={`sensor${module}`} className="floatRight" style={{ color: moduleValue ? 'green' : 'red' }}>
              {moduleValue
                ? <i className="fa fa-check-circle" />
                : <i className="fa fa-times-circle" />
              }
            </span>
            <Tooltip
              for={`#sensor${module}`}
              title={T.translate(`settings.state.value.${moduleValue ? 'connected' : 'disconnected'}.${this.props.language}`)}
            />
          </li>
        ));
      }
    }

    return (
      <div>
        {this.state.hasErrors
          ? <ErrorMessage />
          : (
            <div className="row">
              <div className="col-6">
                <ul className="list-unstyled smallWidth">{moduleList}</ul>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log("mapStateToProps", state);
  return {
    language: state.applicationReducer.language,
    modulesStatus: state.settingsReducer.modulesStatus,
  };
}

export default connect(mapStateToProps)(ModuleStatus);
