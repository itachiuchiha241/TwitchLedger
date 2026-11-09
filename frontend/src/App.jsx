
import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./components/LoginPage";

const API_URL = "http://localhost:5000/api/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CHECK LOGIN SESSION
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${API_URL}/me`, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      // UPDATE LOGIN STATE
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="auth-screen">
        <h2>Loading TwitchLedger...</h2>
      </div>
    );
  }

  // LOGIN PAGE
  if (!user) {
    return <LoginPage />;
  }

  // DASHBOARD
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
