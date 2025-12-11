export function insertIntoStorage(data, remember) {
  if (remember === true) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('remember', true);
  } else {
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('role', data.role);
  }
}

export function checkStorage() {
  const sAccessToken = sessionStorage.getItem('access_token');
  const lAccessToken = localStorage.getItem('access_token');
  const lRole = localStorage.getItem('role');
  if (sAccessToken === null) {
    if (lAccessToken !== null) {
      if (localStorage.getItem('remember')) {
        // session Storage
        sessionStorage.setItem('access_token', lAccessToken);
        sessionStorage.setItem('role', lRole);
      }
    }
  }
}

export function setUserData(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
  sessionStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData() {
  let sessionData = sessionStorage.getItem('userData');
  const localData = localStorage.getItem('userData');

  if (sessionData == null) {
    if (localData) {
      if (localStorage.getItem('remember')) {
        // session Storage
        sessionStorage.setItem('userData', localData);
        sessionData = localData;
        return JSON.parse(sessionData);
      }
    } else {
      return null;
    }
  } else return JSON.parse(sessionData);
  return null;
}

export function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
}
