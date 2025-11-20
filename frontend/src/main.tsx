import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout.tsx";
import Landing from "./Component/Landing.tsx";
import Game from "./Component/Game.tsx";
import { LeaderBoard, Login, Profile, Signup } from "./Component/index.tsx";
import FisherChess from "./Component/FisherChess.tsx";
import AtomicChess from "./Component/AtomicChess.tsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Landing />,
      },
      {
        path: "/standard",
        element: <Game />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/fischer",
        element: <FisherChess />,
      },
      {
        path: "/leaderboard" ,
        element: <LeaderBoard/>
      },
      {
        path: "/atomic" ,
        element : <AtomicChess/>
      },
      {
        path : "/profile" ,
        element : <Profile/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <div className="h-screen bg-[#302e2b]">
      <RouterProvider router={route} />
    </div>
  </StrictMode>
);
