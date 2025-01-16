import React from 'react';
import { useAuth } from '../store/authStore';

function Dashboard() {
  const { authorizeToken, updateToken, logout } = useAuth();

  const handleUpdateToken = () => {
    const newToken = "new-token-value";
    updateToken(newToken);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Authorization Token: {authorizeToken || "No token available"}</p>
      <button onClick={handleUpdateToken}>Update Token</button><br></br>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
