import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken} from '../store/Storage';
const AuthContext = createContext({
  user: null,
  authorizeToken: null,
  login: () => {},
  logout: () => {},
  updateToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authorizeToken, setAuthorizeToken] = useState(null);


  const login = (userData) => setUser(userData);

  useEffect(() => {
    // Load token from sessionStorage when the app initializes
    const authorizationToken = getAuthToken();
    if (authorizationToken) {
      setAuthorizeToken(authorizationToken);
    }
  }, []);

  const updateToken = (token) => {
    setAuthorizeToken(token);
    setAuthToken(token); // Persist token in sessionStorage
  };

  const logout = () => {
    setUser(null);
    setAuthorizeToken(null);
    setAuthToken(null); // Clear token from sessionStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateToken, authorizeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
