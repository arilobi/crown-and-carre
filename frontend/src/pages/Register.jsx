import React, { useContext, useState } from 'react';
import '../components/Forms.css'; 
import formImage from '../assets/formImage.jpg';
import { UserContext } from '../Contexts/UserContext';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const {addUser} = useContext(UserContext)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Client");
  const [password, setPassword] = useState("");

  // HANDLE FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();

    addUser(name, email, password, role)
  };

  return (
    <div className="login-container">
      
      <div className="image-section">
        <img src={formImage} alt="Login visual" className="form-image" />
      </div>

      <div className="form-section">
        <div className="form-content">
          <h1 className="form-title">Create An Account!</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name" 
                className="form-input"
                placeholder="Jane Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email" 
                className="form-input"
                placeholder="janedoe@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password" 
                className="form-input"
                placeholder="Enter Password"
              />
              <span
                className="eye-icon"
                onClick={(e) => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

             {/* Role */}
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
              >
                <option value="Client">Client</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* GOOGLE */}

            <button type="submit" className="submit-btn">
              Continue
            </button>
          </form>

          <p className="form-footer">
            Already have an account? <a href="/login" className="form-link">Sign In!</a>
          </p>
        </div>
      </div>
      
    </div>
  );
}