import "./Alert.css";
import { useAlert } from "../../context";

export const Alert = () => {
  const { alert, setAlert } = useAlert();

  if (!alert.open) {
    return null;
  }

  const handleClose = () => {
    setAlert({
      open: false,
      message: "",
      type: "success",
    });
  };

  return (
    <div className={`alert-message ${alert.type}`}>
      <span>{alert.message}</span>

      <button onClick={handleClose} className="alert-close">
        ×
      </button>
    </div>
  );
};