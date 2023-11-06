import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { useAuthContext } from "../hooks/useAuthContext";
import "./OnlineUsers.css";
const { io } = require("socket.io-client");

export default function OnlineUsers() {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const socketConnection = io("https://projects.adaptable.app");
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(socket.id);
      });

      socket.emit("set user online", user.userId);

      socket.on("users", (onlineUsers) => {
        console.log(onlineUsers);
        setUsers(onlineUsers);
      });
    }
  }, [socket, user]);

  return (
    <div className="user-list">
      <h2>All Users</h2>
      {error && <div className="error">{error}</div>}
      {users &&
        users.map((onlineUser) => {
          // Skip rendering the current user
          if (onlineUser._id === user.userId) {
            return null;
          }
          return (
            <div key={onlineUser._id} className="user-list-item">
              {onlineUser.online && <span className="online-user"></span>}
              <span>{onlineUser.userName}</span>
              <Avatar src={onlineUser.profileImage.url} />
            </div>
          );
        })}
    </div>
  );
}
