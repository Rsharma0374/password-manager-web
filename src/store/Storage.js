export const getAuthToken = () => sessionStorage.getItem("sAuthorizationToken");
export const setAuthToken = (token) => sessionStorage.setItem("sAuthorizationToken", token);

export const getUserName = () => sessionStorage.getItem("sUserName");
export const setUserName = (userName) => sessionStorage.setItem("sUserName", userName);
