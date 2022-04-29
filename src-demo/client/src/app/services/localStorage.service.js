const TOKEN_KEY = "jwt-token";
const USER_KEY = "jwt-user";

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
}

export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}


export function removeAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);    
}


const localStorageService = {
    setToken,
    setUser,    
    getToken,
    getUser,    
    removeAuthData
};
export default localStorageService;
