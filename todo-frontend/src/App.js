/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Login from "./Login";
import TaskPage from "./TaskPage";
import Register from "./Register";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return showRegister ? (
      <Register setShowRegister={setShowRegister} />
    ) : (
      <Login setToken={saveToken} setShowRegister={setShowRegister} />
    );
  }

  return <TaskPage token={token} logout={logout} />;
}

export default App;
