### Multiplayer Chess Platform

A full-stack real-time multiplayer chess platform supporting **Standard Chess, Chess960 (Fischer Random), and Atomic Chess** variants. The application uses **React** for the frontend and a **Node.js/Express + WebSocket** backend to provide real-time matchmaking, move synchronization, game state management, and game-over detection.

**Key Features:**

* Real-time multiplayer gameplay using WebSockets.
* Supports Standard Chess, Chess960, and Atomic Chess.
* Server-side game and move validation using `chess.js`.
* Custom game manager for matchmaking players based on game variant.
* Real-time synchronization of moves and board state between players.
* Player ratings and opponent information displayed during games.
* Move history and valid-move highlighting on the chessboard.
* Game persistence and backend APIs using MongoDB.
* React-based responsive chess interface with React Router and Tailwind CSS.
* Secure authentication and protected user/profile APIs.

**Tech Stack:** React, TypeScript/JavaScript, Node.js, Express, WebSockets, MongoDB, Mongoose, chess.js, Tailwind CSS
