import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsers } from "../../hooks/useGetAllUesrs";
import { useAuthContext } from "../../hooks/useAuthContext";
import Avatar from "../../components/Avatar";
const { io } = require("socket.io-client");

export default function ProjectSummary({ project }) {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState("");
  const navigate = useNavigate();
  const { deleteProject, getAllUsers, error, isLoading } = useGetAllUsers();

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
        console.log("socket is connected");
      });

      socket.emit("set user online", user.userId);
      socket.emit("join project", project._id);
    }
  }, [socket, user]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };
    fetchAllUsers();
  }, []);

  const handleDeleteProject = async () => {
    const response = await deleteProject(project._id);

    if (!response.error) {
      const deleted = {
        projectId: project._id,
        users: users,
      };
      socket.emit("delete project", deleted);

      navigate("/");
    }
  };
  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{project.projectName}</h2>
        <p>Due by {new Date(project.dueDate).toDateString()}</p>
        <p className="details">{project.details}</p>
        <h4>Project is assigned to : </h4>
        <div className="assigned-users">
          {project.assignedUsers &&
            project.assignedUsers.map((user) => (
              <div key={user._id}>
                <Avatar src={user.profileImage.url} />
              </div>
            ))}
        </div>
        {user.userId && project.createdBy === user.userId && (
          <button className="btn" onClick={handleDeleteProject}>
            Mark has Completed
          </button>
        )}
      </div>
    </div>
  );
}
