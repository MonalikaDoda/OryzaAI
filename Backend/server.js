import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatsRouter from "./routes/chats.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log("server is listening on port 3000");
    });

  } catch (err) {
    console.log(err);
  }
};

startServer();

app.use("/api", chatsRouter);