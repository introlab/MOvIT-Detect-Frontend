/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

// ------------------------------------
// Constants
// ------------------------------------

let url;
const isDemo = false;
const offset = 0;// Math.ceil(new Date().getTimezoneOffset() / 60) * -1;

const bport = process.env.BPORT || 1880; // Backend port
const bhost = process.env.BHOST || '192.168.10.1'; // Host address for the backend

// url = `http://${bhost}:${bport}/`; // URL for the backend, this URL is exported and used throughout the code

// DL changed URL to to relative path to be proxied internally
url = '/api/';

console.log(`Mode: ${process.env.NODE_ENV}, Backend URL: ${url}`);

export const URL = url;
export const OFFSET = offset;
export const IS_DEMO = isDemo;
export const IS_MOBILE = window.innerWidth <= 500;
export const IS_TABLET = window.innerWidth <= 780;
export const LANGUAGE = 'LANGUAGE';
export const LANGUAGE_UPDATE = 'LANGUAGE_UPDATE';
export const FR = 'FR';
export const EN = 'EN';
export const cFR = 'cFR';
export const cEN = 'cEN';
export const PROFILE = 'PROFILE';
export const TOKEN = 'TOKEN';

// ------------------------------------
// Actions
// ------------------------------------
function changeLanguage() {
  return {
    type: LANGUAGE,
  };
}

function updateLanguage() {
  return {
    type: LANGUAGE_UPDATE,
  };
}

function changeProfile(profileName) {
  return {
    type: PROFILE,
    profile: profileName,
  };
}

function changeToken(tokenString) {
  return {
    type: TOKEN,
    token: tokenString,
  };
}


// Update the ui language when exitting clinician view
function updateUILanguage(lan, user) {
  let toReturn = FR;
  if (user === 'clinician') {
    if (lan.includes('FR')) {
      toReturn = cFR;
    } else {
      toReturn = cEN;
    }
  } else if (lan.includes('FR')) {
    toReturn = FR;
  } else {
    toReturn = EN;
  }
  console.log(toReturn);
  return toReturn;
}


// Toggle the language between EN and FR for the user and cFR and cEN for the clinician
function switchLanguage(lan, user) {
  let toReturn = FR;
  if (user === 'clinician') {
    if (lan.includes('FR')) {
      toReturn = cFR;
    } else {
      toReturn = cEN;
    }
  } else if (lan.includes('FR')) {
    toReturn = FR;
  } else {
    toReturn = EN;
  }

  if (toReturn === FR) {
    toReturn = EN;
  } else if (toReturn === EN) {
    toReturn = FR;
  } else if (toReturn === cEN) {
    toReturn = cFR;
  } else if (toReturn === cFR) {
    toReturn = cEN;
  }
  console.log(toReturn);
  return toReturn;
}

export const ApplicationActions = {
  changeLanguage,
  changeProfile,
  changeToken,
  updateLanguage,
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LANGUAGE]: state => (
    { ...state, language: switchLanguage(state.language, state.profile) }
  ),
  [LANGUAGE_UPDATE]: state => (
    { ...state, language: updateUILanguage(state.language, state.profile) }
  ),
  [PROFILE]: (state, action) => (
    { ...state, profile: action.profile }
  ),
  [TOKEN]: (state, action) => (
    { ...state, token: action.token, header: { headers: { Authorization: action.token } } }
  ),
};

// ------------------------------------
// Reducer
// ------------------------------------

export const initApplication = {
  language: 'FR',
  profile: '',
  userName: '',
  userID: '',
  token: null,
  header: {},
  maxAngle: null,
  userWeight: null,
};
export default function applicationReducer(state = initApplication, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
