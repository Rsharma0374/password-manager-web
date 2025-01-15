export const getAuthToken = () => sessionStorage.getItem("sAuthorizationToken");
export const setAuthToken = (token) => sessionStorage.setItem("sAuthorizationToken", token);
