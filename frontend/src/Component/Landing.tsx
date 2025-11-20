import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import chessBoard from "../assets/chessBoard.png";
import { Button, Logout } from ".";

const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-green-400">ChessVerse</h1>
        <div className="flex gap-6">
          {isAuthenticated && (
            <div className=" flex gap-6 ">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </Button>
            </div>
          )}
          {!isAuthenticated ? (
            <Button
              className=" bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Logout />
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 px-6 md:px-12 py-12 gap-10">
        {/* Chess Board Image */}
        <div className="flex justify-center">
          <img
            src={chessBoard}
            className="max-w-md drop-shadow-lg transition-transform transform hover:scale-105"
            alt="Chess Board"
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to <span className="text-green-400">ChessVerse</span>
          </h1>
          <p className="text-lg mt-3 text-gray-300">
            Play chess with your friends and challenge your skills.
          </p>

          {/* Play Options */}
          <div className="mt-6 flex flex-col md:flex-row justify-center md:justify-start gap-5 flex-wrap ">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
              onClick={() => {
                isAuthenticated ? (
                  navigate("/standard")
                ) : navigate("/login")
              }}
            >
              Play Standard
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
              onClick={() => {
                isAuthenticated ? (
                  navigate("/fischer")
                ) : navigate("/login")
              }}
            >
              Play Fischer Random
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md"
              onClick={() => {
                isAuthenticated ? (
                  navigate("/atomic")
                ) : navigate("/login")
              }}
            >
              Play Atomic Chess
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
