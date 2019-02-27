import '../../styles/components/moduleStatus.css';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { connect } from 'react-redux';
import ErrorMessage from '../shared/errorMessage';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import { get } from '../../utilities/secureHTTP';

const POLLING_INTERVAL = 5000;

class ModuleStatus extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    moduleStatus: PropTypes.object.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    changeModulesStatus: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      socket: new WebSocket('ws://raspberrypi.local:1880/ws/rawData'),
      tofConnected: false,
      flowConnected: false,
      alarmConnected: false,
      pressureMatConnected: false,
      mIMUConnected: false,
      fIMUConnected: false,
    };
    let self = this
    this.state.socket.onmessage = function (evt) {
      const receivedObj = JSON.parse(evt.data);
      self.state.tofConnected = receivedObj.ToFSensor.connected
      self.state.flowConnected = receivedObj.flowSensor.connected
      self.state.alarmConnected = receivedObj.alarmSensor.connected
      self.state.pressureMatConnected = receivedObj.pressureMat.connected
      self.state.mIMUConnected = receivedObj.mIMU.connected
      self.state.fIMUConnected = receivedObj.fIMU.connected
      self.updateModulesStatus()
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  getModulesStatus() {
    var a = { 
              "notificationModule": this.state.alarmConnected,
              "fixedAccelerometer": this.state.fIMUConnected,
              "mobileAccelerometer": this.state.mIMUConnected,
              "pressureMat": this.state.pressureMatConnected, 
              "flowSensor": this.state.flowConnected, 
              "tofSensor": this.state.tofConnected
            }
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
        {this.props.hasErrors
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
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(ModuleStatus);
