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

class TiltCalibration extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      tooltip: PropTypes.string,
      id: PropTypes.string,
      seatAngle: PropTypes.number.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        isPopupOpened: false,
      };
    }

    async calibrateIMU() {
      await get(`${URL}calibrateIMU`);
      this.setState({
        ...this.state,
        showCountdownIMU: false,
        isPopupOpened: false,
      });
    }

    openModal() {
      this.setState({ isPopupOpened: true });
    }

    closeModal() {
      this.setState({ isPopupOpened: false });
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
            body={T.translate(`calibrateIMU.confirmation.${this.props.language}`)}
            show={this.state.isPopupOpened}
            onConfirm={() => this.calibrateIMU()}
            onClose={() => this.closeModal()}
          />
            &nbsp;
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(TiltCalibration);
