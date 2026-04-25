import "./Sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/blacklogo.png";

function Sidebar() {
  const {
    setPrompt,
    setReply,
    setCurrThreadId,
    setNewChat,
    currThreadId,
    setPrevChats,
    allThreads,
    setAllThreads,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(
        "https://oryzaai-production.up.railway.app/api/thread",
      );
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      throw err;
    }
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `https://oryzaai-production.up.railway.app/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setPrompt("");
    setReply(null);
    setNewChat(true);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const deleteThread = async (threadId) => {
    const response = await fetch(
      `https://oryzaai-production.up.railway.app/api/thread/${threadId}`,
      { method: "DELETE" },
    );
    const res = await response.json();
    console.log(res);
    getAllThreads();
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src={logo} alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)}>
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Monalika &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
