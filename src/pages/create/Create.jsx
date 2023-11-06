import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGetAllUsers } from "../../hooks/useGetAllUesrs";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Create.css";
// import { useCreateProject } from "../../hooks/useCreateProject";

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const { user } = useAuthContext();
  const { getAllUsers, createProject, error, isLoading } = useGetAllUsers();
  const navigate = useNavigate();
  // const { createProject, error, isLoading } = useCreateProject();
  const [users, setUsers] = useState("");
  const [projectName, setProjectName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [formError, setFormError] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const users = await getAllUsers();
      if (users) {
        const assingedUsersOptions = users.map((user) => {
          return { value: user._id, label: user.userName };
        });
        setUsers(assingedUsersOptions);
      }
    };
    fetchAllUsers();
  }, []);

  const formatDate = (dateToFormat) => {
    // Format the date  to "YYYY-MM-DD HH:mm")
    const formattedDate = `${dateToFormat.getFullYear()}-${(
      dateToFormat.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateToFormat
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateToFormat
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateToFormat
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!category) {
      setFormError("Please select a project category");
      return;
    }

    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    const assignedUsersList = assignedUsers.map((user) => {
      return [user.value];
    });

    const projectDetails = {
      projectName,
      details,
      createdDate: formatDate(new Date()),
      dueDate: formatDate(new Date(dueDate)),
      category: category.value,
      createdBy: user.userId,
      assignedUsers: assignedUsersList,
    };
    // console.log(projectDetails);
    createProject(projectDetails);
    if (!error) navigate("/");
  };
  return (
    <div className="create-form">
      <h2 className="page-title">Create a new Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project Name:</span>
          <input
            type="text"
            required
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            type="text"
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label>
          <span>Due date:</span>
          <input
            type="date"
            required
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>

        <button className="btn">Add Project</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
