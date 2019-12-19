import '../styles/components/moduleStatus.css';

/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

export const DATA_AGREEMENT = 'DATA_AGREEMENT';
export const SNOOZE_TIME = 'SNOOZE_TIME';
export const ENABLED = 'ENABLED';
export const IS_LED_BLINKING_ENABLED = 'IS_LED_BLINKING_ENABLED';
export const IS_VIBRATION_ENABLED = 'IS_VIBRATION_ENABLED';
export const TOTAL_MEMORY = 'TOTAL_MEMORY';
export const USED_MEMORY = 'USED_MEMORY';
export const MODULES_STATUS = 'MODULES_STATUS';
export const IS_UPDATE_AVAILABLE = 'IS_UPDATE_AVAILABLE';
export const LAST_UPDATE_DATE = 'LAST_UPDATE_DATE';
export const WIFI_CONNECTION = 'WIFI_CONNECTION';

// -------------- NOTIFICATION SETTINGS --------------
function changeAreNotificationsEnabled(isEnabled) {
  return {
    type: ENABLED,
    enabled: isEnabled,
  };
}

function changeIsLedBlinkingEnabled(isEnabled) {
  return {
    type: IS_LED_BLINKING_ENABLED,
    isLedBlinkingEnabled: isEnabled,
  };
}

function changeIsVibrationEnabled(isEnabled) {
  return {
    type: IS_VIBRATION_ENABLED,
    isVibrationEnabled: isEnabled,
  };
}

function changeSnoozeTime(time) {
  return {
    type: SNOOZE_TIME,
    snoozeTime: time,
  };
}

// -------------- MEMORY --------------
function changeTotalMemory(totalMemory) {
  return {
    type: TOTAL_MEMORY,
    totalMemory,
  };
}

function changeUsedMemory(usedMemory) {
  return {
    type: USED_MEMORY,
    usedMemory,
  };
}

// -------------- PERMISSIONS --------------
function changeDataAgreement(agree) {
  return {
    type: DATA_AGREEMENT,
    dataAgreement: agree,
  };
}

// -------------- MODULES STATUS --------------
function changeModulesStatus(modulesStatus) {
  return {
    type: MODULES_STATUS,
    modulesStatus,
  };
}

function changeIsUpdateAvailable(isAvailable) {
  return {
    type: IS_UPDATE_AVAILABLE,
    isUpdateAvailable: isAvailable,
  };
}

// -------------- WIFI --------------
function changeIsWifiConnected(isConnected) {
  return {
    type: WIFI_CONNECTION,
    isWifiConnected: isConnected,
  };
}

export const SettingsActions = {
  changeAreNotificationsEnabled,
  changeIsLedBlinkingEnabled,
  changeIsVibrationEnabled,
  changeSnoozeTime,
  changeTotalMemory,
  changeUsedMemory,
  changeDataAgreement,
  changeModulesStatus,
  changeIsUpdateAvailable,
  changeIsWifiConnected,
};

const ACTION_HANDLERS = {
  [DATA_AGREEMENT]: (state, action) => (
    { ...state, dataAgreement: action.dataAgreement }
  ),
  [ENABLED]: (state, action) => (
    { ...state, enabled: action.enabled }
  ),
  [IS_LED_BLINKING_ENABLED]: (state, action) => (
    { ...state, isLedBlinkingEnabled: action.isLedBlinkingEnabled }
  ),
  [IS_VIBRATION_ENABLED]: (state, action) => (
    { ...state, isVibrationEnabled: action.isVibrationEnabled }
  ),
  [SNOOZE_TIME]: (state, action) => (
    { ...state, snoozeTime: action.snoozeTime }
  ),
  [TOTAL_MEMORY]: (state, action) => (
    { ...state, totalMemory: action.totalMemory }
  ),
  [USED_MEMORY]: (state, action) => (
    { ...state, usedMemory: action.usedMemory }
  ),
  [MODULES_STATUS]: (state, action) => (
    { ...state, modulesStatus: action.modulesStatus }
  ),
  [IS_UPDATE_AVAILABLE]: (state, action) => (
    { ...state, isUpdateAvailable: action.isUpdateAvailable }
  ),
  [WIFI_CONNECTION]: (state, action) => (
    { ...state, isWifiConnected: action.isWifiConnected }
  ),
};

export const initParameter = {
  dataAgreement: true,
  enabled: true,
  isLedBlinkingEnabled: true,
  isVibrationEnabled: true,
  isUpdateAvailable: false,
  isWifiConnected: false,
  snoozeTime: 10,
  totalMemory: 0,
  usedMemory: 0,
  modulesStatus: {},
};

export default function applicationReducer(state = initParameter, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
