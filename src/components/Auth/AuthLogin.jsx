import "./Auth.css";
import { validateNumber, validatePassword } from "../../utils";
import { loginHandler } from "../../services";
import { useAuth, useAlert } from "../../context";

export const AuthLogin = () => {
  const {
    authDispatch,
    number,
    password,
  } = useAuth();

  const { setAlert } = useAlert();

  const handleNumberChange = (event) => {
    authDispatch({
      type: "NUMBER",
      payload: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    authDispatch({
      type: "PASSWORD",
      payload: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate mobile number
    if (!validateNumber(number)) {
      setAlert({
        open: true,
        message: "Please enter a valid 10-digit mobile number.",
        type: "error",
      });
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setAlert({
        open: true,
        message: "Please enter a valid password.",
        type: "error",
      });
      return;
    }

    // Login
    const result = await loginHandler(
      number,
      password,
      setAlert
    );

    // Login successful
    if (result?.accessToken) {
      authDispatch({
        type: "SET_ACCESS_TOKEN",
        payload: result.accessToken,
      });

      authDispatch({
        type: "SET_USER_NAME",
        payload: result.username,
      });

      authDispatch({
        type: "CLEAR_USER_DATA",
      });

      authDispatch({
        type: "SHOW_AUTH_MODAL",
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
            required
            onChange={handleNumberChange}
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
            required
            onChange={handlePasswordChange}
          />
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="button btn-primary btn-login cursor"
          >
            Login
          </button>
        </div>

      </form>
    </div>
  );
};