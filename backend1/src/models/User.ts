import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  fisherChessWon : number ;
  fisherChessLoss : number ;
  fisherChessDraw : number ;
  comparePassword(password: string): Promise<boolean>;
  rating: number;
  fisherChessRating : number ;
  atomicChessWon : number ;
  atomicChessLoss : number ;
  atomicChessDraw : number ;
  atomicChessRating : number ;
  bio : string ;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
    gamesDrawn: { type: Number, default: 0 },
    fisherChessWon : {type : Number , default : 0} ,
    fisherChessLoss : {type : Number , default : 0} ,
    fisherChessDraw : {type : Number , default : 0} ,
    rating: { type: Number, default: 400, min: 400 },
    fisherChessRating : {type : Number , default: 400 , min : 400},
    atomicChessRating : {type : Number , default: 400 , min : 400},
    atomicChessWon : {type : Number , default : 0} ,
    atomicChessLoss : {type : Number , default : 0} ,
    atomicChessDraw : {type : Number , default : 0} ,
    bio : {type :String , default: ""},
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Define comparePassword method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Export User model
export default mongoose.model<IUser>("User", userSchema);
