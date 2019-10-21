/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

export const USER_NAME = 'USER_NAME';
export const USER_ID = 'USER_ID';
export const USER_WEIGHT = 'USER_WEIGHT';
export const MAX_ANGLE = 'MAX_ANGLE';
export const MIN_ANGLE = 'MIN_ANGLE';
export const TELASK_KEY = 'TELASK_KEY';
export const TELASK_USERNAME = 'TELASK_USERNAME';
export const TELASK_HOST = 'TELASK_HOST';


// ------------------------------------
// Actions
// ------------------------------------

function changeUserName(name) {
  return {
    type: USER_NAME,
    userName: name,
  };
}

function changeTelaskKey(key) {
  return {
    type: TELASK_KEY,
    telaskKey: key,
  };
}

function changeTelaskUsername(username) {
  return {
    type: TELASK_USERNAME,
    telaskUsername: username,
  };
}

function changeTelaskHost(host) {
  return {
    type: TELASK_HOST,
    telaskHost: host,
  };
}

function changeUserID(id) {
  return {
    type: USER_ID,
    userID: id,
  };
}
function changeUserWeight(weight) {
  return {
    type: USER_WEIGHT,
    userWeight: weight,
  };
}
function changeMaxAngle(angle) {
  return {
    type: MAX_ANGLE,
    maxAngle: angle, // Math.floor(Math.random() * 80), // To change for fetching the current seat angle as detected by the system
  };
}

function changeMinAngle(angle) {
  return {
    type: MIN_ANGLE,
    minAngle: angle,
  };
}

export const ConfigurationActions = {
  changeUserName,
  changeUserID,
  changeUserWeight,
  changeMaxAngle,
  changeMinAngle,
  changeTelaskKey,
  changeTelaskHost,
  changeTelaskUsername,
};

const ACTION_HANDLERS = {
  [USER_NAME]: (state, action) => (
    { ...state, userName: action.userName }
  ),
  [USER_ID]: (state, action) => (
    { ...state, userID: action.userID }
  ),
  [USER_WEIGHT]: (state, action) => (
    { ...state, userWeight: action.userWeight }
  ),
  [MAX_ANGLE]: (state, action) => (
    { ...state, maxAngle: action.maxAngle }
  ),
  [MIN_ANGLE]: (state, action) => (
    { ...state, minAngle: action.minAngle }
  ),
  [TELASK_KEY]: (state, action) => (
    { ...state, telaskKey: action.telaskKey }
  ),
  [TELASK_HOST]: (state, action) => (
    { ...state, telaskHost: action.telaskHost }
  ),
  [TELASK_USERNAME]: (state, action) => (
    { ...state, telaskUsername: action.telaskUsername }
  ),
};

// ------------------------------------
// Reducer
// ------------------------------------

export const initConfiguration = {
  userName: '',
  userID: '',
  maxAngle: null,
  minAngle: null, // was forgotten ?!
  userWeight: null,
  telaskKey: '',
  telaskUsername: '',
  telaskHost: '',
};
export default function configurationReducer(state = initConfiguration, action) { // changed applicationReducer to configurationReducer
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
