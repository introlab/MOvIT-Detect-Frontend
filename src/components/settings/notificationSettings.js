/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import PropTypes from 'prop-types';
import { Spinner } from 'primereact/components/spinner/Spinner';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { connect } from 'react-redux';
import ErrorMessage from '../shared/errorMessage';
import { SEC_IN_MIN } from '../../utilities/constants';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import { post } from '../../utilities/secureHTTP';

const MINIMUM_SNOOZE_TIME = 0;
const MAXIMUM_SNOOZE_TIME = 60;
let snoozeTimeout;

class NotificationSettings extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    snoozeTime: PropTypes.number.isRequired,
    enabled: PropTypes.bool.isRequired,
    isLedBlinkingEnabled: PropTypes.bool.isRequired,
    isVibrationEnabled: PropTypes.bool.isRequired,
    changeSnoozeTime: PropTypes.func.isRequired,
    changeAreNotificationsEnabled: PropTypes.func.isRequired,
    changeIsLedBlinkingEnabled: PropTypes.func.isRequired,
    changeIsVibrationEnabled: PropTypes.func.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
  }

  async enableNotifications() {
    const enabled = !this.props.enabled;
    this.props.changeAreNotificationsEnabled(enabled);
    try {
      await post(`${URL}notificationSettings`, { enabled });
      this.props.showSuccess();
    } catch {
      this.props.showError();
    }
  }

  async enableLedBlinking() {
    const isLedBlinkingEnabled = !this.props.isLedBlinkingEnabled;
    this.props.changeIsLedBlinkingEnabled(isLedBlinkingEnabled);
    try {
      await post(`${URL}notificationSettings`, { isLedBlinkingEnabled });
      this.props.showSuccess();
    } catch {
      this.props.showError();
    }
  }

  async enableVibration() {
    const isVibrationEnabled = !this.props.isVibrationEnabled;
    this.props.changeIsVibrationEnabled(isVibrationEnabled);
    try {
      await post(`${URL}notificationSettings`, { isVibrationEnabled });
      this.props.showSuccess();
    } catch {
      this.props.showError();
    }
  }

  changeSnoozeTime(snoozeTime) {
    this.props.changeSnoozeTime(parseInt(snoozeTime, 10));

    clearTimeout(snoozeTimeout);
    snoozeTimeout = setTimeout(async () => {
      try {
        await post(`${URL}notificationSettings`, { snoozeTime: parseInt(snoozeTime, 10) * SEC_IN_MIN });
        this.props.showSuccess();
      } catch {
        this.props.showError();
      }
    }, 3000);
  }

  render() {
    if (this.props.hasErrors) {
      return <ErrorMessage />;
    }
    return (
      <div>
        <div>
          <Checkbox
            id="enableNotifications"
            onChange={() => this.enableNotifications()}
            checked={this.props.enabled}
          />
          <label htmlFor="enableNotifications">
            {T.translate(`settings.notification.enableNotifications.${this.props.language}`)}
          </label>
        </div>
        <div>
          <Checkbox
            id="enableLedBlinking"
            onChange={() => this.enableLedBlinking()}
            checked={this.props.isLedBlinkingEnabled}
          />
          <label htmlFor="enableLedBlinking">
            {T.translate(`settings.notification.enableLedBlinking.${this.props.language}`)}
          </label>
        </div>
        <div>
          <Checkbox
            id="enableVibration"
            onChange={() => this.enableVibration()}
            checked={this.props.isVibrationEnabled}
          />
          <label htmlFor="enableVibration">
            {T.translate(`settings.notification.enableVibration.${this.props.language}`)}
          </label>
        </div>
        <div>
          <span>
            {T.translate(`settings.notification.snoozeTime.${this.props.language}`)}
            :&nbsp;
            <Spinner
              id="value"
              type="number"
              onChange={event => this.changeSnoozeTime(event.value)}
              value={this.props.snoozeTime}
              min={MINIMUM_SNOOZE_TIME}
              max={MAXIMUM_SNOOZE_TIME}
              maxlength={2}
              size="3"
            />
            &nbsp;
            {T.translate(`time.min.${this.props.language}`)}
            &nbsp;
            <i id="snoozeTimeToolTip" className="fa fa-info-circle" />
            <Tooltip
              for="#snoozeTimeToolTip"
              title={T.translate(`settings.notification.snoozeTimeToolTip.${this.props.language}`)}
            />
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(NotificationSettings);
