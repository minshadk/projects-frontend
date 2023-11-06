import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetAllUsers } from "../../hooks/useGetAllUesrs";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./Project.css";
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";

const { io } = require("socket.io-client");

export default function Project() {
  const { projectId } = useParams();
  const [socket, setSocket] = useState(null);
  const { getAllUsers, getProject, error, isLoading } = useGetAllUsers();
  const { user } = useAuthContext();

  const [project, setProject] = useState([]);
  useEffect(() => {
    const fetchProject = async () => {
      const project = await getProject(projectId);
      setProject(project);
      console.log(project);
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (user) {
      const socketConnection = io("https://projects.adaptable.app");
      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket.on("connect", () => {
        console.log(socket.id);
        console.log("socket is connected");
      });

      socket.emit("set user online", user.userId);
      socket.emit("join project", projectId);
    }
  }, [socket, user]);

  return (
    <div className="project-details">
      {user && user.userId ? (
        <>
          <ProjectSummary project={project} />
          <ProjectComments projectId={projectId} />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
