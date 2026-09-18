import axios from "axios";

export const signupHandler = async (
  username,
  number,
  email,
  password,
  setAlert
) => {
  try {
    const response = await axios.post("/api/auth/register", {
      username,
      number,
      email,
      password,
    });

    console.log("Signed Up successfully");
    console.log("Response:", response.data);

    setAlert({
      open: true,
      message: `Account Created: username - ${username}`,
      type: "success",
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    console.error(
      "Error adding user to database:",
      err.response?.data || err.message
    );

    setAlert({
      open: true,
      message:
        err.response?.data?.message ||
        "Unable to create account",
      type: "error",
    });

    return {
      success: false,
    };
  }
};