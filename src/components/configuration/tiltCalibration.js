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
import { get } from '../../utilities/secureHTTP';
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
      //IMUConnected: PropTypes.bool.isRequired,
    };

    constructor(props) {
      super(props);
      const l = window.location;

      this.state = {
        socketAngle: new WebSocket(`ws://${l.host}/ws/sensors/angle`), // websocket for reading calibration state)
        socket : new WebSocket(`ws://${l.host}/ws/chairState`),
        isPopupOpened: false,
        calibrationState: '',/*props.calibrationState,*/
        IMUConnected: false,//props.IMUConnected,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        flagNextButton: false,
        flagStartButton: true,
        showInitialMessage: true,
        flagWaiting: false,
        labelCancelButton: T.translate(`calibrationPopup.cancel.${this.props.language}`),
        labelStartButton: T.translate(`calibrationPopup.start.${this.props.language}`),
        initMode: true,
        hasErrors: false,
      };
    }

    
    onWebSocketAngleMessage(evt) {
      const receivedObj = JSON.parse(evt.data);
      this.setState({
      calibrationState : receivedObj.state["stateName AA"],
      IMUConnected : receivedObj.connected,
      hasErrors: false,
      //console.log(`Socket Angle received : ${stateAngle}`);
      });

      this.updateCalibrationState();
    }

    onWebSocketAngleError(evt) {
      this.setState({ hasErrors: true });
    }

    onWebSocketMessage(evt) {
      // console.log("websocketOnMessage");
      const receivedObj = JSON.parse(evt.data);
      const seatAngle = receivedObj.Angle.seatAngle;
      this.setState({ seatAngle });
      // console.log(`on Message print, seatAngle : ${this.state.seatAngle} `);
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
      if (this.state.socketAngle) {
        this.state.socketAngle.close();
        delete this.state.socketAngle;
      }
    }
  

/*
    componentDidMount() {
      this.state.socketAngle.onmessage = this.onWebSocketAngleMessage.bind(this);
      this.state.socketAngle.onerror = this.onWebSocketAngleError.bind(this);
      this.state.socket.onmessage = this.onWebSocketMessage.bind(this);
      this.state.socket.onerror = this.onWebSocketError.bind(this);
    }*/

    async updateCalibrationState() {
      this.props.changeCalibrationState(this.state.calibrationState);
    }



    async calibrateIMU() {
      await get(`${URL}/calibrateIMU`);
      this.setState({
        ...this.state,
        showCountdownIMU: false,
        // isPopupOpened: false,
      });
    }

    openModal() {
      //this.calibrateIMU();
      this.refreashCalibration(0);
      this.setState({ 
        flagNextButton: false,
        flagStartButton: true ,
        initMode: true,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        labelCancelButton:T.translate(`calibrationPopup.cancel.${this.props.language}`),
        isPopupOpened: true });
    }
  
    

    closeModal() {

      this.setState({ 
        isPopupOpened: false,
        flagNextButton: false,
        flagStartButton: true ,
        confirmationBody: T.translate(`calibrateIMU.confirmation.${this.props.language}`),
        labelCancelButton:T.translate(`calibrationPopup.cancel.${this.props.language}`),
      });
      this.refreashCalibration(1);
      //this.enableCalibrateIMUButton();
    }

   async startModal() // bouton continuer
    {
      if (this.props.calibrationState === "CALIBRATION_WAIT_ZERO_TRIG")
      {
        await this.setState({ 
          flagNextButton: true,
         flagStartButton: false,
         initMode: false,
        });
        await this.functionEtat();
      }

     /* else if (this.props.calibrationState === "undefined")
      {
         await this.setState({initMode: true});
      await this.setState({confirmationBody : T.translate(`calibrationPopup.init.${this.props.language}`), }) ;
      await this.setState({ flagNextButton: false });
      await this.setState({ flagStartButton: false });
      await setTimeout(() => {  
      this.startModal();
      },4000);

      }*/
      else{
      await this.setState({
        initMode: true,
        confirmationBody : T.translate(`calibrationPopup.init.${this.props.language}`), 
        flagNextButton: false ,
        flagStartButton: false,
      });
       setTimeout(() => {  
      this.startModal();
      },4000);
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
    if (this.state.IMUConnected)
    {
      this.calibrateIMU();
    }
    else
    {
      this.functionEtat();
    }
      //this.functionEtat();

    }

  async refreashCalibration(step) // remettre à calibration done ou todo si step = 1 et remettre calibration à wait zero trig si step = 0
    {
      var calib_wait_trig_zero = "CALIBRATION_WAIT_ZERO_TRIG"; var calib_done = "CALIBRATION_DONE"; var calib_todo = "CALIBRATION_TODO";

      var objectif = calib_wait_trig_zero; var pass = calib_done; var pass2 = calib_todo; var objectif2 = "";
      if (step)
      {
        objectif = calib_done; objectif2 = calib_todo; pass = calib_wait_trig_zero; pass2 = "";
      }
      if  (this.props.calibrationState === pass ||
        this.props.calibrationState === pass2 ||
      this.props.calibrationState === "CALIBRATION_WAIT_INCLINED_TRIG")
      {
        this.calibrateIMU();
      }

      if (this.props.calibrationState === objectif || 
        this.props.calibrationState == objectif2 ||
        this.props.calibrationState === '')
      {
        return;
      }
      setTimeout(() => {
        this.refreashCalibration(step);
      }, 4000); 
    }

    /*
    async startCalibration() // commencer la calibration avec wait_zero_trig
    {
      if  (this.props.calibrationState === "CALIBRATION_DONE" ||
      this.props.calibrationState === "CALIBRATION_WAIT_INCLINED_TRIG" ||
      this.props.calibrationState === "CALIBRATION_TODO")
      {
        this.calibrateIMU();
      }

      if (this.props.calibrationState === "CALIBRATION_WAIT_ZERO_TRIG" ||
       this.props.calibrationState === "undefined")
      {
        return;
      }
      setTimeout(() => {
        this.startCalibration();
      }, 4000); 
    }
  */
    async functionEtat()
    {
      if (this.state.IMUConnected)
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
                this.setState({ confirmationBody: T.translate(`calibrationPopup.done.${this.props.language}`) });
                this.setState({ flagNextButton: false });
                this.setState({ labelCancelButton: T.translate(`calibrationPopup.close.${this.props.language}`) });
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
      
      this.state.socketAngle.onmessage = this.onWebSocketAngleMessage.bind(this);
      this.state.socketAngle.onerror = this.onWebSocketAngleError.bind(this);
      this.state.socket.onmessage = this.onWebSocketMessage.bind(this);
      this.state.socket.onerror = this.onWebSocketError.bind(this);
     // this.load();/*
     /*
      const state = this.state;
      const props = this.props;*/
    }
/*
    async load() {
      const promises = Promise.all([
        // this.loadUpdateInfo(),
        this.loadCalibrationState(),
        this.loadNotificationSettings(),
        this.loadPermissions(),
        this.loadWifiConnection(),
      ]);
*/

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
  };
}

export default connect(mapStateToProps)(TiltCalibration);
