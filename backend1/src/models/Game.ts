import mongoose, { Types } from "mongoose";

export interface IMove {
  _id?: Types.ObjectId; // Optional _id for each move
  moveNumber: number;
  from: string;
  to: string;
  san?: string;
}

export interface IGame extends mongoose.Document {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  currentState?: string;
  status: "active" | "finished" | "disconnected";
  winner?: Types.ObjectId;
  moves: IMove[];
  createdAt: Date;
  updatedAt: Date;
}

const moveSchema = new mongoose.Schema<IMove>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto generate _id for each move
    moveNumber: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    san: { type: String },
  },
  { _id: true } // Ensure the _id field is generated automatically for each move
);

const gameSchema = new mongoose.Schema<IGame>(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    currentState: { type: String },
    status: {
      type: String,
      enum: ["active", "finished", "disconnected"],
      default: "active",
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moves: [moveSchema], // Embed moves as subdocuments
  },
  { timestamps: true }
);

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
