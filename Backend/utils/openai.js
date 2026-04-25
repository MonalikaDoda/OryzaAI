import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
});

const sendMessageToChat = async (message) => {
  try {
    const response = await chat.sendMessage({
      message: message,
    });
    return response.text;
  } catch (err) {
    console.log(err);
  }
};

export default sendMessageToChat;
