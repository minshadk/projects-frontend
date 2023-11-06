import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetAllUsers = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  

  const getAllUsers = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://projects.adaptable.app/api/user/getAllUsers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    // console.log(json)
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      setIsLoading(false);
      return json.data.users;
      // update loading state
    }
  };

  const createProject = async (projectDetails) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://projects.adaptable.app/api/project/createProject",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // projectDetails,
          projectName: projectDetails.projectName,
          category: projectDetails.category,
          details: projectDetails.details,
          createdDate: projectDetails.createdDate,
          dueDate: projectDetails.dueDate,
          createdBy: projectDetails.createdBy,
          assignedUsers: projectDetails.assignedUsers,
        }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    return json;
  };
  const getAllProject = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://projects.adaptable.app/api/project/getAllProject",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    return json.data.projects;
  };
  const getProject = async (projectId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `https://projects.adaptable.app/api/project/getProject/${projectId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      // console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    return json.data.project;
  };
  const deleteProject = async (projectId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `https://projects.adaptable.app/api/project/deleteProject/${projectId}`,
      {
        method: "DELETE",
        // headers: { "Content-Type": "application/json" },
        headers: {'Authorization': `Bearer ${user.token}`},
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      // console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    return json.data;
  };

  return {
    isLoading,
    error,
    getAllUsers,
    createProject,
    getAllProject,
    getProject,
    deleteProject,
  };
};
