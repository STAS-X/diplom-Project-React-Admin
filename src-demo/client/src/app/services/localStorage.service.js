const APP_KEY = 'app_context';
const AUTH_KEY = 'app-auth';
const TOKEN_KEY = 'jwt-token';
const USER_KEY = 'jwt-user';

export function setAppData(data) {
  localStorage.setItem(APP_KEY, JSON.stringify({ ...getAppData(), ...data }));
}

export function getAppData() {
  return localStorage.getItem(APP_KEY)
    ? JSON.parse(localStorage.getItem(APP_KEY))
    : null;
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setAuthId(authId) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authId));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
    ? JSON.parse(localStorage.getItem(TOKEN_KEY))
    : null;
}

export function getUser() {
  return localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY))
    : null;
}

export function getAuthId() {
  return localStorage.getItem(AUTH_KEY)
    ? JSON.parse(localStorage.getItem(AUTH_KEY))
    : null;
}

export function removeAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_KEY);
}

const localStorageService = {
  setToken,
  setUser,
  getToken,
  getUser,
  setAuthId,
  getAuthId,
  setAppData,
  getAppData,
  removeAuthData,
};
export default localStorageService;
