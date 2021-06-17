/**
 * @author Charles Maheu
 */


import React, { Component } from 'react';

import { Button } from 'primereact/components/button/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import ConfirmationPopup from '../popups/confirmationPopup';
import CustomCard from '../shared/card';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import { get, post} from '../../utilities/secureHTTP';
import confirmationPopup from '../popups/confirmationPopup';
import { TELASK_HOST } from '../../redux/configurationReducer';

class TiltCalibration extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      tooltip: PropTypes.string,
      id: PropTypes.string,
      seatAngle: PropTypes.number.isRequired,
      calibrationState: PropTypes.string.isRequired,
      changeCalibrationState: PropTypes.func.isRequired,
      IMUState: PropTypes.bool.isRequired,
      changeIMUState: PropTypes.func.isRequired,
    };

    constructor(props) {
      super(props);
      const l = window.location;

      this.state = {
        socket: new WebSocket(`ws://${l.host}/ws/sensors/angle`), // websocket for reading calibration state)
        isPopupOpened: false,
        calibrationState: '',/*props.calibrationState,*/
        IMUState: false,//props.IMUConnected,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        flagNextButton: false,
        flagStartButton: true,
        labelCancelButton: T.translate(`calibrationPopup.cancel.${this.props.language}`),
        initMode: true,
        hasErrors: false,
      };
    }

    
    onWebSocketMessage(evt) {
      const receivedObj = JSON.parse(evt.data);
      this.setState({
      calibrationState : receivedObj.state["stateName AA"],
      IMUState : receivedObj.connected,
      hasErrors: false,
      //console.log(`Socket Angle received : ${stateAngle}`);
      });

      this.updateState();
    }

    onWebSocketError(evt) {
      this.setState({ hasErrors: true });
    }
    componentWillUnmount() {
      // console.log("Configuration - componentWillUnmount");
      if (this.state.socket) {
        this.state.socket.close();
        delete this.state.socket;
      }
    }

    async updateState() {
      this.props.changeCalibrationState(this.state.calibrationState);
      this.props.changeIMUState(this.state.IMUState);
    }

    calibrateIMU(state) {
      post(`${URL}/calibrateIMU`, {'calibrationState': state});
    }

    openModal() {
      this.setState({ 
        flagNextButton: false,
        flagStartButton: true ,
        initMode: true,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        labelCancelButton:T.translate(`calibrationPopup.cancel.${this.props.language}`),
        isPopupOpened: true });
    }
  
    closeModal() {
      this.calibrateIMU(false);
      this.setState({ 
        isPopupOpened: false,
        flagNextButton: false,
        flagStartButton: true ,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        labelCancelButton:T.translate(`calibrationPopup.cancel.${this.props.language}`),
      });
    }

   startModal() // bouton commencer
    {
      if (!this.props.IMUState){ // IMU not connected 
        this.functionEtat();
      }
      else {
        this.calibrateIMU(true);
        this.setState({ 
          flagNextButton: true,
          flagStartButton: false,
          initMode: false,
          confirmationBody : T.translate(`calibrationPopup.init.${this.props.language}`), 
          flagNextButton: false ,
          flagStartButton: false,
        });
        setTimeout(() => {  
          this.functionEtat;
          this.setState({
            flagNextButton: true,
            flagStartButton: false,
          })
        },3500);
      }
    }

    nextStep() {
      /*    
    INIT = 0
    AA_ERROR = 1
    CHECK_CALIBRATION_VALID = 2
    CALIBRATION_WAIT_ZERO_TRIG = 3
    CALIBRATION_RUNNING_ZERO = 4
    CALIBRATION_WAIT_INCLINED_TRIG = 5
    CALIBRATION_RUNNING_INCLINED = 6
    CALIBRATION_WAIT_ROT_WORLD_CALC = 7
    CALIBRATION_DONE = 8
    CALIBRATION_TODO = 9*/
    if (this.props.IMUState)
    {
      this.calibrateIMU(true);
    }
    else
    {
      this.functionEtat();
    }

    }

    async functionEtat()
    {
      if (this.props.IMUState)
      {
        if (!this.state.initMode){
          this.setState({flagNextButton: true});
            switch(this.props.calibrationState)
            {
              case "INIT":
               this.setState({confirmationBody: T.translate(`calibrationPopup.put_to0.${this.props.language}`)});
                break;

              case "AA_ERROR":
                this.setState({confirmationBody: T.translate(`calibrationPopup.put_to0.${this.props.language}`)});
                break;
              
              case "CHECK_CALIBRATION_VALID":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.put_to0.${this.props.language}`) });
                break;

              case "CALIBRATION_WAIT_ZERO_TRIG":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.put_to0.${this.props.language}`) });
                break;
                
              case "CALIBRATION_RUNNING_ZERO":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.wait.${this.props.language}`) });
                this.setState({ flagNextButton: false });
                break;

              case "CALIBRATION_WAIT_INCLINED_TRIG":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.inclined.${this.props.language}`) });
                break;

              case "CALIBRATION_WAIT_ROT_WORLD_CALC":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.wait.${this.props.language}`) });
                this.setState({ flagNextButton: false });
                break;
              
              case "CALIBRATION_DONE":
                this.setState({ 
                  confirmationBody: T.translate(`calibrationPopup.done.${this.props.language}`),
                  flagNextButton: false,
                  labelCancelButton: T.translate(`calibrationPopup.close.${this.props.language}`),
                });

                break;
              
              case "CALIBRATION_TODO":
                this.setState({ confirmationBody: T.translate(`calibrationPopup.to_do.${this.props.language}`) });
                break;

              case '':
                this.setState({ confirmationBody: T.translate(`calibrationPopup.error.${this.props.language}`) });
                break;
          }
        }
      }
      else
      {
        this.setState({ confirmationBody: T.translate(`calibrationPopup.IMUDisconnected.${this.props.language}`) });
        this.setState({ labelCancelButton: T.translate(`calibrationPopup.close.${this.props.language}`) });
        this.setState({ flagStartButton: false });
        this.setState({ flagNextButton: false });
      }
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.calibrationState !== this.props.calibrationState)
        {
          this.functionEtat();
        }
    }

    componentDidMount() {
      this.state.socket.onmessage = this.onWebSocketMessage.bind(this);
      this.state.socket.onerror = this.onWebSocketError.bind(this);
    }


    render() {
      const chairImagePath = require('../../res/images/chair-old.png');
      return (
        <div className="col-12 col-lg-8">
          <CustomCard
            header={(
              <div className="ui-card-title">
                {this.props.title}
                {this.props.tooltip
                            && <i id={`tiltCalibration${this.props.id}`} className="fa fa-info-circle px-2" />
                        }
              </div>
)}
            element={(
              <div className="row">
                <div className="col-4 justify-content-center align-self-center">
                  <img
                    src={chairImagePath}
                    width="100"
                    height="100"
                    alt="chair"
                    style={{ transform: `rotate(${-1 * this.props.seatAngle}deg)` }}
                  />
                </div>
                <div className="col-2 justify-content-center align-self-center">
                  {`${this.props.seatAngle} deg`}
                            &nbsp;
                </div>
                <div className="col-6 justify-content-center align-self-center">
                  {/* <div className="col-12 col-sm-6 col-md-4 mb-2"> */}
                  <Button
                    id="calibrateIMU-button"
                    type="button"
                    onClick={() => this.openModal()}
                    className="p-button-secondary"
                    label={T.translate(`calibrateIMU.${this.props.language}`)}
                  />
                </div>
              </div>
)}
          />
          <Tooltip
            for={`#tiltCalibration${this.props.id}`}
            title={this.props.tooltip}
          />
          <ConfirmationPopup
            title={T.translate(`calibrateIMU.title.${this.props.language}`)}
            body={this.state.confirmationBody}//T.translate(`calibrateIMU.confirmation.${this.props.language}`)}
            show={this.state.isPopupOpened}
            onStart={() => this.startModal()}
            onClose={() => this.closeModal()}
            onNext={() => this.nextStep()}
            flagNextButton={this.state.flagNextButton}
            flagStartButton={this.state.flagStartButton}
            labelCancelButton = {this.state.labelCancelButton}
          />
            &nbsp;
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
    calibrationState: state.configurationReducer.calibrationState,
    IMUState: state.configurationReducer.IMUState,
  };
}

export default connect(mapStateToProps)(TiltCalibration);
