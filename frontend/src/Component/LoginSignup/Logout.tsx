import { Button } from "../index";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300 shadow-md"
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
