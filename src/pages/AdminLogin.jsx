import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleLogin = (e) => {

    e.preventDefault();

    // Temporary admin credentials
    const adminUsername ="sanika";
    const adminPassword = "sanika2114";


    if (
      username === adminUsername &&
      password === adminPassword
    ) {

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      navigate("/admin");

    } else {

      alert("Invalid username or password");

    }

  };


  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-logo">
          SG
        </div>

        <span className="admin-login-label">
          SARANGGRAPHICS
        </span>

        <h1>
          Admin Login
        </h1>

        <p>
          Login to manage your customer enquiries.
        </p>


        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              required
            />

          </div>


          <button
            type="submit"
            className="admin-login-button"
          >
            Login →
          </button>

        </form>

      </div>

    </div>

  );
}

export default AdminLogin;