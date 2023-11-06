import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useGetAllUsers } from "../../hooks/useGetAllUesrs";
import ProjectList from "../../components/ProjectList";
import ProjectFilter from "./ProjectFilter";

const { io } = require("socket.io-client");

export default function Dashboard() {
  const [socket, setSocket] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const { getAllUsers, getAllProject, error, isLoading } = useGetAllUsers();
  const { user } = useAuthContext();

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
        // console.log("socket is connected");
      });

      socket.emit("set user online", user.userId);

      socket.on("remove deleted project", (projectId) => {
        console.log("remove project is running");
        console.log(projectId);
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
      });
    }
  }, [socket, user]);
  useEffect(() => {
    const fetchAllProject = async () => {
      const projects = await getAllProject();

      setProjects(projects);
    };
    fetchAllProject();
  }, []);

  const filteredProjects = projects
    ? projects.filter((project) => {
        switch (currentFilter) {
          case "all":
            return true;
          case "mine":
            let assignedToMe = false;
            project.assignedUsers.forEach((assignedUser) => {
              if (user.userId === assignedUser._id) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case "development":
          case "design":
          case "sales":
          case "marketing":
            return project.category === currentFilter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {projects && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={filteredProjects} />}
    </div>
  );
}
