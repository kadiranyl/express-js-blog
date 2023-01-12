import express, { Request, Response, ErrorRequestHandler } from "express";
import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import userRouter from "./routes/user";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = 8000;


//  Dependencies
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING || "");

const db = mongoose.connection;
db.on("error", (error: ErrorRequestHandler) => {
    console.log("DB error: ", error);
});
db.once("open", () => {
    console.log("DB connection successful!");
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//  Dependencies


app.use("/auth/user", authRouter);
app.use("/blog", blogRouter);
app.use("/user", userRouter);

app.use((req: Request, res: Response) => {
    res.send("404 not found");
});

app.listen(PORT, () => {
    console.log("App started");
});