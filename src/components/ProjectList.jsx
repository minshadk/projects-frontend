import { Link } from "react-router-dom";
import "./ProjectList.css";
import Avatar from "./Avatar";

export default function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.length === 0 && <p>No Projects yet!</p>}
      {projects.map((project) => (
        <Link key={project._id} to={`/projects/${project._id}`}>
          <h4>{project.projectName}</h4>
          <p>Due by {new Date(project.dueDate).toDateString()}</p>
          <div className="assigned-to">
            <ul>
              {project.assignedUsers.map((user) => (
                <li key={user._id}>
                  <Avatar src={user.profileImage.url} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
