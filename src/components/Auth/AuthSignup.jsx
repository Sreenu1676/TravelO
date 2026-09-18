import "./Auth.css";
import { useAuth, useAlert } from "../../context";
import {
  validateEmail,
  validateName,
  validateNumber,
  validatePassword,
} from "../../utils";
import { signupHandler } from "../../services";

export const AuthSignup = () => {
  const {
    username,
    email,
    password,
    number,
    confirmPassword,
    authDispatch,
  } = useAuth();

  const { setAlert } = useAlert();

  const handleNumberChange = (event) => {
    authDispatch({
      type: "NUMBER",
      payload: event.target.value,
    });
  };

  const handleNameChange = (event) => {
    authDispatch({
      type: "NAME",
      payload: event.target.value,
    });
  };

  const handleEmailChange = (event) => {
    authDispatch({
      type: "EMAIL",
      payload: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    authDispatch({
      type: "PASSWORD",
      payload: event.target.value,
    });
  };

  const handleConfirmPasswordChange = (event) => {
    authDispatch({
      type: "CONFIRM_PASSWORD",
      payload: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate form data
    const isNumberValid = validateNumber(number);
    const isNameValid = validateName(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validatePassword(confirmPassword);

    if (!isNumberValid) {
      setAlert({
        open: true,
        message: "Please enter a valid 10-digit mobile number.",
        type: "error",
      });
      return;
    }

    if (!isNameValid) {
      setAlert({
        open: true,
        message: "Please enter a valid name.",
        type: "error",
      });
      return;
    }

    if (!isEmailValid) {
      setAlert({
        open: true,
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    if (!isPasswordValid) {
      setAlert({
        open: true,
        message:
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match.",
        type: "error",
      });
      return;
    }

    if (!isConfirmPasswordValid) {
      setAlert({
        open: true,
        message: "Please enter a valid confirm password.",
        type: "error",
      });
      return;
    }

    // Send registration request to backend
    const result = await signupHandler(
      username,
      number,
      email,
      password,
      setAlert
    );

    // Clear form only when registration succeeds
    if (result?.success) {
      authDispatch({
        type: "CLEAR_USER_DATA",
      });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleFormSubmit}>

        {/* Mobile Number */}
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Mobile Number <span className="asterisk">*</span>
          </label>

          <input
            value={number}
            type="tel"
            className="auth-input"
            placeholder="Enter Mobile Number"
            onChange={handleNumberChange}
            required
          />
        </div>

        {/* Name */}
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Name <span className="asterisk">*</span>
          </label>

          <input
            value={username}
            className="auth-input"
            placeholder="Enter Name"
            onChange={handleNameChange}
            required
          />
        </div>

        {/* Email */}
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Email <span className="asterisk">*</span>
          </label>

          <input
            value={email}
            className="auth-input"
            placeholder="Enter Email"
            type="email"
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Password */}
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Password <span className="asterisk">*</span>
          </label>

          <input
            value={password}
            className="auth-input"
            placeholder="Enter Password"
            type="password"
            onChange={handlePasswordChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="d-flex direction-column lb-in-container">
          <label className="auth-label">
            Confirm Password <span className="asterisk">*</span>
          </label>

          <input
            value={confirmPassword}
            className="auth-input"
            placeholder="Confirm Password"
            type="password"
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="button btn-primary btn-login cursor"
          >
            Submit
          </button>
        </div>

      </form>
    </div>
  );
};