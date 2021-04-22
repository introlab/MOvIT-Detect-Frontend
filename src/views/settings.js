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
import CustomCard from '../components/shared/card';
import DbActions from '../components/settings/dbActions';
import Loading from '../components/shared/loading';
import MemoryUsage from '../components/settings/memoryUsage';
import ModuleStatus from '../components/settings/moduleStatus';
import Notification from '../components/settings/notification';
import NotificationSettings from '../components/settings/notificationSettings';
import Permissions from '../components/settings/permissions';
import SysControl from '../components/settings/sysControl';
import { SEC_IN_MIN } from '../utilities/constants';
import { SettingsActions } from '../redux/settingsReducer';
import { T } from '../utilities/translator';
import { URL } from '../redux/applicationReducer';
// import UpdatesManager from '../components/settings/updatesManager';
import Wifi from '../components/settings/wifi';
import { get } from '../utilities/secureHTTP';

class Settings extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    dataAgreement: PropTypes.bool.isRequired,
    totalMemory: PropTypes.number.isRequired,
    usedMemory: PropTypes.number.isRequired,
    snoozeTime: PropTypes.number.isRequired,
    enabled: PropTypes.bool.isRequired,
    isLedBlinkingEnabled: PropTypes.bool.isRequired,
    isVibrationEnabled: PropTypes.bool.isRequired,
    modulesStatus: PropTypes.object.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    isWifiConnected: PropTypes.bool.isRequired,
    changeDataAgreement: PropTypes.func.isRequired,
    changeTotalMemory: PropTypes.func.isRequired,
    changeUsedMemory: PropTypes.func.isRequired,
    changeSnoozeTime: PropTypes.func.isRequired,
    changeAreNotificationsEnabled: PropTypes.func.isRequired,
    changeIsLedBlinkingEnabled: PropTypes.func.isRequired,
    changeIsVibrationEnabled: PropTypes.func.isRequired,
    changeModulesStatus: PropTypes.func.isRequired,
    changeIsUpdateAvailable: PropTypes.func.isRequired,
    changeIsWifiConnected: PropTypes.func.isRequired,
    profile: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoaded: false,
      hasUpdateInfoErrors: false,
      hasMemoryUsageErrors: false,
      hasNotificationSettingsErrors: false,
      hasPermissionsErrors: false,
      hasWifiConnectionErrors: false,
      showShutdownConfirmation: false,
      showRebootConfirmation: false,
    };


    // console.log("Settings initial props", this.props.modulesStatus)
  }

  componentDidMount() {
    // This is called only when component is instanciated
    // console.log('Settings - componentDidMount');

    // This should load data async
    this.load();
  }

  async load() {
    const promises = Promise.all([
      // this.loadUpdateInfo(),
      this.loadMemoryUsage(),
      this.loadNotificationSettings(),
      this.loadPermissions(),
      this.loadWifiConnection(),
    ]);

    await promises;
    this.setState({ isLoaded: true });
  }

  async loadWifiConnection() {
    try {
      const response = await get(`${URL}wifi`);
      this.props.changeIsWifiConnected(response.data.connected);
    } catch (error) {
      this.setState({ hasWifiConnectionErrors: true });
    }
  }

  async loadUpdateInfo() { // unimplemented update mechanism
    try {
      const response = await get(`${URL}updates`);
      this.props.changeIsUpdateAvailable(response.data.isAvailable);
    } catch (error) {
      this.setState({ hasUpdateInfoErrors: true });
    }
  }

  async loadMemoryUsage() {
    try {
      const response = await get(`${URL}memory`);
      this.props.changeTotalMemory(response.data.total);
      this.props.changeUsedMemory(response.data.used);
    } catch (error) {
      this.setState({ hasMemoryUsageErrors: true });
    }
  }

  async loadNotificationSettings() {
    try {
      const response = await get(`${URL}notificationSettings`);
      this.props.changeIsLedBlinkingEnabled(response.data.isLedBlinkingEnabled);
      this.props.changeIsVibrationEnabled(response.data.isVibrationEnabled);
      this.props.changeSnoozeTime(response.data.snoozeTime / SEC_IN_MIN);
      this.props.changeAreNotificationsEnabled(response.data.enabled);
    } catch (error) {
      this.setState({ hasNotificationSettingsErrors: true });
    }
  }

  async loadPermissions() {
    try {
      const response = await get(`${URL}dataAgreement`);
      this.props.changeDataAgreement(response.data.dataAgreement);
    } catch (error) {
      this.setState({ hasPermissionsErrors: true });
    }
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

  confirmShutdown() {
    this.setState({ showShutdownConfirmation: true });
  }

  confirmReboot() {
    this.setState({ showRebootConfirmation: true });
  }

  cancelShutdown() {
    this.setState({ showShutdownConfirmation: false });
  }

  cancelReboot() {
    this.setState({ showRebootConfirmation: false });
  }

  async shutdown() {
    this.setState({ showShutdownConfirmation: false });
    try {
      const response = await get(`${URL}shutdown`);
    } catch (error) {
      console.log('Detected error when trying to shutdown');
    }
  }

  async reboot() {
    this.setState({ showShutdownConfirmation: false });
    try {
      const response = await get(`${URL}reboot`);
    } catch (error) {
      console.log('Detected error when trying to reboot');
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loading key="loading" />;
    }
    return (
      <div>
        <Growl ref={(growl) => { this.growl = growl; }} position="topright" />
        <div className="mt-4">
          <h2 className="header text-center">{T.translate(`settings.${this.props.language}`)}</h2>
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              {/*
                this.props.profile !== 'user' && <Notification />
              }
              {{
                this.props.profile !== 'user' && <DbActions />
              } */}
              {
                //this.props.profile !== 'user' && (
                  <CustomCard
                    header={<span className="ui-card-title">{T.translate(`settings.modules.${this.props.language}`)}</span>}
                    element={(
                      <ModuleStatus
                        moduleStatus={this.props.modulesStatus}
                        changeModulesStatus={this.props.changeModulesStatus}
                      />
                    )}
                  />
               // )
              }
              {<CustomCard
                header={<span className="ui-card-title">{T.translate(`settings.notification.${this.props.language}`)}</span>}
                element={(
                  <NotificationSettings
                    snoozeTime={this.props.snoozeTime}
                    enabled={this.props.enabled}
                    isLedBlinkingEnabled={this.props.isLedBlinkingEnabled}
                    isVibrationEnabled={this.props.isVibrationEnabled}
                    changeSnoozeTime={this.props.changeSnoozeTime}
                    changeAreNotificationsEnabled={this.props.changeAreNotificationsEnabled}
                    changeIsLedBlinkingEnabled={this.props.changeIsLedBlinkingEnabled}
                    changeIsVibrationEnabled={this.props.changeIsVibrationEnabled}
                    hasErrors={this.state.hasNotificationSettingsErrors}
                    showSuccess={this.showSuccess.bind(this)}
                    showError={this.showSuccess.bind(this)}
                  />
                )}
              />}
              {
                //this.props.profile !== 'user' && (
                  <CustomCard
                    header={<span className="ui-card-title">{T.translate(`settings.wifi.${this.props.language}`)}</span>}
                    element={(
                      <Wifi
                        isConnected={this.props.isWifiConnected}
                        changeIsConnected={this.props.changeIsWifiConnected}
                        hasErrors={this.state.hasWifiConnectionErrors}
                      />
                    )}
                  />
                //)
              }
              <CustomCard
                header={<span className="ui-card-title">{T.translate(`settings.permissions.${this.props.language}`)}</span>}
                element={(
                  <Permissions
                    dataAgreement={this.props.dataAgreement}
                    changeDataAgreement={this.props.changeDataAgreement}
                    hasErrors={this.state.hasPermissionsErrors}
                    showSuccess={this.showSuccess.bind(this)}
                    showError={this.showSuccess.bind(this)}
                  />
                )}
              />
              {this.props.profile !== 'user' && (
                <CustomCard
                  header={<span className="ui-card-title">{T.translate(`settings.system.${this.props.language}`)}</span>}
                  element={(
                    <div>
                      <h6>{T.translate(`settings.system.memory.${this.props.language}`)}</h6>
                      <MemoryUsage
                        total={this.props.totalMemory}
                        used={this.props.usedMemory}
                        hasErrors={this.state.hasMemoryUsageErrors}
                      />{/* TODO (finish and solve errors to add shutdown and reboot button...)
                      &nbsp;
                      <h6>{T.translate(`settings.system.control.${this.props.language}`)}</h6>
                      <SysControl
                        onClickShutdown={this.props.confirmShutdown.bind(this)}
                        onClickReboot={this.props.confirmReboot.bind(this)}
                        btnTextShutdown={T.translate(`settings.system.control.btnShutdown.${this.props.language}`)}
                        btnTextReboot={T.translate(`settings.system.control.btnReboot.${this.props.language}`)}
                      /> */}
                      {/* <br />
                      <h6>{T.translate(`settings.system.update.${this.props.language}`)}</h6>
                      <UpdatesManager                                            /Completely broken and useless card
                        isUpdateAvailable={this.props.isUpdateAvailable}
                        changeIsUpdateAvailable={this.props.changeIsUpdateAvailable}
                        hasErrors={this.state.hasUpdateInfoErrors}
                      /> */}
                      <br />
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>{/*
        <ConfirmationPopup
          title={T.translate(`settings.system.control.${this.props.language}`)}
          body={T.translate(`settings.system.control.confirmationReboot.${this.props.language}`)}
          show={this.state.showRebootConfirmation}
          onConfirm={this.reboot.bind(this)}
          onClose={this.cancelReboot.bind(this)}
        />
        <ConfirmationPopup
          title={T.translate(`settings.system.control.${this.props.language}`)}
          body={T.translate(`settings.system.control.confirmationShutdown.${this.props.language}`)}
          show={this.state.showShutdownConfirmation}
          onConfirm={this.shutdown.bind(this)}
          onClose={this.cancelShutdown.bind(this)}
        /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log("mapStateToProps state", state);

  return {
    profile: state.applicationReducer.profile,
    language: state.applicationReducer.language,
    dataAgreement: state.settingsReducer.dataAgreement,
    totalMemory: state.settingsReducer.totalMemory,
    usedMemory: state.settingsReducer.usedMemory,
    snoozeTime: state.settingsReducer.snoozeTime,
    enabled: state.settingsReducer.enabled,
    isLedBlinkingEnabled: state.settingsReducer.isLedBlinkingEnabled,
    isVibrationEnabled: state.settingsReducer.isVibrationEnabled,
    modulesStatus: state.settingsReducer.modulesStatus,
    isUpdateAvailable: state.settingsReducer.isUpdateAvailable,
    isWifiConnected: state.settingsReducer.isWifiConnected,
  };
}

function mapDispatchToProps(dispatch) {
  // console.log("mapDispatchToProps");

  return bindActionCreators({
    changeDataAgreement: SettingsActions.changeDataAgreement,
    changeTotalMemory: SettingsActions.changeTotalMemory,
    changeUsedMemory: SettingsActions.changeUsedMemory,
    changeAreNotificationsEnabled: SettingsActions.changeAreNotificationsEnabled,
    changeIsLedBlinkingEnabled: SettingsActions.changeIsLedBlinkingEnabled,
    changeIsVibrationEnabled: SettingsActions.changeIsVibrationEnabled,
    changeSnoozeTime: SettingsActions.changeSnoozeTime,
    changeModulesStatus: SettingsActions.changeModulesStatus,
    changeIsUpdateAvailable: SettingsActions.changeIsUpdateAvailable,
    changeIsWifiConnected: SettingsActions.changeIsWifiConnected,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
