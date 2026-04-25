import express from "express";
import { Thread } from "../models/ThreadSchema.js";
import mongoose from "mongoose";
import sendMessageToChat from "../utils/openai.js";

const router = express.Router({ mergeParams: true });

router.post("/test", async (req, res) => {
  try {
    console.log("DB state:", mongoose.connection.readyState);
    const thread = new Thread({
      threadId: "abc",
      title: "new sample yes",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//get all threads
router.get("/thread", async (req, res) => {
  try {
    const thread = await Thread.find({}).sort({ updatedAt: -1 });
    res.send(thread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//get specific thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.send(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOneAndDelete({ threadId });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//get a reply from backend
router.post("/chat", async (req, res) => {
  const { threadId, message} = req.body;

  if(!threadId || !message) {
    res.status(400).json({ error: "missing fields required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
      threadId: threadId,
      title: message,
      messages: [{role : "user", content : message}]
    });
    } else{
        thread.messages.push({role : "user", content : message});
    }

    const modelReply = await sendMessageToChat(message);

    if (!modelReply) {
      return res.status(503).json({ error: "Model unavailable, try again" });
    }

    thread.messages.push({role : "model", content : modelReply});
    thread.updatedAt = new Date();   

    await thread.save();
    res.json({reply : modelReply});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
