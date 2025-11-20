import { useState, useEffect } from "react";
import { ATOMIC_CHESS, FISHER_CHESS, STANDARD } from "../../../backend1/src/messages";


interface Player {
  username: string;
  rating: number;
  gamesWon : number ;
}

interface Fischer {
  username : string ;
  fisherChessRating : number ;
  fisherChessWon : number ;
}

interface Atomic {
  username : string ;
  atomicChessRating : number ;
  atomicChessWon : number ;
}

const LeaderBoard = () => {
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [fisherChess, setfisherChess] = useState<Fischer[]>([])
  const [atomicChess, setAtomicChess] = useState<Atomic[]>([])
  const [gameType, setGameType] = useState<string>(STANDARD);

  useEffect(() => {
    const fetchData = async () => {
      console.log("INSIDE FETCH DATA FUNCTION ");
      try {
        const response = await fetch(
          `http://localhost:8080/api/DashBoard?gameType=${gameType}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Player[] = await response.json();
        console.log(data);
        setPlayerData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchData();
  }, [gameType === STANDARD]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("INSIDE OF FETCH OF FISCHER")
        const response = await fetch(
          `http://localhost:8080/api/DashBoard?gameType=${gameType}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Fischer[] = await response.json();
        setfisherChess(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchData();
  }, [gameType === FISHER_CHESS]); // Add dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("INSIDE OF FETCH OF FISCHER")
        const response = await fetch(
          `http://localhost:8080/api/DashBoard?gameType=${gameType}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Atomic[] = await response.json();
        setAtomicChess(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchData();
  }, [gameType === ATOMIC_CHESS]); // Add dependency array

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-screen-lg w-full px-6 md:px-12 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Leaderboard
        </h2>

        {/* Game Type Selector */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-3 text-lg font-semibold rounded-l-lg ${
              gameType === STANDARD
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setGameType(STANDARD)}
          >
            Standard
          </button>
          <button
            className={`px-6 py-3 text-lg font-semibold ${
              gameType === FISHER_CHESS
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setGameType(FISHER_CHESS)}
          >
            Fischer Random
          </button>
          <button
            className={`px-6 py-3 text-lg font-semibold rounded-r-lg ${
              gameType === ATOMIC_CHESS
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setGameType(ATOMIC_CHESS)}
          >
            Atomic Chess
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          {playerData.length > 0 ? (
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2">#</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Rating</th>
                  <th className="py-2">Wins</th>
                </tr>
              </thead>
              <tbody>
                
                  {gameType === STANDARD &&
                    playerData.map((player, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-2 text-center">{index + 1}</td>
                        <td className="py-2 text-center">{player.username}</td>
                        <td className="py-2 text-center">{player.rating}</td>
                        <td className="py-2 text-center">{player.gamesWon}</td>
                      </tr>
                    ))}

                  {gameType === FISHER_CHESS &&
                    fisherChess.map((player, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-2 text-center">{index + 1}</td>
                        <td className="py-2 text-center">{player.username}</td>
                        <td className="py-2 text-center">
                          {player.fisherChessRating}
                        </td>
                        <td className="py-2 text-center">
                          {player.fisherChessWon}
                        </td>
                      </tr>
                    ))}

                  {gameType === ATOMIC_CHESS &&
                    atomicChess.map((player, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-2 text-center">{index + 1}</td>
                        <td className="py-2 text-center">{player.username}</td>
                        <td className="py-2 text-center">
                          {player.atomicChessRating}
                        </td>
                        <td className="py-2 text-center">
                          {player.atomicChessWon}
                        </td>
                      </tr>
                    ))}
                </tbody>
            </table>
          ) : (
            <p className="text-gray-300 text-center">Loading leaderboard...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
