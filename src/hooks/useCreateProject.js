import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useCreateProject = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const createProject = async (projectDetails) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://projects.adaptable.app/api/project/createProject",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDetails,
        }),
      }
    );
    const json = await response.json();
    console.log(json);

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
  };

  return { createProject, isLoading, error };
};
