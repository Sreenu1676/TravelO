import axios from "axios";

export const loginHandler = async (number, password, setAlert) => {
  try {
    const response = await axios.post("/api/auth/login", {
      number,
      password,
    });

    const { accessToken, user } = response.data;

    const username = user.username;

    console.log("Logged IN");
    console.log("Username:", username);
    console.log("Access Token:", accessToken);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("username", username);

    setAlert({
      open: true,
      message: "Login Successful!",
      type: "success",
    });

    return {
      accessToken,
      username,
    };
  } catch (err) {
    console.error(
      "Unable to login:",
      err.response?.data || err.message
    );

    setAlert({
      open: true,
      message: err.response?.data?.message || "Unable to login",
      type: "error",
    });

    return {};
  }
};