import {useEffect , useState  , useRef} from "react";
import { jwtDecode } from "jwt-decode";

interface IUser {
    username : string | null ,
    bio : string | null ,
    avatarUrl : string  ,
    stats : Stats | null ;
}

type Stats = {
  standard: { rating: number; wins: number };
  fischer: { rating: number; wins: number };
  atomic: { rating: number; wins: number };
};

interface userstats {
gamesWon : number ;
fisherChessWon : number ;
atomicChessWon : number ;
rating : number ; 
fisherChessRating : number ; 
atomicChessRating : number ; 
bio : string ;
}

const createUser = ({
  username,
  bio,
  avatarUrl,
  stats,
}: {
  username: string | null;
  bio: string;
  avatarUrl: string;
  stats: Stats;
}):IUser => {
  return {
    username,
    bio,
    avatarUrl,
    stats
  };
};

// Example usage



const Profile = () => {


const [user, setuser] = useState<IUser | null>(null)
const [isEditable, setisEditable] = useState(false) 
const [bio, setbio] = useState<string | null>(null)
const bioInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decode: { username: string } = jwtDecode(token);

      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/profile?username=${decode.username}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data: userstats = await response.json(); // assuming it's an object, not an array
          

          const user = createUser({
            username: decode.username,
            bio: data.bio,
            avatarUrl: "https://i.pravatar.cc/150?img=10",
            stats: {
              standard: { rating: data.rating, wins: data.gamesWon },
              fischer: {
                rating: data.fisherChessRating,
                wins: data.fisherChessWon,
              },
              atomic: {
                rating: data.atomicChessRating,
                wins: data.atomicChessWon,
              },
            },
          });

          setbio(user.bio) ;

          setuser(user);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
}, []);

useEffect(() => {
  if(isEditable && bioInputRef.current){
    bioInputRef.current.focus() ;
  }
} , [isEditable])

 if (!user) {
   return (
     <div className="min-h-screen flex items-center justify-center text-white">
       <p>Loading profile...</p>
     </div>
   );
 }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-500"
          />
          <div>
            <h2 className="text-3xl font-bold">{user.username}</h2>
            <input className="text-gray-300" ref = {bioInputRef} type="text" disabled = {!isEditable} value={bio || ""} onChange={(e) => setbio(e.target.value)}  ></input>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h3 className="text-xl font-semibold mb-2">Standard Chess</h3>
            <p>
              Rating: <strong>{user.stats!.standard.rating}</strong>
            </p>
            <p>
              Wins: <strong>{user.stats!.standard.wins}</strong>
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h3 className="text-xl font-semibold mb-2">Fischer Random</h3>
            <p>
              Rating: <strong>{user.stats!.fischer.rating}</strong>
            </p>
            <p>
              Wins: <strong>{user.stats!.fischer.wins}</strong>
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h3 className="text-xl font-semibold mb-2">Atomic Chess</h3>
            <p>
              Rating: <strong>{user.stats!.atomic.rating}</strong>
            </p>
            <p>
              Wins: <strong>{user.stats!.atomic.wins}</strong>
            </p>
          </div>
        </div>

        {/* Edit button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition" onClick={() => {setisEditable(!isEditable)
          } }>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
