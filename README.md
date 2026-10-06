# ♟️ Chess-Verse

A full-stack, real-time multiplayer chess platform supporting **Standard Chess**, **Chess960 (Fischer Random)** and **Atomic Chess**. Players sign up, get matched with an opponent in their chosen variant, and play live over WebSockets with server-side move validation.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-ws-010101)

## Features

- **Three game variants:** Standard Chess, Chess960 and Atomic Chess
- **Real-time play:** moves and board state sync instantly between players via WebSockets
- **Matchmaking:** a game manager pairs waiting players who picked the same variant
- **Server-side validation:** every move is checked on the server with [`chess.js`](https://github.com/jhlywa/chess.js), so clients can't cheat
- **Valid-move highlighting:** select a piece to see its legal destination squares
- **Move history and game-over detection**
- **Player ratings:** ratings and opponent info shown during games, plus a leaderboard dashboard
- **User profiles and authentication:** register/login with bcrypt-hashed passwords and JWTs
- **Authenticated sockets:** WebSocket connections require a valid JWT
- **Modern UI:** React, React Router, Tailwind CSS, `react-chessboard` and Motion animations

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4, react-chessboard, react-hook-form, Motion |
| Backend | Node.js, Express 4, TypeScript, `ws` (WebSockets) |
| Game logic | chess.js |
| Database | MongoDB with Mongoose |
| Auth and validation | JSON Web Tokens, bcrypt, Zod |

## Project Structure

```
Chess-Verse/
├── frontend/                 # React + Vite client
│   └── package.json
└── backend1/                 # Express + WebSocket server
    ├── src/
    │   ├── index.ts          # Entry point: HTTP API + WebSocket server
    │   ├── GameManager.ts    # Matchmaking and routing of game messages
    │   ├── Games/            # StandardChess, FischerChess, AtomicGame
    │   ├── routes/           # auth, update_win_lose
    │   ├── Controller/       # authController (register/login)
    │   ├── models/           # Mongoose models (User)
    │   ├── Config/db.ts      # MongoDB connection
    │   └── messages.ts       # Message type constants
    └── tsconfig.json
```

## How It Works

1. A user registers or logs in via the REST API and receives a JWT.
2. The client opens a WebSocket connection to the server with the token as a query parameter: `ws://localhost:8000?token=<JWT>`. Connections without a valid token are closed.
3. The client sends an `INIT_GAME` message with the chosen variant. If another player is waiting for the same variant, the server starts a game for the pair; otherwise the player waits in the queue.
4. Players send `MOVE` messages. The server validates each move, updates the game and broadcasts the new state. `VALID_MOVES` requests return the legal moves for a square so the UI can highlight them.

## API Reference

**REST** (default port `8080`)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `GET` | `/api/Dashboard?gameType=<type>` | Leaderboard of players sorted by rating |
| `GET` | `/api/profile?username=<name>` | Fetch a player's profile |
| | `/update_win_lose` | Update a player's win/loss record |

**WebSocket** (port `8000`): message types `INIT_GAME`, `MOVE`, `VALID_MOVES` (client to server) and `MOVE_PLAYED` and related game events (server to client).

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/garvagrawal9084/Chess-Verse.git
cd Chess-Verse
```

### 2. Set up the backend

```bash
cd backend1
npm install
```

Create `backend1/.env`:

```env
PORT=8080
SECRET_KEY=replace-with-a-long-random-string
MONGO_URI=mongodb://127.0.0.1:27017/chessVerse
```

Start the server:

```bash
npx nodemon --exec ts-node src/index.ts
```

Or compile and run:

```bash
npx tsc
node dist/index.js
```

The REST API runs on `http://localhost:8080` and the WebSocket server on `ws://localhost:8000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`), register an account, and open a second browser window with another account to play a match.

Other frontend scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8080` | HTTP server port |
| `SECRET_KEY` | `default_secret` | Secret used to sign and verify JWTs. **Always set your own.** |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/chessVerse` | MongoDB connection string |

## Roadmap

- [ ] Clean up games when a player disconnects
- [ ] Resign / draw offers and rematch
- [ ] Per-variant ratings and leaderboards
- [ ] Game history and replay
- [ ] Chess clocks / time controls
- [ ] Tests and CI

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes and push the branch
4. Open a pull request

## License

No license has been specified yet. Add a `LICENSE` file to define how others may use this project.
