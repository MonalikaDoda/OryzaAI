import "./ChatWindow.css";
import { ScaleLoader } from "react-spinners";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setNewChat,
    setPrevChats,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const getReply = async () => {
    try {
      setLoading(true);
      setNewChat(false);
      const reply = await fetch("https://oryzaai-production.up.railway.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });
      const res = await reply.json();
      console.log(res);
      setReply(res.reply);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "model",
          content: reply,
        },
      ]);
      setPrompt("");
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          OryzaAI <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div
          className="userIconDiv"
          onClick={() => setDropdown((prev) => !prev)}
        >
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {dropdown && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat></Chat>

      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">OryzaAI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default ChatWindow;
