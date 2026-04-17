import { useState, useContext } from 'react';
import '../components/Forms.css'; 
import formImage2 from '../assets/formImage2.jpg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from '../Contexts/UserContext';

export default function Login() {
  const {login} = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("")

  // HANDLING FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password)
  };

  return (
    <div className="login-container">
    {/* IMAGE */}
      <div className="image-section">
        <img src={formImage2} alt="Login visual" className="form-image" />
      </div>

    {/* FORM */}
      <div className="form-section">
        <div className="form-content">
          <h1 className="form-title">We Missed You!</h1>
          
          <form onSubmit={handleSubmit}>
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
              <div className="password-wrapper">
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
            </div>

            {/* GOOGLE */}

            <button type="submit" className="submit-btn">
              Continue
            </button>
          </form>

          <p className="form-footer">
            Don't have an account? <a href="/register" className="form-link">Sign Up!</a>
          </p>
        </div>
      </div>
    </div>
  );
}